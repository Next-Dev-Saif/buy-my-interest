import { MapPin, Clock } from "lucide-react";
import Image from "next/image";

export interface InterestResult {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  dateScraped: string;
}

interface InterestCardProps {
  data: InterestResult;
}

export default function InterestCard({ data }: InterestCardProps) {
  const formattedPrice =
    data.price.includes("$") || data.price.toLowerCase().includes("rs")
      ? data.price
      : `Rs. ${parseInt(data.price).toLocaleString()}`;

  return (
    <div className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
            No Image
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/70" />

        {/* Category */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-background/70 text-foreground backdrop-blur-md border border-border">
          {data.category}
        </div>

        {/* Date */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs flex items-center gap-1 bg-background/70 text-muted-foreground backdrop-blur-md border border-border">
          <Clock className="w-3.5 h-3.5" />
          {data.dateScraped}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Top section */}
        <div className="space-y-4 mb-3">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{data.location}</span>
          </div>
        </div>

        {/* Bottom pinned section */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          {/* Price */}
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-xl font-semibold tracking-tight">
              {formattedPrice}
            </p>
          </div>

          {/* Action */}
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-primary text-primary-foreground px-4 py-2.5 rounded-full hover:opacity-90 transition active:scale-95"
          >
            Lets Go
          </a>
        </div>
      </div>
    </div>
  );
}
