# Python Interface for Adam-X

Adam-X includes a Python interface that provides an alternative way to interact with the AI coding assistant. This interface is designed to be simple and lightweight, making it easy to use in environments where Node.js might not be available.

## Installation

You can run the Python interface using the provided scripts:

**Windows:**
```powershell
.\python\run-adam-x-py.ps1
```

**Unix (Linux/macOS):**
```bash
./python/run-adam-x-py.sh
```

Alternatively, you can install it as a Python package:
```bash
cd python
pip install -e .
adam-x-py
```

## Features

The Python interface provides the following features:

- Simple command-line interface
- Project management
- Code snippet management
- File creation with templates
- Code explanation, optimization, and debugging

## Command Reference

### Help

Display a list of available commands:

```
help
```

### Create a File

Create a new file with AI-generated code:

```
create <filename>
```

Example:
```
create utils.py
```

The AI will ask for a description of what you want the file to contain and then generate the code.

### Explain Code

Get an explanation of what a piece of code does:

```
explain <code>
```

Example:
```
explain def factorial(n): return 1 if n <= 1 else n * factorial(n-1)
```

### Optimize Code

Get suggestions for optimizing a piece of code:

```
optimize <code>
```

Example:
```
optimize for i in range(len(items)): print(items[i])
```

### Debug Code

Get help debugging a piece of code:

```
debug <code>
```

Example:
```
debug try: result = 10 / 0 except: print("Error")
```

### Project Management

List your projects:

```
projects
```

Switch to or create a project:

```
project <name>
```

Example:
```
project my-web-app
```

### Snippet Management

Save a code snippet:

```
snippet <name> <code>
```

Example:
```
snippet sort-function def sort_list(items): return sorted(items)
```

Use a saved snippet:

```
use <name>
```

Example:
```
use sort-function
```

### Exit

Exit the Adam-X Python interface:

```
exit
```

## Natural Language Commands

You can also use natural language to describe what you want to do:

```
Write a function to calculate the Fibonacci sequence
```

```
Create a REST API endpoint for user authentication
```

```
Help me understand how async/await works in Python
```

## Configuration

The Python interface uses the same API keys as the main Adam-X CLI. You can set these keys in your environment variables or in a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_1_5_API_KEY=your_gemini_api_key
MISTRAL_7B_API_KEY=your_mistral_api_key
```

## Implementation Details

The Python interface is implemented in the following files:

- `python/adam_x.py`: Core functionality
- `python/run-adam-x-py.sh`: Unix shell script to run the interface
- `python/run-adam-x-py.ps1`: Windows PowerShell script to run the interface
- `python/setup.py`: Package installation script
- `python/tests/test_adam_x.py`: Tests for the Python interface

## Testing

You can run the tests for the Python interface using:

```bash
cd python
python run_tests.py
```

Or from the adam-x-cli directory:

```bash
npm run test:python
```

## Troubleshooting

If you encounter issues with the Python interface, check the following:

1. Ensure you have Python 3.6 or newer installed
2. Verify that your API keys are set correctly
3. Check that you have the required dependencies installed:
   ```bash
   pip install openai python-dotenv
   ```
4. If you're using a virtual environment, make sure it's activated
