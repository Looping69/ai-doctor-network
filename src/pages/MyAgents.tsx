import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Search as SearchIcon } from 'lucide-react';
import { AgentCard } from '@/components/library/AgentCard'; 
import { EmptyState } from '@/components/library/EmptyState'; 
import { CardSkeleton } from '@/components/library/CardSkeleton'; 
import { AgentCategory } from '@/components/agents/AgentCategoryFilters'; // Keep type import

// Example Agent Data (replace with actual data fetching)
interface AgentData {
  id: string;
  title: string; 
  preview: string; 
  date: Date; 
  avatarUrl?: string;
  specialty?: string;
  category: AgentCategory | 'general'; 
}

// Define props for MyAgents to accept the initial category filter
interface MyAgentsProps {
  initialCategory?: AgentCategory | 'general'; // Make it optional, default to 'all'
}

const exampleAgents: AgentData[] = [
  { id: 'agent1', title: 'Cardiology Specialist', preview: 'Specialized in cardiovascular disease diagnosis and treatment recommendations.', date: new Date('2025-03-10'), avatarUrl: '/agents/male-doctor-labcoat.jpg', specialty: 'Cardiology', category: 'general' },
  { id: 'agent2', title: 'Radiology Assistant', preview: 'Helps interpret imaging studies and generate preliminary reports for review.', date: new Date('2025-03-08'), avatarUrl: '/agents/female-doctor-scrubs.jpg', specialty: 'Radiology', category: 'research' },
  { id: 'agent3', title: 'Med Student Tutor', preview: 'Assists medical students with study materials and case reviews.', date: new Date('2025-03-05'), avatarUrl: '', specialty: 'Education', category: 'med_student' },
  { id: 'agent4', title: 'Nursing Support Bot', preview: 'Provides quick answers to common nursing questions and protocols.', date: new Date('2025-03-01'), avatarUrl: '/agents/female-surgeon-cap.jpg', specialty: 'Nursing', category: 'nursing' },
  { id: 'agent5', title: 'Oncology Advisor', preview: 'Provides information on cancer treatment protocols and clinical trials.', date: new Date('2025-02-25'), avatarUrl: '', specialty: 'Oncology', category: 'research' },
];

// Accept initialCategory prop
const MyAgents = ({ initialCategory = 'all' }: MyAgentsProps) => { 
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentData[]>(exampleAgents); 
  const [searchTerm, setSearchTerm] = useState('');
  // Category is now controlled by the prop passed from Index.tsx
  const selectedCategory = initialCategory; 
  const [isLoading, setIsLoading] = useState(false); 

  const filteredAgents = useMemo(() => {
    setIsLoading(true);
    let results = agents.filter(agent => 
      agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== 'all') {
      results = results.filter(agent => agent.category === selectedCategory);
    }
    
    // Simulate loading finished
    setTimeout(() => setIsLoading(false), 300); 

    return results;
  }, [agents, searchTerm, selectedCategory]);

  const handleAgentClick = (agentId: string) => {
    navigate(`/agents/${agentId}`); 
  };

  const handleCreateAgent = () => {
    navigate('/agents/create'); 
  };

  return (
    // NOTE: Padding is removed here, assuming parent (Index.tsx) handles it when rendering this component
    <div className="h-full flex flex-col"> 
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 pt-6"> {/* Add padding back here */}
        <h1 className="text-2xl font-semibold text-perplexity-text-primary">My Agents</h1>
        <Button 
          size="sm" 
          className="bg-perplexity-teal hover:bg-perplexity-teal-dark text-white"
          onClick={handleCreateAgent}
        >
          <PlusIcon size={16} className="mr-1" />
          Create Agent
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-6 px-4"> {/* Add padding back here */}
        <SearchIcon 
          size={18} 
          className="absolute left-7 top-1/2 transform -translate-y-1/2 text-perplexity-text-tertiary pointer-events-none" // Adjust left padding for icon
        />
        <Input
          type="search"
          placeholder="Search agents..."
          className="w-full rounded-full bg-perplexity-bg-hover border-perplexity-border pl-10 pr-4 py-2 text-sm focus:bg-background focus:ring-1 focus:ring-perplexity-teal focus:border-perplexity-teal" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters are rendered in Index.tsx now */}

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto"> 
         <div className="divide-y divide-perplexity-border px-4"> {/* Add padding back here */}
          {isLoading ? (
            <CardSkeleton count={4} /> 
          ) : filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                title={agent.title}
                preview={agent.preview}
                date={agent.date} 
                avatarUrl={agent.avatarUrl}
                specialty={agent.specialty}
                onClick={() => handleAgentClick(agent.id)}
                // Add actions if needed
              />
            ))
          ) : (
            <EmptyState
              title="No agents found"
              description={searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filter.' : 'Create a new agent to get started.'}
              actionLabel="Create Agent"
              onAction={handleCreateAgent}
            />
          )}
        </div>
      </div>
    </div>
    // Removed AppLayout wrapper as this component is rendered inside Index.tsx which already uses AppLayout
  );
};

export default MyAgents;
