import { MapPin, DollarSign, Calendar, ExternalLink, Sparkles, Navigation } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface InterestResult {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  imageUrl: string;
  link: string;
  dateScraped: string;
}

interface InterestCardProps {
  data: InterestResult;
}

export default function InterestCard({ data }: InterestCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/5 hover:border-primary/30 shadow-xl"
    >
      <div className="relative h-56 w-full bg-black/20 overflow-hidden">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary/20" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-4 py-1.5 glass border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
          {data.category}
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md border-white/10 rounded-lg text-[9px] font-bold text-white/70">
          <Calendar className="w-3 h-3 inline mr-1 opacity-50" /> {data.dateScraped}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <div className="flex items-center gap-2 text-foreground/40 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{data.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between items-end pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Market Price</span>
            <span className="text-2xl font-black text-primary tracking-tighter">{data.price}</span>
          </div>
          
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
          >
            <Navigation className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
