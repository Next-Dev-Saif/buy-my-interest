"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, X, Sparkles, MapPin, Search, ArrowRight, ArrowLeft, User, Mail, Target, ShoppingCart, Tag, PawPrint, Car, Home, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

const interestedItemsOptions = ["Pets", "Cars", "Houses", "Plots"] as const;

const formSchema = z.object({
  userType: z.enum(["buyer", "seller"]),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  interestedItems: z.array(z.string()).min(1, "Select at least one category"),
  interestedLocations: z.array(z.string()).min(1, "Add at least one location"),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * InterestForm Component
 * 
 * A multi-step onboarding wizard for both Buyers and Sellers.
 * Handles user type selection, profile creation, category interests, and location targeting.
 * 
 * @returns {JSX.Element} The multi-step form interface.
 */
export default function InterestForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const [step, setStep] = useState(0); // 0 is userType selection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "buyer",
      fullName: "",
      email: "",
      interestedItems: [],
      interestedLocations: [],
    },
  });

  const [locationInput, setLocationInput] = useState("");
  const userType = watch("userType");
  const selectedItems = watch("interestedItems");
  const selectedLocations = watch("interestedLocations") || [];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role");
    if (role === "buyer" || role === "seller") {
      setValue("userType", role as "buyer" | "seller");
      setStep(1);
    }
  }, [setValue]);

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    
    let fields: (keyof FormValues)[] = [];
    if (step === 1) fields = ["fullName", "email"];
    if (step === 2) fields = ["interestedItems"];
    if (step === 3) fields = ["interestedLocations"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const addLocation = () => {
    const val = locationInput.trim();
    if (val && !selectedLocations.includes(val)) {
      setValue("interestedLocations", [...selectedLocations, val], { shouldValidate: true });
    }
    setLocationInput("");
  };
  
  const removeLocation = (loc: string) => {
    setValue("interestedLocations", selectedLocations.filter((l) => l !== loc), { shouldValidate: true });
  };

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setValue("interestedItems", selectedItems.filter((i) => i !== item), { shouldValidate: true });
    } else {
      setValue("interestedItems", [...selectedItems, item], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Determine plan from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get("plan") || "free";
    
    // Keeping existing collection names for backend compatibility but terminology on UI is updated
    let collectionName = "FreeSubscribers";
    if (plan === "pro" || plan === "vanguard") collectionName = "PrioritySubscribers";
    if (plan === "elite" || plan === "apex") collectionName = "PremiumSubscribers";

    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        plan,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        if (data.userType === "buyer") {
          router.push(`/explore-interests/${encodeURIComponent(data.email)}`);
        } else {
          router.push(`/seller/dashboard`);
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-12 rounded-2xl border border-border flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] shadow-xl"
      >
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Setup Complete</h3>
          <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">
            {userType === "buyer" 
              ? "Your search parameters are being initialized. We're preparing your personalized dashboard now..."
              : "Your seller profile is being configured. You'll be redirected to your dashboard shortly."}
          </p>
        </div>
      </motion.div>
    );
  }

  const steps = [
    {
      id: 0,
      title: "Identify Your Goal",
      desc: "Choose the path that best describes your needs on the platform.",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => { setValue("userType", "buyer"); handleNext(); }}
            className={`p-6 rounded-xl text-left transition-all duration-300 border ${
              userType === "buyer" ? "bg-primary text-white border-primary shadow-lg" : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${userType === "buyer" ? "bg-white/20" : "bg-primary/10"}`}>
              <ShoppingCart className={`w-6 h-6 ${userType === "buyer" ? "text-white" : "text-primary"}`} />
            </div>
            <h3 className="text-lg font-bold mb-1">I'm a Buyer</h3>
            <p className={`text-xs leading-relaxed ${userType === "buyer" ? "text-white/80" : "text-secondary"}`}>I want to find specific items and receive automated match alerts.</p>
          </button>

          <button
            type="button"
            onClick={() => { setValue("userType", "seller"); handleNext(); }}
            className={`p-6 rounded-xl text-left transition-all duration-300 border ${
              userType === "seller" ? "bg-primary text-white border-primary shadow-lg" : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${userType === "seller" ? "bg-white/20" : "bg-primary/10"}`}>
              <Tag className={`w-6 h-6 ${userType === "seller" ? "text-white" : "text-primary"}`} />
            </div>
            <h3 className="text-lg font-bold mb-1">I'm a Seller</h3>
            <p className={`text-xs leading-relaxed ${userType === "seller" ? "text-white/80" : "text-secondary"}`}>I want to list items and connect with highly targeted prospects.</p>
          </button>
        </div>
      )
    },
    {
      id: 1,
      title: "Personal Information",
      desc: "Provide your contact details to manage your search and receive notifications.",
      content: (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              {...register("fullName")}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-red-500 text-[10px] font-bold">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              {...register("email")}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email.message}</p>}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Market Categories",
      desc: userType === "buyer"
        ? "Select the categories you're interested in monitoring."
        : "Select the categories that best describe your offerings.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {interestedItemsOptions.map((item) => {
              const isSelected = selectedItems.includes(item);
              const Icon = {
                Pets: PawPrint,
                Cars: Car,
                Houses: Home,
                Plots: Map,
              }[item];

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                      : "bg-card border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${isSelected ? "bg-white/20" : "bg-primary/10"}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary"}`} />
                  </div>
                  <span className="text-sm font-bold">{item}</span>
                </button>
              );
            })}
          </div>
          {errors.interestedItems && <p className="text-red-500 text-[10px] font-bold">{errors.interestedItems.message}</p>}
        </div>
      )
    },
    {
      id: 3,
      title: "Location Targeting",
      desc: "Specify the geographic areas relevant to your search.",
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedLocations.map((loc) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={loc}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/20 text-xs font-bold"
                >
                  {loc}
                  <button type="button" onClick={() => removeLocation(loc)} className="hover:text-primary/70 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="e.g. London, Tokyo..."
            />
            <button
              type="button"
              onClick={addLocation}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Add
            </button>
          </div>
          {errors.interestedLocations && <p className="text-red-500 text-[10px] font-bold">{errors.interestedLocations.message}</p>}
        </div>
      )
    }
  ];

  const currentStepData = steps.find(s => s.id === step) || steps[0];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-border rounded-full mb-10 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          className="h-full bg-primary transition-all duration-500"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden min-h-[500px] flex flex-col md:flex-row">
          {/* Form Content Side */}
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            <div className="mb-8">
               <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                  <span>Step {step + 1} of {steps.length}</span>
               </div>
               <h2 className="text-2xl font-bold text-foreground mb-2">{currentStepData.title}</h2>
               <p className="text-sm text-secondary leading-relaxed">{currentStepData.desc}</p>
            </div>

            <div className="flex-1 flex flex-col">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1"
                  >
                    {currentStepData.content}
                  </motion.div>
               </AnimatePresence>

               <div className="flex items-center gap-3 mt-8 pt-8 border-t border-border">
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 text-secondary transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  
                  {step < steps.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Setup <Sparkles className="w-4 h-4" /></>}
                    </button>
                  )}
               </div>
            </div>
          </div>

          {/* Visual/Context Side */}
          <div className="hidden md:flex w-1/3 bg-muted/30 border-l border-border p-8 flex-col justify-center items-center text-center space-y-6">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Target className="w-8 h-8 text-primary" />
             </div>
             <div>
                <p className="text-sm font-bold text-foreground mb-1">Precision Filtering</p>
                <p className="text-xs text-secondary leading-relaxed px-4">
                   Your requirements are processed using advanced matching algorithms for maximum accuracy.
                </p>
             </div>
             <div className="pt-4 flex flex-col gap-2 w-full max-w-[160px]">
                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                   <div className="h-full bg-primary/40 w-3/4 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">System Ready</p>
             </div>
          </div>
      </div>
    </div>
  );
}
