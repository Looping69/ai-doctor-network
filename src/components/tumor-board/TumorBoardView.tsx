import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, CheckCircle, Plus, ChevronRight, Send, User, MessageCircle, Clock, AlertTriangle, Save, Users as UsersIcon, FlaskConical, Search as SearchIcon } from 'lucide-react'; // Added UsersIcon, FlaskConical, SearchIcon
import ConsensusReportView from './ConsensusReportView';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { toast } from "sonner"; // Assuming sonner is available globally or provided via context if needed here

// --- Helper Data & Functions ---

const allSpecialists = [
  { id: 'oncologist', name: 'Medical Oncology', color: '#4287f5', icon: '👨‍⚕️', description: 'Systemic treatments, chemotherapy' },
  { id: 'surgeon', name: 'Surgical Oncology', color: '#42c5f5', icon: '🔪', description: 'Surgical resection assessment' },
  { id: 'radiologist', name: 'Radiology', color: '#42f59e', icon: '🔍', description: 'Imaging interpretation' },
  { id: 'pathologist', name: 'Pathology', color: '#a142f5', icon: '🔬', description: 'Biopsy analysis, diagnosis confirmation' },
  { id: 'radiation', name: 'Radiation Oncology', color: '#f542c8', icon: '☢️', description: 'Radiation therapy planning' },
  { id: 'pulmonologist', name: 'Pulmonology', color: '#f5a142', icon: '🫁', description: 'Lung function, respiratory issues' },
  { id: 'cardiology', name: 'Cardiology', color: '#d93025', icon: '❤️', description: 'Heart and vascular conditions' },
];

const getSpecialistById = (id: string) => allSpecialists.find(s => s.id === id) || { id: 'unknown', name: 'Unknown', color: '#888888', icon: '❓', description: 'Unknown specialist' };

const generateSimulatedDiscussion = (agents: Specialist[], caseInfo: string) => {
  const agentIds = agents.map(a => a.id);
  let script: { agentId: string; content: string; type?: string }[] = [];

  if (agentIds.includes('radiologist')) {
      script.push({ agentId: 'radiologist', content: `Reviewing imaging for case: ${caseInfo.substring(0, 30)}... Findings indicate ${Math.random() > 0.5 ? 'a suspicious 3cm lesion' : 'potential inflammation'}.` });
  } else if (agents.length > 0) {
      script.push({ agentId: agents[0].id, content: `Initiating review for case: ${caseInfo.substring(0, 30)}...` });
  } else {
       script.push({ agentId: 'system', content: `No specialists selected for case: ${caseInfo.substring(0, 30)}...` });
  }
  if (agentIds.includes('pathologist')) {
    script.push({ agentId: 'pathologist', content: `Biopsy results pending, morphology ${Math.random() > 0.5 ? 'concerning' : 'atypical'}.` });
  }
  if (agentIds.includes('oncologist')) {
      script.push({ agentId: 'oncologist', content: `Considering presentation, differential includes adenocarcinoma, NET, or pancreatitis. Recommend PET & markers.` });
  }
  if (agentIds.includes('surgeon')) {
    script.push({ agentId: 'surgeon', content: `Assessing surgical candidacy. Need vascular involvement eval.` });
  }
  if (agentIds.includes('radiologist')) {
      script.push({ agentId: 'radiologist', content: `Comparing priors. Attention to SMV/SMA margins.` });
  }
   if (agentIds.includes('radiation')) {
    script.push({ agentId: 'radiation', content: `Evaluating role for neoadjuvant/adjuvant RT.` });
  }
  if (agentIds.includes('oncologist')) {
      script.push({
        agentId: 'oncologist',
        content: `Consensus: Agree on PET & CA 19-9?`,
        type: 'consensus_poll'
      });
  } else if (agents.length > 1) {
       script.push({
           agentId: agents[0].id,
           content: `Next step: Further imaging?`,
           type: 'consensus_poll'
       });
  }
   script.push({
    agentId: 'system',
    content: `Summary: Initial assessment suggests [Condition]. Next steps: [Actions]. Awaiting results.`,
    type: 'summary'
  });

  const filteredScript = script.filter(msg => msg.agentId === 'system' || agentIds.includes(msg.agentId));
  const consensusData = extractConsensusFromScript(filteredScript, agents);
  return { script: filteredScript, consensusData };
};

export interface ConsensusItem {
    topic: string;
    status: 'Discussed' | 'Proposed' | 'Pending' | 'Agreed' | 'Confirmed';
    details: string;
    specialists: { id: string; color: string; initial: string }[];
}

const extractConsensusFromScript = (script: { agentId: string; content: string; type?: string }[], agents: Specialist[]): ConsensusItem[] => {
    const items: ConsensusItem[] = [];
    const specialistMap = new Map(agents.map(a => [a.id, a]));
    const topics: { [key: string]: { keywords: string[], status: ConsensusItem['status'], specialists: Set<string>, details: string[] } } = {
        'Imaging Findings': { keywords: ['imaging', 'scan', 'lesion', 'margins'], status: 'Discussed', specialists: new Set(), details: [] },
        'Pathology Report': { keywords: ['biopsy', 'morphology', 'stains', 'malignancy'], status: 'Pending', specialists: new Set(), details: [] },
        'Treatment Plan': { keywords: ['chemotherapy', 'radiation', 'neoadjuvant', 'adjuvant', 'regimen'], status: 'Proposed', specialists: new Set(), details: [] },
        'Surgical Assessment': { keywords: ['surgical', 'resection', 'resectability', 'vascular'], status: 'Discussed', specialists: new Set(), details: [] },
        'Next Steps': { keywords: ['next step', 'recommend', 'consensus point', 'marker'], status: 'Proposed', specialists: new Set(), details: [] },
    };
    script.forEach(msg => {
        if (msg.agentId === 'system') return;
        let assigned = false;
        Object.entries(topics).forEach(([topicName, topicData]) => {
            if (topicData.keywords.some(kw => msg.content.toLowerCase().includes(kw))) {
                topicData.specialists.add(msg.agentId);
                topicData.details.push(msg.content);
                if (msg.type === 'consensus_poll') topicData.status = 'Proposed';
                assigned = true;
            }
        });
        if (!assigned && msg.type === 'consensus_poll') {
             topics['Next Steps'].specialists.add(msg.agentId);
             topics['Next Steps'].details.push(msg.content);
             topics['Next Steps'].status = 'Proposed';
        }
    });
    Object.entries(topics).forEach(([topicName, topicData]) => {
        if (topicData.specialists.size > 0) {
            items.push({
                topic: topicName,
                status: topicData.status,
                details: topicData.details.length > 0 ? topicData.details.join(' | ') : 'No specific details captured.',
                specialists: Array.from(topicData.specialists).map(id => {
                    const spec = specialistMap.get(id) || getSpecialistById(id);
                    return { id: spec.id, color: spec.color, initial: spec.name.substring(0, 2).toUpperCase() };
                })
            });
        }
    });
    // Simplified placeholder return for brevity
    return items.length > 0 ? items : [{ topic: 'General Discussion', status: 'Discussed', details: 'Consultation held.', specialists: agents.map(a => ({ id: a.id, color: a.color, initial: a.name.substring(0, 2).toUpperCase() })) }];
};


// --- Component Types ---
interface Specialist {
    id: string;
    name: string;
    color: string;
    icon: string;
    description: string;
}
interface Message {
    agentId: string;
    content: string;
    type?: 'consensus_poll' | 'summary';
}
interface ConsultationSetupProps {
    onStart: (agents: Specialist[], caseInfo: string) => void;
}
interface ConsultationViewProps {
    agents: Specialist[];
    caseInfo: string;
    onGoBack: () => void;
    onProceed: (data: ConsensusItem[]) => void;
}
interface ParticipantListHeaderProps {
    agents: Specialist[];
    activeAgentId: string | null;
}
interface MessageItemProps {
    message: Message;
}
interface TypingIndicatorProps {
    agentId: string | null;
}

// --- Components ---

// 1. Consultation Setup Component - Redesigned with Two Columns
const ConsultationSetup: React.FC<ConsultationSetupProps> = ({ onStart }) => {
  const [caseDetails, setCaseDetails] = useState("55-year-old male experiencing chest pain radiating to the left arm for the past hour, with mild shortness of breath and dizziness. BP 145/90, P 92. Hx of hypertension, no prior cardiac history reported.");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Specialist[]>([]);
  const [localSelectedAgents, setLocalSelectedAgents] = useState<Specialist[]>([]);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);

  const handleAnalyze = useCallback(() => {
    setIsLoading(true);
    setAnalysisPerformed(false);
    setSuggestions([]);
    setLocalSelectedAgents([]);
    setTimeout(() => {
      const suggestedIds = new Set<string>();
      const caseLower = caseDetails.toLowerCase();
      if (caseLower.includes('cancer') || caseLower.includes('tumor') || caseLower.includes('malignancy') || caseLower.includes('chemo')) suggestedIds.add('oncologist');
      if (caseLower.includes('surgery') || caseLower.includes('resection') || caseLower.includes('mass')) suggestedIds.add('surgeon');
      if (caseLower.includes('image') || caseLower.includes('scan') || caseLower.includes('ct') || caseLower.includes('mri') || caseLower.includes('x-ray')) suggestedIds.add('radiologist');
      if (caseLower.includes('biopsy') || caseLower.includes('pathology') || caseLower.includes('cells')) suggestedIds.add('pathologist');
      if (caseLower.includes('radiation') || caseLower.includes('radiotherapy')) suggestedIds.add('radiation');
      if (caseLower.includes('lung') || caseLower.includes('breath') || caseLower.includes('pulmonary')) suggestedIds.add('pulmonologist');
      if (caseLower.includes('heart') || caseLower.includes('cardiac') || caseLower.includes('chest pain')) suggestedIds.add('cardiology');
      if (suggestedIds.size === 0) { suggestedIds.add('oncologist'); suggestedIds.add('radiologist'); }
      const suggestedAgents = allSpecialists.filter(s => suggestedIds.has(s.id));
      setSuggestions(suggestedAgents);
      if (suggestedAgents.length > 0) { setLocalSelectedAgents(suggestedAgents.slice(0, Math.min(suggestedAgents.length, 2))); }
      setIsLoading(false);
      setAnalysisPerformed(true);
    }, 1500);
  }, [caseDetails]);

  const toggleAgent = (agent: Specialist) => {
    // Only allow toggling if analysis is performed and not loading
    if (!analysisPerformed || isLoading) return;
    setLocalSelectedAgents(prev => prev.some(a => a.id === agent.id) ? prev.filter(a => a.id !== agent.id) : [...prev, agent]);
  };

  const canStart = localSelectedAgents.length > 0 && analysisPerformed;

  return (
    // Main container for the setup view - Using flex column
    <div className="flex flex-col h-full"> {/* Ensure parent has height */}
      {/* Two-column layout for medium screens and up */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-6 md:gap-8 p-4 md:p-6">

        {/* Left Column: Intro, Case Summary, Analyze Button */}
        <div className="flex flex-col md:w-1/2 lg:w-7/12 overflow-y-auto pr-0 md:pr-4">
          {/* Header with Icon and Title Inline */}
          <div className="flex items-center gap-3 mb-6">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
               <UsersIcon size={24} strokeWidth={1.5} />
             </div>
             <h1 className="text-xl md:text-2xl font-semibold text-gray-900">AI Expert Consultation Panel</h1>
          </div>

          <div className="flex flex-col flex-grow mb-4">
            <Label htmlFor="case-summary" className="mb-1.5 text-sm font-medium text-gray-700">Patient Case Summary</Label>
            {/* Moved descriptive paragraph here */}
            <p className="text-xs text-gray-500 mb-2">
              Enter patient case details below. Our AI will suggest relevant AI specialists for a collaborative review, like a virtual tumor board.
            </p>
            <Textarea
              id="case-summary"
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              placeholder="Enter patient case summary, medical history, relevant findings, and specific questions..."
              className="flex-grow resize-none text-sm p-3 border rounded-lg min-h-[250px] md:min-h-[300px]" // Adjusted min-height
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !caseDetails}
            className="w-full mt-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Case...
              </>
            ) : (
              <>
                <FlaskConical size={16} className="mr-2" />
                Analyze & Suggest Specialists
              </>
            )}
          </Button>
        </div>

        {/* Right Column: Specialist Suggestions / Preview */}
        <div className="flex flex-col md:w-1/2 lg:w-5/12 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex-shrink-0">
            {isLoading ? 'Analyzing...' : (analysisPerformed && suggestions.length > 0 ? 'Suggested Specialists' : 'Available Specialists (Preview)')}
          </h2>
          <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-1"> {/* Added padding-right for scrollbar */}
            {isLoading ? (
              // Loading Skeleton
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : analysisPerformed ? (
              // Post-Analysis: Show Suggestions or "No Suggestions"
              suggestions.length > 0 ? (
                suggestions.map((agent, index) => {
                  const isSelected = localSelectedAgents.some(a => a.id === agent.id);
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                        isSelected ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/30' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s`, opacity: 1, animationFillMode: 'forwards', animationName: 'fadeInUp' }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center mr-3 text-base shrink-0"
                        style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                        title={agent.name}
                      >
                        {agent.icon || agent.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{agent.name}</div>
                        <div className="text-xs text-gray-500 truncate">{agent.description}</div>
                      </div>
                      <div className="pl-3">
                        {isSelected ? <CheckCircle size={20} className="text-primary" /> : <Plus size={20} className="text-gray-400" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-gray-500 pt-10">
                  No specific specialists suggested based on the summary.
                </div>
              )
            ) : (
              // Pre-Analysis: Show all specialists grayed out
              allSpecialists.map((agent, index) => (
                <div
                  key={agent.id}
                  className={`flex items-center p-3 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed`} // Grayed out and non-interactive
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mr-3 text-base shrink-0 bg-gray-200 text-gray-500" // Gray avatar
                    title={agent.name}
                  >
                    {agent.icon || agent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-500 truncate">{agent.name}</div>
                    <div className="text-xs text-gray-400 truncate">{agent.description}</div>
                  </div>
                  <div className="pl-3">
                    <Plus size={20} className="text-gray-300" /> {/* Gray plus icon */}
                  </div>
                </div>
              ))
            )}
          </div>
           {/* Only show Add/Search button if analysis is done */}
           {analysisPerformed && (
             <Button variant="outline" className="mt-auto w-full flex-shrink-0"> 
               <SearchIcon size={16} className="mr-2" /> Add / Search More
             </Button>
           )}
        </div>
      </div>

      {/* Footer Section */}
      {analysisPerformed && (
        <div className="p-4 mt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          {localSelectedAgents.length > 0 && (
            <div className="mb-3 flex items-center flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-600 mr-1">Selected:</span>
              {localSelectedAgents.map(agent => (
                <div key={agent.id} className="flex items-center bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                  <span className="mr-1 opacity-80" style={{color: agent.color}}>{agent.icon}</span>
                  {agent.name}
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={() => onStart(localSelectedAgents, caseDetails)}
            disabled={!canStart}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Start AI Consultation ({localSelectedAgents.length})
            <ChevronRight size={18} className="ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
};


// --- Real-time Consultation Components ---

const ParticipantListHeader: React.FC<ParticipantListHeaderProps> = ({ agents, activeAgentId }) => {
  if (!agents || agents.length === 0) return null;
  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 sticky top-0 z-10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
             <span className="text-xs font-medium text-gray-500 shrink-0 mr-2">Participants:</span>
            {agents.map(agent => (
                <div
                    key={agent.id}
                    title={agent.name}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 shrink-0 ${
                        activeAgentId === agent.id ? 'border-primary scale-110' : 'border-transparent scale-100'
                    }`}
                    style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                >
                    {agent.icon || agent.name.substring(0,1)}
                     {activeAgentId === agent.id && (
                         <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                     )}
                </div>
            ))}
        </div>
    </div>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const agent = getSpecialistById(message.agentId);
    const isSystem = message.agentId === 'system';
    const isConsensus = message.type === 'consensus_poll';
    const isSummary = message.type === 'summary';
    let containerClass = 'flex justify-start mb-4';
    let bubbleClass = 'p-3 rounded-lg shadow-sm max-w-[85%] border-l-4';
    let bgColor = 'bg-white';
    let textColor = 'text-gray-800';
    let borderColor = agent.color || '#cccccc';
    if (isSystem || isSummary) {
        containerClass = 'flex justify-center mb-4';
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-800';
        borderColor = '#60a5fa';
        bubbleClass = 'p-3 rounded-lg max-w-[85%] border border-blue-200 text-center italic';
    } else if (isConsensus) {
         bgColor = 'bg-yellow-50';
         borderColor = '#fbbf24';
    }
    const animationStyle = { animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 };
    return (
        <div className={containerClass} style={animationStyle}>
            <div className={`${bubbleClass} ${bgColor} ${textColor}`} style={{ borderLeftColor: isSystem ? 'transparent' : borderColor, borderColor: isSystem ? borderColor : '' }}>
                 {!isSystem && (
                     <div className="flex items-center mb-1.5">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs shrink-0"
                            style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                            title={agent.name}
                        >
                            {agent.icon || agent.name.substring(0,1)}
                        </div>
                        <span className="text-xs font-semibold tracking-wide" style={{ color: agent.color }}>
                            {agent.name}
                        </span>
                    </div>
                 )}
                <p className={`text-sm leading-relaxed ${isSystem ? '' : 'pl-7'}`}>
                    {isSummary && <FileText size={14} className="inline mr-1 mb-0.5 opacity-70"/> }
                    {message.content}
                </p>
                 {isConsensus && (
                    <div className="mt-2.5 pl-7 flex flex-wrap gap-2">
                        <button className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-md hover:bg-green-200 transition-colors">Agree</button>
                        <button className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md hover:bg-red-200 transition-colors">Disagree</button>
                        <button className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-200 transition-colors">More Info</button>
                    </div>
                 )}
            </div>
        </div>
    );
};

const MessageStream: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentId }) => {
  if (!agentId) return null;
  const agent = getSpecialistById(agentId);
  const animationStyle = { animation: 'fadeInUp 0.3s ease-out forwards', opacity: 0 };
  return (
    <div className="flex justify-start p-4 pt-1 pb-2" style={animationStyle}>
       <div className="flex items-center p-2 rounded-lg bg-white shadow-sm border-l-4" style={{ borderLeftColor: agent.color || '#cccccc' }}>
            <div
                className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs shrink-0"
                style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                title={agent.name}
            >
                 {agent.icon || agent.name.substring(0,1)}
            </div>
            <div className="flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
       </div>
    </div>
  );
};

// 2. Real-time Consultation View Component
const ConsultationView: React.FC<ConsultationViewProps> = ({ agents, caseInfo, onGoBack, onProceed }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingAgentId, setTypingAgentId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState('Initializing...');
  const [generatedConsensusData, setGeneratedConsensusData] = useState<ConsensusItem[] | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!agents || agents.length === 0) {
        setSessionStatus('Error: No specialists selected.');
        return;
    }
    setMessages([]);
    setTypingAgentId(null);
    setGeneratedConsensusData(null);
    setSessionStatus('Running consultation...');
    const { script: discussionScript, consensusData } = generateSimulatedDiscussion(agents, caseInfo);
    let messageIndex = 0;
    const processNextMessage = () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
      if (messageIndex >= discussionScript.length) {
        setTypingAgentId(null);
        setSessionStatus('Consultation complete.');
        setGeneratedConsensusData(consensusData);
        return;
      }
      const nextMessage = discussionScript[messageIndex];
      const isSystemMessage = nextMessage.agentId === 'system';
      timeoutRef.current = setTimeout(() => {
          if (!isSystemMessage) { setTypingAgentId(nextMessage.agentId); }
          else { setTypingAgentId(null); }
          const messageDelay = isSystemMessage ? 1500 : (1200 + Math.random() * 1800);
          timeoutRef.current = setTimeout(() => {
            setMessages(prev => [...prev, nextMessage as Message]);
            if (!isSystemMessage) { setTypingAgentId(null); }
            messageIndex++;
            processNextMessage();
          }, messageDelay);
      }, isSystemMessage ? 500 : 700);
    };
    timeoutRef.current = setTimeout(processNextMessage, 1000);
    return () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
      setTypingAgentId(null);
    };
  }, [agents, caseInfo]);

  return (
    // Apply more pronounced styling - Removed fixed height
    <div className="flex flex-col bg-gray-100 max-w-4xl mx-auto shadow-xl rounded-xl border border-gray-400 overflow-hidden"> 
      <ParticipantListHeader agents={agents} activeAgentId={typingAgentId} />
      <MessageStream messages={messages} />
      <div className="bg-gray-100 h-10 flex items-center">
           <TypingIndicator agentId={typingAgentId} />
      </div>
      <div className="bg-white border-t border-gray-200 p-3 sticky bottom-0">
          <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">{sessionStatus}</span>
              {sessionStatus === 'Consultation complete.' && generatedConsensusData && (
                  <div className="flex gap-2">
                       <button
                          onClick={() => onProceed(generatedConsensusData)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-medium flex items-center"
                      >
                          <Save size={12} className="mr-1"/>
                          Proceed
                      </button>
                      <button
                          onClick={onGoBack}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium" // Kept blue for contrast
                      >
                          New Consultation
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};


// --- Main App Component (Entry Point) ---
const TumorBoardView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'setup' | 'consultation' | 'report'>('setup');
  const [selectedAgents, setSelectedAgents] = useState<Specialist[]>([]);
  const [caseDetails, setCaseDetails] = useState('');
  const [consensusData, setConsensusData] = useState<ConsensusItem[] | null>(null);

  const handleStartConsultation = useCallback((agents: Specialist[], caseInfo: string) => {
    setSelectedAgents(agents);
    setCaseDetails(caseInfo);
    setCurrentView('consultation');
  }, []);

   const handleGoBackToSetup = () => {
       setCurrentView('setup');
       setSelectedAgents([]);
   }

   const handleProceedToReport = (generatedData: ConsensusItem[]) => {
       setConsensusData(generatedData);
       setCurrentView('report');
   }

   const handleCloseReport = () => {
       handleGoBackToSetup();
   }

  const renderView = () => {
    switch (currentView) {
      case 'setup':
        return <ConsultationSetup onStart={handleStartConsultation} />;
      case 'consultation':
        return (
          <ConsultationView
            agents={selectedAgents}
            caseInfo={caseDetails}
            onGoBack={handleGoBackToSetup}
            onProceed={handleProceedToReport}
          />
        );
      case 'report':
        return (
          <ConsensusReportView
            consensusData={consensusData}
            onClose={handleCloseReport}
          />
        );
      default:
        return <ConsultationSetup onStart={handleStartConsultation} />;
    }
  };

  // Removed PublicLayout wrapper and container div
  return (
    <> 
      {renderView()}
      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
         @keyframes bounce {
           0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
           50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
         }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
        .animate-bounce { animation: bounce 1s infinite; }
      `}</style>
    </> // Close fragment
  );
}

export default TumorBoardView;
