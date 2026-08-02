import type { JSONContent } from "@tiptap/react";

/**
 * Renders TipTap JSON content to an HTML string (server-safe).
 * Supports the node/mark subset used by the UA content editors.
 */
export function renderRichText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  return renderNode(doc as JSONContent, true);
}

function renderNode(node: JSONContent, isTop = false): string {
  if (!node) return "";

  switch (node.type) {
    case "doc":
      return (node.content ?? []).map((n) => renderNode(n)).join("");
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`;
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 1), 6);
      return `<h${level}>${renderChildren(node)}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${(node.content ?? []).map((n) => renderNode(n)).join("")}</ul>`;
    case "orderedList":
      return `<ol>${(node.content ?? []).map((n) => renderNode(n)).join("")}</ol>`;
    case "listItem":
      return `<li>${renderChildren(node)}</li>`;
    case "blockquote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${escapeHtml((node.content ?? []).map((n) => n.text ?? "").join(""))}</code></pre>`;
    case "horizontalRule":
      return `<hr />`;
    case "image": {
      const src = String(node.attrs?.src ?? "");
      const alt = String(node.attrs?.alt ?? "");
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />`;
    }
    case "hardBreak":
      return "<br />";
    case "text": {
      let text = escapeHtml(node.text ?? "");
      if (node.marks?.some((m) => m.type === "bold")) text = `<strong>${text}</strong>`;
      if (node.marks?.some((m) => m.type === "italic")) text = `<em>${text}</em>`;
      if (node.marks?.some((m) => m.type === "underline")) text = `<u>${text}</u>`;
      if (node.marks?.some((m) => m.type === "strike")) text = `<s>${text}</s>`;
      if (node.marks?.some((m) => m.type === "code")) text = `<code>${text}</code>`;
      const link = node.marks?.find((m) => m.type === "link");
      if (link?.attrs?.href) {
        text = `<a href="${escapeHtml(String(link.attrs.href))}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      return text;
    }
    default:
      return isTop ? "" : renderChildren(node);
  }
}

function renderChildren(node: JSONContent): string {
  return (node.content ?? []).map((n) => renderNode(n)).join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
