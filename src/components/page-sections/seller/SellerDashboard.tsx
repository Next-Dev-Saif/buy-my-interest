"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  LayoutDashboard,
  Tag,
  Users,
  TrendingUp,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Zap,
  CheckCircle2,
  Clock,
  X,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomSelect from "@/components/core-components/CustomSelect";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import WaveCanvas from "@/components/animations/WaveCanvas";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface Listing extends ListingFormValues {
  id: string;
  status: string;
  views: number;
  leads: number;
  image?: string;
  createdAt: any;
}

interface Lead {
  id: string;
  buyerName: string;
  interest: string;
  location: string;
  date: string;
  match: string;
  buyerEmail?: string;
}

const currencyOptions = [
  { value: "PKR", label: "PKR - Pakistan Rupee" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "CAD", label: "CAD - Canada Dollar" },
];

export default function SellerDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("listings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "Houses",
      currency: "PKR",
    },
  });

  // Handle Edit click
  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setValue("title", listing.title);
    setValue("price", listing.price);
    setValue("currency", listing.currency);
    setValue("category", listing.category);
    setValue("location", listing.location);
    setValue("description", listing.description);
    setIsModalOpen(true);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setEditingListing(null);
      reset({
        title: "",
        price: "",
        currency: "PKR",
        category: "Houses",
        location: "",
        description: "",
      });
    }
  }, [isModalOpen, reset]);

  // Fetch Listings
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "seller_listings"),
      where("userId", "==", user.email),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Listing[];

      // Sort in memory to avoid index requirement
      const sortedData = data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setListings(sortedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch Leads (Search Results from n8n)
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "search_results"),
      where("userId", "==", user.email),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          id: doc.id,
          buyerName:
            item.title?.replace("Interested Buyer: ", "") || "Anonymous Buyer",
          interest: item.category,
          location: item.location,
          date:
            item.timestamp && typeof item.timestamp.toDate === "function"
              ? formatDistanceToNow(item.timestamp.toDate()) + " ago"
              : "Just now",
          match: "95%",
          buyerEmail: item.metadata?.buyerEmail,
          timestamp: item.timestamp, // Keep for sorting
        };
      });

      // Sort in memory
      const sortedLeads = data.sort((a: any, b: any) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      });

      setLeads(sortedLeads);
    });

    return () => unsubscribe();
  }, [user]);

  const onSubmit = async (data: ListingFormValues) => {
    if (!user?.email) return;

    try {
      if (editingListing) {
        // Update existing listing
        const listingRef = doc(db, "seller_listings", editingListing.id);
        await updateDoc(listingRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Create new listing
        await addDoc(collection(db, "seller_listings"), {
          ...data,
          userId: user.email,
          status: "Active",
          views: 0,
          leads: 0,
          createdAt: Timestamp.now(),
          image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", // Default for now
        });
      }
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Failed to save listing. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    // In a premium app, we should use a custom modal, but keeping it functional for now
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "seller_listings", id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {/* Header Section - Mobile Optimized */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border shadow-sm p-6 md:p-8 rounded-[2rem] md:rounded-3xl">
          <div className="space-y-2 md:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-wider">
              Seller Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Dashboard <span className="text-primary">Overview</span>
            </h1>
            <p className="text-secondary text-sm md:text-sm font-medium max-w-xl leading-relaxed">
              Manage your inventory, track interested buyers, and grow your marketplace presence.
            </p>
          </div>
          <div className="flex items-center w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm transition-all hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" /> 
              <span>New Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - 2 Column on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* ... existing stats ... */}
      </div>

      {/* Integrated Market Insights - Now part of the main dashboard flow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Top Performing Items</h4>
            <div className="space-y-4">
              {listings.slice(0, 3).map((item, i) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      #{i + 1}
                    </div>
                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{item.title}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{item.views} Views</span>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-xs text-secondary text-center py-4 italic">No listing data available yet</p>
              )}
            </div>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">+12.4%</p>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mt-1">Conversion Velocity</p>
            </div>
            <p className="text-xs text-secondary font-medium leading-relaxed">
              Your listings are performing above the market average for your category.
            </p>
          </div>
        </div>

        <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Engagement Analytics</h3>
              <p className="text-[10px] text-secondary font-medium mt-1">Growth over the last 30 days</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-[10px] font-bold text-secondary uppercase">Impressions</span>
            </div>
          </div>

          <div className="relative h-48 md:h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradientMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              ))}
              <path
                d="M 0 250 Q 150 220 250 180 T 500 120 T 750 80 T 1000 40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
              />
              <path
                d="M 0 250 Q 150 220 250 180 T 500 120 T 750 80 T 1000 40 L 1000 300 L 0 300 Z"
                fill="url(#chartGradientMain)"
              />
              {[0, 250, 500, 750, 1000].map((x, i) => (
                <circle key={i} cx={x} cy={[250, 180, 120, 80, 40][i]} r="4" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-6 px-2">
            {["W1", "W2", "W3", "W4", "NOW"].map((label) => (
              <span key={label} className="text-[9px] font-bold text-secondary uppercase tracking-widest">{label}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar - Tab-style on Mobile */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar sticky top-0 lg:top-8 bg-background/80 backdrop-blur-md z-10 -mx-4 px-4 lg:mx-0 lg:px-0">
          {[
            { id: "listings", label: "Inventory", icon: Tag, count: listings.length },
            { id: "leads", label: "Buyers", icon: Users, count: leads.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center justify-between px-4 lg:px-5 py-3 rounded-xl lg:rounded-xl text-xs lg:text-sm font-bold transition-all duration-200 whitespace-nowrap lg:w-full border ${
                activeTab === item.id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-card border-border text-secondary hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-white" : "text-primary"}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`hidden lg:inline px-2 py-0.5 rounded-lg text-[10px] font-bold ${activeTab === item.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Panel - Cinematic Layout */}
        <div className="lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === "listings" && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Search & Filter Bar - Mobile Optimized */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                      Active Inventory
                    </h2>
                    <p className="text-[10px] md:text-xs font-medium text-secondary">
                      Manage and monitor your published marketplace listings.
                    </p>
                  </div>
                  <div className="relative group w-full md:min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full transition-all placeholder:text-secondary/50 font-medium"
                    />
                  </div>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {listings.length === 0 ? (
                      <div className="py-24 text-center space-y-6 bg-card border border-border rounded-3xl shadow-sm">
                        <Tag className="w-12 h-12 text-primary/30 mx-auto" />
                        <div className="space-y-2">
                          <p className="text-xl font-bold text-foreground">No listings yet.</p>
                          <p className="text-secondary text-sm max-w-xs mx-auto">
                            Ready to make a sale? Create your first listing and reach buyers.
                          </p>
                        </div>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                          Create Listing
                        </button>
                      </div>
                  ) : (
                    listings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex flex-col sm:flex-row items-stretch gap-6 p-4 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
                      >
                        {/* Image Section */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden flex-shrink-0 border border-border/50">
                          <Image
                            src={listing.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 shadow-sm">
                              {listing.status}
                            </span>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-grow flex flex-col justify-center space-y-3 md:space-y-4 py-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary/70">
                                {listing.category}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-border"></span>
                              <span className="text-[9px] md:text-[10px] font-medium text-secondary flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {listing.location}
                              </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                              {listing.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between md:justify-start gap-8">
                            <div>
                              <p className="text-[8px] md:text-[9px] font-bold text-secondary uppercase tracking-wider mb-0.5 md:mb-1">Valuation</p>
                              <p className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                                <span className="text-xs md:text-sm font-bold text-primary mr-1">{listing.currency}</span>
                                {listing.price}
                              </p>
                            </div>
                            <div className="hidden md:block h-8 w-px bg-border/50"></div>
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="text-center">
                                <p className="text-[8px] md:text-[9px] font-bold text-secondary uppercase tracking-wider mb-0.5 md:mb-1">Views</p>
                                <p className="text-xs md:text-sm font-bold text-foreground">{listing.views}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] md:text-[9px] font-bold text-secondary uppercase tracking-wider mb-0.5 md:mb-1">Leads</p>
                                <p className="text-xs md:text-sm font-bold text-primary">{listing.leads}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Section - Grid on Mobile */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-col items-center justify-center gap-2 pt-4 sm:pt-0 sm:px-4 sm:border-l border-border/50">
                          <button 
                            onClick={() => handleEdit(listing)}
                            className="flex items-center justify-center gap-2 sm:p-3 py-2.5 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-border/50 active:scale-95 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="sm:hidden">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="flex items-center justify-center gap-2 sm:p-3 py-2.5 rounded-xl bg-muted/30 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 border border-border/50 active:scale-95 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sm:hidden">Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                      Interested Buyers
                    </h2>
                    <p className="text-[10px] md:text-xs font-medium text-secondary">
                      Track inquiries and buyer activity.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-primary px-4 py-2 rounded-full bg-primary/5 border border-primary/10 uppercase tracking-wider w-fit">
                    <Clock className="w-3.5 h-3.5" /> Active Updates
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {leads.length === 0 ? (
                    <div className="py-24 text-center space-y-6 bg-card border border-border rounded-3xl shadow-sm">
                      <Users className="w-12 h-12 text-primary/30 mx-auto" />
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-foreground">No buyers found yet.</p>
                        <p className="text-secondary text-sm max-w-sm mx-auto leading-relaxed font-medium">
                          We are currently searching the market to find the best buyers for your items.
                        </p>
                      </div>
                    </div>
                  ) : (
                    leads.map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-6 sm:p-8 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 bg-card shadow-sm hover:shadow-md overflow-hidden"
                      >
                        <div className="relative space-y-8">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-105 uppercase">
                                {lead.buyerName[0]}
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-foreground tracking-tight">
                                  {lead.buyerName}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-bold text-secondary">{lead.date}</span>
                                  <span className="w-1 h-1 rounded-full bg-border"></span>
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Verified Prospect</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {lead.match} Match
                              </div>
                              <p className="text-[10px] font-medium text-secondary/60">Interest Quality</p>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 space-y-1.5">
                              <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Interest Profile</p>
                              <p className="text-base font-bold text-foreground capitalize tracking-tight">
                                {lead.interest}
                              </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 space-y-1.5">
                              <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Acquisition Region</p>
                              <p className="text-base font-bold text-foreground tracking-tight">
                                {lead.location}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
                            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card border border-border font-bold text-xs uppercase tracking-wider hover:bg-muted transition-all active:scale-95">
                              Ignore Lead
                            </button>
                            <Link
                              href={lead.buyerEmail ? `mailto:${lead.buyerEmail}` : "#"}
                              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md font-bold text-xs uppercase tracking-wider active:scale-95"
                            >
                              <span>Initiate Contact</span>
                              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab content logic remains for listings and leads */}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal - Cinematic Listing Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {createPortal(
              <div className="fixed inset-0 z-[99999] overflow-y-auto flex justify-center py-12 px-4 scroll-smooth no-scrollbar">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 md:p-10"
                >
                  <div className="absolute inset-0 opacity-40">
                    <WaveCanvas
                      color={theme === "dark" ? "#00f2ff" : "#0f766e"}
                      opacity={theme === "dark" ? 0.6 : 0.4}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl bg-card rounded-[2rem] md:rounded-[3rem] border border-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-fit z-[60] overflow-hidden my-auto"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
                  
                  {/* Modal Header */}
                  <div className="p-6 md:p-10 border-b border-border relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-wider mb-3">
                        {editingListing ? "Edit Listing" : "New Listing"}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-none">
                        {editingListing ? "Update" : "Create"} <span className="text-primary">Listing</span>
                      </h2>
                      <p className="text-xs md:text-sm text-secondary font-medium mt-2 max-w-md">
                        {editingListing 
                          ? "Refine your listing details to ensure maximum buyer compatibility."
                          : "Provide accurate specifications to reach the most interested buyers."
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-6 right-6 md:static group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-muted/30 hover:bg-red-500 transition-all border border-border active:scale-90"
                    >
                      <X className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 md:p-10 lg:p-14">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-12 md:space-y-16"
                    >
                      {/* Section 1: Listing Info */}
                      <div className="space-y-10">
                        <div className="flex items-center gap-4">
                          <Tag className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                              Listing Details
                            </h3>
                            <p className="text-xs text-secondary font-medium mt-1 opacity-60">
                              Define the primary attributes of your item
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          <div className="md:col-span-8 space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-secondary/80 ml-1">
                              Listing Title
                            </label>
                            <input
                              {...register("title")}
                              placeholder="e.g. 2024 Luxury Villa"
                              className="w-full bg-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-secondary/40"
                            />
                            {errors.title && (
                              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-4">
                            <Controller
                              name="category"
                              control={control}
                              render={({ field }) => (
                                <CustomSelect
                                  label="Category"
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={[
                                    { value: "Houses", label: "Real Estate" },
                                    { value: "Cars", label: "Automotive" },
                                    { value: "Pets", label: "Pets" },
                                    { value: "Plots", label: "Land/Plots" },
                                  ]}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Pricing & Location */}
                      <div className="space-y-10">
                        <div className="flex items-center gap-4">
                          <TrendingUp className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                              Pricing & Location
                            </h3>
                            <p className="text-xs text-secondary font-medium mt-1 opacity-60">
                              Valuation and physical origin
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          <div className="md:col-span-4">
                            <Controller
                              name="currency"
                              control={control}
                              render={({ field }) => (
                                <CustomSelect
                                  label="Currency"
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={currencyOptions}
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-4 space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-secondary/80 ml-1">
                              Asking Price
                            </label>
                            <input
                              {...register("price")}
                              placeholder="0.00"
                              className="w-full bg-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-secondary/40"
                            />
                            {errors.price && (
                              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">
                                {errors.price.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-4 space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-secondary/80 ml-1">
                              Current Location
                            </label>
                            <input
                              {...register("location")}
                              placeholder="e.g. London, UK"
                              className="w-full bg-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-secondary/40"
                            />
                            {errors.location && (
                              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">
                                {errors.location.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Description */}
                      <div className="space-y-10">
                        <div className="flex items-center gap-4">
                          <Users className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                              Listing Description
                            </h3>
                            <p className="text-xs text-secondary font-medium mt-1 opacity-60">
                              Detailed information and key features
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <textarea
                            {...register("description")}
                            rows={6}
                            placeholder="Provide a detailed description of your item..."
                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none min-h-[150px] placeholder:text-secondary/30 leading-relaxed"
                          />
                          {errors.description && (
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">
                              {errors.description.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-border">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 py-4 rounded-xl border border-border font-bold text-[11px] uppercase tracking-widest text-secondary hover:bg-muted transition-all active:scale-95"
                        >
                          Discard Changes
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                        >
                          <span>{editingListing ? "Apply Modifications" : "Publish to Marketplace"}</span>
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>,
              document.body,
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
