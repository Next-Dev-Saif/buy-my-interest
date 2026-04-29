import { MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";

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
    <div className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <span className="text-primary/40 font-medium">No image available</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold">
          {data.category}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
          {data.title}
        </h3>
        
        <div className="flex flex-col gap-2 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{data.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{data.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Found: {data.dateScraped}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border mt-3">
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
          >
            View Original Listing
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
