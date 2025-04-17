/**
 * Tests for the command handler
 */

import { describe, it, expect } from 'vitest';
import { parseCommandArgs } from '../src/command-handler';

// Export the parseCommandArgs function for testing
// This is a workaround since the function is not exported in the original file
export { parseCommandArgs };

describe('Command Handler', () => {
  describe('parseCommandArgs', () => {
    it('should parse arguments without flags', () => {
      const args = ['arg1', 'arg2', 'arg3'];
      const context = parseCommandArgs(args);

      expect(context.args).toEqual(args);
      expect(context.flags.size).toBe(0);
      expect(context.rawArgs).toEqual(args);
    });

    it('should parse arguments with long flags', () => {
      const args = ['arg1', '--flag1', 'arg2', '--flag2', 'value2'];
      const context = parseCommandArgs(args);

      expect(context.args).toEqual(['arg1', 'arg2']);
      expect(context.flags.has('flag1')).toBe(true);
      expect(context.flags.get('flag2')).toBe('value2');
      expect(context.rawArgs).toEqual(args);
    });

    it('should parse arguments with short flags', () => {
      const args = ['arg1', '-f', 'arg2', '-v', 'value'];
      const context = parseCommandArgs(args);

      expect(context.args).toEqual(['arg1', 'arg2']);
      expect(context.flags.has('f')).toBe(true);
      expect(context.flags.get('v')).toBe('value');
      expect(context.rawArgs).toEqual(args);
    });

    it('should handle mixed flags and arguments', () => {
      const args = ['arg1', '--flag1', '-f', 'value', 'arg2', '--flag2'];
      const context = parseCommandArgs(args);

      expect(context.args).toEqual(['arg1', 'arg2']);
      expect(context.flags.get('flag1')).toBe(true);
      expect(context.flags.get('f')).toBe('value');
      expect(context.flags.get('flag2')).toBe(true);
      expect(context.rawArgs).toEqual(args);
    });

    it('should handle empty arguments', () => {
      const args: string[] = [];
      const context = parseCommandArgs(args);

      expect(context.args).toEqual([]);
      expect(context.flags.size).toBe(0);
      expect(context.rawArgs).toEqual([]);
    });
  });
});
