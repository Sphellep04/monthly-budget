import { describe, expect, it } from "vitest";
import { extractKeyword, suggestCategory } from "./autoCategorize";

describe("suggestCategory", () => {
  it("matches a built-in merchant keyword", () => {
    const result = suggestCategory("SHOPRITE WINDHOEK");
    expect(result?.category).toBe("Groceries");
    expect(result?.source).toBe("default");
  });

  it("is case-insensitive", () => {
    expect(suggestCategory("shell service station")?.category).toBe(
      "Transportation",
    );
  });

  it("returns null when nothing matches", () => {
    expect(suggestCategory("Some Unrecognized Merchant Ltd")).toBeNull();
  });

  it("prefers a learned rule over the built-in default for the same keyword", () => {
    const result = suggestCategory("SHOPRITE WINDHOEK", [
      { id: 1n, keyword: "shoprite", category: "Dining Out" },
    ]);
    expect(result?.category).toBe("Dining Out");
    expect(result?.source).toBe("learned");
  });

  it("matches a learned rule with no built-in equivalent", () => {
    const result = suggestCategory("MY LOCAL SPAZA SHOP", [
      { id: 2n, keyword: "spaza", category: "Groceries" },
    ]);
    expect(result?.category).toBe("Groceries");
  });
});

describe("extractKeyword", () => {
  it("extracts the first word-like token, lowercased", () => {
    expect(extractKeyword("SHOPRITE WINDHOEK")).toBe("shoprite");
  });

  it("skips leading punctuation or numbers", () => {
    expect(extractKeyword("#123 Engen Garage")).toBe("engen");
  });

  it("returns null for text with no usable token", () => {
    expect(extractKeyword("123 456")).toBeNull();
  });
});
