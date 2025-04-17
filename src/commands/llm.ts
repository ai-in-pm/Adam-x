/**
 * LLM command handler for Adam-X
 *
 * This module provides command handlers for managing LLM providers.
 */

import chalk from 'chalk';
import { CommandContext } from '../command-handler';
import {
  getAvailableProviders,
  getAllProviders,
  getDefaultProviderId,
  setDefaultProviderId
} from '../utils/llm/llm-service';
import { loadConfig, saveConfig } from '../utils/config';
import { ApiKeyError, ProviderNotAvailableError, ProviderNotFoundError, formatError } from '../utils/errors';

/**
 * Handle the LLM command
 * @param context Command context
 */
export async function handleLLMCommand(context: CommandContext): Promise<void> {
  const { args } = context;

  if (args.length === 0) {
    printLLMStatus();
    return;
  }

  const subcommand = args[0];

  switch (subcommand) {
    case 'list':
    case 'ls':
      listProviders();
      break;
    case 'use':
    case 'switch':
      if (args.length < 2) {
        console.log(chalk.red('Missing provider ID'));
        console.log(chalk.yellow('Usage: adam-x llm use <provider-id>'));
        return;
      }
      switchProvider(args[1]);
      break;
    case 'status':
      printLLMStatus();
      break;
    case 'help':
    case '--help':
    case '-h':
      printLLMHelp();
      break;
    default:
      console.log(chalk.red(`Unknown subcommand: ${subcommand}`));
      printLLMHelp();
      break;
  }
}

/**
 * List all available LLM providers
 */
function listProviders(): void {
  try {
    const availableProviders = getAvailableProviders();
    const allProviders = getAllProviders();
    const defaultProviderId = getDefaultProviderId();

    console.log(chalk.blue('\nAvailable LLM Providers:'));
    console.log(chalk.blue('=======================\n'));

    if (availableProviders.length === 0) {
      console.log(chalk.yellow('No LLM providers are available. Please check your API keys.'));
      console.log(chalk.yellow('You can set API keys in your .env file or as environment variables.'));
      return;
    }

  availableProviders.forEach(provider => {
    const isDefault = provider.id === defaultProviderId;
    const defaultIndicator = isDefault ? chalk.green(' (default)') : '';

    console.log(chalk.green(`${provider.id}${defaultIndicator}`));
    console.log(chalk.white(`  Name: ${provider.name}`));
    console.log(chalk.white(`  Description: ${provider.description}`));
    console.log(chalk.white(`  Default Model: ${provider.defaultModel}`));
    console.log(chalk.white(`  Available Models: ${provider.availableModels.join(', ')}`));
    console.log();
  });

  if (allProviders.length > availableProviders.length) {
    console.log(chalk.yellow('\nUnavailable LLM Providers (missing API keys):'));

    allProviders
      .filter(provider => !provider.isAvailable())
      .forEach(provider => {
        console.log(chalk.yellow(`${provider.id}`));
        console.log(chalk.white(`  Name: ${provider.name}`));
        console.log(chalk.white(`  Description: ${provider.description}`));
        console.log();
      });
  }
  } catch (error) {
    if (error instanceof ApiKeyError) {
      console.error(chalk.red(`API key error: ${error.message}`));
    } else {
      console.error(chalk.red(`Error listing providers: ${formatError(error)}`));
    }
  }
}

/**
 * Switch to a different LLM provider
 * @param providerId The provider ID to switch to
 */
function switchProvider(providerId: string): void {
  const allProviders = getAllProviders();
  const provider = allProviders.find(p => p.id === providerId);

  if (!provider) {
    console.log(chalk.red(`Provider '${providerId}' not found`));
    console.log(chalk.yellow('Available providers:'));
    allProviders.forEach(p => {
      console.log(chalk.yellow(`  ${p.id}`));
    });
    return;
  }

  if (!provider.isAvailable()) {
    console.log(chalk.red(`Provider '${providerId}' is not available`));
    console.log(chalk.yellow(`Please set the API key for ${provider.name} in your .env file or as an environment variable.`));
    return;
  }

  try {
    // Update the default provider in the LLM service
    setDefaultProviderId(providerId);

    // Update the config file
    const config = loadConfig();
    config.provider = providerId;
    saveConfig(config);

    console.log(chalk.green(`Switched to ${provider.name} (${providerId})`));
    console.log(chalk.white(`Default model: ${provider.defaultModel}`));
  } catch (error) {
    if (error instanceof ProviderNotFoundError) {
      console.error(chalk.red(`Provider not found: ${error.message}`));
    } else if (error instanceof ProviderNotAvailableError) {
      console.error(chalk.red(`Provider not available: ${error.message}`));
    } else if (error instanceof ApiKeyError) {
      console.error(chalk.red(`API key error: ${error.message}`));
    } else {
      console.error(chalk.red(`Error switching provider: ${formatError(error)}`));
    }
  }
}

/**
 * Print the current LLM status
 */
function printLLMStatus(): void {
  try {
    const defaultProviderId = getDefaultProviderId();
    const provider = getAvailableProviders().find(p => p.id === defaultProviderId);

    if (!provider) {
      console.log(chalk.red('No LLM provider is currently available'));
      console.log(chalk.yellow('Please check your API keys and run "adam-x llm list" to see available providers.'));
      return;
    }

    console.log(chalk.blue('\nCurrent LLM Provider:'));
    console.log(chalk.blue('====================\n'));

    console.log(chalk.green(`Provider: ${provider.name} (${provider.id})`));
    console.log(chalk.white(`Description: ${provider.description}`));
    console.log(chalk.white(`Default Model: ${provider.defaultModel}`));
    console.log(chalk.white(`Available Models: ${provider.availableModels.join(', ')}`));
  } catch (error) {
    if (error instanceof ApiKeyError) {
      console.error(chalk.red(`API key error: ${error.message}`));
      console.log(chalk.yellow('Please check your API keys and run "adam-x llm list" to see available providers.'));
    } else {
      console.error(chalk.red(`Error getting LLM status: ${formatError(error)}`));
    }
  }
}

/**
 * Print help information for the LLM command
 */
function printLLMHelp(): void {
  console.log(chalk.blue('\nAdam-X LLM Provider Management'));
  console.log(chalk.blue('==============================\n'));
  console.log('Manage and switch between different LLM providers.\n');

  console.log(chalk.green('Commands:'));
  console.log('  adam-x llm list');
  console.log('    List all available LLM providers');
  console.log('    Aliases: ls\n');

  console.log('  adam-x llm use <provider-id>');
  console.log('    Switch to a different LLM provider');
  console.log('    Aliases: switch\n');

  console.log('  adam-x llm status');
  console.log('    Show the current LLM provider status\n');

  console.log('  adam-x llm help');
  console.log('    Show this help information\n');

  console.log(chalk.green('Examples:'));
  console.log('  adam-x llm list');
  console.log('  adam-x llm use anthropic');
  console.log('  adam-x llm status');
}
