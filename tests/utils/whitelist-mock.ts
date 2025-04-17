/**
 * Mock implementation of the whitelist functionality for testing
 */

import { WhitelistedCommand } from '../../src/utils/whitelist';

// In-memory whitelist for testing
let whitelistedCommands: WhitelistedCommand[] = [];

/**
 * Add a command to the whitelist
 * @param pattern Command pattern to whitelist
 * @param reason Reason for whitelisting
 * @param allowNetwork Whether to allow network access
 */
export function addToWhitelist(pattern: string, reason: string, allowNetwork: boolean): void {
  // Check if the command is already whitelisted
  const existingIndex = whitelistedCommands.findIndex(cmd => cmd.pattern === pattern);
  
  if (existingIndex >= 0) {
    // Update the existing command
    whitelistedCommands[existingIndex] = {
      pattern,
      reason,
      allowNetwork,
      addedAt: whitelistedCommands[existingIndex].addedAt
    };
  } else {
    // Add a new command
    whitelistedCommands.push({
      pattern,
      reason,
      allowNetwork,
      addedAt: new Date().toISOString()
    });
  }
}

/**
 * Remove a command from the whitelist
 * @param pattern Command pattern to remove
 * @returns True if the command was removed, false if it wasn't found
 */
export function removeFromWhitelist(pattern: string): boolean {
  const initialLength = whitelistedCommands.length;
  whitelistedCommands = whitelistedCommands.filter(cmd => cmd.pattern !== pattern);
  return whitelistedCommands.length < initialLength;
}

/**
 * List all whitelisted commands
 * @returns Array of whitelisted commands
 */
export function listWhitelistedCommands(): WhitelistedCommand[] {
  return [...whitelistedCommands];
}

/**
 * Check if a command is whitelisted
 * @param args Command arguments
 * @returns The whitelisted command if found, undefined otherwise
 */
export function isWhitelisted(args: string[]): WhitelistedCommand | undefined {
  const command = args.join(' ');
  return whitelistedCommands.find(cmd => command.startsWith(cmd.pattern));
}

/**
 * Reset the whitelist (for testing)
 */
export function resetWhitelist(): void {
  whitelistedCommands = [];
}
