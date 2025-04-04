
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientRecords from "./pages/PatientRecords";
import Agents from "./pages/Agents";
import Collaboration from "./pages/Collaboration";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import FollowupScheduler from "./pages/FollowupScheduler";
// Removed FollowupMonitoring import as the page was deleted
import Features from "./pages/Features";
import AboutUs from "./pages/AboutUs";
import Notifications from "./pages/Notifications";
import AIExpertsSettings from "./pages/AIExpertsSettings";
import EditAIExpert from "./pages/EditAIExpert";
import DocumentTransformer from "./pages/DocumentTransformer";
import CollaborationHub from "./pages/CollaborationHub";
import TumorBoardView from "@/components/tumor-board/TumorBoardView";
import QuickNotes from "./pages/QuickNotes";
import Chat from "./pages/Chat"; // Import the new Chat page

// Import the new page for security logs if needed
// import SecurityLogs from "./pages/SecurityLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<AboutUs />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <ProtectedRoute>
                    <PatientRecords />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <ProtectedRoute>
                    <Agents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/collaboration" 
                element={
                  <ProtectedRoute>
                    <Collaboration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings/*" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/followup-scheduler" 
                element={
                  <ProtectedRoute>
                    <FollowupScheduler />
                  </ProtectedRoute>
                } 
              />
              {/* Removed Followup Monitoring route */}
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              {/* AI Experts routes removed */}
              {/* Route for the new Document Transformer tool */}
              <Route 
                path="/tools/document-transformer" 
                element={
                  <ProtectedRoute>
                    <DocumentTransformer />
                  </ProtectedRoute>
                } 
              />
              {/* Route for the new Collaboration Hub */}
              <Route 
                path="/collaboration-hub" 
                element={
                  <ProtectedRoute>
                    <CollaborationHub />
                  </ProtectedRoute>
                } 
              />
              {/* Route for the new Tumor Board view - Made public */}
              <Route 
                path="/tumor-board" 
                element={<TumorBoardView />} 
              />
              {/* Removed route for Quick Notes (now shown in Index) */}
              {/* Removed route for Chat (now shown in Index) */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
