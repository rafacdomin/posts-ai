import { describe, it, expect } from "vitest";
import { escapeControlCharsInStrings, repairTruncatedJson } from "../openrouter-service";

describe("JSON Utilities", () => {
  describe("escapeControlCharsInStrings", () => {
    it("should escape raw control characters inside JSON strings", () => {
      // Create a string that contains a raw newline and tab inside quotes
      const input = '{"text": "hello\nworld\t!"}';
      const result = escapeControlCharsInStrings(input);
      expect(result).toBe('{"text": "hello\\nworld\\t!"}');
    });

    it("should not affect already escaped characters", () => {
      const input = '{"text": "hello\\\\nworld"}';
      const result = escapeControlCharsInStrings(input);
      expect(result).toBe('{"text": "hello\\\\nworld"}');
    });

    it("should keep standard strings intact", () => {
      const input = '{"text": "hello world"}';
      const result = escapeControlCharsInStrings(input);
      expect(result).toBe('{"text": "hello world"}');
    });
  });

  describe("repairTruncatedJson", () => {
    it("should close unclosed object brackets", () => {
      const input = '{"html": "<div>hello</div>", "caption": "cool"';
      const result = repairTruncatedJson(input);
      expect(result).toBe('{"html": "<div>hello</div>", "caption": "cool"}');
    });

    it("should close unclosed array brackets", () => {
      const input = '{"slides": [{"title": "one"}, {"title": "two"';
      const result = repairTruncatedJson(input);
      expect(result).toBe('{"slides": [{"title": "one"}, {"title": "two"}]}');
    });

    it("should close unclosed string quotes and then brackets", () => {
      const input = '{"html": "<div>hello';
      const result = repairTruncatedJson(input);
      expect(result).toBe('{"html": "<div>hello"}');
    });

    it("should do nothing to valid JSON", () => {
      const input = '{"html": "ok", "caption": "yes"}';
      const result = repairTruncatedJson(input);
      expect(result).toBe(input);
    });
  });
});
