"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import InterestCard, { InterestResult } from "@/components/cards/InterestCard";
import { parsePrice } from "@/utils/price-utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Plus,
  X,
  MapPin,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExploreDashboardProps {
  email: string;
}

const ITEMS_PER_PAGE = 8;

type FilterKey = "price" | "location" | "sort" | "signals";

export default function ExploreDashboard({ email }: ExploreDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<InterestResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Basic Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [locationTerm, setLocationTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest",
  );
  const [onlyNew, setOnlyNew] = useState(false);
  const [hasGallery, setHasGallery] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([
    "price",
    "sort",
    "signals",
  ]);
  const [urlInitialized, setUrlInitialized] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const resetAll = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setLocationTerm("");
    setSortBy("newest");
    setOnlyNew(false);
    setHasGallery(false);
    setActiveFilters(["price", "sort", "signals"]);
  };

  const removeFilter = (key: FilterKey) => {
    if (key === "price") {
      setMinPrice("");
      setMaxPrice("");
    }
    if (key === "location") setLocationTerm("");
    if (key === "sort") setSortBy("newest");
    if (key === "signals") {
      setOnlyNew(false);
      setHasGallery(false);
    }
    setActiveFilters((prev) => prev.filter((f) => f !== key));
  };

  useEffect(() => {
    async function fetchResults() {
      try {
        const q = query(
          collection(db, "search_results"),
          where("userId", "==", email),
        );
        const querySnapshot = await getDocs(q);

        const data: InterestResult[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            id: doc.id,
            ...docData,
            // Ensure dateScraped exists or fallback
            dateScraped:
              docData.dateScraped ||
              (docData.timestamp
                ? new Date(
                    docData.timestamp.seconds * 1000,
                  ).toLocaleDateString()
                : new Date().toLocaleDateString()),
          } as InterestResult);
        });

        setResults(data);
      } catch (error) {
        console.error("Error fetching results", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [email]);

  useEffect(() => {
    if (urlInitialized) return;

    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const loc = searchParams.get("loc");
    const sort = searchParams.get("sort") as
      | "newest"
      | "price-asc"
      | "price-desc"
      | null;
    const isNewParam = searchParams.get("new");
    const galleryParam = searchParams.get("gallery");

    if (q) setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
    if (min) setMinPrice(min);
    if (max) setMaxPrice(max);
    if (loc) setLocationTerm(loc);
    if (sort === "newest" || sort === "price-asc" || sort === "price-desc") {
      setSortBy(sort);
    }
    if (isNewParam === "1") setOnlyNew(true);
    if (galleryParam === "1") setHasGallery(true);

    const initialFilters: FilterKey[] = [];
    if (min || max) initialFilters.push("price");
    if (loc) initialFilters.push("location");
    if (sort) initialFilters.push("sort");
    if (isNewParam === "1" || galleryParam === "1") initialFilters.push("signals");

    if (initialFilters.length > 0) {
      setActiveFilters(Array.from(new Set(initialFilters)));
    }

    setUrlInitialized(true);
  }, [searchParams, urlInitialized]);

  useEffect(() => {
    if (!urlInitialized) return;

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedCategory !== "All") params.set("cat", selectedCategory);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (locationTerm.trim()) params.set("loc", locationTerm.trim());
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (onlyNew) params.set("new", "1");
    if (hasGallery) params.set("gallery", "1");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [
    urlInitialized,
    pathname,
    router,
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    locationTerm,
    sortBy,
    onlyNew,
    hasGallery,
  ]);

  const categories = [
    "All",
    ...Array.from(new Set(results.map((r) => r.category))),
  ];

  const processedResults = useMemo(() => {
    let filtered = results.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const itemPrice = parsePrice(item.price);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = itemPrice >= min && itemPrice <= max;

      const matchesLocation =
        !locationTerm.trim() ||
        item.location.toLowerCase().includes(locationTerm.toLowerCase());

      const matchesNew = !onlyNew || Boolean(item.isNew);

      const matchesGallery =
        !hasGallery || (item.moreImages?.filter(Boolean).length ?? 0) > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesLocation &&
        matchesNew &&
        matchesGallery
      );
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "price-asc")
        return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-desc")
        return parsePrice(b.price) - parsePrice(a.price);

      // Default: Newest first (client-side sort to avoid Firestore index)
      const getTime = (val: any) => {
        if (!val) return 0;
        if (typeof val === "number") return val;
        if (val.seconds) return val.seconds * 1000;
        return new Date(val).getTime() || 0;
      };

      return getTime(b.timestamp) - getTime(a.timestamp);
    });
  }, [
    results,
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    locationTerm,
    onlyNew,
    hasGallery,
    sortBy,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE);
  const paginatedResults = processedResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    locationTerm,
    onlyNew,
    hasGallery,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
        </div>
        <p className="text-foreground/40 font-bold tracking-[0.2em] uppercase text-xs mt-6 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between border-b border-border/40 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground font-editorial">
              Explore Marketplace
            </h1>
            <p className="text-sm text-secondary font-medium max-w-xl">
              Manage and filter the marketplace opportunities identified for <span className="text-primary font-bold">{email}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end gap-1 mr-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">Search Status</span>
              <span className="text-[11px] font-bold text-foreground">Active</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-sm shadow-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Monitoring Enabled
            </div>
          </div>
        </div>

        <div className="relative group/filters">
          <div className="glass p-1 rounded-[2rem] border border-border/60 shadow-lg shadow-black/5 flex flex-col gap-1">
            <div className="flex flex-col lg:flex-row items-center gap-2 p-1">
              <div className="relative flex-grow w-full group/search">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 group-focus-within/search:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Query marketplace by title, keywords or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background/40 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none focus:ring-0 transition-all placeholder:text-secondary/40"
                />
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto p-1 lg:p-0">
                <div className="hidden lg:flex flex-col items-end px-4 border-r border-border/40">
                  <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Matches</span>
                  <span className="text-xs font-black text-foreground">{processedResults.length.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setShowFilters(true)}
                  className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all border ${
                    activeFilters.length > 0
                      ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10"
                      : "bg-background/80 border-border/80 hover:bg-muted/40 hover:border-primary/40 text-foreground"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {activeFilters.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] -mr-1">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="px-3 pb-3 pt-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1.5 border-t border-border/40">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-transparent border-transparent hover:bg-muted/40 text-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-border/30">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 mr-1">Active Criteria</span>
              
              {searchTerm.trim() ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="text-secondary/60 font-black uppercase tracking-[0.1em]">Q:</span>
                  <span className="max-w-[120px] truncate">{searchTerm}</span>
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {selectedCategory !== "All" ? (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="text-secondary/60 font-black uppercase tracking-[0.1em]">CAT:</span>
                  <span className="max-w-[120px] truncate">{selectedCategory}</span>
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {minPrice || maxPrice ? (
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="text-secondary/60 font-black uppercase tracking-[0.1em]">PRC:</span>
                  <span className="truncate">
                    {minPrice ? `$${minPrice}` : "0"} - {maxPrice ? `$${maxPrice}` : "∞"}
                  </span>
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {locationTerm.trim() ? (
                <button
                  onClick={() => setLocationTerm("")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="max-w-[120px] truncate">{locationTerm}</span>
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {onlyNew ? (
                <button
                  onClick={() => setOnlyNew(false)}
                  className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  New Only
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {hasGallery ? (
                <button
                  onClick={() => setHasGallery(false)}
                  className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Image className="w-3 h-3 text-primary" />
                  Gallery
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              {sortBy !== "newest" ? (
                <button
                  onClick={() => setSortBy("newest")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="text-secondary/60 font-black uppercase tracking-[0.1em]">SORT:</span>
                  {sortBy === "price-asc" ? "Price ↑" : "Price ↓"}
                  <X className="w-3 h-3 text-secondary group-hover:text-foreground" />
                </button>
              ) : null}

              <div className="flex-1" />

              {searchTerm || selectedCategory !== "All" || minPrice || maxPrice || locationTerm || onlyNew || hasGallery || sortBy !== "newest" ? (
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-foreground hover:bg-muted/60 transition-all hover:scale-105 active:scale-95"
                >
                  Clear All
                </button>
              ) : (
                <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-[0.1em]">Showing all results</span>
              )}
          </div>

      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 flex items-center justify-between border-b border-border/40 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <SlidersHorizontal size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-[0.1em] text-foreground leading-none">Advanced Filters</h3>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-2">Refine your marketplace search</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-3 rounded-full hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
                  >
                    <X size={20} className="text-secondary" />
                  </button>
                </div>

                <div className="lg:col-span-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-foreground/5 p-5 rounded-2xl border border-border/40">
                  <div className="flex flex-wrap gap-2.5">
                    {activeFilters.length === 0 && (
                      <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.1em] px-2">No active filter modules</span>
                    )}
                    {activeFilters.map((f) => (
                      <button
                        key={f}
                        onClick={() => removeFilter(f)}
                        className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-foreground hover:border-primary/40 transition-all shadow-sm"
                      >
                        {f}
                        <X className="w-3 h-3 text-secondary/60 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value as FilterKey | "";
                        if (!val) return;
                        setActiveFilters((prev) =>
                          prev.includes(val) ? prev : [...prev, val],
                        );
                      }}
                      className="w-full sm:w-auto bg-card border border-border rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.1em] focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer appearance-none text-center shadow-sm"
                    >
                      <option value="">+ Add filter…</option>
                      {!activeFilters.includes("price") ? (
                        <option value="price">Price Range</option>
                      ) : null}
                      {!activeFilters.includes("location") ? (
                        <option value="location">Location</option>
                      ) : null}
                      {!activeFilters.includes("sort") ? (
                        <option value="sort">Sort Order</option>
                      ) : null}
                      {!activeFilters.includes("signals") ? (
                        <option value="signals">Attributes</option>
                      ) : null}
                    </select>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10 pb-6">
                  {activeFilters.includes("price") ? (
                    <div className="space-y-5">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Price Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-secondary/60 uppercase ml-1">Minimum</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-secondary/30 shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-secondary/60 uppercase ml-1">Maximum</span>
                          <input
                            type="number"
                            placeholder="Any"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-secondary/30 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activeFilters.includes("location") ? (
                    <div className="space-y-5">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Location
                      </label>
                      <div className="relative group/loc">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within/loc:text-primary transition-colors" />
                        <input
                          type="text"
                          placeholder="Search city, region, or country…"
                          value={locationTerm}
                          onChange={(e) => setLocationTerm(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-secondary/30 shadow-sm"
                        />
                      </div>
                    </div>
                  ) : null}

                  {activeFilters.includes("sort") ? (
                    <div className="space-y-5">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Sort Order
                      </label>
                      <div className="relative group/sort">
                        <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within/sort:text-primary transition-colors" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-black uppercase tracking-[0.05em] focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer appearance-none shadow-sm"
                        >
                          <option value="newest">Chronological (Newest)</option>
                          <option value="price-asc">Value: Low to High</option>
                          <option value="price-desc">Value: High to Low</option>
                        </select>
                      </div>
                    </div>
                  ) : null}

                  {activeFilters.includes("signals") ? (
                    <div className="space-y-5">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Listing Attributes
                      </label>
                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={() => setOnlyNew((v) => !v)}
                          className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all ${
                            onlyNew
                              ? "border-primary/40 bg-primary/5 text-foreground shadow-sm"
                              : "border-border bg-background text-secondary hover:border-border/80"
                          }`}
                        >
                          <span className="inline-flex items-center gap-4 text-xs font-bold">
                            <Sparkles className={`w-5 h-5 ${onlyNew ? "text-primary" : "text-secondary/30"}`} />
                            Only reveal new listings
                          </span>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${onlyNew ? "bg-primary" : "bg-muted"}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${onlyNew ? "left-6" : "left-1"}`} />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHasGallery((v) => !v)}
                          className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all ${
                            hasGallery
                              ? "border-primary/40 bg-primary/5 text-foreground shadow-sm"
                              : "border-border bg-background text-secondary hover:border-border/80"
                          }`}
                        >
                          <span className="inline-flex items-center gap-4 text-xs font-bold">
                            <Image className={`w-5 h-5 ${hasGallery ? "text-primary" : "text-secondary/30"}`} />
                            Filter by visual evidence
                          </span>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${hasGallery ? "bg-primary" : "bg-muted"}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${hasGallery ? "left-6" : "left-1"}`} />
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-border/40 lg:pl-10">
                  <div className="space-y-5">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
                      <Sparkles size={16} className="text-primary" />
                      Filter Summary
                    </label>
                    <div className="bg-foreground/5 rounded-3xl p-6 border border-border/40 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-secondary uppercase tracking-[0.1em]">Estimated Matches</span>
                        <span className="text-2xl font-black text-foreground">{processedResults.length.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-border/40" />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.1em]">Active Modules</span>
                          <p className="text-sm font-black text-foreground">{activeFilters.length}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.1em]">Results View</span>
                          <p className="text-sm font-black text-foreground">Page {currentPage}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-4 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-foreground/10 active:scale-[0.98]"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={resetAll}
                      className="w-full py-4 rounded-2xl bg-background border border-border text-[11px] font-black uppercase tracking-[0.2em] text-foreground hover:bg-muted/40 transition-all active:scale-[0.98]"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Results Content */}
      <div className="space-y-8">
        {paginatedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.map((item) => (
                <InterestCard key={item.id} data={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg bg-card border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border shadow-sm ${
                            currentPage === pageNum
                              ? "bg-primary text-white border-primary"
                              : "bg-card border-border hover:border-primary text-secondary"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-lg bg-card border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-card rounded-2xl border border-border text-center shadow-sm">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <FilterX className="w-8 h-8 text-secondary/30" />
            </div>
            <h3 className="text-xl font-bold mb-1">No results found</h3>
            <p className="text-secondary max-w-sm mx-auto mb-6 text-sm px-6">
              Try adjusting your search terms or filters to find more matches.
            </p>
            <button
              onClick={resetAll}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


