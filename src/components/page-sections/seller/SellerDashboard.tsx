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
import { Controller } from "react-hook-form";
import CustomSelect from "@/components/core-components/CustomSelect";

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
    control,
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
          { label: "Active Listings", value: "12", icon: Tag, color: "text-red-600", bg: "bg-red-50" },
          { label: "Market Reach", value: "2,405", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Qualified Leads", value: "48", icon: Users, color: "text-red-700", bg: "bg-red-50" },
          { label: "Conversion Rate", value: "4.2%", icon: Zap, color: "text-rose-800", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center text-current`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</h3>
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
                  <h2 className="text-xl font-bold text-foreground">Active Inventory</h2>
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
                  {mockListings.map((listing) => (
                    <div 
                      key={listing.id}
                      className="flex flex-col sm:flex-row items-center gap-5 p-3 rounded-xl border border-border hover:bg-muted/30 transition-all group"
                    >
                      <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-primary text-[9px] font-bold uppercase tracking-wider">
                            {listing.status}
                          </span>
                          <span className="text-secondary text-[10px] font-bold uppercase">{listing.category}</span>
                        </div>
                        <h3 className="font-bold text-base leading-tight text-foreground">{listing.title}</h3>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                           <p className="text-primary font-bold text-sm">{listing.price}</p>
                           <p className="text-secondary text-[10px] font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {listing.location}
                           </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-row items-center justify-center gap-8 px-4 border-l border-border hidden md:flex">
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Views</p>
                          <p className="text-sm font-bold text-foreground">{listing.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Leads</p>
                          <p className="text-sm font-bold text-primary">{listing.leads}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="p-2 rounded-lg bg-background border border-border hover:border-primary hover:text-primary transition-all shadow-sm">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 rounded-lg bg-background border border-border hover:border-red-500 hover:text-red-500 transition-all shadow-sm">
                          <Trash2 className="w-3.5 h-3.5" />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Qualified Leads</h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary px-2 py-1 rounded bg-primary/5 border border-primary/10">
                    <Clock className="w-3 h-3" /> Last Update: 2m ago
                  </div>
                </div>

                <div className="space-y-3">
                  {mockLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all space-y-4 bg-card shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {lead.buyerName[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-foreground">{lead.buyerName}</h3>
                            <p className="text-[10px] font-medium text-secondary">{lead.date}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-100 text-primary font-bold text-xs">
                          <CheckCircle2 className="w-3 h-3" /> {lead.match} Compatibility
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Interest</p>
                          <p className="text-sm font-bold text-foreground">{lead.interest}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Target Region</p>
                          <p className="text-sm font-bold text-foreground">{lead.location}</p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-bold text-xs transition-all shadow-md">
                          Review Profile <ExternalLink className="w-3.5 h-3.5" />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-primary">
                   <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-foreground">Market Performance</h3>
                   <p className="text-secondary text-sm max-w-sm mx-auto mt-1 leading-relaxed">
                     Comprehensive analytics for your active inventory are being processed. Direct buyer engagement will appear here.
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
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-card rounded-xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">New Listing</h2>
                    <p className="text-secondary text-sm">Fill in the details for your marketplace asset.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg bg-background border border-border hover:bg-muted/50 transition-all shadow-sm"
                  >
                    <X className="w-5 h-5 text-secondary" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Asset Title
                      </label>
                      <input 
                        {...register("title")}
                        placeholder="e.g. 2024 Luxury Villa"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      />
                      {errors.title && <p className="text-red-500 text-[10px] font-bold">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Price
                      </label>
                      <input 
                        {...register("price")}
                        placeholder="e.g. $250,000"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      />
                      {errors.price && <p className="text-red-500 text-[10px] font-bold">{errors.price.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          label="Category"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.category?.message}
                          options={[
                            { value: "Houses", label: "Houses" },
                            { value: "Cars", label: "Cars" },
                            { value: "Pets", label: "Pets" },
                            { value: "Plots", label: "Plots" },
                          ]}
                        />
                      )}
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Location
                      </label>
                      <input 
                        {...register("location")}
                        placeholder="e.g. Dubai, UAE"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      />
                      {errors.location && <p className="text-red-500 text-[10px] font-bold">{errors.location.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Detailed Description
                    </label>
                    <textarea 
                      {...register("description")}
                      rows={4}
                      placeholder="Enter a comprehensive description..."
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                    />
                    {errors.description && <p className="text-red-500 text-[10px] font-bold">{errors.description.message}</p>}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-lg border border-border font-bold text-sm hover:bg-muted/50 transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
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
