/**
 * Anthropic Provider Implementation
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { CompletionOptions, CompletionResponse, LLMProvider } from './provider-interface';

// Get API key from environment
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export class AnthropicProvider implements LLMProvider {
  id = 'anthropic';
  name = 'Anthropic';
  description = 'Anthropic Claude models including Claude 3 Opus, Sonnet, and Haiku';
  defaultModel = 'claude-3-sonnet-20240229';
  availableModels = [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2'
  ];

  private client: Anthropic;

  constructor() {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not found. Please set ANTHROPIC_API_KEY environment variable.');
    }
    this.client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY
    });
  }

  isAvailable(): boolean {
    return Boolean(ANTHROPIC_API_KEY);
  }

  async getCompletion(options: CompletionOptions): Promise<CompletionResponse> {
    const model = options.model || this.defaultModel;

    const response = await this.client.messages.create({
      model,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature,
      top_p: options.topP,
      messages: [
        {
          role: 'user',
          content: options.prompt
        }
      ]
    });

    return {
      text: response.content[0]?.text || '',
      model,
      provider: this.id,
      usage: {
        promptTokens: response.usage?.input_tokens,
        completionTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.input_tokens + response.usage?.output_tokens
      }
    };
  }

  async streamCompletion(options: CompletionOptions, callback: (chunk: string) => void): Promise<void> {
    const model = options.model || this.defaultModel;

    const stream = await this.client.messages.create({
      model,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature,
      top_p: options.topP,
      messages: [
        {
          role: 'user',
          content: options.prompt
        }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        callback(chunk.delta.text);
      }
    }
  }
}
