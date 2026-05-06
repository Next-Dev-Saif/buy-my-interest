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
    if (isNewParam === "1" || galleryParam === "1")
      initialFilters.push("signals");

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
        <p className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px] mt-8 animate-pulse">
          Retrieving Results...
        </p>
      </div>
    );
  }

  const FilterPanel = ({ isSidebar = false }: { isSidebar?: boolean }) => (
    <div className={`flex flex-col gap-10 ${isSidebar ? "" : "p-6 sm:p-10"}`}>
      {!isSidebar && (
        <div className="flex items-center justify-between border-b border-border/40 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/60">
              <SlidersHorizontal size={18} className="text-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground font-editorial">
                Search Filters
              </h3>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.1em] mt-1">
                Refine marketplace results
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(false)}
            className="p-3 rounded-xl hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
          >
            <X size={20} className="text-secondary" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-5">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50 flex items-center gap-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                  : "bg-background/40 border-border/60 hover:border-primary/30 text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-5">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50 flex items-center gap-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group/min">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary/30">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-background/30 border border-border/60 rounded-xl pl-8 pr-3 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/20"
            />
          </div>
          <div className="relative group/max">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary/30">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-background/30 border border-border/60 rounded-xl pl-8 pr-3 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/20"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-5">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50 flex items-center gap-2">
          Location
        </label>
        <div className="relative group/loc">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/30 group-focus-within/loc:text-primary transition-colors" />
          <input
            type="text"
            placeholder="City, State or Country"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            className="w-full bg-background/30 border border-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/20"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-5">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50 flex items-center gap-2">
          Order By
        </label>
        <div className="relative group/sort">
          <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/30 group-focus-within/sort:text-primary transition-colors" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-background/30 border border-border/60 rounded-xl pl-11 pr-4 py-3.5 text-[11px] font-bold focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer appearance-none text-foreground"
          >
            <option value="newest">Recently Posted</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-5">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50 flex items-center gap-2">
          Preferences
        </label>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setOnlyNew(!onlyNew)}
            className="flex items-center justify-between group"
          >
            <span className="flex items-center gap-4 text-xs font-bold text-secondary group-hover:text-foreground transition-colors">
              <Sparkles
                className={`w-4 h-4 ${onlyNew ? "text-primary" : "opacity-30"}`}
              />
              New Listings Only
            </span>
            <div
              className={`w-9 h-5 rounded-lg relative transition-colors ${onlyNew ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-md bg-white transition-all ${onlyNew ? "left-5" : "left-1"}`}
              />
            </div>
          </button>
          <button
            onClick={() => setHasGallery(!hasGallery)}
            className="flex items-center justify-between group"
          >
            <span className="flex items-center gap-4 text-xs font-bold text-secondary group-hover:text-foreground transition-colors">
              <Image
                className={`w-4 h-4 ${hasGallery ? "text-primary" : "opacity-30"}`}
              />
              With Images
            </span>
            <div
              className={`w-9 h-5 rounded-lg relative transition-colors ${hasGallery ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-md bg-white transition-all ${hasGallery ? "left-5" : "left-1"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {!isSidebar && (
        <div className="pt-6 flex flex-col gap-3">
          <button
            onClick={() => setShowFilters(false)}
            className="w-full py-4 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.1em] hover:opacity-90 transition-all shadow-xl shadow-foreground/10"
          >
            Apply Selection
          </button>
          <button
            onClick={resetAll}
            className="w-full py-4 rounded-2xl bg-background border border-border text-[11px] font-bold uppercase tracking-[0.1em] text-secondary hover:text-foreground hover:bg-muted/40 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-14">
      {/* Mobile-Only App Header */}
      <div className="lg:hidden space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-foreground font-editorial">
          Discovery.
        </h1>
        <p className="text-sm text-secondary font-medium leading-relaxed">
          Results for <span className="text-foreground font-bold">{email}</span>
        </p>
      </div>

      {/* Page Header - Desktop Only */}
      <div className="hidden lg:flex flex-row gap-8 items-end justify-between border-b border-border/60 pb-10">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tight text-foreground font-editorial">
            Explore Results.
          </h1>
          <p className="text-base text-secondary font-medium max-w-xl leading-relaxed">
            Marketplace opportunities identified for{" "}
            <span className="text-foreground font-bold">{email}</span>. Use the
            criteria below to refine your view.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/40">
              Total Found
            </span>
            <span className="text-lg font-black text-foreground">
              {processedResults.length.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-px bg-border/60" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-10 space-y-12">
            <FilterPanel isSidebar />

            <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/40 space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/50">
                Market Intelligence
              </h4>
              <p className="text-xs text-secondary/70 leading-relaxed font-medium">
                Our system aggregates listings from over 500 sources, refreshing
                every 2 hours to ensure priority access to new deals.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8 sm:space-y-12">
          {/* Sticky Mobile Search & Tools */}
          <div className="sticky top-20 lg:relative z-40 -mx-5 sm:mx-0 px-5 sm:px-0 py-4 lg:py-0 bg-background lg:bg-transparent border-b lg:border-none border-border/40 lg:shadow-none transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-grow group/search">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl lg:rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                  <div className="relative glass p-1.5 lg:p-2 rounded-2xl lg:rounded-[2.5rem] border border-border/60 shadow-lg shadow-black/[0.01]">
                    <div className="relative flex items-center">
                      <Search className="absolute left-5 lg:left-7 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-secondary/30 group-focus-within/search:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Search model, keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none rounded-xl lg:rounded-[2rem] pl-12 lg:pl-16 pr-5 lg:pr-8 py-3 lg:py-5.5 text-sm lg:text-base font-semibold focus:outline-none focus:ring-0 transition-all placeholder:text-secondary/20"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background transition-all hover:opacity-90 active:scale-90 shadow-lg shadow-foreground/10 flex-shrink-0"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Quick Categories */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.05em] transition-all border ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                        : "bg-muted/40 border-border/40 text-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Chips */}
          {(searchTerm ||
            selectedCategory !== "All" ||
            minPrice ||
            maxPrice ||
            locationTerm ||
            onlyNew ||
            hasGallery ||
            sortBy !== "newest") && (
            <div className="flex flex-wrap items-center gap-3">
              {searchTerm && (
                <Chip
                  icon={Search}
                  label={`Search: ${searchTerm}`}
                  onClear={() => setSearchTerm("")}
                />
              )}
              {selectedCategory !== "All" && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onClear={() => setSelectedCategory("All")}
                />
              )}
              {(minPrice || maxPrice) && (
                <Chip
                  label={`Price: ${minPrice || "0"} - ${maxPrice || "∞"}`}
                  onClear={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                />
              )}
              {locationTerm && (
                <Chip
                  icon={MapPin}
                  label={`Near: ${locationTerm}`}
                  onClear={() => setLocationTerm("")}
                />
              )}
              {onlyNew && (
                <Chip
                  icon={Sparkles}
                  label="Recent Only"
                  onClear={() => setOnlyNew(false)}
                />
              )}
              {hasGallery && (
                <Chip
                  icon={Image}
                  label="With Gallery"
                  onClear={() => setHasGallery(false)}
                />
              )}
              {sortBy !== "newest" && (
                <Chip
                  label={`Sorted: ${sortBy === "price-asc" ? "Price ↑" : "Price ↓"}`}
                  onClear={() => setSortBy("newest")}
                />
              )}
              <button
                onClick={resetAll}
                className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground hover:text-primary transition-colors ml-3 border-b border-border/60 pb-0.5"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Results Grid */}
          <div className="space-y-14">
            {paginatedResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                  <AnimatePresence mode="popLayout">
                    {paginatedResults.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <InterestCard data={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-12 border-t border-border/40">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          totalPages > 5 &&
                          Math.abs(currentPage - pageNum) > 2 &&
                          pageNum !== 1 &&
                          pageNum !== totalPages
                        )
                          return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-14 h-14 rounded-2xl text-xs font-black transition-all border ${
                              currentPage === pageNum
                                ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10"
                                : "bg-background border-border/60 hover:border-primary text-secondary"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-28 h-28 rounded-[3rem] bg-muted/20 border border-border/40 flex items-center justify-center">
                  <FilterX className="w-12 h-12 text-secondary/20" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black font-editorial">
                    No matches found.
                  </h3>
                  <p className="text-secondary text-base max-w-md mx-auto font-medium">
                    Try broadening your selection or clearing active filters to
                    find more opportunities.
                  </p>
                </div>
                <button
                  onClick={resetAll}
                  className="px-10 py-5 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 inset-x-0 bg-card rounded-t-[3.5rem] border-t border-border shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar pb-10"
            >
              <FilterPanel />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({
  label,
  onClear,
  icon: Icon,
}: {
  label: string;
  onClear: () => void;
  icon?: any;
}) {
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border hover:border-primary/30 text-[10px] font-bold text-secondary hover:text-foreground transition-all group"
    >
      {Icon && (
        <Icon className="w-3 h-3 text-primary opacity-70 group-hover:opacity-100" />
      )}
      <span className="max-w-[150px] truncate">{label}</span>
      <X className="w-3 h-3 text-secondary/40 group-hover:text-foreground transition-colors" />
    </button>
  );
}
