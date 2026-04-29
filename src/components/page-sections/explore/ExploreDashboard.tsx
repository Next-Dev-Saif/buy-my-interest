"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import InterestCard, { InterestResult } from "@/components/cards/InterestCard";
import { Search, Loader2, FilterX } from "lucide-react";

interface ExploreDashboardProps {
  email: string;
}

export default function ExploreDashboard({ email }: ExploreDashboardProps) {
  const [results, setResults] = useState<InterestResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchResults() {
      try {
        // Assume n8n saves scraped results in a 'scraped_results' collection
        // with the userEmail field to link them to the buyer.
        const q = query(collection(db, "scraped_results"), where("userEmail", "==", email));
        const querySnapshot = await getDocs(q);
        
        const data: InterestResult[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as InterestResult);
        });
        
        // Mock data if empty for demo purposes during development
        if (data.length === 0) {
           setTimeout(() => {
             setResults([
               {
                 id: "1",
                 title: "Adorable Golden Retriever Puppy",
                 price: "$1,200",
                 location: "Islamabad, PK",
                 category: "Pets",
                 imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
                 link: "#",
                 dateScraped: new Date().toLocaleDateString()
               },
               {
                 id: "2",
                 title: "Vintage 1969 Ford Mustang",
                 price: "$45,000",
                 location: "Islamabad, PK",
                 category: "Cars",
                 imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800",
                 link: "#",
                 dateScraped: new Date().toLocaleDateString()
               }
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

  const categories = ["All", ...Array.from(new Set(results.map(r => r.category)))];

  const filteredResults = results.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-foreground/60">Fetching your curated interests...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Filter Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Search e.g. 'Golden Retriever Islamabad'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                ? "bg-primary text-primary-foreground" 
                : "bg-background border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResults.map((item) => (
            <InterestCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[400px] glass rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FilterX className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No matches found</h3>
          <p className="text-foreground/60 max-w-md">
            We couldn't find any results matching your current filters. Try adjusting your search or category.
          </p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
