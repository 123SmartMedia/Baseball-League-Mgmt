"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Organization } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    organization_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load organizations for the dropdown
  useEffect(() => {
    supabase
      .from("organizations")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => setOrgs((data ?? []) as Organization[]));
  }, [supabase]);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.organization_id) {
      setError("Please select your league or organization.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:           form.email,
          password:        form.password,
          full_name:       form.full_name,
          organization_id: form.organization_id,
        }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response (e.g. 500 from missing env var)
      }

      if (!res.ok) {
        setError(data.error ?? `Server error (${res.status}). Please try again.`);
        return;
      }

      // Auto sign in after account creation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setSuccess(true);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="mb-2">Account Created</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You can now sign in with your email and password.
          </p>
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">League Platform</Link>
          <p className="mt-2 text-sm text-muted-foreground">Create your coach account</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Sign Up</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="full_name"
              label="Full Name"
              placeholder="Jane Smith"
              value={form.full_name}
              onChange={set("full_name")}
              autoComplete="name"
              required
            />

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              required
            />

            {/* Organization selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="org" className="text-sm font-medium">
                Your League / Organization
              </label>
              <select
                id="org"
                value={form.organization_id}
                onChange={set("organization_id")}
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select your organization…</option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
              required
            />

            <Input
              id="confirm_password"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={set("confirm_password")}
              autoComplete="new-password"
              required
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
