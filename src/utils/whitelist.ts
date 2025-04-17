/**
 * Whitelist functionality for network-enabled command execution
 */

import fs from "fs";
import path from "path";
import os from "os";
import { isLoggingEnabled, log } from "./agent/log.js";
import { FileError } from "./errors";

export interface WhitelistedCommand {
  /** The command pattern to match */
  pattern: string;
  /** Description of why this command is whitelisted */
  reason: string;
  /** When this command was added to the whitelist */
  addedAt: string;
  /** Whether network access is allowed for this command */
  allowNetwork: boolean;
}

export interface WhitelistConfig {
  /** List of whitelisted commands */
  commands: WhitelistedCommand[];
}

const DEFAULT_WHITELIST_CONFIG: WhitelistConfig = {
  commands: [],
};

/**
 * Path to the whitelist configuration file
 */
export const WHITELIST_CONFIG_PATH = path.join(
  os.homedir(),
  ".adam-x",
  "whitelist.json"
);

/**
 * Load the whitelist configuration
 * @returns The whitelist configuration
 * @throws FileError if the whitelist file exists but cannot be read or parsed
 */
export function loadWhitelistConfig(): WhitelistConfig {
  try {
    if (fs.existsSync(WHITELIST_CONFIG_PATH)) {
      try {
        const configData = fs.readFileSync(WHITELIST_CONFIG_PATH, "utf8");
        return JSON.parse(configData);
      } catch (error) {
        if (isLoggingEnabled()) {
          log(`Error reading whitelist config: ${error}`);
        }
        throw new FileError('reading', WHITELIST_CONFIG_PATH, String(error));
      }
    }
  } catch (error) {
    if (isLoggingEnabled()) {
      log(`Error checking whitelist config existence: ${error}`);
    }
  }

  return DEFAULT_WHITELIST_CONFIG;
}

/**
 * Save the whitelist configuration
 * @param config The whitelist configuration to save
 * @throws FileError if the whitelist file cannot be written
 */
export function saveWhitelistConfig(config: WhitelistConfig): void {
  try {
    const configDir = path.dirname(WHITELIST_CONFIG_PATH);
    if (!fs.existsSync(configDir)) {
      try {
        fs.mkdirSync(configDir, { recursive: true });
      } catch (error) {
        if (isLoggingEnabled()) {
          log(`Error creating whitelist directory: ${error}`);
        }
        throw new FileError('creating directory', configDir, String(error));
      }
    }

    try {
      fs.writeFileSync(
        WHITELIST_CONFIG_PATH,
        JSON.stringify(config, null, 2),
        "utf8"
      );
    } catch (error) {
      if (isLoggingEnabled()) {
        log(`Error writing whitelist config: ${error}`);
      }
      throw new FileError('writing', WHITELIST_CONFIG_PATH, String(error));
    }
  } catch (error) {
    if (error instanceof FileError) {
      throw error;
    }
    if (isLoggingEnabled()) {
      log(`Error saving whitelist config: ${error}`);
    }
    throw new FileError('saving', WHITELIST_CONFIG_PATH, String(error));
  }
}

/**
 * Add a command to the whitelist
 */
export function addToWhitelist(
  pattern: string,
  reason: string,
  allowNetwork: boolean
): void {
  const config = loadWhitelistConfig();

  // Check if the command is already whitelisted
  const existingIndex = config.commands.findIndex(
    (cmd) => cmd.pattern === pattern
  );

  if (existingIndex !== -1) {
    // Update existing entry
    config.commands[existingIndex] = {
      pattern,
      reason,
      addedAt: new Date().toISOString(),
      allowNetwork,
    };
  } else {
    // Add new entry
    config.commands.push({
      pattern,
      reason,
      addedAt: new Date().toISOString(),
      allowNetwork,
    });
  }

  saveWhitelistConfig(config);
}

/**
 * Remove a command from the whitelist
 */
export function removeFromWhitelist(pattern: string): boolean {
  const config = loadWhitelistConfig();

  const initialLength = config.commands.length;
  config.commands = config.commands.filter((cmd) => cmd.pattern !== pattern);

  if (config.commands.length !== initialLength) {
    saveWhitelistConfig(config);
    return true;
  }

  return false;
}

/**
 * List all whitelisted commands
 */
export function listWhitelistedCommands(): WhitelistedCommand[] {
  const config = loadWhitelistConfig();
  return config.commands;
}

/**
 * Check if a command is whitelisted
 * @param command The command to check
 * @returns The whitelisted command if found, undefined otherwise
 */
export function isWhitelisted(command: ReadonlyArray<string>): WhitelistedCommand | undefined {
  const config = loadWhitelistConfig();
  const commandStr = command.join(" ");

  // Find a matching pattern
  return config.commands.find((cmd) => {
    // Simple pattern matching for now
    // TODO: Implement more sophisticated pattern matching if needed
    return commandStr.includes(cmd.pattern);
  });
}
