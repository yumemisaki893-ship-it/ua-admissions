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
      <p className="flex items-center gap-2 rounded-lg border border-gold-300/40 bg-gold-300/10 px-4 py-3 text-sm text-gold-300">
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
        className="border-white/15 bg-white/5 text-white placeholder:text-navy-400 focus:border-gold-300/60"
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0 bg-crimson-700 text-white hover:bg-gold-300 hover:text-navy-950"
        aria-label="Subscribe"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
