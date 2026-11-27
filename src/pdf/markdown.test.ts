import { describe, expect, it } from "vitest";

import { paragraphs, parseInline } from "./markdown";

describe("parseInline", () => {
  it("plain text", () => {
    expect(parseInline("hello")).toEqual([{ text: "hello" }]);
  });

  it("bold, italic, link", () => {
    expect(parseInline("a **b** *c* [d](https://x.io) e")).toEqual([
      { text: "a " },
      { text: "b", bold: true },
      { text: " " },
      { text: "c", italic: true },
      { text: " " },
      { text: "d", href: "https://x.io" },
      { text: " e" },
    ]);
  });

  it("nested marks", () => {
    expect(parseInline("**a *b* [c](u)**")).toEqual([
      { text: "a ", bold: true },
      { text: "b", bold: true, italic: true },
      { text: " ", bold: true },
      { text: "c", bold: true, href: "u" },
    ]);
  });

  it("leaves unmatched markers literal", () => {
    expect(parseInline("5 * 3 and **open")).toEqual([
      { text: "5 * 3 and **open" },
    ]);
    expect(parseInline("[t](has space)")).toEqual([{ text: "[t](has space)" }]);
  });
});

describe("paragraphs", () => {
  it("splits lines, drops blanks", () => {
    expect(paragraphs(" a \n\n b\n")).toEqual(["a", "b"]);
  });
});
