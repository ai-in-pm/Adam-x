/**
 * Google AI Provider Implementation (Gemini models)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompletionOptions, CompletionResponse, LLMProvider } from './provider-interface';

// Get API key from environment
const GEMINI_API_KEY = process.env.GEMINI_1_5_API_KEY || '';

export class GoogleProvider implements LLMProvider {
  id = 'google';
  name = 'Google AI';
  description = 'Google Gemini models including Gemini 1.5 Pro and Gemini 1.0 Pro';
  defaultModel = 'gemini-1.5-pro';
  availableModels = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'gemini-1.0-pro-vision'
  ];

  private client: GoogleGenerativeAI;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('Google Gemini API key not found. Please set GEMINI_1_5_API_KEY environment variable.');
    }
    this.client = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  isAvailable(): boolean {
    return Boolean(GEMINI_API_KEY);
  }

  async getCompletion(options: CompletionOptions): Promise<CompletionResponse> {
    const model = options.model || this.defaultModel;

    const geminiModel = this.client.getGenerativeModel({ model });

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
      generationConfig: {
        temperature: options.temperature,
        topP: options.topP,
        maxOutputTokens: options.maxTokens,
        stopSequences: options.stop
      }
    });

    const response = result.response;
    const text = response.text();

    return {
      text,
      model,
      provider: this.id
    };
  }

  async streamCompletion(options: CompletionOptions, callback: (chunk: string) => void): Promise<void> {
    const model = options.model || this.defaultModel;

    const geminiModel = this.client.getGenerativeModel({ model });

    const result = await geminiModel.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
      generationConfig: {
        temperature: options.temperature,
        topP: options.topP,
        maxOutputTokens: options.maxTokens,
        stopSequences: options.stop
      }
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        callback(chunkText);
      }
    }
  }
}
