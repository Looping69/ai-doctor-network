import React from 'react';

interface HealthcareCardProps {
  imageUrl: string;
  logoIconText: string;
  logoText: string;
  location: string; // e.g., "Cardiology" or "Neurology Clinic"
  rating: number | string; // Can be number or "New"
  reviewCount?: number;
  description: string;
  availability: string;
  price: string;
  pricePeriod: string;
  services: string[];
  isFavorite?: boolean; // Optional: to control the heart icon state
  onFavoriteToggle?: () => void; // Optional: handler for favorite button
}

const HealthcareCard: React.FC<HealthcareCardProps> = ({
  imageUrl,
  logoIconText,
  logoText,
  location,
  rating,
  reviewCount,
  description,
  availability,
  price,
  pricePeriod,
  services,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : rating;
  const displayReviewCount = reviewCount ? `(${reviewCount.toLocaleString()})` : '';

  return (
    <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-60 bg-gray-200">
        <img
          src={imageUrl || '/api/placeholder/400/320'} // Use provided image or placeholder
          alt={logoText}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/api/placeholder/400/320'; // Default placeholder
            target.alt = 'Placeholder Image';
          }}
        />
        {/* Favorite Button */}
        <button
          onClick={onFavoriteToggle}
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
          aria-label="Toggle favorite"
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className={`block h-4 w-4 stroke-2 overflow-visible ${
              isFavorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black'
            }`}
          >
            <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Logo Row */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            {logoIconText}
          </div>
          <div className="font-semibold text-base text-gray-900 truncate">{logoText}</div>
        </div>

        {/* Title and Rating Row */}
        <div className="flex justify-between items-start mb-1">
          <div className="font-semibold text-gray-900">{location}</div>
          {displayRating && (
            <div className="flex items-center font-medium text-sm text-gray-800 flex-shrink-0 ml-2">
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-3.5 w-3.5 fill-current mr-1"
              >
                <path
                  d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"
                  fillRule="evenodd"
                ></path>
              </svg>
              {displayRating}
              {displayReviewCount && <span className="text-gray-500 ml-1">{displayReviewCount}</span>}
            </div>
          )}
        </div>

        {/* Description, Availability, Price */}
        <div className="text-sm text-gray-600 mb-1">{description}</div>
        <div className="text-sm text-gray-600 mb-2">{availability}</div>
        <div className="font-semibold text-gray-900">
          {price}
          <span className="font-normal text-gray-600 text-sm ml-1">{pricePeriod}</span>
        </div>

        {/* Services Tags */}
        {services && services.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700"
              >
                {service}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthcareCard;
