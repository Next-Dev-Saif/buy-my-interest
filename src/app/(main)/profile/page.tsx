"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Save,
  Loader2,
  Camera,
  Bell,
  CreditCard,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Notification State
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });

  const toggleNotification = (id: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (["personal", "notifications", "billing", "settings"].includes(hash)) {
      setActiveTab(hash === "settings" ? "personal" : hash);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      setName(user.displayName || "");
    }
  }, [user, loading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(user, { displayName: name });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Identity", icon: User },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "billing", label: "Plan", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-10 sm:px-6 ">
      <div className="max-w-[1100px] mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border/40">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black font-editorial tracking-tight text-foreground">
              Account <span className="text-primary">Overview.</span>
            </h1>
            <p className="text-lg text-secondary max-w-lg font-medium leading-relaxed">
              Manage your personal information, configure marketplace alerts,
              and oversee your search preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full border border-border/60 text-secondary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} className="text-primary" />
              Free Plan
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95 border border-border/40"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-sm font-black uppercase tracking-widest border ${
                    activeTab === tab.id
                      ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10"
                      : "text-secondary hover:text-foreground border-transparent hover:border-border/60"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="glass rounded-[2rem] p-6 border border-border/60 space-y-6">
              <div className="relative group mx-auto w-fit">
                <div className="w-24 h-24 rounded-[2rem] border-2 border-border/60 group-hover:border-primary/40 transition-all overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-secondary/40" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-foreground text-background rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-background">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-black font-editorial text-xl">
                  {user.displayName || "Explorer"}
                </h3>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.1em]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/60">
                    <form onSubmit={handleUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1">
                            Full Name
                          </label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 opacity-60">
                          <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                            <input
                              type="email"
                              readOnly
                              value={user.email || ""}
                              className="w-full bg-muted/30 border border-border/30 rounded-2xl py-4 pl-12 pr-6 outline-none cursor-not-allowed font-bold text-base"
                            />
                          </div>
                        </div>
                      </div>

                      {message.text && (
                        <div
                          className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 ${
                            message.type === "success"
                              ? "bg-green-500/10 border-green-500/20 text-green-500"
                              : "bg-red-500/10 border-red-500/20 text-red-500"
                          }`}
                        >
                          {message.type === "success" ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <AlertCircle size={16} />
                          )}
                          {message.text}
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-border/40">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-foreground/10"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Update Information
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/60 flex flex-col md:flex-row items-center gap-8">
                    <Shield className="w-10 h-10 text-primary" />
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-black font-editorial">
                        Security Settings
                      </h3>
                      <p className="text-secondary font-medium text-sm leading-relaxed max-w-lg">
                        Your account is protected by standard security
                        protocols. You can update your authentication details at
                        any time.
                      </p>
                    </div>
                    <button className="px-8 py-4 rounded-2xl border border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-muted/50 transition-all active:scale-95">
                      Manage Security
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/60 space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black font-editorial">
                        Market Alerts
                      </h3>
                      <p className="text-secondary font-medium">
                        Manage how you receive notifications about new
                        marketplace matches.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          id: "email" as const,
                          label: "Email Notifications",
                          desc: "Receive alerts about new matches directly in your inbox.",
                        },
                        {
                          id: "push" as const,
                          label: "Browser Alerts",
                          desc: "Get real-time browser notifications for important updates.",
                        },
                        {
                          id: "weekly" as const,
                          label: "Weekly Summary",
                          desc: "A curated digest of market activities and recommendations.",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/20 border border-border/40"
                        >
                          <div className="space-y-1">
                            <span className="text-base font-black text-foreground">
                              {item.label}
                            </span>
                            <p className="text-xs text-secondary font-medium">
                              {item.desc}
                            </p>
                          </div>
                          <div
                            onClick={() => toggleNotification(item.id)}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifications[item.id] ? "bg-primary" : "bg-muted"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${notifications[item.id] ? "translate-x-6" : "translate-x-0"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  {/* Current Status Card */}
                  <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/60 bg-muted/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 text-secondary text-[10px] font-black uppercase tracking-widest">
                          Account Status
                        </div>
                        <h3 className="text-5xl lg:text-7xl font-black font-editorial tracking-tight text-foreground">
                          Free Plan.
                        </h3>
                        <p className="text-secondary font-medium leading-relaxed max-w-sm">
                          Your current search capacity is limited. Upgrade to
                          professional plans for global coverage and real-time
                          alerts.
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-8 rounded-[3rem] border border-border/40 bg-background/50 backdrop-blur-xl">
                        <span className="text-4xl font-black font-editorial text-foreground">
                          $0
                        </span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">
                          Per Quarter
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass rounded-[2.5rem] p-8 border border-primary/40 flex flex-col justify-between group hover:border-primary transition-all duration-500">
                      <div className="space-y-4">
                        <Zap size={32} className="text-primary" />
                        <h4 className="text-3xl font-black font-editorial tracking-tight">
                          Professional.
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Unlimited Match Alerts",
                            "Priority Search Status",
                            "50+ Target Regions",
                          ].map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-3 text-xs font-bold text-secondary"
                            >
                              <CheckCircle2
                                size={14}
                                className="text-primary"
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="mt-10 w-full py-5 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Upgrade to Professional
                      </button>
                    </div>

                    <div className="glass rounded-[2.5rem] p-8 border border-border/60 flex flex-col justify-between group hover:border-foreground/40 transition-all duration-500">
                      <div className="space-y-4">
                        <Sparkles size={32} className="text-foreground" />
                        <h4 className="text-3xl font-black font-editorial tracking-tight">
                          Enterprise.
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Deep Market Analytics",
                            "Concierge Support",
                            "Custom Search Protocols",
                          ].map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-3 text-xs font-bold text-secondary"
                            >
                              <CheckCircle2
                                size={14}
                                className="text-foreground/40"
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="mt-10 w-full py-5 rounded-2xl border border-border/60 text-xs font-black uppercase tracking-widest hover:bg-muted/50 active:scale-95 transition-all">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
