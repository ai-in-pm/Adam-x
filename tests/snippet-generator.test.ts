/**
 * Tests for the snippet generator functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { 
  generateSnippet, 
  loadSnippetTemplates, 
  findSnippetTemplates, 
  saveSnippetTemplate,
  createSnippetFile,
  initializeDefaultTemplates,
  SnippetTemplate
} from '../src/utils/snippet-generator';

// Mock the OpenAI API
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: '// Mock generated snippet\nconsole.log("Hello, world!");'
                }
              }
            ]
          })
        }
      }
    }))
  };
});

// Mock the fs module
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn()
  };
});

// Mock the path module
vi.mock('path', async () => {
  const actual = await vi.importActual('path');
  return {
    ...actual,
    join: vi.fn().mockImplementation((...args) => args.join('/')),
    dirname: vi.fn().mockImplementation((p) => p.split('/').slice(0, -1).join('/') || '.')
  };
});

describe('Snippet Generator', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementations
    (fs.existsSync as any).mockReturnValue(true);
    (fs.mkdirSync as any).mockReturnValue(undefined);
    (fs.writeFileSync as any).mockReturnValue(undefined);
    (fs.readFileSync as any).mockReturnValue('{"name":"Test","description":"Test","language":"javascript","tags":[],"template":"// Test"}');
    (fs.readdirSync as any).mockReturnValue(['test.json']);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('generateSnippet', () => {
    it('should generate a snippet using OpenAI API', async () => {
      const snippet = await generateSnippet('Test snippet', 'javascript');
      expect(snippet).toContain('// Mock generated snippet');
      expect(snippet).toContain('console.log("Hello, world!");');
    });
  });

  describe('saveSnippetTemplate', () => {
    it('should save a snippet template to the snippets directory', () => {
      const template: SnippetTemplate = {
        name: 'Test Template',
        description: 'Test description',
        language: 'javascript',
        tags: ['test', 'javascript'],
        template: '// Test template'
      };
      
      saveSnippetTemplate(template);
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('loadSnippetTemplates', () => {
    it('should load all snippet templates from the snippets directory', () => {
      const templates = loadSnippetTemplates();
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readdirSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(templates).toHaveLength(1);
      expect(templates[0].name).toBe('Test');
    });
  });

  describe('findSnippetTemplates', () => {
    it('should find snippet templates by query', () => {
      const templates = findSnippetTemplates('test');
      
      expect(templates).toHaveLength(1);
      expect(templates[0].name).toBe('Test');
    });
  });

  describe('createSnippetFile', () => {
    it('should create a file with the snippet content', () => {
      (fs.existsSync as any).mockReturnValue(false);
      
      const result = createSnippetFile('test.js', '// Test content');
      
      expect(fs.existsSync).toHaveBeenCalledWith('test.js');
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledWith('test.js', '// Test content', 'utf-8');
      expect(result).toBe(true);
    });
    
    it('should return false if the file already exists', () => {
      (fs.existsSync as any).mockReturnValue(true);
      
      const result = createSnippetFile('test.js', '// Test content');
      
      expect(fs.existsSync).toHaveBeenCalledWith('test.js');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('initializeDefaultTemplates', () => {
    it('should initialize default templates', () => {
      initializeDefaultTemplates();
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});
