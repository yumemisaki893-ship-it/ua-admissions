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
      <p className="flex items-center gap-2 rounded-lg border border-amber-300 bg-yellow-50 px-4 py-3 text-sm text-crimson-800">
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
        className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-400"
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
