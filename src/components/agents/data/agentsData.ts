import { 
  Heart, Brain, Microscope, Stethoscope, Eye, BarChart4, Pill, Activity,
  HeartPulse, BrainCircuit, SearchCheck, Wind, Droplet, ScanFace, ShieldAlert,
  HelpingHand, Bone, Users, MessageSquare, FileCheck, Scale, FlaskConical,
  ClipboardList, UserCheck, TestTubeDiagonal, FolderKanban, FileLock, SearchCode,
  ClipboardCheck, BookUser, Speech, PersonStanding, Recycle, Bot, Dna, HandHeart,
  GraduationCap, Briefcase, FileQuestion, ShieldCheck, FileSearch, UserCog
} from "lucide-react"; // Added many new icons
import { Agent } from "../types/agentTypes";

// Helper function to generate simple IDs
const generateId = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
};

// Helper function to split tasks into description and capabilities
const processTasks = (tasks: string): { description: string; capabilities: string[] } => {
    const sentences = tasks.split('. ').filter(s => s.trim() !== '');
    const description = sentences[0] || tasks; // Use first sentence or full text
    // Split by common delimiters like commas or 'and' within the first sentence for capabilities, or use all sentences
    let capabilities = sentences; 
    if (sentences.length === 1) {
        capabilities = description.split(/, | and /);
    }
    return { description: description + (description.endsWith('.') ? '' : '.'), capabilities: capabilities.map(c => c.trim().replace(/\.$/, '')) };
};

// Placeholder colors and icons
const defaultIcon = Bot;
const colors = [
    "red-500", "orange-500", "amber-500", "yellow-500", "lime-500", 
    "green-500", "emerald-500", "teal-500", "cyan-500", "sky-500", 
    "blue-500", "indigo-500", "violet-500", "purple-500", "fuchsia-500", 
    "pink-500", "rose-500"
];
let colorIndex = 0;
const getNextColor = () => colors[colorIndex++ % colors.length];

// Existing Agents
const existingAgents: Agent[] = [
  {
    id: "cardio", name: "CardioAssist", specialty: "Cardiology", 
    description: "Expert in cardiovascular conditions and treatments.", icon: Heart, color: "medical-red",
    capabilities: ["ECG analysis and interpretation", "Cardiovascular risk assessment", "Treatment recommendations for heart conditions", "Post-operative monitoring guidance"]
  },
  {
    id: "neuro", name: "NeuroLogic", specialty: "Neurology", 
    description: "Specialist in neurological disorders and brain function.", icon: Brain, color: "aida-600", // Keep existing color if specific
    capabilities: ["Neurological symptom analysis", "MRI and CT scan preliminary review", "Neurological treatment recommendations", "Stroke assessment protocols"]
  },
  {
    id: "path", name: "PathInsight", specialty: "Pathology", 
    description: "Analysis of lab results and diagnostic findings.", icon: Microscope, color: "medical-green",
    capabilities: ["Laboratory test analysis", "Pathology report interpretation", "Diagnostic testing recommendations", "Tissue sample preliminary assessment"]
  },
  {
    id: "gen", name: "GeneralMD", specialty: "General Medicine", 
    description: "Comprehensive primary care expertise.", icon: Stethoscope, color: "muted-foreground",
    capabilities: ["General health assessments", "Preventive care recommendations", "Common illness diagnosis assistance", "Patient education materials"]
  },
  {
    id: "opth", name: "OptiVision", specialty: "Ophthalmology", 
    description: "Expert in eye conditions and treatments.", icon: Eye, color: "medical-purple",
    capabilities: ["Vision test interpretation", "Eye disease assessment", "Treatment recommendations for eye conditions", "Post-operative care guidance"]
  },
  {
    id: "radiology", name: "RadAnalytics", specialty: "Radiology", 
    description: "Interpretation of medical imaging.", icon: BarChart4, color: "slate-700",
    capabilities: ["X-ray preliminary analysis", "CT scan review assistance", "MRI interpretation support", "Imaging protocol recommendations"]
  },
  {
    id: "pharma", name: "PharmExpert", specialty: "Pharmacology", 
    description: "Medication advice and drug interactions.", icon: Pill, color: "medical-yellow",
    capabilities: ["Drug interaction checking", "Medication regimen review", "Dosage adjustment recommendations", "Side effect management advice"]
  },
];

// New Agent Data (Parsed)
const newAgentData = [
  { name: "CardioInsight AI", specialty: "Cardiology", tasks: "Identifies cardiac abnormalities from ECGs, analyzes symptoms indicative of cardiovascular conditions.", icon: HeartPulse },
  { name: "NeuroSense AI", specialty: "Neurology", tasks: "Evaluates neurological symptoms, assists in identifying conditions such as stroke, epilepsy, and Parkinson's disease.", icon: BrainCircuit },
  { name: "OncoDetect AI", specialty: "Oncology", tasks: "Assists in early detection of various cancers, analyzes biopsy and imaging data.", icon: SearchCheck },
  { name: "PulmoAid AI", specialty: "Pulmonology", tasks: "Diagnoses respiratory diseases including COPD, asthma, and pneumonia based on patient symptoms and imaging.", icon: Wind },
  { name: "EndoCare AI", specialty: "Endocrinology", tasks: "Manages endocrine disorders like diabetes, thyroid dysfunction, and hormonal imbalances through symptom analysis and blood tests.", icon: Droplet },
  { name: "DermalView AI", specialty: "Dermatology", tasks: "Identifies skin conditions using image analysis, assists in diagnosing conditions like melanoma, psoriasis, and dermatitis.", icon: ScanFace },
  { name: "GastroCheck AI", specialty: "Gastroenterology", tasks: "Evaluates gastrointestinal symptoms and assists in diagnosing conditions like IBS, Crohn's disease, and GERD.", icon: Activity }, // Placeholder icon
  { name: "NephroTrack AI", specialty: "Nephrology", tasks: "Monitors kidney function, identifies renal diseases and abnormalities from lab tests and patient history.", icon: Activity }, // Placeholder icon
  { name: "PediaCare AI", specialty: "Pediatrics", tasks: "Specializes in pediatric diagnostics including growth disorders, childhood infections, and developmental concerns.", icon: HelpingHand },
  { name: "PsychAssist AI", specialty: "Psychiatry", tasks: "Assists in diagnosing mental health disorders like depression, anxiety, and bipolar disorder through behavioral analysis.", icon: MessageSquare },
  { name: "RheumaDetect AI", specialty: "Rheumatology", tasks: "Evaluates symptoms of autoimmune and inflammatory conditions, such as rheumatoid arthritis and lupus.", icon: Bone },
  { name: "ImmunoSense AI", specialty: "Immunology", tasks: "Detects immune system disorders and allergies, provides diagnostic insights based on immune response tests.", icon: ShieldAlert },
  { name: "OphthalmoInsight AI", specialty: "Ophthalmology", tasks: "Diagnoses eye conditions, including glaucoma, macular degeneration, and diabetic retinopathy through retinal scans.", icon: Eye }, // Reuse existing
  { name: "HemaGuard AI", specialty: "Hematology", tasks: "Assists in diagnosing blood disorders like anemia, leukemia, and clotting disorders through blood work analysis.", icon: TestTubeDiagonal },
  { name: "OrthoAssist AI", specialty: "Orthopedics", tasks: "Identifies orthopedic conditions including fractures, arthritis, and musculoskeletal disorders using imaging and physical examination data.", icon: Bone }, // Reuse existing
  { name: "UroCare AI", specialty: "Urology", tasks: "Diagnoses conditions such as urinary tract infections, prostate issues, and kidney stones.", icon: Activity }, // Placeholder icon
  { name: "GynecoAssist AI", specialty: "Gynecology", tasks: "Identifies reproductive health issues, assists in diagnosing conditions like PCOS and endometriosis.", icon: Users }, // Placeholder icon
  { name: "InfectioSense AI", specialty: "Infectious Diseases", tasks: "Diagnoses bacterial, viral, fungal, and parasitic infections using symptom analysis and laboratory results.", icon: FlaskConical },
  { name: "ENTDiagnose AI", specialty: "Otolaryngology (ENT)", tasks: "Evaluates and diagnoses conditions related to ear, nose, and throat, including sinus infections and hearing loss.", icon: Activity }, // Placeholder icon
  { name: "AllerGuard AI", specialty: "Allergy and Immunology", tasks: "Identifies allergens and allergic reactions, provides insights into effective treatment strategies.", icon: ShieldAlert }, // Reuse existing
  { name: "VascuSense AI", specialty: "Vascular Surgery", tasks: "Diagnoses conditions involving blood vessels such as varicose veins, aneurysms, and peripheral artery disease.", icon: Activity }, // Placeholder icon
  { name: "GenetiCare AI", specialty: "Genetics", tasks: "Provides genetic screening analysis, identifies hereditary conditions and genetic risk factors.", icon: Dna },
  { name: "PainManage AI", specialty: "Pain Management", tasks: "Evaluates chronic pain conditions, helps identify sources of pain, and suggests personalized treatment plans.", icon: HandHeart },
  { name: "SportsMed AI", specialty: "Sports Medicine", tasks: "Assists in diagnosis and management of sports-related injuries, from muscle strains to concussions.", icon: Activity }, // Placeholder icon
  { name: "RehabTrack AI", specialty: "Rehabilitation Medicine", tasks: "Monitors patient recovery post-injury or surgery, provides tailored rehabilitation plans.", icon: Recycle },
  { name: "IntervenCardio AI", specialty: "Interventional Cardiology", tasks: "Assists in interpreting cardiac catheterization data and managing post-procedural care.", icon: HeartPulse }, // Reuse existing
  { name: "PediaOnco AI", specialty: "Pediatric Oncology", tasks: "Supports diagnosis and treatment planning for childhood cancers using pediatric-specific data.", icon: HelpingHand }, // Reuse existing
  { name: "NeuroOnco AI", specialty: "Neuro-Oncology", tasks: "Analyzes brain scans and neurological symptoms to assist in diagnosing and managing brain tumors.", icon: BrainCircuit }, // Reuse existing
  { name: "ReproEndo AI", specialty: "Reproductive Endocrinology", tasks: "Assists in diagnosing and treating hormonal disorders related to fertility and reproductive health.", icon: Users }, // Reuse existing
  { name: "GeriatraCare AI", specialty: "Geriatric Medicine", tasks: "Focuses on age-related health concerns, including polypharmacy, cognitive decline, and chronic disease management.", icon: UserCheck },
  { name: "NutritionCare AI", specialty: "Nutrition", tasks: "Generates dietary plans, identifies nutritional deficiencies, and supports patient wellness goals.", icon: Activity }, // Placeholder icon
  { name: "SpeechTherapy AI", specialty: "Speech Therapy", tasks: "Assists in planning and tracking speech-language therapy for neurological and developmental cases.", icon: Speech },
  { name: "OccupationalTherapy AI", specialty: "Occupational Therapy", tasks: "Helps design rehabilitation routines for patients recovering from surgery, injury, or chronic conditions.", icon: PersonStanding },
  { name: "PharmaAdvisor AI", specialty: "Pharmacy", tasks: "Provides medication reviews, flags potential interactions, and ensures compliance with treatment regimens.", icon: Pill }, // Reuse existing
  { name: "SocialCare AI", specialty: "Social Work", tasks: "Assists patients with navigating healthcare systems, insurance, and accessing support resources.", icon: Briefcase },
  { name: "BillingCode AI", specialty: "Medical Billing and Coding", tasks: "Generates CPT and ICD codes from clinical documentation for accurate billing.", icon: FileQuestion },
  { name: "ConsentPrep AI", specialty: "Patient Consent Documentation", tasks: "Drafts patient consent forms tailored to procedures, risks, and compliance needs.", icon: ClipboardCheck },
  { name: "ReferralManager AI", specialty: "Referral Coordination", tasks: "Prepares referral letters, gathers relevant medical documents, and manages specialist scheduling.", icon: FolderKanban },
  { name: "LegalScreen AI", specialty: "Medical-Legal Compliance", tasks: "Reviews documentation for HIPAA compliance and potential legal risks.", icon: ShieldCheck },
  { name: "ClinicalTrialMatch AI", specialty: "Clinical Research", tasks: "Matches patients to active clinical trials based on diagnosis, history, and eligibility criteria.", icon: FileSearch }
];

// Map new data to Agent structure
const newAgents: Agent[] = newAgentData.map(agentInfo => {
    const { description, capabilities } = processTasks(agentInfo.tasks);
    return {
        id: generateId(agentInfo.name),
        name: agentInfo.name,
        specialty: agentInfo.specialty,
        description: description,
        icon: agentInfo.icon || defaultIcon,
        color: getNextColor(), // Assign rotating color
        capabilities: capabilities.slice(0, 4) // Limit capabilities for display
    };
});

// Combine existing and new agents
export const agents: Agent[] = [...existingAgents, ...newAgents];
