"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Link2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, minHeight = 200 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: (value ?? { type: "doc", content: [] }) as object,
    editorProps: {
      attributes: {
        class: "prose-sm focus:outline-none min-h-full px-4 py-3 text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  const tools = [
    { label: "Bold", active: editor.isActive("bold"), onClick: () => editor.chain().focus().toggleBold().run(), icon: Bold },
    { label: "Italic", active: editor.isActive("italic"), onClick: () => editor.chain().focus().toggleItalic().run(), icon: Italic },
    { label: "Heading", active: editor.isActive("heading", { level: 2 }), onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2 },
    { label: "Bullet list", active: editor.isActive("bulletList"), onClick: () => editor.chain().focus().toggleBulletList().run(), icon: List },
    { label: "Numbered list", active: editor.isActive("orderedList"), onClick: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered },
    { label: "Quote", active: editor.isActive("blockquote"), onClick: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote },
    { label: "Add link", active: editor.isActive("link"), onClick: () => toggleLink(editor), icon: Link2 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={tool.onClick}
            className={cn(
              "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              tool.active && "bg-sky-100 text-sky-700",
            )}
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          title="Undo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Redo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} style={{ minHeight }} />
    </div>
  );
}

function toggleLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Link URL", previousUrl ?? "https://");
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}
