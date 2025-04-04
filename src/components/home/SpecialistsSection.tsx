import HealthcareCard from "@/components/home/HealthcareCard"; // Import the new card
import { agents } from "@/components/agents/data/agentsData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components

// Define interface for the mapped specialist object to match HealthcareCard props
interface MappedSpecialistForHC {
  id: string;
  logoText: string;
  location: string; // Changed from specialty
  description: string;
  services: string[];
  imageUrl: string; 
  delay: number;
  isNew: boolean;
  logoIconText: string;
  // logoColor is not directly used by HealthcareCard
  rating: number | 'New';
  reviewCount?: number;
  availability: string;
  price: string;
  pricePeriod: string;
}

const SpecialistsSection = () => {
  // Map agents data to the HealthcareCard props
  const specialists: MappedSpecialistForHC[] = agents.map((agent, index) => {
    const isNewAgent = index < 3; // Example logic for 'New' rating
    return {
      id: agent.id,
      logoText: agent.name,
      location: agent.specialty, // Map specialty to location
      description: agent.description,
      services: agent.capabilities.slice(0, 2), // Show first 2 capabilities as services
      imageUrl: `/agents/${agent.id}.jpg`, // Assuming image path convention
      logoIconText: agent.name.substring(0, 2).toUpperCase(),
      rating: isNewAgent ? 'New' : parseFloat((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewCount: isNewAgent ? undefined : Math.floor(500 + Math.random() * 1500),
      availability: index % 2 === 0 ? "Available Mon-Fri" : "Available 24/7",
      price: isNewAgent ? "$0" : `$${10 + index * 5}`,
      pricePeriod: isNewAgent ? "for first consultation" : "per consultation",
      // Add missing properties required by the interface
      delay: 0, // Delay is not used in HealthcareCard, set to 0
      isNew: isNewAgent, // Keep the isNew logic if needed elsewhere, though not used by card
    };
  });
  
  // Return Carousel instead of grid
  return (
    <Carousel 
      opts={{
        align: "start",
        loop: true, // Loop the carousel
      }}
      className="w-full relative" // Added relative positioning for nav buttons
    >
      <CarouselContent className="-ml-4"> {/* Negative margin for item spacing */}
        {specialists.map((specialist, index) => (
          <CarouselItem key={specialist.id || index} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              {/* Render the new HealthcareCard */}
              <HealthcareCard
                // Spread the mapped props
                {...specialist}
                // Add optional favorite handling if needed later
                // isFavorite={false}
                // onFavoriteToggle={() => console.log('Toggle favorite for', specialist.id)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Position nav buttons inside the container, slightly offset */}
      <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex z-10" /> 
      <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex z-10" />
    </Carousel>
  );
};
export default SpecialistsSection;
