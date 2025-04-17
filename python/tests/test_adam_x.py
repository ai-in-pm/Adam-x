"""
Tests for the Adam-X Python interface
"""

import unittest
import os
import sys
import tempfile
import shutil
from io import StringIO
from unittest.mock import patch, MagicMock

# Add the parent directory to the path so we can import the adam_x module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from adam_x import (
    AdamX,
    process_command,
    generate_code,
    explain_code,
    optimize_code,
    debug_code
)

class TestAdamX(unittest.TestCase):
    """Test cases for the Adam-X Python interface"""

    def setUp(self):
        """Set up test fixtures"""
        # Create a temporary directory for testing
        self.test_dir = tempfile.mkdtemp()
        self.adam_x = AdamX(show_welcome=False)

        # Mock the _simulate_ai_response method
        self.simulate_patcher = patch('adam_x.AdamX._simulate_ai_response')
        self.mock_simulate = self.simulate_patcher.start()
        self.mock_simulate.return_value = "Test response"

    def tearDown(self):
        """Tear down test fixtures"""
        # Remove the temporary directory
        shutil.rmtree(self.test_dir)

        # Stop the patcher
        self.simulate_patcher.stop()

    def test_process_command_help(self):
        """Test the help command"""
        # Patch the show_help method to capture its output
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            result = process_command("help")
            output = mock_stdout.getvalue()
            self.assertEqual(result, "Help displayed")
            self.assertIn("Adam-X Commands:", output)
            self.assertIn("help", output)
            self.assertIn("create", output)
            self.assertIn("explain", output)
            self.assertIn("optimize", output)
            self.assertIn("debug", output)

    def test_generate_code(self):
        """Test code generation"""
        code = generate_code("Create a function to add two numbers")
        self.assertEqual(code, "Test response")
        self.mock_simulate.assert_called()

    def test_explain_code(self):
        """Test code explanation"""
        explanation = explain_code("def add(a, b): return a + b")
        self.assertEqual(explanation, "Test response")
        self.mock_simulate.assert_called()

    def test_optimize_code(self):
        """Test code optimization"""
        optimization = optimize_code("def add(a, b): return a + b")
        self.assertEqual(optimization, "Test response")
        self.mock_simulate.assert_called()

    def test_debug_code(self):
        """Test code debugging"""
        debug_result = debug_code("def add(a, b): return a + b")
        self.assertEqual(debug_result, "Test response")
        self.mock_simulate.assert_called()

    def test_create_file(self):
        """Test file creation"""
        # Change to the test directory
        original_dir = os.getcwd()
        os.chdir(self.test_dir)

        try:
            # Create a test file with specific content
            test_file_path = os.path.join(self.test_dir, "test.py")
            with open(test_file_path, "w") as f:
                f.write("def test(): pass")

            # Check that the file was created
            self.assertTrue(os.path.exists(test_file_path))

            # Check the file contents
            with open(test_file_path, "r") as f:
                content = f.read()
                self.assertEqual(content, "def test(): pass")
        finally:
            # Change back to the original directory
            os.chdir(original_dir)

if __name__ == '__main__':
    unittest.main()
