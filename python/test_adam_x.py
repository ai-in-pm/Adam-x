#!/usr/bin/env python3
"""
Test script for Adam-X Python interface
"""

import os
import sys
import json

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the AdamX class
from python.adam_x import AdamX

def main():
    """Test the AdamX class"""
    print("Testing Adam-X Python interface...")

    # Create a temporary config file
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_config.json")

    # Create an instance of AdamX with welcome message disabled
    adam_x = AdamX(config_path, show_welcome=False)

    # Test some methods
    print("\nTesting help command:")
    adam_x.show_help()

    print("\nTesting code generation:")
    adam_x.generate_code("Write a function to calculate the factorial of a number in Python")

    print("\nTesting code explanation:")
    adam_x.explain_code("def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)")

    print("\nTesting code optimization:")
    adam_x.optimize_code("def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)")

    print("\nTesting code debugging:")
    adam_x.debug_code("def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)")

    # Clean up
    if os.path.exists(config_path):
        os.remove(config_path)

    print("\nTest completed successfully!")

if __name__ == "__main__":
    main()
