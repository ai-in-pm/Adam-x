/**
 * LLM Service
 * 
 * This module provides a unified interface for interacting with different LLM providers.
 */

import { CompletionOptions, CompletionResponse } from './provider-interface';
import { providerRegistry } from './provider-registry';

/**
 * Get a completion from the default or specified LLM provider
 * @param options Completion options
 * @param providerId Optional provider ID (uses default if not specified)
 * @returns Completion response
 */
export async function getCompletion(
  options: CompletionOptions,
  providerId?: string
): Promise<CompletionResponse> {
  const provider = providerId
    ? providerRegistry.getProvider(providerId)
    : providerRegistry.getDefaultProvider();
  
  if (!provider) {
    throw new Error(`Provider '${providerId}' not found`);
  }
  
  if (!provider.isAvailable()) {
    throw new Error(`Provider '${provider.name}' is not available. Please check your API key.`);
  }
  
  return provider.getCompletion(options);
}

/**
 * Stream a completion from the default or specified LLM provider
 * @param options Completion options
 * @param callback Callback function to receive chunks of the completion
 * @param providerId Optional provider ID (uses default if not specified)
 */
export async function streamCompletion(
  options: CompletionOptions,
  callback: (chunk: string) => void,
  providerId?: string
): Promise<void> {
  const provider = providerId
    ? providerRegistry.getProvider(providerId)
    : providerRegistry.getDefaultProvider();
  
  if (!provider) {
    throw new Error(`Provider '${providerId}' not found`);
  }
  
  if (!provider.isAvailable()) {
    throw new Error(`Provider '${provider.name}' is not available. Please check your API key.`);
  }
  
  if (!provider.streamCompletion) {
    throw new Error(`Provider '${provider.name}' does not support streaming`);
  }
  
  await provider.streamCompletion(options, callback);
}

/**
 * Get the current default provider ID
 * @returns The default provider ID
 */
export function getDefaultProviderId(): string {
  return providerRegistry.getDefaultProvider().id;
}

/**
 * Set the default provider ID
 * @param providerId The provider ID to set as default
 */
export function setDefaultProviderId(providerId: string): void {
  providerRegistry.setDefaultProviderId(providerId);
}

/**
 * Get all available providers
 * @returns Array of available providers
 */
export function getAvailableProviders() {
  return providerRegistry.getAvailableProviders();
}

/**
 * Get all registered providers
 * @returns Array of all registered providers
 */
export function getAllProviders() {
  return providerRegistry.getAllProviders();
}
