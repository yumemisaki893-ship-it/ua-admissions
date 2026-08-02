import { generateReferenceNumber, formatCurrency, slugify, formatBytes, cn } from "@/lib/utils";

describe("generateReferenceNumber", () => {
  it("formats a five-digit zero-padded sequence", () => {
    expect(generateReferenceNumber(2026, 42)).toBe("UA-2026-00042");
  });

  it("handles large sequences without truncation", () => {
    expect(generateReferenceNumber(2026, 12345)).toBe("UA-2026-12345");
  });
});

describe("formatCurrency", () => {
  it("formats PHP amounts", () => {
    expect(formatCurrency(500)).toBe("₱500.00");
    expect(formatCurrency(1500.5)).toBe("₱1,500.50");
  });
});

describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("Bachelor of Science in Information Technology")).toBe(
      "bachelor-of-science-in-information-technology",
    );
  });

  it("strips special characters", () => {
    expect(slugify("UA Opens Applications 2026-2027!")).toBe("ua-opens-applications-2026-2027");
  });
});

describe("formatBytes", () => {
  it("formats bytes, KB, and MB", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5 MB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});

describe("cn", () => {
  it("merges tailwind classes with tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("a", undefined, "b", false, null, "c")).toBe("a b c");
  });
});
