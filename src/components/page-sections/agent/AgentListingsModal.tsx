import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, MapPin } from "lucide-react";
import { AgentAvatar } from "./AgentAvatar";

interface Listing {
  id: string;
  title?: string;
  price?: string;
  location?: string;
  imageUrl?: string;
  category?: string;
  sourceUrl?: string;
}

export const AgentListingsModal = ({
  isOpen,
  onClose,
  listings
}: {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] glass rounded-[3rem] border border-border/40 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header with SVG Animation */}
            <div className="p-8 border-b border-border/30 bg-primary/5 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative">
                  <AgentAvatar size="lg" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background"
                  />
                </div>
                <div className="bg-background/80 backdrop-blur-sm px-5 py-3 rounded-2xl rounded-tl-none border border-border/40 shadow-sm">
                  <motion.h2 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl font-bold text-foreground"
                  >
                    I found <span className="text-primary font-black">{listings.length}</span> matches for you!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs font-medium text-secondary mt-0.5 flex items-center gap-1"
                  >
                    <motion.svg 
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 text-emerald-500"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                    Scan complete
                  </motion.p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="relative z-10 p-3 bg-background/50 hover:bg-background/80 rounded-full transition-colors text-foreground backdrop-blur-md border border-border/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Cards */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-background/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="group flex flex-col bg-background rounded-3xl overflow-hidden border border-border/40 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-muted/20">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/40 font-bold uppercase tracking-widest text-xs">
                          No Image
                        </div>
                      )}
                      {item.category && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                          {item.category}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight mb-2">
                        {item.title || "Untitled Listing"}
                      </h3>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-4">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {item.location}
                        </div>
                      )}
                      <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
                        <span className="text-xl font-black text-emerald-500">
                          {item.price || "Contact"}
                        </span>
                        {item.sourceUrl ? (
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-not-allowed opacity-50">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
