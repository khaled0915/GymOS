"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth.actions";
import { motion, AnimatePresence } from "motion/react";
import {
  Dumbbell,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AuthSwitchProps {
  initialMode?: "signin" | "signup";
  callbackUrl?: string;
  className?: string;
}

function AuthSwitchInner({
  initialMode = "signin",
  callbackUrl: propCallbackUrl,
  className,
}: AuthSwitchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = propCallbackUrl || searchParams.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleModeSwitch = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email: cleanEmail,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid email or password. Please check your credentials.");
        } else {
          setSuccess("Welcome back! Redirecting to dashboard...");
          window.location.href = callbackUrl;
        }
      } catch {
        setError("An unexpected authentication error occurred. Please try again.");
      }
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Full name is required.");
      return;
    }
    if (!cleanEmail) {
      setError("Email address is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await registerUser({
          name: cleanName,
          email: cleanEmail,
          password,
        });

        if (!res.success) {
          setError(res.error || "Failed to create account.");
          return;
        }

        setSuccess("Account created successfully! Signing you in...");

        // Automatically sign in after account creation
        const signInRes = await signIn("credentials", {
          email: cleanEmail,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          handleModeSwitch("signin");
          setSuccess("Account registered! Please sign in with your password.");
        } else {
          window.location.href = callbackUrl;
        }
      } catch {
        setError("An unexpected registration error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-border/60 bg-[#12161F]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 text-white overflow-hidden transition-all",
        className
      )}
    >
      {/* Background Neon Emerald Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Logo */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3 pb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              GymOS
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                v1.0
              </span>
            </span>
            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
              The Athlete&apos;s OS
            </span>
          </div>
        </Link>
      </div>

      {/* Switcher Tab Control */}
      <div className="relative z-10 p-1.5 rounded-2xl bg-[#0A0D12] border border-border/80 grid grid-cols-2 gap-1 mb-6">
        <button
          type="button"
          onClick={() => handleModeSwitch("signin")}
          className={cn(
            "relative py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 z-10",
            mode === "signin"
              ? "text-black"
              : "text-slate-300 hover:text-white"
          )}
        >
          {mode === "signin" && (
            <motion.div
              layoutId="auth-tab-pill"
              className="absolute inset-0 rounded-xl bg-emerald-400 shadow-md shadow-emerald-500/30 -z-10"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch("signup")}
          className={cn(
            "relative py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 z-10",
            mode === "signup"
              ? "text-black"
              : "text-slate-300 hover:text-white"
          )}
        >
          {mode === "signup" && (
            <motion.div
              layoutId="auth-tab-pill"
              className="absolute inset-0 rounded-xl bg-emerald-400 shadow-md shadow-emerald-500/30 -z-10"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span>Create Account</span>
        </button>
      </div>

      {/* Alert Notices */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-3.5 mb-5 text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2.5"
        >
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-3.5 mb-5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-start gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{success}</span>
        </motion.div>
      )}

      {/* Forms Container with Smooth AnimatePresence Transition */}
      <div className="relative z-10 min-h-[280px]">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "signin" ? (
            <motion.form
              key="signin-form"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="signin-email" className="text-xs font-bold text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="athlete@gymos.app"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password" className="text-xs font-bold text-slate-200">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 mt-2 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignUp}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-xs font-bold text-slate-200">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Mercer"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-xs font-bold text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@gymos.app"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-xs font-bold text-slate-200">
                  Password (min 8 characters)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 mt-2 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-current" /> Create Free Athlete Account
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Highlights Footer */}
      <div className="relative z-10 pt-6 mt-6 border-t border-border/50 flex items-center justify-around text-[11px] text-slate-300 font-semibold">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Free
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Overload Engine
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No Card Needed
        </span>
      </div>
    </div>
  );
}

export function AuthSwitch(props: AuthSwitchProps) {
  return (
    <Suspense fallback={<div className="h-[460px] w-full max-w-md mx-auto rounded-3xl bg-[#12161F]/60 animate-pulse" />}>
      <AuthSwitchInner {...props} />
    </Suspense>
  );
}

export default AuthSwitch;
