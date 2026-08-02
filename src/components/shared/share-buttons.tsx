"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
        <Share2 className="h-4 w-4 text-crimson-700" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        className="border-slate-300 text-slate-600 hover:border-amber-400 hover:text-crimson-700"
        onClick={shareFacebook}
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-slate-300 text-slate-600 hover:border-amber-400 hover:text-crimson-700"
        onClick={shareTwitter}
      >
        X
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-slate-300 text-slate-600 hover:border-amber-400 hover:text-crimson-700"
        onClick={() => void copyLink()}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : null}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
