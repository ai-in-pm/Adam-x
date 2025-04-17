/**
 * OpenAI Provider Implementation
 */

import OpenAI from 'openai';
import { CompletionOptions, CompletionResponse, LLMProvider } from './provider-interface';
import { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_TIMEOUT_MS } from '../config';

export class OpenAIProvider implements LLMProvider {
  id = 'openai';
  name = 'OpenAI';
  description = 'OpenAI models including GPT-3.5, GPT-4, and GPT-4o';
  defaultModel = 'gpt-3.5-turbo';
  availableModels = [
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4o',
    'gpt-4o-mini'
  ];
  
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: OPENAI_BASE_URL || undefined,
      timeout: OPENAI_TIMEOUT_MS,
    });
  }
  
  isAvailable(): boolean {
    return Boolean(OPENAI_API_KEY);
  }
  
  async getCompletion(options: CompletionOptions): Promise<CompletionResponse> {
    const model = options.model || this.defaultModel;
    
    const messages = [];
    
    // Add system message if needed
    messages.push({
      role: 'user',
      content: options.prompt
    });
    
    const response = await this.client.chat.completions.create({
      model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stop: options.stop,
      stream: false
    });
    
    return {
      text: response.choices[0]?.message?.content || '',
      model,
      provider: this.id,
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens
      }
    };
  }
  
  async streamCompletion(options: CompletionOptions, callback: (chunk: string) => void): Promise<void> {
    const model = options.model || this.defaultModel;
    
    const messages = [];
    
    // Add system message if needed
    messages.push({
      role: 'user',
      content: options.prompt
    });
    
    const stream = await this.client.chat.completions.create({
      model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stop: options.stop,
      stream: true
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        callback(content);
      }
    }
  }
}
