
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agents } from "./data/agentsData";
import { Agent } from "./types/agentTypes";
import AgentCard from "./AgentCard";
import ChatInterface from "./ChatInterface";
import AgentConsultationForm from "./consultation/AgentConsultationForm";

const AIAgentsView = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);

  // Function to handle selecting an agent
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveTab("chat");
  };

  // Function to open consultation form
  const handleOpenConsultationForm = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConsultationFormOpen(true);
  };

  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-6"> 
      <header className="space-y-2">
        <motion.h1 
          className="h1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          AI Medical Assistants
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Interactive AI specialists to assist with medical decision-making
        </motion.p>
      </header>

      <Tabs 
        defaultValue="explore" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="explore">Explore Agents</TabsTrigger>
            <TabsTrigger value="chat" disabled={!selectedAgent}>
              Chat {selectedAgent && `with ${selectedAgent.name}`}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="explore" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onSelect={() => handleSelectAgent(agent)}
                onConsultation={() => handleOpenConsultationForm(agent)}
                delay={index * 0.05}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          {selectedAgent && (
            <ChatInterface selectedAgent={selectedAgent} />
          )}
        </TabsContent>
      </Tabs>

      {/* Consultation Form Dialog */}
      {selectedAgent && (
        <AgentConsultationForm
          agent={selectedAgent}
          isOpen={isConsultationFormOpen}
          onClose={() => setIsConsultationFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AIAgentsView;
