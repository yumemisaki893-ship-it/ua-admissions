"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { updateSiteContent } from "@/lib/actions/admin";

interface ContentBlock {
  key: string;
  title: string;
  description: string;
  content: unknown;
}

export function AboutEditor({ blocks }: { blocks: ContentBlock[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(blocks.map((b) => [b.key, b.content])),
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSave(key: string) {
    setSaving(key);
    const result = await updateSiteContent(key, values[key]);
    setSaving(null);
    if (result.ok) {
      toast.success("Content updated", { description: "The About page has been refreshed." });
      router.refresh();
    } else {
      toast.error("Update failed", { description: result.error });
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {blocks.map((block) => (
        <Card key={block.key}>
          <CardHeader>
            <CardTitle className="text-lg">{block.title}</CardTitle>
            <CardDescription>{block.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <RichTextEditor
              value={values[block.key]}
              onChange={(v) => setValues((prev) => ({ ...prev, [block.key]: v }))}
            />
            <div className="flex justify-end">
              <Button onClick={() => handleSave(block.key)} disabled={saving === block.key} size="sm">
                {saving === block.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
