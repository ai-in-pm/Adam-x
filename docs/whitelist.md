# Command Whitelist for Network Access

Adam-X runs commands in a sandbox that blocks network access by default. However, some commands require network access to function properly. The whitelist feature allows you to specify which commands can be executed with network access enabled.

## Overview

The whitelist feature provides the following capabilities:

- List all whitelisted commands
- Add a command to the whitelist with or without network access
- Remove a command from the whitelist

When Adam-X encounters a command that matches a pattern in the whitelist:

1. If the command is whitelisted with network access enabled, it will be executed with network access
2. If the command is whitelisted without network access, it will be auto-approved but still run in the sandbox
3. If the command is not whitelisted, the normal approval process applies

## Command Reference

### List Whitelisted Commands

```shell
adam-x whitelist list
```

This command displays a table of all whitelisted commands, including:
- The command pattern
- The reason for whitelisting
- Whether network access is enabled
- When the command was added to the whitelist

### Add a Command to the Whitelist

```shell
adam-x whitelist add <pattern> <reason> [--network]
```

Parameters:
- `<pattern>`: The command pattern to whitelist (e.g., "npm install")
- `<reason>`: A description of why this command is whitelisted
- `--network`: Optional flag to enable network access for this command

Examples:
```shell
# Add a command without network access
adam-x whitelist add "npm install" "Install dependencies"

# Add a command with network access
adam-x whitelist add "curl api.example.com" "Fetch data from example API" --network
```

### Remove a Command from the Whitelist

```shell
adam-x whitelist remove <pattern>
```

Parameters:
- `<pattern>`: The command pattern to remove from the whitelist

Example:
```shell
adam-x whitelist remove "npm install"
```

## How It Works

The whitelist is stored in a JSON file at `~/.adam-x/whitelist.json`. Each entry in the whitelist includes:

- `pattern`: The command pattern to match
- `reason`: A description of why this command is whitelisted
- `addedAt`: When this command was added to the whitelist
- `allowNetwork`: Whether network access is enabled for this command

When Adam-X executes a command, it checks if the command matches any pattern in the whitelist. If a match is found, the command is executed according to the whitelist entry.

## Security Considerations

- Only whitelist commands that you trust and understand
- Be cautious when enabling network access for commands, as this bypasses the sandbox's network protection
- Regularly review your whitelist to ensure it only contains necessary commands
- Consider using more specific patterns to reduce the risk of command injection

## Troubleshooting

If a whitelisted command is not being executed as expected, check the following:

1. Verify that the command pattern matches exactly what Adam-X is trying to execute
2. Check if the command requires network access and if the `--network` flag was used
3. Ensure that the whitelist file has the correct permissions
4. Try removing and re-adding the command to the whitelist

## Implementation Details

The whitelist functionality is implemented in the following files:

- `src/utils/whitelist.ts`: Core whitelist functionality
- `src/commands/whitelist.ts`: Command-line interface for managing the whitelist
- `tests/utils/whitelist.test.ts`: Tests for the whitelist functionality
