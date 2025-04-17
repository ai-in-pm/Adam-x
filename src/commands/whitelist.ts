/**
 * Command to manage the whitelist of commands that can be executed with network access
 */

import { addToWhitelist, listWhitelistedCommands, removeFromWhitelist } from "../utils/whitelist.js";
import { CommandContext } from "../command-handler";
import { FileError, formatError } from "../utils/errors";
import chalk from "chalk";

export async function handleWhitelistCommand(context: CommandContext): Promise<void> {
  const { args } = context;

  if (args.length === 0) {
    printUsage();
    return;
  }

  const subcommand = args[0];

  switch (subcommand) {
    case "list":
      await listCommands();
      break;
    case "add":
      if (args.length < 3) {
        console.error(chalk.red("Error: Missing required arguments for 'add' command."));
        console.error(`Usage: adam-x whitelist add <pattern> <reason> [--network]`);
        return;
      }
      await addCommand(context);
      break;
    case "remove":
      if (args.length < 2) {
        console.error(chalk.red("Error: Missing required arguments for 'remove' command."));
        console.error(`Usage: adam-x whitelist remove <pattern>`);
        return;
      }
      await removeCommand(args[1]);
      break;
    case "help":
      printUsage();
      break;
    default:
      console.error(chalk.red(`Error: Unknown subcommand '${subcommand}'`));
      printUsage();
      break;
  }
}

function printUsage(): void {
  console.log(`
${chalk.bold("Adam-X Whitelist Management")}

Manage the whitelist of commands that can be executed with or without network access.

${chalk.bold("Usage:")}
  adam-x whitelist <command> [options]

${chalk.bold("Commands:")}
  list                     List all whitelisted commands
  add <pattern> <reason>   Add a command pattern to the whitelist
  remove <pattern>         Remove a command pattern from the whitelist
  help                     Show this help message

${chalk.bold("Options for 'add' command:")}
  --network                Allow network access for the command (default: false)

${chalk.bold("Examples:")}
  adam-x whitelist list
  adam-x whitelist add "curl api.example.com" "Fetch data from example API" --network
  adam-x whitelist add "npm install" "Install dependencies" --network
  adam-x whitelist remove "curl api.example.com"
`);
}

async function listCommands(): Promise<void> {
  try {
    const commands = listWhitelistedCommands();

    if (commands.length === 0) {
      console.log(chalk.yellow("No commands are currently whitelisted."));
      return;
    }

    console.log(chalk.bold("\nWhitelisted Commands:"));
    console.log(chalk.dim("─".repeat(80)));
    console.log(
      chalk.bold("Pattern".padEnd(30)) +
      chalk.bold("Reason".padEnd(30)) +
      chalk.bold("Network".padEnd(10)) +
      chalk.bold("Added At")
    );
    console.log(chalk.dim("─".repeat(80)));

    for (const cmd of commands) {
      console.log(
        cmd.pattern.padEnd(30) +
        cmd.reason.padEnd(30) +
        (cmd.allowNetwork ? chalk.green("Yes".padEnd(10)) : chalk.red("No".padEnd(10))) +
        new Date(cmd.addedAt).toLocaleString()
      );
    }
    console.log(chalk.dim("─".repeat(80)));
  } catch (error) {
    if (error instanceof FileError) {
      console.error(chalk.red(`Error listing whitelisted commands: ${error.message}`));
    } else {
      console.error(chalk.red(`Error listing whitelisted commands: ${formatError(error)}`));
    }
  }
}

async function addCommand(context: CommandContext): Promise<void> {
  const { args, flags } = context;
  const pattern = args[1]; // First arg after the subcommand
  const reason = args[2]; // Second arg after the subcommand

  // Check if --network flag is present in the flags
  const allowNetwork = flags.has('network');

  try {
    addToWhitelist(pattern, reason, allowNetwork);

    console.log(chalk.green(`Command '${pattern}' has been added to the whitelist.`));
    if (allowNetwork) {
      console.log(chalk.yellow(`Network access is ${chalk.bold("enabled")} for this command.`));
    } else {
      console.log(chalk.yellow(`Network access is ${chalk.bold("disabled")} for this command.`));
    }
  } catch (error) {
    if (error instanceof FileError) {
      console.error(chalk.red(`Error adding command to whitelist: ${error.message}`));
    } else {
      console.error(chalk.red(`Error adding command to whitelist: ${formatError(error)}`));
    }
  }
}

async function removeCommand(pattern: string): Promise<void> {
  try {
    const removed = removeFromWhitelist(pattern);

    if (removed) {
      console.log(chalk.green(`Command '${pattern}' has been removed from the whitelist.`));
    } else {
      console.log(chalk.yellow(`Command '${pattern}' was not found in the whitelist.`));
    }
  } catch (error) {
    if (error instanceof FileError) {
      console.error(chalk.red(`Error removing command from whitelist: ${error.message}`));
    } else {
      console.error(chalk.red(`Error removing command from whitelist: ${formatError(error)}`));
    }
  }
}
