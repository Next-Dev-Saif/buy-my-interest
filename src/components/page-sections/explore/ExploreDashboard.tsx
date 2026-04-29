"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import InterestCard, { InterestResult } from "@/components/cards/InterestCard";
import {
  Search,
  Loader2,
  FilterX,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

interface ExploreDashboardProps {
  email: string;
}

const ITEMS_PER_PAGE = 8;

export default function ExploreDashboard({ email }: ExploreDashboardProps) {
  const [results, setResults] = useState<InterestResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Basic Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest",
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchResults() {
      try {
        // Removed orderBy to avoid requiring a composite index in Firestore
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

        // Mock data if empty for demo purposes during development
        if (data.length === 0) {
          setTimeout(() => {
            setResults([
              {
                id: "1",
                title: "Adorable Golden Retriever Puppy",
                price: "1200",
                location: "Islamabad, PK",
                category: "Pets",
                imageUrl:
                  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
                link: "#",
                dateScraped: new Date().toLocaleDateString(),
              },
              {
                id: "2",
                title: "Vintage 1969 Ford Mustang",
                price: "45000",
                location: "Islamabad, PK",
                category: "Cars",
                imageUrl:
                  "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800",
                link: "#",
                dateScraped: new Date().toLocaleDateString(),
              },
              {
                id: "3",
                title: "Premium Persian Kitten",
                price: "800",
                location: "Lahore, PK",
                category: "Pets",
                imageUrl:
                  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
                link: "#",
                dateScraped: new Date().toLocaleDateString(),
              },
              {
                id: "4",
                title: "Modern 5 Marla House",
                price: "150000",
                location: "Rawalpindi, PK",
                category: "Houses",
                imageUrl:
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
                link: "#",
                dateScraped: new Date().toLocaleDateString(),
              },
              {
                id: "5",
                title: "Honda Civic 2022 Turbo",
                price: "32000",
                location: "Karachi, PK",
                category: "Cars",
                imageUrl:
                  "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
                link: "#",
                dateScraped: new Date().toLocaleDateString(),
              },
            ]);
            setLoading(false);
          }, 1500);
          return;
        }

        setResults(data);
      } catch (error) {
        console.error("Error fetching results", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [email]);

  // Helper to parse price string to number
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

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

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "price-asc")
        return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-desc")
        return parsePrice(b.price) - parsePrice(a.price);

      // Default: Newest first (client-side sort to avoid Firestore index)
      const dateA = a.timestamp?.seconds || 0;
      const dateB = b.timestamp?.seconds || 0;
      return dateB - dateA;
    });
  }, [results, searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE);
  const paginatedResults = processedResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

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
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Your Interests {email}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Manage and filter your discovered market opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Updates Active
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="glass p-4 rounded-3xl border border-border/60 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Field */}
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title, location or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Filter Action */}
              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                    showFilters
                      ? "bg-foreground text-background border-foreground shadow-md"
                      : "bg-background border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <div className="flex-grow lg:hidden" />

                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-border/40">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Results:
                  </span>
                  <span className="text-xs font-black text-foreground">
                    {processedResults.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-background/50 border-border/50 hover:border-primary/30 text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Panel */}
          {showFilters && (
            <div className="mt-4 glass p-6 rounded-3xl border border-border/60 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <DollarSign size={14} className="text-primary" />
                  Price Filters
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                      Min Price
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                      Max Price
                    </span>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-primary" />
                  Sort Preference
                </label>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                    Order By
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    <option value="newest">Latest Discovered</option>
                    <option value="price-asc">Price: Lowest First</option>
                    <option value="price-desc">Price: Highest First</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  Active Context
                </label>
                <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      Matches Found
                    </span>
                    <span className="text-xs font-black">
                      {processedResults.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      Current View
                    </span>
                    <span className="text-xs font-black">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="w-full pt-2 text-[10px] font-black text-primary hover:text-primary/80 transition-colors border-t border-border/40 mt-2"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Content */}
      <div className="space-y-8">
        {paginatedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.map((item) => (
                <InterestCard key={item.id} data={item} />
              ))}
            </div>

            {/* Functional Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-3 rounded-xl bg-background border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${
                            currentPage === pageNum
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-background border-border hover:border-primary/50 text-muted-foreground"
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
                  className="p-3 rounded-xl bg-background border border-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50 text-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <FilterX className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm px-6">
              We couldn't find any items matching your current filters. Try
              adjusting your search term or price range.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="px-8 py-3 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-using Lucide icons as local components for cleaner code
function DollarSign({ size, className }: { size: number; className: string }) {
  return <span className={className}>$</span>;
}
