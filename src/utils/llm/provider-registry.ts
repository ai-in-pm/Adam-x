/**
 * LLM Provider Registry
 *
 * This module manages the registration and access to different LLM providers.
 */

import { LLMProvider } from './provider-interface';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';
import { MistralProvider } from './mistral-provider';
import { ApiKeyError, ProviderNotAvailableError, ProviderNotFoundError } from '../errors';

class ProviderRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private defaultProviderId: string = 'openai';

  constructor() {
    // Register built-in providers
    this.safeRegisterProvider(() => new OpenAIProvider());
    this.safeRegisterProvider(() => new AnthropicProvider());
    this.safeRegisterProvider(() => new GoogleProvider());
    this.safeRegisterProvider(() => new MistralProvider());

    // Set default provider based on available API keys
    this.setDefaultProvider();
  }

  /**
   * Safely register a provider, catching any initialization errors
   * @param providerFactory Function that creates a provider instance
   * @returns The provider if successfully registered, undefined otherwise
   */
  private safeRegisterProvider(providerFactory: () => LLMProvider): LLMProvider | undefined {
    try {
      const provider = providerFactory();
      if (!provider.isAvailable()) {
        console.warn(`Provider ${provider.id} is not available (missing API key)`);
        return undefined;
      }
      this.providers.set(provider.id, provider);
      console.log(`Successfully registered provider: ${provider.name} (${provider.id})`);
      return provider;
    } catch (error) {
      console.warn(`Failed to initialize provider: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  /**
   * Register a new LLM provider
   * @param provider The provider to register
   */
  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Get a provider by ID
   * @param id The provider ID
   * @returns The provider or undefined if not found
   */
  getProvider(id: string): LLMProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Get the default provider
   * @returns The default provider
   * @throws ApiKeyError if no providers are available
   */
  getDefaultProvider(): LLMProvider {
    const provider = this.providers.get(this.defaultProviderId);
    if (!provider) {
      // Try to find any available provider
      const availableProviders = this.getAvailableProviders();
      if (availableProviders.length > 0) {
        this.defaultProviderId = availableProviders[0].id;
        return availableProviders[0];
      }

      throw new ApiKeyError('any LLM provider');
    }

    // Check if the provider is available
    if (!provider.isAvailable()) {
      // Try to find any available provider
      const availableProviders = this.getAvailableProviders();
      if (availableProviders.length > 0) {
        this.defaultProviderId = availableProviders[0].id;
        return availableProviders[0];
      }

      throw new ApiKeyError(provider.name);
    }

    return provider;
  }

  /**
   * Set the default provider ID
   * @param id The provider ID to set as default
   * @throws ProviderNotFoundError if the provider is not found
   * @throws ProviderNotAvailableError if the provider is not available
   */
  setDefaultProviderId(id: string): void {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new ProviderNotFoundError(id, Array.from(this.providers.keys()));
    }

    if (!provider.isAvailable()) {
      throw new ProviderNotAvailableError(id);
    }

    this.defaultProviderId = id;
    console.log(`Default provider set to: ${provider.name} (${id})`);
  }

  /**
   * Get the environment variable name for a provider's API key
   * @param providerId The provider ID
   * @returns The environment variable name
   */
  private getApiKeyNameForProvider(providerId: string): string {
    switch (providerId) {
      case 'openai': return 'OPENAI_API_KEY';
      case 'anthropic': return 'ANTHROPIC_API_KEY';
      case 'google': return 'GEMINI_1_5_API_KEY';
      case 'mistral': return 'MISTRAL_7B_API_KEY';
      default: return 'UNKNOWN_API_KEY';
    }
  }

  /**
   * Get all available providers
   * @returns Array of available providers
   */
  getAvailableProviders(): LLMProvider[] {
    return Array.from(this.providers.values()).filter(provider => provider.isAvailable());
  }

  /**
   * Get all registered providers
   * @returns Array of all registered providers
   */
  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Set the default provider based on available API keys
   * Prioritizes in this order: OpenAI, Anthropic, Google, Mistral
   */
  private setDefaultProvider(): void {
    const availableProviders = this.getAvailableProviders();

    if (availableProviders.length === 0) {
      // Keep OpenAI as default even if not available
      return;
    }

    // Priority order for default provider
    const priorityOrder = ['openai', 'anthropic', 'google', 'mistral'];

    for (const id of priorityOrder) {
      const provider = this.providers.get(id);
      if (provider && provider.isAvailable()) {
        this.defaultProviderId = id;
        return;
      }
    }

    // If none of the priority providers are available, use the first available one
    this.defaultProviderId = availableProviders[0].id;
  }
}

// Create and export a singleton instance
export const providerRegistry = new ProviderRegistry();
