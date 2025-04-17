# Script to run the Adam-X Python interface

# Get the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Run the Python script
python "$scriptDir\adam_x.py" $args
