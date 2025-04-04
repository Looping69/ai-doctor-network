
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

type PublicLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  forceHideHeader?: boolean; // New prop
};

const PublicLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  forceHideHeader = false // Default to false
}: PublicLayoutProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f5fa] to-blue-50">
      {/* Conditionally render header based on showHeader AND forceHideHeader */}
      {showHeader && !forceHideHeader && ( 
        // Updated header styles: sticky, white bg, border
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
          {/* Use max-w-screen-xl for consistency if needed, or keep container */}
          <div className="container mx-auto px-6"> 
            {/* Reduced padding py-3 */}
            <nav className="flex items-center justify-between py-3">
              {/* Simplified Logo */}
              <Link to="/" className="flex items-center text-decoration-none">
                {/* Removed icon div */}
                {/* Removed flex-col div */}
                <span className="font-bold text-2xl text-primary leading-none"> {/* Adjusted size/leading */}
                  Leny.ai
                </span>
                {/* Removed tagline span */}
              </Link>
              
              {/* Updated Nav Links */}
              <div className="hidden md:flex items-center gap-8"> {/* Increased gap */}
                <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
                {/* Added Link to the new Tool */}
                <Link to="/tools/document-transformer" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Tools</Link> 
                {/* Removed About Us link */}
              </div>

              {/* Updated User Actions */}
              <div className="flex items-center gap-3"> {/* Reduced gap */}
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    {/* Use base Button and add specific classes */}
                    <Button className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2.5">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      {/* Use base Button and add specific classes */}
                      <Button variant="ghost" className="text-sm font-semibold rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">Log in</Button>
                    </Link>
                    <Link to="/register">
                      {/* Use base Button and add specific classes */}
                      <Button className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2.5">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* Remove gradient from main content area if layout handles bg */}
      <main className="flex-1 bg-white"> 
        {children}
      </main>

      {showFooter && (
        // Updated footer styles: white bg, top border
        <footer className="bg-white border-t border-gray-200 pt-10 pb-5">
          <div className="container mx-auto px-6">
            {/* Footer columns */}
            <div className="flex flex-wrap justify-between gap-8 mb-8">
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-gray-800">Support</h3>
                <ul className="space-y-3">
                  <li><Link to="/help" className="text-sm text-gray-600 hover:underline">Help Center</Link></li>
                  <li><Link to="/privacy" className="text-sm text-gray-600 hover:underline">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-sm text-gray-600 hover:underline">Terms of Service</Link></li>
                  <li><Link to="/contact" className="text-sm text-gray-600 hover:underline">Contact Us</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-gray-800">Features</h3>
                <ul className="space-y-3">
                  <li><Link to="/features#specialists" className="text-sm text-gray-600 hover:underline">AI Specialists</Link></li>
                  <li><Link to="/features#transcription" className="text-sm text-gray-600 hover:underline">Medical Transcription</Link></li>
                  <li><Link to="/features#research" className="text-sm text-gray-600 hover:underline">Research Assistance</Link></li>
                  <li><Link to="/features#analytics" className="text-sm text-gray-600 hover:underline">Healthcare Analytics</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-gray-800">About</h3>
                <ul className="space-y-3">
                  <li><Link to="/about#story" className="text-sm text-gray-600 hover:underline">Our Story</Link></li>
                  <li><Link to="/careers" className="text-sm text-gray-600 hover:underline">Careers</Link></li>
                  <li><Link to="/press" className="text-sm text-gray-600 hover:underline">Press</Link></li>
                  <li><Link to="/blog" className="text-sm text-gray-600 hover:underline">Blog</Link></li>
                </ul>
              </div>
            </div>
            {/* Copyright */}
            <div className="border-t border-gray-200 pt-6 mt-8 text-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} LENY-AI, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
