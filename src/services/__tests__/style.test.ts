import { describe, it, expect, vi, beforeEach } from "vitest";
import { readStyleGuide, DEFAULT_STYLE_FALLBACK } from "../style";
import * as fs from "fs/promises";

vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

describe("Style Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return file contents if the file exists and is not empty", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce("Custom Brand Style Guide Content");
    
    const result = await readStyleGuide();
    
    expect(result).toBe("Custom Brand Style Guide Content");
    expect(fs.readFile).toHaveBeenCalledWith(expect.stringContaining("design-guide.md"), "utf-8");
  });

  it("should return the default fallback guide if the file is empty", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce("   ");
    
    const result = await readStyleGuide();
    
    expect(result).toBe(DEFAULT_STYLE_FALLBACK);
  });

  it("should return the default fallback guide if file reading fails (e.g. file does not exist)", async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(new Error("ENOENT: no such file or directory"));
    
    const result = await readStyleGuide();
    
    expect(result).toBe(DEFAULT_STYLE_FALLBACK);
  });
});
