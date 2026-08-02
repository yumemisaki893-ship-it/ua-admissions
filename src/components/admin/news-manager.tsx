"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createNews, updateNews, deleteNews } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  published: boolean;
  publishedAt: Date | null;
  content: unknown;
}

export function NewsManager({ items }: { items: NewsItem[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<"NEWS" | "EVENT" | "ANNOUNCEMENT">("NEWS");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [content, setContent] = useState<unknown>(null);

  function openCreate() {
    setEditing(null);
    setTitle("");
    setExcerpt("");
    setCategory("NEWS");
    setImageUrl("");
    setPublished(true);
    setContent({ type: "doc", content: [] });
    setDialogOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditing(item);
    setTitle(item.title);
    setExcerpt(item.excerpt ?? "");
    setCategory(item.category as "NEWS" | "EVENT" | "ANNOUNCEMENT");
    setImageUrl(item.imageUrl ?? "");
    setPublished(item.published);
    setContent(item.content);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (title.trim().length < 5) {
      toast.error("Title too short", { description: "Please enter at least 5 characters." });
      return;
    }
    setSaving(true);
    const input = { title: title.trim(), excerpt, category, published, imageUrl, content };
    const result = editing ? await updateNews(editing.id, input) : await createNews(input);
    setSaving(false);
    if (result.ok) {
      toast.success(editing ? "Article updated" : "Article created");
      setDialogOpen(false);
      router.refresh();
    } else {
      toast.error("Save failed", { description: result.error });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteNews(deleting.id);
    if (result.ok) {
      toast.success("Article deleted");
      setDeleting(null);
      router.refresh();
    } else {
      toast.error("Delete failed", { description: result.error });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> New Article
        </Button>
      </div>

      <div className="space-y-2.5">
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            No articles yet. Create your first one.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium text-slate-900">{item.title}</p>
                <Badge variant={item.category === "EVENT" ? "warning" : item.category === "ANNOUNCEMENT" ? "default" : "secondary"}>
                  {item.category}
                </Badge>
                {!item.published && <Badge variant="outline">Draft</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(item.publishedAt)} · /news/{item.slug}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Delete" className="text-destructive" onClick={() => setDeleting(item)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle>
            <DialogDescription>
              Write the article, then publish it to the News &amp; Events page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Title</Label>
              <Input id="news-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as "NEWS")}>
                  <SelectTrigger id="news-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEWS">News</SelectItem>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-image">Image URL (optional)</Label>
                <Input id="news-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://res.cloudinary.com/…" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-excerpt">Excerpt (optional)</Label>
              <Input id="news-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown on cards" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={published} onCheckedChange={(v) => setPublished(Boolean(v))} />
              Publish immediately
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Create Article"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.title}&rdquo; will be permanently removed from the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
