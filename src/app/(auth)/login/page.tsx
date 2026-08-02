"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

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
import { loginSchema, type LoginInput } from "@/lib/validations";
import { loginWithCredentials } from "@/lib/actions/auth";

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setPending(true);
    const result = await loginWithCredentials(values);
    setPending(false);
    if (result?.error) {
      toast.error("Sign in failed", { description: result.error });
    } else {
      router.push("/portal/dashboard");
    }
  }

  return (
    <Suspense fallback={null}>
      <Card className="animate-scale-in border-white/10 bg-navy-900/90 shadow-2xl shadow-crimson-950/40 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-white">Student Portal Sign In</CardTitle>
          <CardDescription className="text-navy-300">Track your application or continue where you left off.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-navy-100">Password</FormLabel>
                      <Link href="/register" className="text-xs text-gold-300 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
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
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign In
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-navy-300">
            New to UA?{" "}
            <Link href="/register" className="font-medium text-gold-300 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </Suspense>
  );
}
