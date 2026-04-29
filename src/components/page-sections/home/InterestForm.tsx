"use client";

import { useState } from "react";
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
    
    let collectionName = "FreeSubscribers";
    if (plan === "vanguard") collectionName = "PrioritySubscribers";
    if (plan === "apex") collectionName = "PremiumSubscribers";

    // If seller, we could have different logic, but following the prompt's specific collection request for tiers
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
        </div>
        <div>
          <h3 className="text-4xl font-black mb-4">Registration Complete!</h3>
          <p className="text-foreground/70 text-xl max-w-md mx-auto">
            {userType === "buyer" 
              ? "Your search agent is initializing. Preparing your personalized results dashboard now..."
              : "Your seller profile is being set up. You can now start reaching interested buyers!"}
          </p>
        </div>
      </motion.div>
    );
  }

  const steps = [
    {
      id: 0,
      title: "Identify Your Role",
      desc: "Are you here to find your next passion or to connect your offerings with eager buyers?",
      image: "/images/hero.png",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => { setValue("userType", "buyer"); handleNext(); }}
            className={`p-8 rounded-[2rem] text-left transition-all duration-300 border ${
              userType === "buyer" ? "bg-primary text-white border-transparent shadow-2xl scale-105" : "bg-foreground/5 border-white/10 hover:bg-foreground/10"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${userType === "buyer" ? "bg-white/20" : "bg-primary/10"}`}>
              <ShoppingCart className={`w-6 h-6 ${userType === "buyer" ? "text-white" : "text-primary"}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">I'm a Buyer</h3>
            <p className={`text-sm ${userType === "buyer" ? "text-white/80" : "text-foreground/60"}`}>I want to find specific items and get notified of matches.</p>
          </button>

          <button
            type="button"
            onClick={() => { setValue("userType", "seller"); handleNext(); }}
            className={`p-8 rounded-[2rem] text-left transition-all duration-300 border ${
              userType === "seller" ? "bg-purple-600 text-white border-transparent shadow-2xl scale-105" : "bg-foreground/5 border-white/10 hover:bg-foreground/10"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${userType === "seller" ? "bg-white/20" : "bg-purple-500/10"}`}>
              <Tag className={`w-6 h-6 ${userType === "seller" ? "text-white" : "text-purple-400"}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">I'm a Seller</h3>
            <p className={`text-sm ${userType === "seller" ? "text-white/80" : "text-foreground/60"}`}>I want to list items and reach highly targeted leads.</p>
          </button>
        </div>
      )
    },
    {
      id: 1,
      title: "Tell us about yourself",
      desc: userType === "buyer" 
        ? "We need your contact info to build your personalized agent dashboard and notify you when matches are found."
        : "Connect your profile so buyers can reach you. We'll use this to manage your active listings.",
      image: "/images/form_profile.png",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-foreground/80">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              {...register("fullName")}
              className="w-full bg-foreground/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-foreground/80">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              {...register("email")}
              className="w-full bg-foreground/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: userType === "buyer" ? "What are you hunting?" : "What are you offering?",
      desc: userType === "buyer"
        ? "Select the categories you're interested in. Our AI agents are specialized in these distinct market sectors."
        : "Select the categories you specialize in. This helps us route the right buyers to your listings.",
      image: "/images/form_interests.png",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                  className={`p-6 rounded-3xl text-left transition-all duration-300 border ${
                    isSelected
                      ? (userType === 'buyer' ? "bg-primary" : "bg-purple-600") + " text-white border-transparent shadow-xl scale-105"
                      : "bg-foreground/5 border-white/10 text-foreground hover:bg-foreground/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isSelected ? "bg-white/20" : (userType === 'buyer' ? "bg-primary/10" : "bg-purple-500/10")}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : (userType === 'buyer' ? "text-primary" : "text-purple-400")}`} />
                  </div>
                  <span className="text-lg font-bold">{item}</span>
                </button>
              );
            })}
          </div>
          {errors.interestedItems && <p className="text-red-500 text-xs">{errors.interestedItems.message}</p>}
        </div>
      )
    },
    {
      id: 3,
      title: userType === "buyer" ? "Where should we look?" : "Where do you operate?",
      desc: userType === "buyer"
        ? "Add specific cities or regions. Your agents will scour these specific geographic zones for results."
        : "Select locations you want customers from. This helps us match your listings with the right local buyers.",
      image: "/images/form_locations.png",
      content: (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {selectedLocations.map((loc) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={loc}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                    userType === 'buyer' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}
                >
                  {loc}
                  <button type="button" onClick={() => removeLocation(loc)} className="hover:opacity-70">
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-3">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
              className="flex-1 bg-foreground/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
              placeholder="e.g. London, Tokyo..."
            />
            <button
              type="button"
              onClick={addLocation}
              className={`px-8 py-4 rounded-2xl font-bold text-white transition-all ${
                userType === 'buyer' ? 'bg-primary hover:bg-primary/90' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Add
            </button>
          </div>
          {errors.interestedLocations && <p className="text-red-500 text-xs">{errors.interestedLocations.message}</p>}
        </div>
      )
    }
  ];

  const currentStepData = steps.find(s => s.id === step) || steps[0];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-foreground/5 rounded-full mb-12 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          className={`h-full transition-colors duration-500 ${userType === 'buyer' ? 'bg-primary' : 'bg-purple-600'}`}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid lg:grid-cols-2 gap-12 items-stretch"
        >
          {/* Visual Side */}
          <div className="hidden lg:block relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass min-h-[600px]">
            <Image
              src={currentStepData.image}
              alt={currentStepData.title}
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 glass p-8 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-4 ${
                userType === 'buyer' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-purple-500/20 border-purple-500/30 text-purple-400'
              }`}>
                Step {step + 1} of {steps.length}
              </div>
              <h2 
                className="text-4xl font-black mb-4"
                style={{ color: theme === 'dark' ? '#ffffff' : '#4c1d95' }}
              >
                {currentStepData.title}
              </h2>
              <p 
                className="text-lg leading-relaxed font-medium"
                style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(91, 33, 182, 0.8)' }}
              >
                {currentStepData.desc}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="flex flex-col justify-center">
            <div className="lg:hidden mb-8">
              <h2 className="text-3xl font-black mb-2">{currentStepData.title}</h2>
              <p className="text-foreground/70">{currentStepData.desc}</p>
            </div>

            <div className="space-y-8">
              {currentStepData.content}

              <div className="flex items-center gap-4 pt-4">
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="p-5 rounded-2xl glass border border-white/10 hover:bg-foreground/5 transition-all"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                
                {step > 0 && (
                  step < 3 ? (
                    <button
                      onClick={handleNext}
                      className={`flex-1 p-5 rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 shadow-xl ${
                        userType === 'buyer' ? 'bg-primary hover:bg-primary/90 shadow-primary/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                      }`}
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className={`flex-1 p-5 rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl ${
                        userType === 'buyer' ? 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-primary/40' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/40'
                      }`}
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Setup <Sparkles className="w-5 h-5" /></>}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
