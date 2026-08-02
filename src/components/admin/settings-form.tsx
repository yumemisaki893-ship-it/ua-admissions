"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Megaphone, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendAnnouncement, updateSettings } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function SettingsForm({
  admissionOpen,
  applicationFee,
  studentCount,
}: {
  admissionOpen: boolean;
  applicationFee: number | null;
  studentCount: number;
}) {
  const [open, setOpen] = React.useState(admissionOpen);
  const [fee, setFee] = React.useState(String(applicationFee ?? 500));
  const [saving, setSaving] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateSettings({ admissionOpen: open, applicationFee: fee });
    setSaving(false);
    if (result.ok) {
      toast.success("Settings saved", { description: "The admission settings have been updated." });
    } else {
      toast.error("Save failed", { description: result.error });
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const result = await sendAnnouncement({ title, message });
    setSending(false);
    if (result.ok) {
      toast.success("Announcement sent", {
        description: `Notified ${studentCount} student account${studentCount === 1 ? "" : "s"}.`,
      });
      setTitle("");
      setMessage("");
    } else {
      toast.error("Send failed", { description: result.error });
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveSettings} className="space-y-6">
        <Card className="border-white/10 bg-white/[0.06] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Admission Period</CardTitle>
            <CardDescription>
              Control whether students can start new applications. In-progress applications can
              still be completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">
                Status:{" "}
                <span className={cn("font-semibold", open ? "text-emerald-400" : "text-crimson-300")}>
                  {open ? "Open" : "Closed"}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                When closed, the Apply page shows a notice to new applicants.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={open}
              onClick={() => setOpen(!open)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                open ? "bg-emerald-500" : "bg-white/15",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
                  open ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.06] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Application Fee</CardTitle>
            <CardDescription>
              The fee charged to applicants. This overrides the default fee for new applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-xs space-y-2">
            <Label htmlFor="fee">Fee (PHP)</Label>
            <Input
              id="fee"
              type="number"
              min={1}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>

      <form onSubmit={send}>
        <Card className="border-white/10 bg-white/[0.06] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="h-5 w-5 text-crimson-300" /> Send Announcement
            </CardTitle>
            <CardDescription>
              Post a notification to all {studentCount} student account{studentCount === 1 ? "" : "s"}.
              Announcements appear in the student portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                placeholder="e.g. Enrollment Schedule for the Next Term"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-message">Message</Label>
              <Textarea
                id="ann-message"
                rows={4}
                placeholder="Write the full announcement…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                Send to All Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
