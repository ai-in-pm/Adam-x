# Adam-X: Your Terminal AI Coding Assistant

![adam-x-inerface](https://github.com/user-attachments/assets/6e7914c7-fae3-4364-ab0e-017fdd22305c)


## Introduction

Adam-X is a powerful AI-Agent-driven coding assistant that lives in your terminal. It combines the reasoning capabilities of advanced language models with the ability to execute code, manipulate files, and iterate on solutions—all while maintaining the safety and security of your development environment.

Designed for developers who prefer working in the terminal, Adam-X streamlines your coding workflow by helping with tasks like:

- **Code Generation**: Create new files, functions, or entire applications from natural language descriptions
- **Code Explanation**: Understand complex code snippets or entire codebases
- **Code Optimization**: Improve performance, readability, and maintainability of your code
- **Debugging**: Identify and fix issues in your code
- **Project Management**: Organize and navigate your projects efficiently
- **Snippet Management**: Save and reuse code snippets for common tasks

With support for multiple LLM providers (OpenAI, Anthropic, Google, Mistral) and a flexible security model, Adam-X adapts to your specific needs and preferences while ensuring your code and data remain secure.

## Quickstart

Install globally:

```shell
npm install -g @adam/adam-x
```

Next, set your API keys. You can either set them as environment variables:

```shell
export OPENAI_API_KEY="your-openai-api-key-here"
# Optional: Add other LLM provider keys
export ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

> **Note:** This command sets the keys only for your current terminal session. To make them permanent, add the `export` lines to your shell's configuration file (e.g., `~/.zshrc`).

Alternatively, you can create a `.env` file in your project directory using the provided example:

```shell
cp .env.example .env
# Then edit .env to add your API keys
```

Run interactively:

```shell
adam-x
```

Or, run with a prompt as input (and optionally in `Full Auto` mode):

```shell
adam-x "explain this codebase to me"
```

```shell
adam-x --approval-mode full-auto "create the fanciest todo-list app"
```

That's it – Adam-X will scaffold a file, run it inside a sandbox, install any
missing dependencies, and show you the live result. Approve the changes and
they'll be committed to your working directory.

---

## Why Adam-X?

Adam-X is built for developers who already **live in the terminal** and want an AI Agent-level reasoning **plus** the power to actually run code, manipulate files, and iterate – all under version control. In short, it's _AI-Agent-driven development_ that understands and executes your repo.

- **Zero setup** — bring your own API key!
- **Full auto-approval, while safe + secure** by running network-disabled and directory-sandboxed
- **Multimodal** — pass in screenshots or diagrams to implement features ✨
- **Code snippet generator** — quickly create code snippets for common programming tasks
- **Multi-LLM support** — switch between different LLM providers like OpenAI, Anthropic, Google, and Mistral

---

## Security Model & Permissions

Adam-X lets you decide _how much autonomy_ the agent receives and auto-approval policy via the
`--approval-mode` flag (or the interactive onboarding prompt):

| Mode                      | What the agent may do without asking            | Still requires approval                                         |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **Suggest** <br>(default) | • Read any file in the repo                     | • **All** file writes/patches <br>• **All** shell/Bash commands |
| **Auto Edit**             | • Read **and** apply‑patch writes to files      | • **All** shell/Bash commands                                   |
| **Full Auto**             | • Read/write files <br>• Execute shell commands | –                                                               |

In **Full Auto** every command is run **network‑disabled** and confined to the
current working directory (plus temporary files) for defense‑in‑depth. Adam-X
will also show a warning/confirmation if you start in **auto‑edit** or
**full‑auto** while the directory is _not_ tracked by Git, so you always have a
safety net.

You can now whitelist specific commands to auto-execute with network access enabled
using the `adam-x whitelist` command. See the "Command Whitelist for Network Access" section below for details.

### Platform sandboxing details

The hardening mechanism Adam-X uses depends on your OS:

- **macOS 12+** – commands are wrapped with **Apple Seatbelt** (`sandbox-exec`).

  - Everything is placed in a read‑only jail except for a small set of
    writable roots (`$PWD`, `$TMPDIR`, `~/.adam-x`, etc.).
  - Outbound network is _fully blocked_ by default – even if a child process
    tries to `curl` somewhere it will fail.

- **Linux** – we recommend using Docker for sandboxing, where Adam-X launches itself inside a **minimal
  container image** and mounts your repo _read/write_ at the same path. A
  custom `iptables`/`ipset` firewall script denies all egress except the
  OpenAI API. This gives you deterministic, reproducible runs without needing
  root on the host. You can read more in [`run_in_container.sh`](./adam-x-cli/scripts/run_in_container.sh)

Both approaches are _transparent_ to everyday usage – you still run `adam-x` from your repo root and approve/reject steps as usual.

---

## System Requirements

| Requirement                 | Details                                                         |
| --------------------------- | --------------------------------------------------------------- |
| Operating systems           | macOS 12+, Ubuntu 20.04+/Debian 10+, or Windows 11 **via WSL2** |
| Node.js                     | **22 or newer** (LTS recommended)                               |
| Git (optional, recommended) | 2.23+ for built‑in PR helpers                                   |
| RAM                         | 4‑GB minimum (8‑GB recommended)                                 |

> Never run `sudo npm install -g`; fix npm permissions instead.

---

## CLI Reference

| Command                    | Purpose                             | Example                                                |
| -------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `adam-x`                   | Interactive REPL                    | `adam-x`                                               |
| `adam-x "…"`              | Initial prompt for interactive REPL | `adam-x "fix lint errors"`                             |
| `adam-x -q "…"`           | Non‑interactive "quiet mode"        | `adam-x -q --json "explain utils.ts"`                  |
| `adam-x snippet generate`  | Generate code snippets              | `adam-x snippet generate javascript "REST API endpoint"` |
| `adam-x snippet list`      | List available snippet templates    | `adam-x snippet list react`                             |
| `adam-x snippet init`      | Initialize default templates        | `adam-x snippet init`                                  |
| `adam-x llm list`          | List available LLM providers        | `adam-x llm list`                                      |
| `adam-x llm use`           | Switch to a different LLM provider  | `adam-x llm use anthropic`                             |
| `adam-x llm status`        | Show current LLM provider status    | `adam-x llm status`                                    |
| `adam-x whitelist list`    | List whitelisted commands           | `adam-x whitelist list`                                |
| `adam-x whitelist add`     | Add a command to the whitelist      | `adam-x whitelist add "npm install" "Install deps" --network` |
| `python/run-adam-x-py.ps1` | Run the Python interface (Windows)  | `./python/run-adam-x-py.ps1`                           |
| `python/run-adam-x-py.sh`  | Run the Python interface (Unix)     | `./python/run-adam-x-py.sh`                            |

Key flags: `--model/-m`, `--approval-mode/-a`, and `--quiet/-q`.

---

## Memory & Project Docs

Adam-X merges Markdown instructions in this order:

1. `~/.adam-x/instructions.md` – personal global guidance
2. `adam-x.md` at repo root – shared project notes
3. `adam-x.md` in cwd – sub‑package specifics

Disable with `--no-project-doc` or `ADAM_X_DISABLE_PROJECT_DOC=1`.

---

## Code Snippet Generator

Adam-X includes a powerful code snippet generator that allows you to quickly create code snippets for common programming tasks directly from the terminal.

### Generating Snippets

Generate a code snippet for a specific programming language:

```shell
adam-x snippet generate javascript "Express.js REST API endpoint for user authentication"
```

Generate a snippet and save it directly to a file:

```shell
adam-x snippet generate python "Script to process CSV files" process_csv.py
```

### Managing Snippet Templates

List all available snippet templates:

```shell
adam-x snippet list
```

Search for specific templates by language or tag:

```shell
adam-x snippet list react
```

Initialize default snippet templates:

```shell
adam-x snippet init
```

Snippet templates are stored in `~/.adam-x/snippets/` and can be customized to fit your needs.

---

## Python Interface

Adam-X now includes a Python interface that provides an alternative way to interact with the AI coding assistant. This interface is designed to be simple and lightweight, making it easy to use in environments where Node.js might not be available.

### Using the Python Interface

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

### Python Interface Features

- Simple command-line interface
- Project management
- Code snippet management
- File creation with templates
- Code explanation, optimization, and debugging

For more details, see the [Python interface README](python/README.md).

## Multi-LLM Support

Adam-X supports multiple LLM providers, allowing you to switch between different language models based on your needs and preferences.

### Supported LLM Providers

- **OpenAI** (GPT-3.5, GPT-4, GPT-4o)
- **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- **Google AI** (Gemini 1.5 Pro, Gemini 1.0 Pro)
- **Mistral AI** (Mistral Large, Medium, Small)

And many more providers can be added through the modular provider system.

### Managing LLM Providers

List all available LLM providers:

```shell
adam-x llm list
```

Switch to a different LLM provider:

```shell
adam-x llm use anthropic
```

Check the current LLM provider status:

```shell
adam-x llm status
```

### Setting Up API Keys

To use different LLM providers, you need to set up the corresponding API keys in your environment variables or `.env` file:

```
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
GEMINI_1_5_API_KEY="your_gemini_api_key"
MISTRAL_7B_API_KEY="your_mistral_api_key"
```

Adam-X will automatically detect available providers based on the API keys you've set up.

For convenience, you can copy the provided `.env.example` file to create your own `.env` file:

```shell
cp .env.example .env
# Then edit .env to add your API keys
```

---

## Command Whitelist for Network Access

Adam-X runs commands in a sandbox that blocks network access by default. However, some commands require network access to function properly. The whitelist feature allows you to specify which commands can be executed with network access enabled.

### Managing Whitelisted Commands

List all whitelisted commands:

```shell
adam-x whitelist list
```

Add a command to the whitelist with network access:

```shell
adam-x whitelist add "npm install" "Install dependencies" --network
```

Remove a command from the whitelist:

```shell
adam-x whitelist remove "npm install"
```

### How It Works

When Adam-X encounters a command that matches a pattern in the whitelist:

1. If the command is whitelisted with `--network`, it will be executed with network access enabled
2. If the command is whitelisted without `--network`, it will be auto-approved but still run in the sandbox
3. If the command is not whitelisted, the normal approval process applies

Whitelisted commands are stored in `~/.adam-x/whitelist.json` and can be managed using the `adam-x whitelist` command.

---

## Non‑interactive / CI mode

Run Adam-X head‑less in pipelines. Example GitHub Action step:

```yaml
- name: Update changelog via Adam-X
  run: |
    npm install -g @adam/adam-x
    export OPENAI_API_KEY="${{ secrets.OPENAI_KEY }}"
    adam-x -a auto-edit --quiet "update CHANGELOG for next release"
```

Set `ADAM_X_QUIET_MODE=1` to silence interactive UI noise.

---

## Recipes

Below are a few bite‑size examples you can copy‑paste. Replace the text in quotes with your own task.

| ✨  | What you type                                                                   | What happens                                                               |
| --- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | `adam-x "Refactor the Dashboard component to React Hooks"`                       | Adam-X rewrites the class component, runs `npm test`, and shows the diff.   |
| 2   | `adam-x "Generate SQL migrations for adding a users table"`                      | Infers your ORM, creates migration files, and runs them in a sandboxed DB. |
| 3   | `adam-x "Write unit tests for utils/date.ts"`                                    | Generates tests, executes them, and iterates until they pass.              |
| 4   | `adam-x "Bulk‑rename *.jpeg → *.jpg with git mv"`                                | Safely renames files and updates imports/usages.                           |
| 5   | `adam-x "Explain what this regex does: ^(?=.*[A-Z]).{8,}$"`                      | Outputs a step‑by‑step human explanation.                                  |
| 6   | `adam-x "Carefully review this repo, and propose 3 high impact well-scoped PRs"` | Suggests impactful PRs in the current codebase.                            |
| 7   | `adam-x "Look for vulnerabilities and create a security review report"`          | Finds and explains security bugs.                                          |
| 8   | `adam-x snippet generate typescript "React custom hook for API data fetching"`   | Generates a reusable React hook for data fetching with TypeScript.         |

---

## Installation

<details open>
<summary><strong>From npm (Recommended)</strong></summary>

```bash
npm install -g @adam/adam-x
# or
yarn global add @adam/adam-x
```

</details>

<details>
<summary><strong>Build from source</strong></summary>

```bash
# Clone the repository and navigate to the CLI package
git clone https://github.com/adam/adam-x.git
cd adam-x/adam-x-cli

# Install dependencies and build
npm install
npm run build

# Run the locally‑built CLI directly
node ./dist/cli.js --help

# Or link the command globally for convenience
npm link
```

</details>

---

## Configuration

Adam-X looks for config files in **`~/.adam-x/`**.

```yaml
# ~/.adam-x/config.yaml
model: o4-mini # Default model
fullAutoErrorMode: ask-user # or ignore-and-continue
```

You can also define custom instructions:

```yaml
# ~/.adam-x/instructions.md
- Always respond with emojis
- Only use git commands if I explicitly mention you should
```

---

## FAQ

<details>
<summary>How do I stop Adam-X from touching my repo?</summary>

Adam-X always runs in a **sandbox first**. If a proposed command or file change looks suspicious you can simply answer **n** when prompted and nothing happens to your working tree.

</details>

<details>
<summary>Does it work on Windows?</summary>

Not directly. It requires [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install) – Adam-X has been tested on macOS and Linux with Node ≥ 22.

</details>

<details>
<summary>Which models are supported?</summary>

Adam-X now supports multiple LLM providers:

- **OpenAI**: Any model available with [Responses API](https://platform.adam.com/docs/api-reference/responses). The default is `o4-mini`, but pass `--model gpt-4o` or set `model: gpt-4o` in your config file to override.
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku, and other Claude models
- **Google AI**: Gemini 1.5 Pro, Gemini 1.0 Pro, and other Gemini models
- **Mistral AI**: Mistral Large, Medium, Small, and other Mistral models

You can switch between providers using the `adam-x llm use <provider>` command.

</details>

<details>
<summary>How do I customize the snippet templates?</summary>

Snippet templates are stored as JSON files in the `~/.adam-x/snippets/` directory. You can edit these files directly or create new ones following the same format. Each template includes a name, description, language, tags, and the template code.

</details>

<details>
<summary>How do I set up API keys for different LLM providers?</summary>

You can set up API keys for different LLM providers in your environment variables or `.env` file:

```
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
GEMINI_1_5_API_KEY="your_gemini_api_key"
MISTRAL_7B_API_KEY="your_mistral_api_key"
```

Adam-X will automatically detect available providers based on the API keys you've set up.

For convenience, a `.env.example` file is provided in the repository. You can copy it to create your own `.env` file:

```shell
cp .env.example .env
# Then edit .env to add your API keys
```

The example file includes all supported API keys and configuration options with helpful comments.

</details>

<details>
<summary>How do I allow network access for specific commands?</summary>

Adam-X runs commands in a sandbox that blocks network access by default. To allow network access for specific commands, you can use the whitelist feature:

```shell
adam-x whitelist add "npm install" "Install dependencies" --network
```

This will add the command to the whitelist and allow it to be executed with network access enabled. You can manage whitelisted commands using the `adam-x whitelist` command.

</details>

---

### Development workflow

- Create a _topic branch_ from `main` – e.g. `feat/interactive-prompt`.
- Keep your changes focused. Multiple unrelated fixes should be opened as separate PRs.
- Use `npm run test:watch` during development for super‑fast feedback.
- We use **Vitest** for unit tests, **ESLint** + **Prettier** for style, and **TypeScript** for type‑checking.
- Before pushing, run the full test/type/lint suite:

  ```bash
  npm test && npm run lint && npm run typecheck
  ```

- If you have **not** yet signed the Contributor License Agreement (CLA), add a PR comment containing the exact text

  ```text
  I have read the CLA Document and I hereby sign the CLA
  ```

  The CLA‑Assistant bot will turn the PR status green once all authors have signed.

```bash
# Watch mode (tests rerun on change)
npm run test:watch

# Type‑check without emitting files
npm run typecheck

# Automatically fix lint + prettier issues
npm run lint:fix
npm run format:fix
```

### Review process

1. One maintainer will be assigned as a primary reviewer.
2. We may ask for changes – please do not take this personally. We value the work, we just also value consistency and long‑term maintainability.
3. When there is consensus that the PR meets the bar, a maintainer will squash‑and‑merge.

### Getting help

If you run into problems setting up the project, would like feedback on an idea, or just want to say _hi_ – please open a Discussion or jump into the relevant issue. We are happy to help.

Together we can make Adam-X an incredible tool. **Happy hacking!** :rocket:

#### Quick fixes

| Scenario          | Command                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Amend last commit | `git commit --amend -s --no-edit && git push -f`                                          |
| GitHub UI only    | Edit the commit message in the PR → add<br>`Signed-off-by: Your Name <email@example.com>` |

The **DCO check** blocks merges until every commit in the PR carries the footer (with squash this is just the one).

### Releasing `adam-x`

To publish a new version of the CLI, run the release scripts defined in `adam-x-cli/package.json`:

1. Open the `adam-x-cli` directory
2. Make sure you're on a branch like `git checkout -b bump-version`
3. Bump the version and `CLI_VERSION` to current datetime: `npm run release:version`
4. Commit the version bump (with DCO sign-off):
   ```bash
   git add adam-x-cli/src/utils/session.ts adam-x-cli/package.json
   git commit -s -m "chore(release): adam-x-cli v$(node -p \"require('./adam-x-cli/package.json').version\")"
   ```
5. Copy README, build, and publish to npm: `npm run release`
6. Push to branch: `git push origin HEAD`

---

## Security &amp; Responsible AI

Have you discovered a vulnerability or have concerns about model output? Please e‑mail **darrell.mesa@pm-ss.org** and I will respond promptly.

---
