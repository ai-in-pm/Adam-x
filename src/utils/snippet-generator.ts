/**
 * Code Snippet Generator for Adam-X
 *
 * This module provides functionality to generate code snippets and templates
 * for common programming tasks directly from the terminal.
 */

import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_TIMEOUT_MS, CONFIG_DIR } from './config';

// Define the structure of a snippet template
export interface SnippetTemplate {
  name: string;
  description: string;
  language: string;
  tags: string[];
  template: string;
}

// Path to the snippets directory
const SNIPPETS_DIR = path.join(CONFIG_DIR, 'snippets');

/**
 * Ensure the snippets directory exists
 */
function ensureSnippetsDir(): void {
  if (!fs.existsSync(SNIPPETS_DIR)) {
    fs.mkdirSync(SNIPPETS_DIR, { recursive: true });
  }
}

/**
 * Generate a code snippet using the OpenAI API
 * @param description Description of the code snippet to generate
 * @param language Programming language for the snippet
 * @returns The generated code snippet
 */
export async function generateSnippet(
  description: string,
  language: string
): Promise<string> {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: OPENAI_BASE_URL || undefined,
      timeout: OPENAI_TIMEOUT_MS,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a code snippet generator. Generate a concise, well-commented ${language} code snippet that accomplishes the following task. Only return the code without any explanations or markdown formatting.`
        },
        {
          role: 'user',
          content: description
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message.content || 'Error generating snippet';
  } catch (error) {
    console.error(`Error generating snippet: ${error}`);
    return `Error generating snippet: ${error}`;
  }
}

/**
 * Save a snippet template to the snippets directory
 * @param template The snippet template to save
 */
export function saveSnippetTemplate(template: SnippetTemplate): void {
  ensureSnippetsDir();

  const filename = `${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  const filepath = path.join(SNIPPETS_DIR, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(template, null, 2), 'utf-8');
    console.log(`Snippet template saved to ${filepath}`);
  } catch (error) {
    console.error(`Error saving snippet template: ${error}`);
  }
}

/**
 * Load all snippet templates from the snippets directory
 * @returns Array of snippet templates
 */
export function loadSnippetTemplates(): SnippetTemplate[] {
  ensureSnippetsDir();

  try {
    const files = fs.readdirSync(SNIPPETS_DIR);
    const templates: SnippetTemplate[] = [];

    for (const file of files) {
      if (path.extname(file) === '.json') {
        const filepath = path.join(SNIPPETS_DIR, file);
        const content = fs.readFileSync(filepath, 'utf-8');
        templates.push(JSON.parse(content) as SnippetTemplate);
      }
    }

    return templates;
  } catch (error) {
    console.error(`Error loading snippet templates: ${error}`);
    return [];
  }
}

/**
 * Find snippet templates by tags or language
 * @param query Search query (tag or language)
 * @returns Array of matching snippet templates
 */
export function findSnippetTemplates(query: string): SnippetTemplate[] {
  const templates = loadSnippetTemplates();
  const lowerQuery = query.toLowerCase();

  return templates.filter(template =>
    template.language.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Create a new file with the generated snippet
 * @param filepath Path to the file to create
 * @param content Content of the file
 * @returns True if the file was created successfully, false otherwise
 */
export function createSnippetFile(filepath: string, content: string): boolean {
  try {
    // Check if the file already exists
    if (fs.existsSync(filepath)) {
      console.error(`File ${filepath} already exists`);
      return false;
    }

    // Create the directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`File created at ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Error creating file: ${error}`);
    return false;
  }
}

/**
 * Initialize the snippets directory with some default templates
 */
export function initializeDefaultTemplates(): void {
  ensureSnippetsDir();

  const defaultTemplates: SnippetTemplate[] = [
    {
      name: 'Express API Route',
      description: 'Basic Express.js API route with error handling',
      language: 'javascript',
      tags: ['express', 'api', 'node'],
      template: `// Express.js API route with error handling
const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/resource
 * @desc    Get all resources
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Your logic here
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;`
    },
    {
      name: 'React Component',
      description: 'Functional React component with hooks',
      language: 'typescript',
      tags: ['react', 'frontend', 'component'],
      template: `import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  onAction?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Render your data here */}
          <button onClick={onAction}>Action</button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;`
    },
    {
      name: 'Python CLI',
      description: 'Python command-line interface using argparse',
      language: 'python',
      tags: ['python', 'cli', 'argparse'],
      template: `#!/usr/bin/env python3
import argparse
import sys

def main():
    """Main entry point for the CLI."""
    parser = argparse.ArgumentParser(
        description='Description of your program',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    # Add arguments
    parser.add_argument('-f', '--file', help='Input file')
    parser.add_argument('-o', '--output', help='Output file')
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')

    # Add subcommands
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Create the parser for the "process" command
    process_parser = subparsers.add_parser('process', help='Process data')
    process_parser.add_argument('input', help='Input to process')

    args = parser.parse_args()

    if args.verbose:
        print(f"Arguments: {args}")

    if args.command == 'process':
        process_data(args.input)
    else:
        parser.print_help()
        return 1

    return 0

def process_data(input_data):
    """Process the input data."""
    print(f"Processing: {input_data}")
    # Your processing logic here

if __name__ == '__main__':
    sys.exit(main())`
    }
  ];

  for (const template of defaultTemplates) {
    saveSnippetTemplate(template);
  }
}
