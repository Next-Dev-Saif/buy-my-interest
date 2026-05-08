"use client";

import { useEffect, useState } from "react";
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
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "Houses",
      currency: "PKR",
    },
  });

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
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "seller_listings", id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
            Marketplace Partner
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-secondary text-sm font-medium">
            Manage your inventory and connect with qualified buyers globally.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Listings",
            value: listings.length.toString(),
            icon: Tag,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Market Reach",
            value: "2,405",
            icon: TrendingUp,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Qualified Leads",
            value: leads.length.toString(),
            icon: Users,
            color: "text-red-700",
            bg: "bg-red-50",
          },
          {
            label: "Conversion Rate",
            value:
              leads.length > 0
                ? ((leads.length / (listings.length || 1)) * 10).toFixed(1) +
                  "%"
                : "0%",
            icon: Zap,
            color: "text-rose-800",
            bg: "bg-rose-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center text-current`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
          {[
            { id: "listings", label: "My Inventory", icon: Tag },
            { id: "leads", label: "Direct Leads", icon: Users },
            { id: "analytics", label: "Market Insights", icon: TrendingUp },
            { id: "settings", label: "Settings", icon: LayoutDashboard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap lg:w-full border ${
                activeTab === item.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-card border-border text-secondary hover:border-primary/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "listings" && (
              <motion.div
                key="listings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-foreground">
                    Active Inventory
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {listings.length === 0 ? (
                    <div className="py-12 text-center space-y-3 border-2 border-dashed border-border rounded-xl">
                      <Tag className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
                      <p className="text-secondary text-sm font-medium">
                        No active listings found.
                      </p>
                    </div>
                  ) : (
                    listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex flex-col sm:flex-row items-center gap-5 p-3 rounded-xl border border-border hover:bg-muted/30 transition-all group"
                      >
                        <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <Image
                            src={listing.image || ""}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow space-y-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-red-50 text-primary text-[9px] font-bold uppercase tracking-wider">
                              {listing.status}
                            </span>
                            <span className="text-secondary text-[10px] font-bold uppercase">
                              {listing.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-base leading-tight text-foreground">
                            {listing.title}
                          </h3>
                          <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                            <p className="text-primary font-bold text-sm">
                              {listing.price}
                            </p>
                            <p className="text-secondary text-[10px] font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {listing.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:flex-row items-center justify-center gap-8 px-4 border-l border-border hidden md:flex">
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">
                              Views
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              {listing.views}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">
                              Leads
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {listing.leads}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button className="p-2 rounded-lg bg-background border border-border hover:border-primary hover:text-primary transition-all shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="p-2 rounded-lg bg-background border border-border hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Qualified Leads
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary px-2 py-1 rounded bg-primary/5 border border-primary/10">
                    <Clock className="w-3 h-3" /> Last Update: 2m ago
                  </div>
                </div>

                <div className="space-y-3">
                  {leads.length === 0 ? (
                    <div className="py-20 text-center space-y-4 border-2 border-dashed border-border rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto border border-primary/10">
                        <Users className="w-8 h-8 text-primary opacity-20" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground font-bold">
                          No buyer prospects yet.
                        </p>
                        <p className="text-secondary text-sm max-w-xs mx-auto">
                          Our AI agents are searching for buyers interested in
                          your inventory. They will appear here automatically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all space-y-4 bg-card shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm uppercase">
                              {lead.buyerName[0]}
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-foreground">
                                {lead.buyerName}
                              </h3>
                              <p className="text-[10px] font-medium text-secondary">
                                {lead.date}
                              </p>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-100 text-primary font-bold text-xs">
                            <CheckCircle2 className="w-3 h-3" /> {lead.match}{" "}
                            Compatibility
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">
                              Interest
                            </p>
                            <p className="text-sm font-bold text-foreground capitalize">
                              {lead.interest}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">
                              Target Region
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              {lead.location}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={
                              lead.buyerEmail
                                ? `mailto:${lead.buyerEmail}`
                                : "#"
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-bold text-xs transition-all shadow-md"
                          >
                            Contact Buyer{" "}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-primary">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Market Performance
                  </h3>
                  <p className="text-secondary text-sm max-w-sm mx-auto mt-1 leading-relaxed">
                    Comprehensive analytics for your active inventory are being
                    processed. Direct buyer engagement will appear here.
                  </p>
                </div>
                <button className="px-6 py-2 rounded-lg bg-background border border-border font-bold text-sm hover:bg-muted/50 transition-all shadow-sm">
                  Update Insights
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] overflow-y-auto flex justify-center py-12 md:py-20 px-4 scroll-smooth no-scrollbar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-background/95"
            >
              {/* Immersive Wave Canvas - Bright & Clear */}
              <div className="absolute inset-0 opacity-100">
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
              className="relative w-full max-w-3xl bg-card rounded-[2.5rem] border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] h-fit mb-20"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-12 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-foreground font-editorial tracking-tight">
                    Create New Listing
                  </h2>
                  <p className="text-sm text-secondary font-medium mt-1">
                    Provide the details below to publish your listing.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-muted transition-all active:scale-90"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-14">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                  {/* Section 1: Listing Info */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
                          General Information
                        </h3>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 opacity-50">
                          Basic details of your listing
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-secondary ml-1">
                          Listing Title
                        </label>
                        <input
                          {...register("title")}
                          placeholder="e.g. 2024 Luxury Villa"
                          className="w-full bg-muted/30 border border-border/40 rounded-2xl px-6 py-4.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-secondary/30"
                        />
                        {errors.title && (
                          <p className="text-red-500 text-[10px] font-bold ml-1">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              label="Item Category"
                              value={field.value}
                              onChange={field.onChange}
                              options={[
                                { value: "Houses", label: "Houses" },
                                { value: "Cars", label: "Cars" },
                                { value: "Pets", label: "Pets" },
                                { value: "Plots", label: "Plots" },
                              ]}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Pricing & Location */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
                          Pricing & Location
                        </h3>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 opacity-50">
                          Valuation and physical origin
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.1em] text-secondary ml-1">
                            Price
                          </label>
                          <input
                            {...register("price")}
                            placeholder="250,000"
                            className="w-full bg-muted/30 border border-border/40 rounded-2xl px-6 py-4.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-secondary/30"
                          />
                          {errors.price && (
                            <p className="text-red-500 text-[10px] font-bold ml-1">
                              {errors.price.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-secondary ml-1">
                          Current Location
                        </label>
                        <input
                          {...register("location")}
                          placeholder="e.g. Dubai, UAE"
                          className="w-full bg-muted/30 border border-border/40 rounded-2xl px-6 py-4.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-secondary/30"
                        />
                        {errors.location && (
                          <p className="text-red-500 text-[10px] font-bold ml-1">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Description */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
                          Detailed Description
                        </h3>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 opacity-50">
                          Listing specifications and features
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        {...register("description")}
                        rows={6}
                        placeholder="Provide a detailed description of your item..."
                        className="w-full bg-muted/30 border border-border/40 rounded-[2rem] px-8 py-8 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium resize-none min-h-[200px] placeholder:text-secondary/30 leading-relaxed shadow-inner"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-[10px] font-bold ml-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row gap-5 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-6 rounded-[2rem] border border-border font-black text-[11px] uppercase tracking-[0.2em] text-secondary hover:bg-muted/30 transition-all active:scale-[0.98]"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-6 rounded-[2rem] bg-foreground text-background font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-2xl shadow-foreground/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      Publish Listing <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
