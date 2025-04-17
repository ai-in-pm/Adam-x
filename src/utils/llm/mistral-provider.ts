/**
 * Mistral AI Provider Implementation
 */

import { MistralClient } from '@mistralai/mistralai';
import { CompletionOptions, CompletionResponse, LLMProvider } from './provider-interface';

// Get API key from environment
const MISTRAL_API_KEY = process.env.MISTRAL_7B_API_KEY || '';

export class MistralProvider implements LLMProvider {
  id = 'mistral';
  name = 'Mistral AI';
  description = 'Mistral AI models including Mistral Large, Medium, and Small';
  defaultModel = 'mistral-large-latest';
  availableModels = [
    'mistral-large-latest',
    'mistral-medium-latest',
    'mistral-small-latest',
    'open-mistral-7b',
    'open-mixtral-8x7b'
  ];

  private client: MistralClient;

  constructor() {
    if (!MISTRAL_API_KEY) {
      throw new Error('Mistral API key not found. Please set MISTRAL_7B_API_KEY environment variable.');
    }
    this.client = new MistralClient(MISTRAL_API_KEY);
  }

  isAvailable(): boolean {
    return Boolean(MISTRAL_API_KEY);
  }

  async getCompletion(options: CompletionOptions): Promise<CompletionResponse> {
    const model = options.model || this.defaultModel;

    const response = await this.client.chat({
      model,
      messages: [
        { role: 'user', content: options.prompt }
      ],
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      topP: options.topP
    });

    return {
      text: response.choices[0]?.message?.content || '',
      model,
      provider: this.id,
      usage: {
        promptTokens: response.usage?.promptTokens,
        completionTokens: response.usage?.completionTokens,
        totalTokens: response.usage?.totalTokens
      }
    };
  }

  async streamCompletion(options: CompletionOptions, callback: (chunk: string) => void): Promise<void> {
    const model = options.model || this.defaultModel;

    const stream = await this.client.chatStream({
      model,
      messages: [
        { role: 'user', content: options.prompt }
      ],
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      topP: options.topP
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        callback(chunk.choices[0].delta.content);
      }
    }
  }
}
