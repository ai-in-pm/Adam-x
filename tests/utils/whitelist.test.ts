/**
 * Tests for the whitelist functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import the mock whitelist module
import {
  addToWhitelist,
  removeFromWhitelist,
  listWhitelistedCommands,
  isWhitelisted,
  resetWhitelist
} from './whitelist-mock';

describe('Whitelist Functionality', () => {
  // Reset the whitelist before each test
  beforeEach(() => {
    resetWhitelist();
  });

  // Reset the whitelist after each test
  afterEach(() => {
    resetWhitelist();
  });

  it('should add a command to the whitelist', () => {
    // Add a command to the whitelist
    addToWhitelist('test-command', 'Test command', false);

    // Get the whitelist
    const commands = listWhitelistedCommands();

    // Check that the command was added
    expect(commands.length).toBe(1);
    expect(commands[0].pattern).toBe('test-command');
    expect(commands[0].reason).toBe('Test command');
    expect(commands[0].allowNetwork).toBe(false);
  });

  it('should add a command with network access to the whitelist', () => {
    // Add a command to the whitelist with network access
    addToWhitelist('test-command', 'Test command', true);

    // Get the whitelist
    const commands = listWhitelistedCommands();

    // Check that the command was added with network access
    expect(commands.length).toBe(1);
    expect(commands[0].pattern).toBe('test-command');
    expect(commands[0].reason).toBe('Test command');
    expect(commands[0].allowNetwork).toBe(true);
  });

  it('should update an existing command in the whitelist', () => {
    // Add a command to the whitelist
    addToWhitelist('test-command', 'Test command', false);

    // Update the command
    addToWhitelist('test-command', 'Updated command', true);

    // Get the whitelist
    const commands = listWhitelistedCommands();

    // Check that the command was updated
    expect(commands.length).toBe(1);
    expect(commands[0].pattern).toBe('test-command');
    expect(commands[0].reason).toBe('Updated command');
    expect(commands[0].allowNetwork).toBe(true);
  });

  it('should remove a command from the whitelist', () => {
    // Add a command to the whitelist
    addToWhitelist('test-command', 'Test command', false);

    // Remove the command
    const removed = removeFromWhitelist('test-command');

    // Check that the command was removed
    expect(removed).toBe(true);
    expect(listWhitelistedCommands().length).toBe(0);
  });

  it('should return false when removing a non-existent command', () => {
    // Try to remove a non-existent command
    const removed = removeFromWhitelist('non-existent-command');

    // Check that the command was not removed
    expect(removed).toBe(false);
  });

  it('should check if a command is whitelisted', () => {
    // Add a command to the whitelist
    addToWhitelist('npm install', 'Install dependencies', true);

    // Check if the command is whitelisted
    const whitelisted = isWhitelisted(['npm', 'install', 'some-package']);

    // Check that the command is whitelisted
    expect(whitelisted).toBeDefined();
    expect(whitelisted?.pattern).toBe('npm install');
    expect(whitelisted?.allowNetwork).toBe(true);
  });

  it('should return undefined for non-whitelisted commands', () => {
    // Check if a non-existent command is whitelisted
    const whitelisted = isWhitelisted(['non-existent-command']);

    // Check that the command is not whitelisted
    expect(whitelisted).toBeUndefined();
  });
});
