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
      <Card className="animate-scale-in border-slate-200 bg-white shadow-2xl shadow-red-900/10">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-slate-900">Student Portal Sign In</CardTitle>
          <CardDescription className="text-slate-500">Track your application or continue where you left off.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-400"
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
                      <FormLabel className="text-slate-700">Password</FormLabel>
                      <Link href="/register" className="text-xs text-crimson-700 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-400"
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
                className="w-full bg-crimson-700 text-white shadow-lg shadow-crimson-900/20 hover:bg-yellow-400 hover:text-slate-900"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign In
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to UA?{" "}
            <Link href="/register" className="font-medium text-crimson-700 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </Suspense>
  );
}
