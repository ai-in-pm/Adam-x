#!/usr/bin/env python3
"""
Test runner for the Adam-X Python interface
"""

import unittest
import os
import sys

if __name__ == '__main__':
    # Add the parent directory to the path so we can import the adam_x module
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    
    # Discover and run all tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('tests', pattern='test_*.py')
    
    test_runner = unittest.TextTestRunner(verbosity=2)
    result = test_runner.run(test_suite)
    
    # Exit with non-zero status if there were failures
    sys.exit(not result.wasSuccessful())
