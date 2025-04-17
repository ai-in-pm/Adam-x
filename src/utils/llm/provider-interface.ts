/**
 * LLM Provider Interface
 * 
 * This module defines the common interface for different LLM providers.
 */

export interface CompletionOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
  images?: string[];
}

export interface CompletionResponse {
  text: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  defaultModel: string;
  availableModels: string[];
  isAvailable(): boolean;
  getCompletion(options: CompletionOptions): Promise<CompletionResponse>;
  streamCompletion?(options: CompletionOptions, callback: (chunk: string) => void): Promise<void>;
}
