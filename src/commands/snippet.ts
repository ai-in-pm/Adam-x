/**
 * Snippet command handler for Adam-X
 *
 * This module provides command handlers for generating and managing code snippets.
 */

import * as path from 'path';
import * as fs from 'fs';
import { CommandContext } from '../command-handler';
import {
  generateSnippet,
  loadSnippetTemplates,
  findSnippetTemplates,
  createSnippetFile,
  initializeDefaultTemplates,
  SnippetTemplate
} from '../utils/snippet-generator';
import chalk from 'chalk';

/**
 * Handle the snippet command
 * @param context Command context
 */
export async function handleSnippetCommand(context: CommandContext): Promise<void> {
  const { args } = context;

  if (args.length === 0) {
    printSnippetHelp();
    return;
  }

  const subcommand = args[0];

  switch (subcommand) {
    case 'generate':
    case 'gen':
    case 'g':
      await handleGenerateSnippet(context);
      break;
    case 'list':
    case 'ls':
    case 'l':
      handleListSnippets(context);
      break;
    case 'init':
      handleInitSnippets();
      break;
    case 'help':
    case '--help':
    case '-h':
      printSnippetHelp();
      break;
    default:
      console.log(chalk.red(`Unknown subcommand: ${subcommand}`));
      printSnippetHelp();
      break;
  }
}

/**
 * Handle the generate snippet subcommand
 * @param context Command context
 */
async function handleGenerateSnippet(context: CommandContext): Promise<void> {
  const { args } = context;

  if (args.length < 3) { // subcommand + language + description
    console.log(chalk.red('Missing required arguments for generate command'));
    console.log(chalk.yellow('Usage: adam-x snippet generate <language> <description> [output-file]'));
    return;
  }

  const language = args[1]; // First arg after the subcommand
  const description = args[2]; // Second arg after the subcommand
  const outputFile = args[3]; // Optional third arg after the subcommand

  console.log(chalk.blue(`Generating ${language} snippet for: ${description}`));

  try {
    const snippet = await generateSnippet(description, language);

    if (outputFile) {
      // Determine the file path
      const filePath = path.isAbsolute(outputFile)
        ? outputFile
        : path.join(process.cwd(), outputFile);

      // Create the file with the snippet
      const success = createSnippetFile(filePath, snippet);

      if (success) {
        console.log(chalk.green(`Snippet saved to ${filePath}`));
      } else {
        console.log(chalk.yellow('Snippet was generated but not saved to a file:'));
        console.log(snippet);
      }
    } else {
      // Just print the snippet to the console
      console.log(chalk.green('Generated snippet:'));
      console.log(snippet);
    }
  } catch (error) {
    console.error(chalk.red(`Error generating snippet: ${error}`));
  }
}

/**
 * Handle the list snippets subcommand
 * @param context Command context
 */
function handleListSnippets(context: CommandContext): void {
  const { args } = context;
  const query = args.length > 1 ? args[1] : ''; // First arg after the subcommand

  let templates: SnippetTemplate[];

  if (query) {
    console.log(chalk.blue(`Searching snippets for: ${query}`));
    templates = findSnippetTemplates(query);
  } else {
    console.log(chalk.blue('Listing all available snippet templates:'));
    templates = loadSnippetTemplates();
  }

  if (templates.length === 0) {
    console.log(chalk.yellow('No snippet templates found.'));
    console.log(chalk.yellow('Run "adam-x snippet init" to create default templates.'));
    return;
  }

  templates.forEach((template, index) => {
    console.log(chalk.green(`\n${index + 1}. ${template.name}`));
    console.log(chalk.white(`   Description: ${template.description}`));
    console.log(chalk.white(`   Language: ${template.language}`));
    console.log(chalk.white(`   Tags: ${template.tags.join(', ')}`));
  });
}

/**
 * Handle the init snippets subcommand
 */
function handleInitSnippets(): void {
  console.log(chalk.blue('Initializing default snippet templates...'));

  try {
    initializeDefaultTemplates();
    console.log(chalk.green('Default snippet templates initialized successfully.'));
  } catch (error) {
    console.error(chalk.red(`Error initializing default templates: ${error}`));
  }
}

/**
 * Print help information for the snippet command
 */
function printSnippetHelp(): void {
  console.log(chalk.blue('\nAdam-X Snippet Generator'));
  console.log(chalk.blue('========================\n'));
  console.log('Generate and manage code snippets for common programming tasks.\n');

  console.log(chalk.green('Commands:'));
  console.log('  adam-x snippet generate <language> <description> [output-file]');
  console.log('    Generate a code snippet for the given language and description');
  console.log('    Aliases: gen, g\n');

  console.log('  adam-x snippet list [search-query]');
  console.log('    List available snippet templates, optionally filtered by a search query');
  console.log('    Aliases: ls, l\n');

  console.log('  adam-x snippet init');
  console.log('    Initialize default snippet templates\n');

  console.log('  adam-x snippet help');
  console.log('    Show this help information\n');

  console.log(chalk.green('Examples:'));
  console.log('  adam-x snippet generate javascript "Express.js REST API endpoint for user authentication"');
  console.log('  adam-x snippet generate python "Script to process CSV files" process_csv.py');
  console.log('  adam-x snippet list react');
}
