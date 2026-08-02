import { renderRichText } from "@/lib/rich-text";

describe("renderRichText", () => {
  it("renders an empty doc as an empty string", () => {
    expect(renderRichText({ type: "doc", content: [] })).toBe("");
    expect(renderRichText(null)).toBe("");
  });

  it("renders paragraphs and text", () => {
    const html = renderRichText({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Hello UA!" }] }],
    });
    expect(html).toBe("<p>Hello UA!</p>");
  });

  it("applies inline marks", () => {
    const html = renderRichText({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Bold ", marks: [{ type: "bold" }] },
            { type: "text", text: "link", marks: [{ type: "link", attrs: { href: "https://ua.edu.ph" } }] },
          ],
        },
      ],
    });
    expect(html).toBe('<p><strong>Bold </strong><a href="https://ua.edu.ph" target="_blank" rel="noopener noreferrer">link</a></p>');
  });

  it("renders lists and headings", () => {
    const html = renderRichText({
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Requirements" }] },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "PSA Birth Cert" }] }] },
          ],
        },
      ],
    });
    expect(html).toBe('<h2>Requirements</h2><ul><li><p>PSA Birth Cert</p></li></ul>');
  });

  it("escapes HTML in text content", () => {
    const html = renderRichText({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "<script>alert('x')</script>" }] }],
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
