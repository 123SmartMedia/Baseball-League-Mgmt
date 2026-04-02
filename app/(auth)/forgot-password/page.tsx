"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            League Platform
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <p className="mb-2 text-base font-semibold">Check your email</p>
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link href="/login" className="mt-6 block">
                <Button variant="secondary" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-semibold">Forgot password?</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending…" : "Send Reset Link"}
                </Button>

                <Link href="/login" className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to Sign In
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
