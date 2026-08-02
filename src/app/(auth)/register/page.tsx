"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setPending(true);
    const result = await registerUser(values);
    setPending(false);

    if (result.error) {
      toast.error("Registration failed", { description: result.error });
      return;
    }

    toast.success("Account created", {
      description: "Sign in to start your application.",
    });
    router.push("/login");
  }

  return (
    <Card className="animate-scale-in border-white/10 bg-navy-900/90 shadow-2xl shadow-crimson-950/40 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl text-white">Create Your Account</CardTitle>
        <CardDescription className="text-navy-300">
          Step 1 of 6 — you will fill out your details after signing in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-navy-100">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan Dela Cruz"
                      autoComplete="name"
                      className="border-white/15 bg-white/5 text-white placeholder:text-navy-400 focus:border-gold-300/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-navy-100">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="border-white/15 bg-white/5 text-white placeholder:text-navy-400 focus:border-gold-300/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-navy-100">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="border-white/15 bg-white/5 text-white placeholder:text-navy-400 focus:border-gold-300/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-navy-100">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="border-white/15 bg-white/5 text-white placeholder:text-navy-400 focus:border-gold-300/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={pending}
              size="lg"
              className="w-full bg-crimson-700 text-white shadow-lg shadow-crimson-950/50 hover:bg-gold-300 hover:text-navy-950"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create Account
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-navy-300">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold-300 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
