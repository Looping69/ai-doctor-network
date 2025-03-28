import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Zap } from "lucide-react";
import ChatPreview from "@/components/home/ChatPreview";
const HeroSection = () => {
  const {
    user
  } = useAuth();
  const isAuthenticated = !!user;
  return <section className="py-10 md:py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="md:w-1/2 md:pr-8 mt-8 md:mt-0 mx-[30px]">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-medical-purple/10 text-medical-purple mb-2">
              Medical AI Assistant
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Healthcare AI<br />
              <span className="bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-md">
              LENY-AI streamlines your workflow with intelligent medical assistance for documentation, followups, and patient care.
            </p>
            
            <div className="flex items-center space-x-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Zap className="h-5 w-5 text-medical-yellow flex-shrink-0" />
              <p className="text-sm font-medium text-blue-800">
                <span className="font-bold">Save up to 70% of your time</span> on administrative tasks and documentation
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-medical-blue to-medical-purple hover:from-medical-green/90 hover:to-medical-blue/90 text-white shadow-md hover:shadow-lg transition-all">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-medical-purple/30 text-medical-purple hover:bg-medical-purple/5">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <div className="md:w-1/2 flex justify-center">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;