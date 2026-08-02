"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <Check className="h-4 w-4 shrink-0" />
        Thank you! You are now subscribed to UA updates.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="border-white/15 bg-white/[0.06] text-white placeholder:text-slate-500 focus:border-amber-400/70"
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0 bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
        aria-label="Subscribe"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
