"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateApplicationStatus } from "@/lib/actions/admin";

export function StatusUpdateForm({
  applicationId,
  currentStatus,
  remarks,
}: {
  applicationId: string;
  currentStatus: string;
  remarks: string | null;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(remarks ?? "");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await updateApplicationStatus({ applicationId, status, remarks: note });
    setPending(false);
    if (result.ok) {
      toast.success("Status updated", { description: "The applicant has been notified." });
      router.refresh();
    } else {
      toast.error("Update failed", { description: result.error });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Update Application Status</CardTitle>
        <CardDescription>The applicant receives a notification instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="ACCEPTED">Qualified (Accept)</SelectItem>
                <SelectItem value="REJECTED">Not Qualified (Deny)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (optional)</Label>
            <Textarea
              id="remarks"
              rows={3}
              placeholder="e.g. Documents verified. Ready for enrollment."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save Status
            </Button>
            {currentStatus === "ACCEPTED" && (
              <Button variant="outline" asChild>
                <a href={`/api/applicants/${applicationId}/acceptance-letter`}>
                  Download Acceptance Letter (PDF)
                </a>
              </Button>
            )}
            {currentStatus !== "ACCEPTED" && (
              <Button variant="ghost" asChild>
                <a href={`/api/applicants/${applicationId}/acceptance-letter`}>
                  <X className="mr-1 h-4 w-4" /> Preview Response Letter (PDF)
                </a>
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
