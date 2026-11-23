"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { APP_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";


function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-4.5 w-4.5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.4 0 10-1.8 13.4-4.8l-6.5-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.9v5.2C9.2 39.9 16 44 24 44z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 18z"
      />
      <path
        fill="#EA4335"
        d="M24 12c2.9 0 5.5 1 7.5 3l5.6-5.6C33.7 6.1 29.3 4 24 4 16 4 9.2 8.1 5.9 15l6.7 5.2C14.2 15.6 18.7 12 24 12z"
      />
    </svg>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const router = useRouter()
  const params = useSearchParams()

  // Email Login
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Could not sign in"
        );
      }

      toast.success("Welcome back to GearHub!");

      router.push(params.get("next") || "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Sign in failed"
      );
    } finally {
      setBusy(false);
    }
  }

  // Google Login
  async function google() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${APP_URL}/auth/callback`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign in failed"
      );
    }
  }

  return (
    <div>
      <Button
        onClick={google}
        variant="outline"
        className="w-full cursor-pointer"
        type="button"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted">
        <span className="h-px flex-1 bg-(--border)" />

        or continue with email

        <span className="h-px flex-1 bg-(--border)" />
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="email">Email address</Label>

          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
            />

            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: 44 }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>

            <span className="text-[11px] font-semibold text-muted">
              Forgot password is disabled
            </span>
          </div>

          <div className="relative">
            <Lock
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
            />

            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                paddingLeft: 44,
                paddingRight: 44,
              }}
            />

            {/* Show / Hide Password */}
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={
                show ? "Hide password" : "Show password"
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[var(--foreground)]"
            >
              {show ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={busy}
          size="lg"
          className="w-full cursor-pointer"
        >
          {busy ? "Signing in…" : "Sign in to GearHub"}

          <ArrowRight size={17} />
        </Button>
      </form>
    </div>
  );
}