"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "@/utils/auth-cookies";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import {
  Loader2,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Search,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Target,
  ShoppingCart,
  Tag,
  PawPrint,
  Car,
  Home,
  Map,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

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
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    if (user) {
      setValue("fullName", user.displayName || "");
      setValue("email", user.email || "");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role");
    if (role === "buyer" || role === "seller") {
      setValue("userType", role as "buyer" | "seller");
      setStep(1);
    }
  }, [setValue, user]);

  const handleNext = async () => {
    if (step === 0) {
      const fieldsToValidate: (keyof FormValues)[] = ["userType"];
      if (!user?.displayName) fieldsToValidate.push("fullName");
      if (!user?.email) fieldsToValidate.push("email");
      
      const isValid = await trigger(fieldsToValidate);
      if (isValid) setStep(1);
      return;
    }

    let fields: (keyof FormValues)[] = [];
    if (step === 1) fields = ["interestedItems"];
    if (step === 2) fields = ["interestedLocations"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const addLocation = () => {
    const val = locationInput.trim();
    if (val && !selectedLocations.includes(val)) {
      setValue("interestedLocations", [...selectedLocations, val], {
        shouldValidate: true,
      });
    }
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    setValue(
      "interestedLocations",
      selectedLocations.filter((l) => l !== loc),
      { shouldValidate: true },
    );
  };

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setValue(
        "interestedItems",
        selectedItems.filter((i) => i !== item),
        { shouldValidate: true },
      );
    } else {
      setValue("interestedItems", [...selectedItems, item], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get("plan") || "free";

    let collectionName = "FreeSubscribers";
    if (plan === "pro" || plan === "vanguard")
      collectionName = "PrioritySubscribers";
    if (plan === "elite" || plan === "apex")
      collectionName = "PremiumSubscribers";

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, collectionName), {
        ...data,
        uid: user?.uid,
        plan,
        profileCompleted: true,
        createdAt: serverTimestamp(),
      });
      
      // 2. Mark profile as completed in cookies
      const cookieResult = await setAuthCookie(undefined, true, data.email, data.userType);
      if (!cookieResult) {
        throw new Error("Failed to synchronize session. Please try again.");
      }
      
      // 3. Trigger success UI
      setIsSuccess(true);
      
      // 4. Redirect after delay
      setTimeout(() => {
        if (data.userType === "buyer") {
          router.push(`/explore-interests/${encodeURIComponent(data.email)}`);
        } else {
          router.push(`/seller/dashboard`);
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message || "Initialization failed. Our systems are currently under high load. Please try again in a moment.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 lg:p-20 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 animate-pulse pointer-events-none" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20"
        >
          <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        <div className="space-y-3">
          <h3 className="text-3xl lg:text-4xl font-black font-editorial text-foreground">
            Initialization Complete
          </h3>
          <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed font-medium">
            {userType === "buyer"
              ? "Your intelligence agents are being deployed across our global network. Preparing your command center..."
              : "Your seller profile is being integrated into our marketplace. Stand by for redirection."}
          </p>
        </div>
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-primary"
          />
        </div>
      </motion.div>
    );
  }

  const steps = [
    {
      id: 0,
      title: user?.displayName ? "Identify Your Role" : "Complete Your Profile",
      desc: user?.displayName 
        ? "Choose whether you are looking to buy or sell. This helps us customize your dashboard."
        : "Please provide your basic details and select your primary role in the marketplace.",
      content: (
        <div className="space-y-8">
          {(!user?.displayName || !user?.email) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-border/40">
              {!user?.displayName && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-secondary">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      {...register("fullName")}
                      placeholder="John Doe"
                      className="w-full bg-input/40 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all text-sm font-bold"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              )}
              {!user?.email && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-secondary">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      {...register("email")}
                      placeholder="name@example.com"
                      className="w-full bg-input/40 border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all text-sm font-bold"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              setValue("userType", "buyer");
              handleNext();
            }}
            className={`group p-8 rounded-[2rem] text-left transition-all duration-500 border-2 flex flex-col gap-6 ${
              userType === "buyer"
                ? "bg-primary border-primary shadow-2xl shadow-primary/20"
                : "bg-card/50 border-border/60 hover:border-primary/40 backdrop-blur-sm"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${userType === "buyer" ? "bg-primary-foreground/20" : "bg-primary/5 group-hover:bg-primary/10"}`}
            >
              <ShoppingCart
                className={`w-7 h-7 ${userType === "buyer" ? "text-primary-foreground" : "text-primary"}`}
              />
            </div>
            <div>
              <h3
                className={`text-xl font-black mb-2 font-editorial ${userType === "buyer" ? "text-primary-foreground" : "text-foreground"}`}
              >
                I'm a Buyer
              </h3>
              <p
                className={`text-sm leading-relaxed font-medium ${userType === "buyer" ? "text-primary-foreground/80" : "text-secondary"}`}
              >
                I want to find specific items and receive real-time match
                alerts.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setValue("userType", "seller");
              handleNext();
            }}
            className={`group p-8 rounded-[2rem] text-left transition-all duration-500 border-2 flex flex-col gap-6 ${
              userType === "seller"
                ? "bg-primary border-primary shadow-2xl shadow-primary/20"
                : "bg-card/50 border-border/60 hover:border-primary/40 backdrop-blur-sm"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${userType === "seller" ? "bg-primary-foreground/20" : "bg-primary/5 group-hover:bg-primary/10"}`}
            >
              <Tag
                className={`w-7 h-7 ${userType === "seller" ? "text-primary-foreground" : "text-primary"}`}
              />
            </div>
            <div>
              <h3
                className={`text-xl font-black mb-2 font-editorial ${userType === "seller" ? "text-primary-foreground" : "text-foreground"}`}
              >
                I'm a Seller
              </h3>
              <p
                className={`text-sm leading-relaxed font-medium ${userType === "seller" ? "text-primary-foreground/80" : "text-secondary"}`}
              >
                I want to list items and connect with targeted prospects.
              </p>
            </div>
          </button>
        </div>
      </div>
      ),
    },
    {
      id: 1,
      title: "Market Categories",
      desc: "Select the specific categories you're interested in. This narrows down our scan to only show you relevant listings.",
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
                  className={`group p-6 rounded-2xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                    isSelected
                      ? "bg-primary border-primary shadow-lg scale-[1.02]"
                      : "bg-background/40 border-border/60 hover:border-primary/40 text-foreground backdrop-blur-sm"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-primary-foreground/20" : "bg-primary/5"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isSelected ? "text-primary-foreground" : "text-primary"}`}
                    />
                  </div>
                  <span
                    className={`text-base font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.interestedItems && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">
              {errors.interestedItems.message}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 2,
      title: "Target Locations",
      desc: "Specify where you are looking. This ensures we only notify you about opportunities in your preferred geographic areas.",
      content: (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2.5 min-h-[44px]">
            <AnimatePresence>
              {selectedLocations.map((loc) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  key={loc}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider shadow-sm"
                >
                  {loc}
                  <button
                    type="button"
                    onClick={() => removeLocation(loc)}
                    className="hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-primary/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            {selectedLocations.length === 0 && (
              <span className="text-xs font-bold text-secondary/30 italic flex items-center">
                No locations added yet.
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30 group-focus-within:text-primary transition-colors" />
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLocation())
                }
                className="w-full bg-background/50 border border-border/60 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-semibold backdrop-blur-sm placeholder:text-secondary/20"
                placeholder="e.g. California, USA"
              />
            </div>
            <button
              type="button"
              onClick={addLocation}
              className="px-8 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {errors.interestedLocations && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">
              {errors.interestedLocations.message}
            </p>
          )}
        </div>
      ),
    },
  ];

  const currentStepData = steps.find((s) => s.id === step) || steps[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      {/* Progress Indicator */}
      <div className="w-full mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      <div className="glass rounded-[2.5rem] border border-border shadow-2xl overflow-hidden min-h-[500px] flex flex-col transition-all duration-500">
        <div className="p-8 md:p-12 lg:p-16 flex flex-col flex-1">
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3 font-editorial tracking-tight">
              {currentStepData.title}
            </h2>
            <p className="text-base text-secondary leading-relaxed font-medium">
              {currentStepData.desc}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center"
              >
                {submitError}
              </motion.div>
            )}

            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/40">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl border border-border hover:bg-muted/50 text-secondary transition-all active:scale-90"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/10 active:scale-[0.98]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/10 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Complete Setup <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
