#!/usr/bin/env python3
"""
Adam-X: Your Terminal Coding AI Assistant
-----------------------------------------
A terminal-based AI coding assistant that helps with programming tasks.
"""

import os
import sys
import re
import random
import time
import json
import argparse
from typing import List, Dict, Any, Optional, Tuple

# Try to import readline (not available on Windows by default)
try:
    import readline
except ImportError:
    # On Windows, we can use pyreadline3 as an alternative
    try:
        import pyreadline3
    except ImportError:
        pass

# ASCII art for Adam-X logo
LOGO = """
   _    ____   _    __  __      __  __
  /_\\  |  _ \\ / \\  |  \\/  |    / / \\ \\
 //_\\\\ | | | / _ \\ | |\\/| |   | |   | |
/  _  \\| |_| / ___ \\| |  | |   | |   | |
\\_/ \\_/|____/_/   \\_\\_|  |_|    \\_\\ /_/

Your Terminal Coding AI Agent - v1.0.0
"""

class AdamX:
    def __init__(self, config_path: str = "~/.adam-x/config.json", show_welcome: bool = True):
        """Initialize the Adam-X AI Agent."""
        self.config_path = os.path.expanduser(config_path)
        self.config = self._load_config()
        self.history = []
        self.languages = {
            "python": {"ext": ".py", "comment": "# "},
            "javascript": {"ext": ".js", "comment": "// "},
            "typescript": {"ext": ".ts", "comment": "// "},
            "java": {"ext": ".java", "comment": "// "},
            "c": {"ext": ".c", "comment": "// "},
            "cpp": {"ext": ".cpp", "comment": "// "},
            "rust": {"ext": ".rs", "comment": "// "},
            "go": {"ext": ".go", "comment": "// "},
            "ruby": {"ext": ".rb", "comment": "# "},
            "php": {"ext": ".php", "comment": "// "},
            "shell": {"ext": ".sh", "comment": "# "},
        }
        self.current_project = self.config.get("last_project", None)

        if show_welcome:
            print(LOGO)
            print(f"Hello! I'm Adam-X, your coding companion.")
            print(f"Type 'help' to see available commands or 'exit' to quit.")

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file or create default if not exists."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)

        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"Error reading config file. Using defaults.")
                return self._create_default_config()
        else:
            return self._create_default_config()

    def _create_default_config(self) -> Dict[str, Any]:
        """Create and save default configuration."""
        config = {
            "user_name": os.getenv("USER", "Developer"),
            "theme": "dark",
            "projects": {},
            "last_project": None,
            "snippets": {},
            "preferences": {
                "indent": 4,
                "max_line_length": 88,
                "preferred_language": "python"
            }
        }

        with open(self.config_path, 'w') as f:
            json.dump(config, f, indent=2)

        return config

    def save_config(self) -> None:
        """Save current configuration to file."""
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)

    def run(self) -> None:
        """Main loop for the Adam-X agent."""
        while True:
            try:
                cmd = input("\n> ").strip()
                self.history.append(cmd)

                if cmd.lower() == "exit" or cmd.lower() == "quit":
                    print("Goodbye! Happy coding!")
                    break

                self.process_command(cmd)

            except KeyboardInterrupt:
                print("\nUse 'exit' to quit Adam-X.")
            except Exception as e:
                print(f"Error: {str(e)}")

    def process_command(self, cmd: str) -> None:
        """Process user commands."""
        cmd_lower = cmd.lower()

        # Basic commands
        if cmd_lower == "help":
            self.show_help()
        elif cmd_lower.startswith("create "):
            self.create_file(cmd[7:].strip())
        elif cmd_lower.startswith("explain "):
            self.explain_code(cmd[8:].strip())
        elif cmd_lower.startswith("optimize "):
            self.optimize_code(cmd[9:].strip())
        elif cmd_lower.startswith("search "):
            self.search_documentation(cmd[7:].strip())
        elif cmd_lower.startswith("debug "):
            self.debug_code(cmd[6:].strip())
        elif cmd_lower == "projects":
            self.list_projects()
        elif cmd_lower.startswith("project "):
            self.switch_project(cmd[8:].strip())
        elif cmd_lower.startswith("snippet "):
            parts = cmd[8:].strip().split(" ", 1)
            if len(parts) >= 2:
                self.save_snippet(parts[0], parts[1])
            else:
                print("Usage: snippet <name> <code>")
        elif cmd_lower.startswith("use "):
            self.use_snippet(cmd[4:].strip())
        else:
            self.generate_code(cmd)

    def show_help(self) -> None:
        """Display help information."""
        print("\nAdam-X Commands:")
        print("  help               - Show this help message")
        print("  create <filename>  - Create a new file")
        print("  explain <code>     - Explain what code does")
        print("  optimize <code>    - Suggest optimizations for code")
        print("  search <query>     - Search documentation")
        print("  debug <code>       - Debug code and suggest fixes")
        print("  projects           - List your projects")
        print("  project <name>     - Switch to or create a project")
        print("  snippet <name> <code> - Save a code snippet")
        print("  use <name>         - Use a saved snippet")
        print("  exit               - Quit Adam-X")
        print("\nYou can also just describe what you want to do in natural language.")

    def create_file(self, filename: str) -> None:
        """Create a new file with template content based on file extension."""
        if not filename:
            print("Please specify a filename.")
            return

        # Determine language from extension
        ext = os.path.splitext(filename)[1]
        language = None

        for lang, info in self.languages.items():
            if info["ext"] == ext:
                language = lang
                break

        if not language:
            language = self.config["preferences"]["preferred_language"]

        # Create file with template
        try:
            with open(filename, 'w') as f:
                comment = self.languages.get(language, {"comment": "# "})["comment"]
                f.write(f"{comment}Created by Adam-X on {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"{comment}Author: {self.config['user_name']}\n\n")

                # Add language-specific template
                if language == "python":
                    f.write('"""Main module."""\n\n')
                    f.write('def main():\n    """Main function."""\n    print("Hello, World!")\n\n')
                    f.write('if __name__ == "__main__":\n    main()\n')
                elif language in ["javascript", "typescript"]:
                    f.write('/**\n * Main module\n */\n\n')
                    f.write('function main() {\n    console.log("Hello, World!");\n}\n\n')
                    f.write('main();\n')

            print(f"Created file: {filename}")
        except Exception as e:
            print(f"Error creating file: {str(e)}")

    def explain_code(self, code: str) -> None:
        """Explain what the given code does."""
        if not code:
            print("Please provide code to explain.")
            return

        print("\nCode Explanation:")
        print("This code appears to " + self._simulate_ai_response("explain", code))

    def optimize_code(self, code: str) -> None:
        """Suggest optimizations for the given code."""
        if not code:
            print("Please provide code to optimize.")
            return

        print("\nOptimization Suggestions:")
        print(self._simulate_ai_response("optimize", code))

    def search_documentation(self, query: str) -> None:
        """Search documentation for the given query."""
        if not query:
            print("Please provide a search query.")
            return

        print(f"\nSearch results for '{query}':")
        print(self._simulate_ai_response("search", query))

    def debug_code(self, code: str) -> None:
        """Debug code and suggest fixes."""
        if not code:
            print("Please provide code to debug.")
            return

        print("\nDebugging Results:")
        print(self._simulate_ai_response("debug", code))

    def list_projects(self) -> None:
        """List all projects."""
        projects = self.config.get("projects", {})

        if not projects:
            print("No projects found. Create one with 'project <name>'.")
            return

        print("\nYour Projects:")
        for name, path in projects.items():
            current = " (current)" if name == self.current_project else ""
            print(f"- {name}: {path}{current}")

    def switch_project(self, name: str) -> None:
        """Switch to or create a project."""
        if not name:
            print("Please specify a project name.")
            return

        projects = self.config.get("projects", {})

        if name in projects:
            self.current_project = name
            self.config["last_project"] = name
            self.save_config()
            print(f"Switched to project: {name}")
        else:
            # Create new project
            path = input(f"Enter path for new project '{name}': ").strip()
            if not path:
                path = os.path.join(os.getcwd(), name)

            if not os.path.exists(path):
                try:
                    os.makedirs(path)
                except Exception as e:
                    print(f"Error creating directory: {str(e)}")
                    return

            projects[name] = path
            self.current_project = name
            self.config["projects"] = projects
            self.config["last_project"] = name
            self.save_config()
            print(f"Created and switched to project: {name}")

    def save_snippet(self, name: str, code: str) -> None:
        """Save a code snippet."""
        if not name or not code:
            print("Please provide both a name and code.")
            return

        snippets = self.config.get("snippets", {})
        snippets[name] = code
        self.config["snippets"] = snippets
        self.save_config()
        print(f"Saved snippet: {name}")

    def use_snippet(self, name: str) -> None:
        """Use a saved snippet."""
        if not name:
            print("Please specify a snippet name.")
            return

        snippets = self.config.get("snippets", {})

        if name in snippets:
            print(f"\nSnippet '{name}':")
            print(snippets[name])
        else:
            print(f"Snippet '{name}' not found.")

    def generate_code(self, description: str) -> None:
        """Generate code based on natural language description."""
        if not description:
            return

        print("\nGenerating code based on your description...")
        print(self._simulate_ai_response("generate", description))

    def _simulate_ai_response(self, action: str, input_text: str) -> str:
        """Simulate AI responses based on the action and input."""
        # In a real implementation, this would call an actual AI model
        # This is a simplified simulation for demonstration

        time.sleep(0.5)  # Simulate thinking time

        if action == "explain":
            return (
                "processes data by iterating through a collection, "
                "applying transformations, and returning the results. "
                "It uses standard control flow patterns and seems to handle "
                "edge cases appropriately."
            )
        elif action == "optimize":
            return (
                "1. Consider using list comprehension instead of the explicit for loop\n"
                "2. The nested conditional statements could be simplified\n"
                "3. There's a potential memory leak in the resource handling\n"
                "4. For large inputs, consider processing in batches"
            )
        elif action == "search":
            return (
                "Found several relevant documentation pages:\n"
                "- Official API reference for the requested function\n"
                "- Community tutorial with practical examples\n"
                "- Stack Overflow thread addressing common issues"
            )
        elif action == "debug":
            return (
                "I found a few potential issues:\n"
                "1. Missing variable initialization on line 3\n"
                "2. Potential off-by-one error in the loop condition\n"
                "3. Exception handling is too broad, consider catching specific exceptions\n"
                "4. The function might return None implicitly in some cases"
            )
        elif action == "generate":
            lang = self.config["preferences"]["preferred_language"]
            if "python" in input_text.lower() or lang == "python":
                return (
                    "```python\n"
                    "def process_data(items):\n"
                    "    \"\"\"\n"
                    "    Process a collection of items and return transformed results.\n"
                    "    \n"
                    "    Args:\n"
                    "        items: Iterable of items to process\n"
                    "        \n"
                    "    Returns:\n"
                    "        List of processed items\n"
                    "    \"\"\"\n"
                    "    results = []\n"
                    "    for item in items:\n"
                    "        if not item:\n"
                    "            continue\n"
                    "            \n"
                    "        # Transform the item based on its properties\n"
                    "        processed = transform_item(item)\n"
                    "        results.append(processed)\n"
                    "        \n"
                    "    return results\n"
                    "\n"
                    "def transform_item(item):\n"
                    "    \"\"\"\n"
                    "    Apply transformations to a single item.\n"
                    "    \"\"\"\n"
                    "    # Example transformation\n"
                    "    if isinstance(item, dict):\n"
                    "        return {k: v.upper() if isinstance(v, str) else v \n"
                    "                for k, v in item.items()}\n"
                    "    elif isinstance(item, str):\n"
                    "        return item.upper()\n"
                    "    else:\n"
                    "        return item\n"
                    "```"
                )
            else:
                return (
                    "```javascript\n"
                    "/**\n"
                    " * Process a collection of items and return transformed results.\n"
                    " * @param {Array} items - Items to process\n"
                    " * @returns {Array} - Processed items\n"
                    " */\n"
                    "function processData(items) {\n"
                    "    const results = [];\n"
                    "    \n"
                    "    for (const item of items) {\n"
                    "        if (!item) {\n"
                    "            continue;\n"
                    "        }\n"
                    "        \n"
                    "        // Transform the item based on its properties\n"
                    "        const processed = transformItem(item);\n"
                    "        results.push(processed);\n"
                    "    }\n"
                    "    \n"
                    "    return results;\n"
                    "}\n"
                    "\n"
                    "/**\n"
                    " * Apply transformations to a single item.\n"
                    " * @param {any} item - Item to transform\n"
                    " * @returns {any} - Transformed item\n"
                    " */\n"
                    "function transformItem(item) {\n"
                    "    // Example transformation\n"
                    "    if (typeof item === 'object' && item !== null) {\n"
                    "        const result = {};\n"
                    "        for (const [key, value] of Object.entries(item)) {\n"
                    "            result[key] = typeof value === 'string' ? value.toUpperCase() : value;\n"
                    "        }\n"
                    "        return result;\n"
                    "    } else if (typeof item === 'string') {\n"
                    "        return item.toUpperCase();\n"
                    "    } else {\n"
                    "        return item;\n"
                    "    }\n"
                    "}\n"
                    "```"
                )

# Export functions for testing
def process_command(cmd: str) -> str:
    """Process a command and return the result."""
    adam_x = AdamX(show_welcome=False)
    if cmd == "help":
        adam_x.show_help()
        return "Help displayed"
    elif cmd.startswith("create "):
        filename = cmd[7:].strip()
        adam_x.create_file(filename)
        return f"Created file: {filename}"
    elif cmd.startswith("explain "):
        code = cmd[8:].strip()
        return adam_x._simulate_ai_response("explain", code)
    elif cmd.startswith("optimize "):
        code = cmd[9:].strip()
        return adam_x._simulate_ai_response("optimize", code)
    elif cmd.startswith("debug "):
        code = cmd[6:].strip()
        return adam_x._simulate_ai_response("debug", code)
    else:
        return adam_x._simulate_ai_response("generate", cmd)

def generate_code(description: str) -> str:
    """Generate code based on a description."""
    adam_x = AdamX(show_welcome=False)
    return adam_x._simulate_ai_response("generate", description)

def explain_code(code: str) -> str:
    """Explain what code does."""
    adam_x = AdamX(show_welcome=False)
    return adam_x._simulate_ai_response("explain", code)

def optimize_code(code: str) -> str:
    """Suggest optimizations for code."""
    adam_x = AdamX(show_welcome=False)
    return adam_x._simulate_ai_response("optimize", code)

def debug_code(code: str) -> str:
    """Debug code and suggest fixes."""
    adam_x = AdamX(show_welcome=False)
    return adam_x._simulate_ai_response("debug", code)

def main():
    """Main entry point for Adam-X."""
    parser = argparse.ArgumentParser(description="Adam-X: Your Terminal Coding AI Agent")
    parser.add_argument('--config', type=str, help='Path to configuration file')
    parser.add_argument('--no-welcome', action='store_true', help='Disable welcome message')
    args = parser.parse_args()

    config_path = args.config if args.config else "~/.adam-x/config.json"
    show_welcome = not args.no_welcome

    try:
        adam_x = AdamX(config_path, show_welcome=show_welcome)
        adam_x.run()
    except KeyboardInterrupt:
        print("\nGoodbye! Happy coding!")
        sys.exit(0)

if __name__ == "__main__":
    main()
