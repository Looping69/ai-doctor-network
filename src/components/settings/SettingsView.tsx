
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import AccountTab from "./tabs/AccountTab";
import AppearanceTab from "./tabs/AppearanceTab"; // Already imported
import NotificationsTab from "./tabs/NotificationsTab"; // Already imported
import SecurityTab from "./tabs/SecurityTab"; // Already imported
// Removed CallMonitoringTab import as the section is deleted

const SettingsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("account");
  
  // Extract the path after /settings/
  const settingsPath = location.pathname.split('/').slice(2)[0] || '';
  
  // Handle specific settings routes
  if (settingsPath === 'ai-experts') {
    return <Navigate to="/settings/ai-experts" replace />;
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-8"> 
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1> {/* Adjusted color */}
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="account" value={activeTab} onValueChange={handleTabChange}>
          {/* Updated grid columns to 4 */}
          <TabsList className="grid w-full grid-cols-4"> 
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {/* Removed Call Monitoring Trigger */}
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          
          {/* Removed Call Monitoring Content */}
          
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsView;
