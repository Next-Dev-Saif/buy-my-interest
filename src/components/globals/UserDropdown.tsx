"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LayoutDashboard, 
  Home, 
  LogOut, 
  ChevronDown,
  Bell,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/get-started" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/profile#settings" },
    { icon: Bell, label: "Notifications", href: "/profile#notifications" },
    { icon: CreditCard, label: "Billing", href: "/profile#billing" },
  ];

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl border border-border/60 hover:bg-muted/40 transition-all active:scale-95 group"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-[10px] font-black uppercase tracking-wider text-foreground truncate max-w-[100px]">
            {user.displayName || "User"}
          </span>
          <span className="text-[9px] font-bold text-secondary uppercase tracking-tight">
            Account
          </span>
        </div>
        <div className="w-9 h-9 flex items-center justify-center text-foreground overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <User size={18} />
          )}
        </div>
        <ChevronDown size={14} className={`text-secondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-card border border-border/60 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden z-[999]"
          >
            <div className="p-5 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-foreground font-black text-sm">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-foreground truncate">
                    {user.displayName || "User"}
                  </span>
                  <span className="text-[10px] font-medium text-secondary truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-foreground hover:bg-muted/50 transition-all group"
                >
                  <item.icon size={16} className="group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="p-2 border-t border-border/40">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
              >
                <LogOut size={16} />
                <span className="text-xs font-black uppercase tracking-wider">Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
