#!/bin/bash
# Script to run the Adam-X Python interface

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Run the Python script
python "$SCRIPT_DIR/adam_x.py" "$@"
