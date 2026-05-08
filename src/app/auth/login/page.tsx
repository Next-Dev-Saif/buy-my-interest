"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { setAuthCookie } from "@/utils/auth-cookies";
import { checkProfileCompletion } from "@/utils/profile-check";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const profile = await checkProfileCompletion(email, userCredential.user.uid);
      
      await setAuthCookie(token, !!profile?.completed, email, profile?.userType);
      
      if (!profile || !profile.completed) {
        router.push("/get-started");
      } else if (profile.userType === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push(`/explore-interests/${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden group shadow-2xl">
      {/* Decorative element */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

      <div className="text-center space-y-2 relative">
        <h1 className="text-4xl font-editorial text-gradient">Welcome Back</h1>
        <p className="text-muted-foreground">
          Log in to your account to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5 relative">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] ml-1 text-secondary">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-input/40 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-secondary">
                Password
              </label>
              <Link
                href="#"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-input/40 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-2xl font-medium"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-xl shadow-foreground/10"
        >
          {loading ? "Logging in..." : "Log In"}
          {!loading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>

      <p className="text-center text-[11px] font-bold text-muted-foreground relative">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary hover:underline uppercase tracking-widest ml-1"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
