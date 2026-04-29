"use client";

import { useState } from "react";
import { 
  Plus, 
  LayoutDashboard, 
  Tag, 
  Users, 
  TrendingUp, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Zap,
  CheckCircle2,
  Clock,
  X,
  Camera,
  MapPin,
  DollarSign,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

// Mock data for initial implementation
const mockListings = [
  {
    id: "l1",
    title: "Luxury 4-Bedroom Villa in Bahria Town",
    price: "$250,000",
    category: "Houses",
    location: "Rawalpindi, PK",
    status: "Active",
    views: 142,
    leads: 8,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "l2",
    title: "Siberian Husky Puppies - KCI Registered",
    price: "$800",
    category: "Pets",
    location: "Lahore, PK",
    status: "Active",
    views: 56,
    leads: 3,
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800",
  }
];

const mockLeads = [
  {
    id: "le1",
    buyerName: "Ahmed Khan",
    interest: "Luxury Houses",
    location: "Rawalpindi",
    date: "2 hours ago",
    match: "98%",
  },
  {
    id: "le2",
    buyerName: "Sarah J.",
    interest: "Purebred Dogs",
    location: "Lahore",
    date: "5 hours ago",
    match: "95%",
  }
];

/**
 * SellerDashboard Component
 * 
 * The primary interface for sellers to manage their inventory, view leads, and track analytics.
 * Features a tabbed interface and a "Create New Listing" modal with form validation.
 * 
 * @returns {JSX.Element} The comprehensive seller dashboard view.
 */
export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("listings");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "Houses"
    }
  });

  const onSubmit = (data: ListingFormValues) => {
    console.log("New listing data:", data);
    // In a real app, we would add this to Firestore
    alert("Listing created successfully! (Mocked)");
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 uppercase tracking-widest mb-4"
          >
            <Zap className="w-3 h-3" /> Seller Portal
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Dashboard
          </h1>
          <p className="text-foreground/60 mt-2 text-lg">
            Manage your assets and connect with qualified buyers.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Create New Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Listings", value: "12", icon: Tag, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Total Reach", value: "2.4k", icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Direct Leads", value: "48", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Conversion", value: "4.2%", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (Mobile Top bar) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
          {[
            { id: "listings", label: "My Listings", icon: Tag },
            { id: "leads", label: "Potential Leads", icon: Users },
            { id: "analytics", label: "Performance", icon: TrendingUp },
            { id: "settings", label: "Portal Settings", icon: LayoutDashboard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap lg:w-full ${
                activeTab === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                : "glass border border-white/5 text-foreground/60 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 glass rounded-[2.5rem] border border-white/10 overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "listings" && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">Active Inventory</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input 
                      type="text" 
                      placeholder="Search listings..." 
                      className="bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {mockListings.map((listing) => (
                    <div 
                      key={listing.id}
                      className="group flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-tighter">
                            {listing.status}
                          </span>
                          <span className="text-foreground/40 text-xs font-bold">{listing.category}</span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">{listing.title}</h3>
                        <p className="text-primary font-black">{listing.price}</p>
                        <p className="text-foreground/40 text-xs">{listing.location}</p>
                      </div>
                      <div className="flex sm:flex-col items-center justify-center gap-6 px-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-foreground/30 uppercase">Views</p>
                          <p className="font-bold">{listing.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-foreground/30 uppercase">Leads</p>
                          <p className="font-bold text-primary">{listing.leads}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">Identified Buyer Matches</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10">
                    <Clock className="w-3 h-3" /> Auto-refreshes every 15m
                  </div>
                </div>

                <div className="space-y-4">
                  {mockLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary">
                            {lead.buyerName[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{lead.buyerName}</h3>
                            <p className="text-xs text-foreground/40">{lead.date}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-black text-sm">
                          <CheckCircle2 className="w-4 h-4" /> {lead.match} Match Score
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-black/20 space-y-1">
                          <p className="text-[10px] font-black text-foreground/30 uppercase">Searching For</p>
                          <p className="font-bold">{lead.interest}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/20 space-y-1">
                          <p className="text-[10px] font-black text-foreground/30 uppercase">Target Location</p>
                          <p className="font-bold">{lead.location}</p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold transition-all border border-primary/20">
                          View Search Profile <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                   <TrendingUp className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-black">Performance Insights</h3>
                   <p className="text-foreground/60 max-w-sm mx-auto mt-2">
                     Detailed analytics for your listings are being calculated. Connect more buyers to see trend data.
                   </p>
                </div>
                <button className="px-8 py-3 rounded-xl bg-foreground/5 border border-white/10 font-bold hover:bg-white/5 transition-all">
                  Refresh Engine
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Listing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 lg:p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black">New Listing</h2>
                    <p className="text-foreground/50 text-sm">Provide details about your interest for buyers.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Title
                      </label>
                      <input 
                        {...register("title")}
                        placeholder="e.g. 2024 Luxury Villa"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      {errors.title && <p className="text-red-500 text-[10px] font-bold">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Price
                      </label>
                      <input 
                        {...register("price")}
                        placeholder="e.g. $250,000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      {errors.price && <p className="text-red-500 text-[10px] font-bold">{errors.price.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <LayoutDashboard className="w-3 h-3" /> Category
                      </label>
                      <select 
                        {...register("category")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="Houses">Houses</option>
                        <option value="Cars">Cars</option>
                        <option value="Pets">Pets</option>
                        <option value="Plots">Plots</option>
                      </select>
                      {errors.category && <p className="text-red-500 text-[10px] font-bold">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Location
                      </label>
                      <input 
                        {...register("location")}
                        placeholder="e.g. Dubai, UAE"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      {errors.location && <p className="text-red-500 text-[10px] font-bold">{errors.location.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <Edit2 className="w-3 h-3" /> Description
                    </label>
                    <textarea 
                      {...register("description")}
                      rows={4}
                      placeholder="Describe the item in detail..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                    {errors.description && <p className="text-red-500 text-[10px] font-bold">{errors.description.message}</p>}
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-5 rounded-2xl glass border border-white/10 font-bold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-5 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      Publish Listing <Sparkles className="w-5 h-5" />
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
