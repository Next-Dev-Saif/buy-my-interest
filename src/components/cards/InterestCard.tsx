import { MapPin, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/utils/price-utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface InterestResult {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  imageUrl: string;
  moreImages?: string[];
  description?: string;
  sourceUrl: string;
  dateScraped: string;
  timestamp: any;
  isNew?: boolean;
}

interface InterestCardProps {
  data: InterestResult;
}

export default function InterestCard({ data }: InterestCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const images = [data.imageUrl, ...(data.moreImages || [])].filter(Boolean);
  
  const formattedPrice = formatPrice(data.price);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageError(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageError(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group flex flex-col h-full rounded-xl overflow-hidden border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Slider */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {imageError || !images[currentImageIndex] ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden">
                <img 
                  src="/images/robot-fallback.png" 
                  alt="Error" 
                  className="w-full h-full object-cover opacity-60 mix-blend-lighten"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-0 w-full text-center px-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">Data Hunt in Progress</span>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={images[currentImageIndex]}
                alt={`${data.title}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-border/50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-border/50"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground shadow-sm border border-border/50">
            {data.category}
          </div>
          {data.isNew && (
            <div className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm flex items-center gap-1.5">
              <Sparkles size={10} />
              New
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
             <div className="flex items-center gap-1.5 text-[10px] font-semibold text-secondary">
                <Clock className="w-3 h-3" />
                {data.dateScraped}
             </div>
             <div className="flex items-center gap-1 text-[10px] font-semibold text-secondary">
                <MapPin className="w-3 h-3" />
                {data.location}
             </div>
          </div>
          <h3 className="text-base font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {data.title}
          </h3>
        </div>

        {data.description && (
          <p className="text-xs text-secondary leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              Price
            </span>
            <span className="text-lg font-bold text-foreground">
              {formattedPrice}
            </span>
          </div>

          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}
