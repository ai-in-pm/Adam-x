/**
 * Custom error classes for Adam-X
 */

/**
 * Base error class for Adam-X
 */
export class AdamXError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdamXError';
  }
}

/**
 * Error thrown when an API key is missing
 */
export class ApiKeyError extends AdamXError {
  constructor(provider: string) {
    super(`Missing API key for ${provider}. Please set the appropriate environment variable.`);
    this.name = 'ApiKeyError';
  }
}

/**
 * Error thrown when an LLM provider is not available
 */
export class ProviderNotAvailableError extends AdamXError {
  constructor(provider: string) {
    super(`Provider '${provider}' is not available. Please check your API keys.`);
    this.name = 'ProviderNotAvailableError';
  }
}

/**
 * Error thrown when an LLM provider is not found
 */
export class ProviderNotFoundError extends AdamXError {
  constructor(provider: string, availableProviders: string[]) {
    super(`Provider '${provider}' not found. Available providers: ${availableProviders.join(', ')}`);
    this.name = 'ProviderNotFoundError';
  }
}

/**
 * Error thrown when a command fails
 */
export class CommandError extends AdamXError {
  constructor(command: string, error: string) {
    super(`Error executing command '${command}': ${error}`);
    this.name = 'CommandError';
  }
}

/**
 * Error thrown when a file operation fails
 */
export class FileError extends AdamXError {
  constructor(operation: string, path: string, error: string) {
    super(`Error ${operation} file '${path}': ${error}`);
    this.name = 'FileError';
  }
}

/**
 * Error thrown when a network request fails
 */
export class NetworkError extends AdamXError {
  constructor(url: string, error: string) {
    super(`Error making network request to '${url}': ${error}`);
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when a required argument is missing
 */
export class MissingArgumentError extends AdamXError {
  constructor(argument: string) {
    super(`Missing required argument: ${argument}`);
    this.name = 'MissingArgumentError';
  }
}

/**
 * Error thrown when a command is not whitelisted
 */
export class NotWhitelistedError extends AdamXError {
  constructor(command: string) {
    super(`Command '${command}' is not whitelisted. Use 'adam-x whitelist add' to whitelist it.`);
    this.name = 'NotWhitelistedError';
  }
}

/**
 * Format an error message for display
 * @param error The error to format
 * @returns A formatted error message
 */
export function formatError(error: unknown): string {
  if (error instanceof AdamXError) {
    return `${error.name}: ${error.message}`;
  } else if (error instanceof Error) {
    return `Error: ${error.message}`;
  } else {
    return `Unknown error: ${String(error)}`;
  }
}
