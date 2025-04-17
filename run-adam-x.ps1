# Script to run Adam-X with environment variables from .env file

# Get the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define the path to the .env file
$envPath = Join-Path -Path $scriptDir -ChildPath ".env"
$envExamplePath = Join-Path -Path $scriptDir -ChildPath ".env.example"

# Check if .env file exists, if not, create it from .env.example
if (-not (Test-Path -Path $envPath)) {
    if (Test-Path -Path $envExamplePath) {
        Write-Host "No .env file found. Creating one from .env.example..."
        Copy-Item -Path $envExamplePath -Destination $envPath
        Write-Host "Created .env file. Please edit it to add your API keys."
        Write-Host "You can run this script again after updating the .env file."
        exit
    } else {
        Write-Host "No .env or .env.example file found. Please create a .env file with your API keys."
        exit
    }
}

# Load environment variables from .env file
Write-Host "Loading environment variables from .env file..."
$envContent = Get-Content -Path $envPath
foreach ($line in $envContent) {
    # Skip comments and empty lines
    if ($line.Trim().StartsWith("#") -or [string]::IsNullOrWhiteSpace($line)) {
        continue
    }

    if ($line -match '(.+?)="(.+?)"') {
        $key = $matches[1].Trim()
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "Set environment variable: $key"
    }
}

# Check if at least one API key is set
$hasApiKey = $false
$apiKeys = @(
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GEMINI_1_5_API_KEY",
    "MISTRAL_7B_API_KEY"
)

foreach ($key in $apiKeys) {
    if ([Environment]::GetEnvironmentVariable($key)) {
        $hasApiKey = $true
        break
    }
}

if (-not $hasApiKey) {
    Write-Host "No API keys found in .env file. Please add at least one API key."
    exit
}

# Get the default model from command line arguments or use gpt-3.5-turbo as default
$model = "gpt-3.5-turbo"
$provider = $null
$newArgs = @()

# Parse command line arguments to extract model and provider
for ($i = 0; $i -lt $args.Count; $i++) {
    if ($args[$i] -eq "--model" -or $args[$i] -eq "-m") {
        if ($i + 1 -lt $args.Count) {
            $model = $args[$i + 1]
            $i++  # Skip the next argument
        }
    } elseif ($args[$i] -eq "--provider" -or $args[$i] -eq "-p") {
        if ($i + 1 -lt $args.Count) {
            $provider = $args[$i + 1]
            $newArgs += "--provider"
            $newArgs += $provider
            $i++  # Skip the next argument
        }
    } else {
        $newArgs += $args[$i]
    }
}

# Build the command
$command = "adam-x --model $model"

# Add the remaining arguments
if ($newArgs.Count -gt 0) {
    $arguments = $newArgs -join " "
    $command += " $arguments"
}

# Run Adam-X
Write-Host "Running: $command"
Invoke-Expression $command
