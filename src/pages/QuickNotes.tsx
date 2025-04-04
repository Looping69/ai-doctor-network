import React, { useState, useRef, useCallback, useEffect } from 'react';
// Removed PublicLayout import
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Using installed sonner library for toasts
import {
    Trash2, Upload, Mic, ClipboardList, Search, Copy, Download, Edit, FileText, Users, Brain, Microscope, Phone, Monitor, Bell, Save, SlidersHorizontal, NotebookPen, FileSignature, ListChecks, Languages, RotateCcw, Send // Added Send icon
} from 'lucide-react';

// Define Action Type
interface Action {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType; // Use Lucide icon component type
}

// Define available actions (map icons from lucide-react)
const availableActions: Action[] = [
    { id: 'soap', name: 'SOAP Note', description: 'Structure notes into Subjective, Objective, Assessment, Plan.', icon: FileSignature },
    { id: 'progress', name: 'Progress Note', description: 'Create a standard progress note for follow-up.', icon: ListChecks },
    { id: 'h_and_p', name: 'History & Physical', description: 'Comprehensive patient assessment format.', icon: NotebookPen }, // Example icon
    { id: 'referral', name: 'Referral Letter', description: 'Draft a referral letter to another provider.', icon: Send }, // Re-using Send icon
    { id: 'summarize', name: 'Summarize Key Points', description: 'Extract the most important findings.', icon: FileText }, // Re-using FileText
    { id: 'translate_es', name: 'Translate to Spanish', description: 'Translate the input text into Spanish.', icon: Languages },
    // Add more actions as needed
];

const QuickNotes = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [outputTitle, setOutputTitle] = useState('Generated Document');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Processing...');
    const [showOutput, setShowOutput] = useState(false);
    const [isOutputEditable, setIsOutputEditable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    // Filter actions based on search term
    const filteredActions = availableActions.filter(action =>
        action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Simulation Logic ---
    const simulateTransformation = useCallback((action: Action, input: string) => {
        let content = `This is a simulated <strong>${action.name}</strong> based on the input provided.<br><br>
                         <em>Input snippet:</em> ${input.substring(0, 200).replace(/\n/g, '<br>')}${input.length > 200 ? '...' : ''}<br><br>`;

        switch(action.id) {
            case 'soap':
                content += `<h3>Subjective:</h3> [Details...] <br><h3>Objective:</h3> [Details...] <br><h3>Assessment:</h3> [Details...] <br><h3>Plan:</h3> [Details...]`;
                break;
            case 'progress':
                 content += `<h3>Progress Update:</h3> [Details...] <br><h3>Plan:</h3> [Details...]`;
                 break;
            case 'summarize':
                content += `<h3>Key Points:</h3> <ul><li>Point 1...</li><li>Point 2...</li></ul>`;
                break;
            case 'translate_es':
                content += `<h3>Traducción (Simulada):</h3> Este es un texto simulado traducido al español basado en la entrada.`;
                break;
            default:
                content += `(Standard structured content for ${action.name} would appear here)`;
        }
        return `<h2>${action.name.toUpperCase()}</h2><br>${content}`;
    }, []);

    const handleActionClick = useCallback((action: Action) => {
        if (!inputText.trim()) {
            toast.error('Please enter some text in the input document.');
            return;
        }
        setLoadingText(`Processing: ${action.name}...`);
        setIsLoading(true);
        setShowOutput(false); // Hide previous output
        setIsOutputEditable(false); // Reset edit state

        // Simulate API call
        setTimeout(() => {
            try {
                const simulatedOutput = simulateTransformation(action, inputText);
                setOutputTitle(action.name);
                setOutputText(simulatedOutput);
                setShowOutput(true);
                setIsLoading(false);
                toast.success(`${action.name} generated successfully.`);
            } catch (error) {
                console.error("Simulated transformation error:", error);
                setIsLoading(false);
                toast.error(`Failed to generate ${action.name}.`);
                setShowOutput(false);
            }
        }, 1000 + Math.random() * 800); // Shorter delay for demo
    }, [inputText, simulateTransformation]);

    // --- Input Actions ---
    const handleClearInput = () => {
        setInputText('');
        setOutputText('');
        setShowOutput(false);
        toast.info('Input cleared.');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Added null check for event.target
        const file = event.target?.files?.[0]; 
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Added null check for e.target
                if (e.target?.result) { 
                    setInputText(e.target.result as string);
                    toast.success(`File "${file.name}" loaded.`);
                    setShowOutput(false); // Hide old output
                } else {
                     toast.error(`Error reading file content from "${file.name}".`);
                }
            };
            reader.onerror = () => {
                 toast.error(`Error reading file "${file.name}".`);
            };
            reader.readAsText(file);
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDictate = () => toast.info('Dictation feature not implemented yet.');
    const handleTemplate = () => toast.info('Template feature not implemented yet.');

    // --- Output Actions ---
    const handleCopyOutput = () => {
        if (outputRef.current?.innerText && navigator.clipboard) {
            navigator.clipboard.writeText(outputRef.current.innerText)
                .then(() => toast.success('Output copied to clipboard.'))
                .catch(err => toast.error('Failed to copy output.'));
        } else {
            toast.info('Nothing to copy.');
        }
    };

    const handleDownloadOutput = () => {
        if (!outputRef.current?.innerText) {
            toast.info('Nothing to download.');
            return;
        }
        try {
            const textContent = outputRef.current.innerText;
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = (outputTitle || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.href = url;
            link.download = `${filename}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('Downloading as text file.');
        } catch (err) {
            console.error("Download failed:", err);
            toast.error('Failed to initiate download.');
        }
    };

    const handleToggleEditOutput = () => {
        setIsOutputEditable(prev => {
            if (outputRef.current) {
                outputRef.current.contentEditable = String(!prev);
                if (!prev) {
                    outputRef.current.focus();
                    toast.info('Output editing enabled.');
                } else {
                    toast.info('Output editing disabled.');
                    // Optionally save changes here if needed
                    setOutputText(outputRef.current.innerHTML); // Update state with edited HTML
                }
            }
            return !prev;
        });
    };

    // Scroll to output when it appears
    useEffect(() => {
        if (showOutput) {
            outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showOutput]);

    // Removed PublicLayout wrapper and outer container div
    return (
        <> 
            {/* Use grid for layout, single column on small, two on large */}
            {/* Removed fixed height calculation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 

                {/* Input Panel */}
                    <div className="panel flex flex-col bg-white rounded-xl shadow-md p-6">
                        <div className="panel-header flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                            <h2 className="panel-title text-xl font-semibold">Input Note</h2>
                            <Button variant="ghost" size="sm" onClick={handleClearInput} className="text-xs text-red-600 hover:bg-red-50">
                                <Trash2 size={14} className="mr-1.5" /> Clear
                            </Button>
                        </div>
                        <div className="textarea-container flex-grow flex flex-col">
                            <Textarea
                                id="documentInput"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste or type your medical text here..."
                                className="flex-grow resize-none text-base p-4 border rounded-lg min-h-[300px]"
                            />
                        </div>
                        <div className="input-actions flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md" style={{ display: 'none' }} />
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} className="mr-2" /> Upload File
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDictate}>
                                <Mic size={16} className="mr-2" /> Dictate
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleTemplate}>
                                <ClipboardList size={16} className="mr-2" /> Use Template
                            </Button>
                        </div>
                    </div>

                    {/* Actions & Output Panel */}
                    <div className="panel flex flex-col bg-white rounded-xl shadow-md p-6 overflow-y-auto">
                        <div className="panel-header flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                            <h2 className="panel-title text-xl font-semibold">Actions & Output</h2>
                        </div>

                        {/* Action Search */}
                        <div className="relative mb-5">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                id="actionSearchInput"
                                placeholder="Search actions (e.g., 'summarize', 'SOAP')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 text-base"
                            />
                        </div>

                        {/* Actions Grid */}
                        <div className="actions-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {filteredActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleActionClick(action)}
                                    className="action-card text-left bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary flex flex-col min-h-[110px]"
                                >
                                    <div className="action-card-header flex items-center gap-3 mb-2">
                                        <div className="action-icon w-9 h-9 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                                            <action.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                        </div>
                                        <h4 className="text-base font-semibold text-gray-900">{action.name}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 flex-grow">{action.description}</p>
                                </button>
                            ))}
                             {/* Consider adding a custom action card if needed */}
                        </div>

                        {/* Output Section - Conditionally shown */}
                        {showOutput && (
                            <div className="output-section border-t border-gray-200 pt-6 mt-6 flex-grow flex flex-col min-h-[300px]">
                                <div className="output-header flex justify-between items-center mb-3">
                                    <h3 className="output-title text-lg font-semibold">{outputTitle}</h3>
                                    <div className="output-actions flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCopyOutput}>
                                            <Copy size={14} className="mr-1.5" /> Copy
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadOutput}>
                                            <Download size={14} className="mr-1.5" /> Download
                                        </Button>
                                        <Button variant={isOutputEditable ? "secondary" : "outline"} size="sm" onClick={handleToggleEditOutput}>
                                            <Edit size={14} className="mr-1.5" /> {isOutputEditable ? 'Save Edit' : 'Edit'}
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    ref={outputRef}
                                    id="documentOutput"
                                    contentEditable={isOutputEditable}
                                    dangerouslySetInnerHTML={{ __html: outputText }} // Render simulated HTML
                                    className={`border border-gray-200 rounded-lg p-4 bg-white flex-grow overflow-y-auto text-base leading-relaxed min-h-[200px] ${isOutputEditable ? 'ring-2 ring-primary focus:outline-none' : ''}`}
                                >
                                    {/* Content is set via dangerouslySetInnerHTML */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
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

export default QuickNotes;
