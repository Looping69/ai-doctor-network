import PublicLayout from "@/components/layout/PublicLayout";
import SpecialistsSection from "@/components/home/SpecialistsSection";
import CTASection from "@/components/home/CTASection";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Keep useNavigate for potential future use
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Search,
  SlidersHorizontal,
  HeartPulse, // Cardiology (Placeholder, not used)
  Brain, // Neurology (Placeholder, not used)
  Microscope, // Pathology
  Bone, // Orthopedics (Example - will be replaced)
  Eye, // Ophthalmology (will be replaced)
  FlaskConical, // Pharma/Labs
  Stethoscope, // General Practice & Nursing
  Sparkles, // All/General Icon
  ClipboardList, // Added for Tumor Board filter
  NotebookPen, // Added for Quick Notes filter
  GraduationCap, // Added for Med Students
  MessageCircle, // Added for Chat
} from "lucide-react";
import QuickNotes from "./QuickNotes"; // Import QuickNotes
import Chat from "./Chat"; // Import Chat
import TumorBoardView from "@/components/tumor-board/TumorBoardView"; // Import TumorBoardView
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading

// Define type for filter/tool items
type FilterItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  type: 'filter' | 'tool'; // Simplified type
};

// Updated filter/tool data
const filterCategories: FilterItem[] = [
  { id: 'all', label: 'All Specialists', icon: Sparkles, type: 'filter' },
  { id: 'tumor-board', label: 'Tumor Board', icon: ClipboardList, type: 'tool' },
  { id: 'quick-notes', label: 'Quick Notes', icon: NotebookPen, type: 'tool' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, type: 'tool' },
  { id: 'med-students', label: 'Med Students', icon: GraduationCap, type: 'filter' },
  { id: 'nursing', label: 'Nursing', icon: Stethoscope, type: 'filter' },
  // Add more relevant categories
];

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // For filtering SpecialistsSection
  const [activeTool, setActiveTool] = useState<string | null>(null); // State for active tool view
  const [isToolLoading, setIsToolLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Keep for potential future use

  // Preload agent profile images (Keep this logic)
  useEffect(() => {
    const agentIds = ["cardio", "neuro", "path", "gen", "opth", "radiology", "pharma"];
    agentIds.forEach(id => {
      const img = new Image();
      img.src = `/agents/${id}.jpg`;
    });
  }, []);

  const handleFilterClick = (item: FilterItem) => {
    if (item.type === 'filter') {
      setActiveFilter(item.id);
      setActiveTool(null); // Hide any open tool when a filter is clicked
    } else if (item.type === 'tool') {
      // Toggle tool visibility: if same tool clicked, hide it, otherwise show it
      setActiveTool(prevTool => prevTool === item.id ? null : item.id);
      setActiveFilter('all'); // Reset specialist filter when a tool is opened
      // Show loading briefly
      setIsToolLoading(true);
      setTimeout(() => setIsToolLoading(false), 300); // Adjust delay as needed
    }
  };

  // Determine which main content component to render below the filter bar
  const renderMainContent = () => {
    switch (activeTool) {
      case 'quick-notes':
        return <QuickNotes />;
      case 'chat':
        return <Chat />;
      case 'tumor-board':
        return <TumorBoardView />;
      default:
        // Pass activeFilter to SpecialistsSection if it uses it for filtering
        return <SpecialistsSection /* activeFilter={activeFilter} */ />;
    }
  };

  return (
    // Always render PublicLayout with the header
    <PublicLayout showHeader={true} showFooter={!activeTool}> {/* Hide footer when tool is active */}
      {/* Main content area with padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Combined Search and Filter/Tool Bar Section */}
        {/* Made sticky below the header (assuming header height ~60px) */}
        <div className="sticky top-[60px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3"> 
          <div className="container mx-auto flex items-center gap-4"> {/* Use gap-4 for spacing */}
            
            {/* Filter/Tool Buttons Area (Moved to Left) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {filterCategories.map((category) => (
                <button
                key={category.id}
                onClick={() => handleFilterClick(category)} // Use the updated handler
                className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] sm:min-w-[80px] cursor-pointer group ${
                  // Highlight if it's the active filter OR the active tool
                  (activeFilter === category.id && category.type === 'filter') || (activeTool === category.id && category.type === 'tool')
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300'
                }`}
              >
                <category.icon
                  size={22}
                  className={`transition-opacity ${
                    // Highlight icon if active filter or tool
                    (activeFilter === category.id && category.type === 'filter') || (activeTool === category.id && category.type === 'tool')
                     ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`}
                  strokeWidth={(activeFilter === category.id && category.type === 'filter') || (activeTool === category.id && category.type === 'tool') ? 2 : 1.5}
                />
                <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
              </button>
            ))}
            </div>

            {/* Search Input Area (Moved to Right using ml-auto) */}
            <div className="flex items-center ml-auto max-w-xs border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-12"> {/* Adjusted max-width */}
              <input
                type="text"
                className="flex-grow px-5 py-2 border-none text-sm placeholder-gray-500 focus:outline-none"
                placeholder="Search..." // Shortened placeholder
              />
              <button className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0 hover:bg-primary/90 transition-colors">
                <Search size={14} strokeWidth={3} />
              </button>
            </div>

          </div>
        </div>

        {/* Main Content Area (Specialists or Tool) - Adjusted margin-top */}
        <div className="mt-8 mb-16 min-h-[500px]"> {/* Added min-height */}
          {isToolLoading ? (
            // Show Skeleton loaders while tool loads
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            renderMainContent()
          )} 
        </div>

        {/* CTA Section - Conditionally hide if a tool is active */}
        {!activeTool && (
          <div className="mb-16">
             <CTASection />
          </div>
        )}

      </div>
    </PublicLayout>
  );
};

export default Index;
