import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, Heart } from "lucide-react";

// Updated Props for LENY-AI style card
interface SpecialistCardProps {
  id: string;
  logoText: string; // Specialist Name (e.g., CardioAssist)
  specialty: string; // e.g., Cardiology
  description: string;
  services: string[]; // Service tags
  imageUrl: string; 
  delay: number;
  logoIconText?: string; // Text for the square logo (e.g., "Ca")
  logoColor?: string; // Background color for the square logo (Tailwind class, e.g., "bg-red-500")
  rating?: number | 'New'; // Rating number or the string "New"
  reviewCount?: number; // e.g., 1284 (only shown if rating is a number)
  availability?: string; // e.g., "Available 24/7"
  price?: string; // e.g., "$0"
  pricePeriod?: string; // e.g., "for first consultation"
  isNew?: boolean; // To show the "New" badge on the image
}

// Heart Icon for Favorite Button
const FavoriteIcon = ({ filled }: { filled: boolean }) => (
  <Heart 
    className={cn(
      "h-4 w-4 transition-colors duration-200 stroke-black", // Stroke is always black now
      filled ? "fill-red-500" : "fill-none" // Only fill changes
    )} 
    strokeWidth={2}
  />
);

// Star Icon for Rating (used in badge and rating display)
const StarIcon = ({ className = "h-3.5 w-3.5", filled = true }: { className?: string, filled?: boolean }) => (
  <Star className={cn(className, filled ? "fill-primary text-primary" : "fill-gray-300 text-gray-300")} />
);

const SpecialistCard = ({
  id,
  logoText,
  specialty,
  description,
  services = [],
  imageUrl,
  delay,
  logoIconText = logoText.substring(0, 2),
  logoColor = "bg-primary", // Default to primary color
  rating = 4.9, // Default rating
  reviewCount = 1284, // Default review count
  availability = "Available 24/7",
  price = "$0",
  pricePeriod = "for first consultation",
  isNew = false, // Default to not new
}: SpecialistCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : rating;
  const showReviewCount = typeof rating === 'number' && reviewCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      {/* Use anchor tag if you want the whole card to be clickable */}
      {/* <a href={`/specialist/${id}`} className="block h-full"> */}
      {/* Added flex flex-col h-full to ensure cards take full height of grid cell */}
      <Card className="w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-[3/2] bg-gray-100 flex-shrink-0"> {/* Added flex-shrink-0 */}
          <img 
            src={imageUrl || '/placeholder.svg'}
            alt={specialty} 
            className="absolute inset-0 w-full h-full object-cover" 
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 z-10 shadow-sm"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FavoriteIcon filled={isFavorite} />
          </button>
          {/* New Badge */}
          {isNew && (
            <div className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold z-10 flex items-center gap-1 shadow-sm">
              <StarIcon className="h-3 w-3" filled={true} />
              New
            </div>
          )}
        </div>

        {/* Content - Added flex-grow to allow content to expand */}
        <CardContent className="p-5 flex flex-col flex-grow"> 
          {/* Logo Row */}
          <div className="flex items-center gap-2 mb-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
            {logoIconText && (
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white flex-shrink-0",
                logoColor // Apply dynamic background color
              )}>
                {logoIconText}
              </div>
            )}
            <div className="font-semibold text-base truncate">{logoText}</div>
          </div>

          {/* Info Row */}
          <div className="flex justify-between items-center mb-2 gap-2">
            <div className="text-base font-bold truncate flex-shrink-0">{specialty}</div>
            <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap flex-shrink-0">
              {rating === 'New' ? (
                <>
                  <StarIcon className="h-3.5 w-3.5" filled={false} />
                  <span className="text-gray-700">New</span>
                </>
              ) : (
                <>
                  <StarIcon className="h-3.5 w-3.5" filled={true} />
                  <span>{displayRating}</span>
                  {showReviewCount && (
                    <span className="text-gray-500">({reviewCount.toLocaleString()})</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p> {/* Limit lines */}

          {/* Availability */}
          {availability && (
            <p className="text-sm text-gray-600 mb-3">{availability}</p>
          )}

          {/* Price */}
          {price && (
            <div className="text-base font-semibold mb-3">
              {price}
              {pricePeriod && (
                <span className="text-sm font-normal text-gray-600 ml-1">{pricePeriod}</span>
              )}
            </div>
          )}

          {/* Services/Tags - Added mt-auto to push tags to the bottom */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-3"> {/* Added mt-auto and pt-3 */}
              {services.map((service, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* </a> */}
    </motion.div>
  );
};

export default SpecialistCard;
