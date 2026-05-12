"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase";
import { setAuthCookie } from "@/utils/auth-cookies";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });
      const token = await userCredential.user.getIdToken();
      
      // For a new signup, profile is always false initially and userRole is not set yet
      await setAuthCookie(token, false, email, undefined);
      
      router.push("/get-started");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden group shadow-2xl">
      {/* Decorative element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

      <div className="text-center space-y-2 relative">
        <h1 className="text-4xl font-editorial text-gradient">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Start your personalized interest journey today
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5 relative">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] ml-1 text-secondary">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-input/40 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all text-sm"
              />
            </div>
          </div>

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
            <label className="text-xs font-black uppercase tracking-[0.2em] ml-1 text-secondary">
              Password
            </label>
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
          {loading ? "Creating Account..." : "Sign Up"}
          {!loading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>

      <p className="text-center text-[11px] font-bold text-muted-foreground relative">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:underline uppercase tracking-widest ml-1"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
