# Adam-X Python Interface

This is the Python interface for Adam-X, a terminal-based AI coding assistant. It provides a simple command-line interface for various coding tasks.

## Installation

You can install the Python interface directly from the repository:

```bash
cd python
pip install -e .
```

This will install the `adam-x-py` command.

## Usage

Run the Python interface with:

```bash
adam-x-py
```

Or with a custom configuration file:

```bash
adam-x-py --config /path/to/config.json
```

## Available Commands

- `help` - Show help information
- `create <filename>` - Create a new file
- `explain <code>` - Explain what code does
- `optimize <code>` - Suggest optimizations for code
- `search <query>` - Search documentation
- `debug <code>` - Debug code and suggest fixes
- `projects` - List your projects
- `project <name>` - Switch to or create a project
- `snippet <name> <code>` - Save a code snippet
- `use <name>` - Use a saved snippet
- `exit` - Quit Adam-X

You can also just describe what you want to do in natural language.

## Configuration

Adam-X stores its configuration in `~/.adam-x/config.json`. This file is created automatically when you first run Adam-X.

## Integration with LLM Providers

Currently, the Python interface simulates AI responses for demonstration purposes. In a future update, it will be integrated with the same LLM providers as the main Adam-X interface.

## License

This project is licensed under the Apache-2.0 License.
