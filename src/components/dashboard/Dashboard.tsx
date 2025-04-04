
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "./components/DashboardHeader";
import StatCards from "./components/StatCards";
import QuickActions from "./components/QuickActions";
import ProfileSection from "./components/ProfileSection"; // Re-import the ProfileSection component

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-6"> 
      <DashboardHeader />
      <StatCards />
      {/* Re-add the Profile Section */}
      <ProfileSection /> 
      <QuickActions />
    </div>
  );
};

export default Dashboard;
