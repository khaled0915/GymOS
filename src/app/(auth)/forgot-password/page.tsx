"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4 relative selection:bg-emerald-500 selection:text-black">
      {/* Background Neon Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-border/60 bg-[#12161F]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 text-white space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
              <Dumbbell className="h-5 w-5" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">Reset Password</h1>
            <p className="text-xs text-slate-300">
              {submitted
                ? "Password instructions have been sent"
                : "Enter your registered email to receive reset instructions"}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed flex items-center gap-3 text-left">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                If an account with <strong className="text-white">{email}</strong> exists, instructions have been dispatched.
              </span>
            </div>
            <Button asChild className="w-full h-11 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm rounded-xl">
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Return to Sign In
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="reset-email" className="text-xs font-bold text-slate-200">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="athlete@gymos.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-[#0A0D12]/80 border-border/80 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500/50 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" /> Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
