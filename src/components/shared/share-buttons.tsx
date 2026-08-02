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
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-200">
        <Share2 className="h-4 w-4 text-gold-300" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        className="border-white/15 text-navy-100 hover:border-gold-300/50 hover:text-gold-300"
        onClick={shareFacebook}
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-white/15 text-navy-100 hover:border-gold-300/50 hover:text-gold-300"
        onClick={shareTwitter}
      >
        X
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-white/15 text-navy-100 hover:border-gold-300/50 hover:text-gold-300"
        onClick={() => void copyLink()}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : null}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
