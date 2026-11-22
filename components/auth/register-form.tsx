"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { APP_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

// Google Icon
function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-[18px] w-[18px]"
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

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  const valid = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };

  // Email Registration
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!valid.length || !valid.upper || !valid.lower) {
      toast.error(
        "Password needs uppercase, lowercase and at least 6 characters."
      );
      return;
    }

    setBusy(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        ...(image.trim() ? { image: image.trim() } : {}),
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Could not create your account"
        );
      }

      toast.success("Account created successfully!");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setBusy(false);
    }
  }

  // Google Registration
  async function google() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${APP_URL}/auth/callback`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google sign in failed"
      );
    }
  }

  return (
    <div>
      {/* Google Sign Up */}
      <Button
        onClick={google}
        variant="outline"
        type="button"
        className="w-full"
      >
        <GoogleIcon />
        Sign up with Google
      </Button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted">
        <span className="h-px flex-1 bg-[var(--border)]" />
        or create an account
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Full Name */}
        <div>
          <Label htmlFor="name">Full name</Label>

          <div className="relative">
            <UserRound
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
            />

            <Input
              id="name"
              required
              minLength={2}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={{ paddingLeft: 44 }}
            />
          </div>
        </div>

        {/* Email */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ paddingLeft: 44 }}
            />
          </div>
        </div>

        {/* Profile Image */}
        <div>
          <Label htmlFor="image">
            Profile photo URL (optional)
          </Label>

          <Input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://your-image-link.com/photo.jpg"
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Create password</Label>

          <div className="relative">
            <Lock
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
            />

            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{
                paddingLeft: 44,
                paddingRight: 44,
              }}
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[var(--foreground)]"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
            {[
              { ok: valid.length, label: "6+ characters" },
              { ok: valid.upper, label: "Uppercase" },
              { ok: valid.lower, label: "Lowercase" },
            ].map((rule) => (
              <span
                key={rule.label}
                className={`flex items-center gap-1 ${
                  rule.ok ? "text-emerald-600" : "text-muted"
                }`}
              >
                <CheckCircle2 size={12} />
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={busy}
          size="lg"
          className="mt-2 w-full"
        >
          {busy ? "Creating account…" : "Create free account"}
          <ArrowRight size={17} />
        </Button>

        <p className="text-center text-[11px] leading-5 text-muted">
          You’ll start with a Customer account. Contact a GearHub
          administrator to enable Owner access.
        </p>
      </form>
    </div>
  );
}