import React, { useState, useRef, useCallback, useEffect } from 'react';
// Removed PublicLayout import
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// Removed toast import as it's not used here anymore
import { Send, User, Bot } from 'lucide-react';

type ChatMode = 'patient' | 'provider';
interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

const Chat = () => {
    const [mode, setMode] = useState<ChatMode>('provider'); // Default to provider
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Keep state for potential future use
    const [loadingText, setLoadingText] = useState('Processing...'); // Keep state for potential future use

    const handleModeChange = (value: string) => {
        if (value === 'patient' || value === 'provider') {
            setMode(value as ChatMode);
            // Optionally clear chat or change bot persona here
            setMessages([]);
            setInputText('');
            // Removed toast call
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsSending(true);

        // Simulate bot response based on mode
        setTimeout(() => {
            const botResponseText = `Simulated response in ${mode} mode for: "${userMessage.text}"`;
            const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
            setIsSending(false);
        }, 1000 + Math.random() * 500);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline
            handleSendMessage();
        }
    };

    // Scroll to bottom of messages when new messages are added
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // Removed PublicLayout wrapper and outer container div
    return (
        <> 
            {/* Main chat panel - Removed fixed height calculation */}
            {/* Further increased shadow and border darkness */}
            <div className="flex flex-col max-w-4xl mx-auto bg-white border border-gray-400 rounded-xl shadow-xl overflow-hidden"> 

                {/* Removed Header with Toggle */}

                {/* Message Display Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2.5 max-w-[75%]`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                        <Bot size={18} />
                                    </div>
                                )}
                                <div className={`p-3 rounded-lg shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                 {msg.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                                        <User size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                     {isSending && (
                         <div className="flex justify-start">
                             <div className="flex items-start gap-2.5">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                     <Bot size={18} />
                                 </div>
                                 <div className="p-3 rounded-lg shadow-sm bg-white text-gray-500 border border-gray-100 rounded-bl-none italic">
                                     Typing...
                                 </div>
                             </div>
                         </div>
                     )}
                     {/* Add ref to scroll target */}
                     <div ref={messagesEndRef} /> 
                </div>

                {/* Input Area - Added relative positioning */}
                <div className="p-4 border-t border-gray-200 bg-white relative space-y-3"> {/* Added relative and space-y */}
                    {/* Re-added Toggle Group */}
                    <div className="flex justify-center">
                         <ToggleGroup
                            type="single"
                            value={mode}
                            onValueChange={handleModeChange}
                            className="border bg-gray-100 rounded-md p-1"
                        >
                            <ToggleGroupItem value="patient" aria-label="Toggle patient mode" className="text-xs px-3 py-1 data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                                Patients
                            </ToggleGroupItem>
                            <ToggleGroupItem value="provider" aria-label="Toggle provider mode" className="text-xs px-3 py-1 data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                                Medical Providers
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="flex items-center gap-2">
                        <Textarea
                            placeholder={`Chat as ${mode}... (Enter to send)`} 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="flex-1 resize-none border rounded-lg p-2 pr-12 text-sm focus:ring-primary focus:border-primary" // Adjusted padding-right
                        />
                        {/* Adjusted button positioning */}
                        <Button onClick={handleSendMessage} disabled={!inputText.trim() || isSending} size="icon" className="absolute right-6 bottom-6 w-8 h-8"> 
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            </div> {/* This closes the inner chat panel div */}
            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-[2000] transition-opacity duration-300 opacity-100">
                    <div className="loading-spinner w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="mt-3 font-medium text-gray-700">{loadingText}</div>
                </div>
            )}
        </> // Close the fragment
    );
};

export default Chat;
