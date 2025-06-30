import { create } from 'zustand';

// --- ENUMS & TYPES ---

export type AgentName = 
  | 'DocumentAgent' 
  | 'PropertyAgent' 
  | 'FormAgent' 
  | 'GenerationAgent' 
  | 'ComplianceAgent'
  | 'NavigationAgent'
  | 'GeneralAgent'
  | 'System' 
  | null;
export type InputMode = 'text' | 'voice';

// --- INTERFACES ---

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentName?: AgentName;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    processingTime?: number;
    actionRequired?: any; // For UI manipulation commands
  };
}

export interface PropertyFilters {
  minPrice: string;
  maxPrice: string;
  propertyTypes: string[];
  minBedrooms: number;
}

export interface AriaState {
  // Conversation State
  isOpen: boolean;
  messages: Message[];
  isThinking: boolean;
  currentAgent: AgentName;

  // Context Awareness
  currentContext: {
    page: string;
    propertyId?: string;
    documentId?: string;
    propertyData?: {
      address: string;
      price: number;
      mlsNumber: string;
    };
    activeWorkflow?: {
      type: 'document-creation' | 'property-search' | 'offer-negotiation';
      step: number;
      data: any;
    };
  };

  // Context & Page State
  searchValue: string;
  filters: PropertyFilters;

  // Voice State
  inputMode: InputMode;
  isListening: boolean;
  voiceTranscript: string;
}

export interface AriaActions {
  toggleAria: () => void;
  sendMessage: (content: string) => void;
  addMessage: (message: Message) => void;
  setThinking: (isThinking: boolean) => void;
  setCurrentAgent: (agent: AgentName) => void;
  setContext: (context: Partial<AriaState['currentContext']>) => void;
  startListening: () => void;
  stopListening: () => void;
  setInputMode: (mode: InputMode) => void;
  setSearchValue: (value: string) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  clearFilters: () => void;
  clearHistory: () => void;
}

export type AriaStore = AriaState & AriaActions;

// --- INITIAL STATE ---

const GREETING_MESSAGE: Message = {
    id: 'aria-greeting-initial',
    role: 'assistant',
    agentName: 'System',
    content: "I'm ARIA, your AI Real Estate Assistant. How can I help you today? You can ask me to find properties, create documents, or filter results.",
    timestamp: new Date(),
};

const initialFilters: PropertyFilters = {
  minPrice: '',
  maxPrice: '',
  propertyTypes: [],
  minBedrooms: 0,
};

const initialState: AriaState = {
  isOpen: false,
  messages: [GREETING_MESSAGE],
  isThinking: false,
  currentAgent: null,
  currentContext: {
    page: 'unknown',
  },
  inputMode: 'text',
  isListening: false,
  voiceTranscript: '',
  searchValue: '',
  filters: initialFilters,
};

// --- STORE CREATION ---

export const useAriaStore = create<AriaStore>((set, get) => ({
  ...initialState,

  toggleAria: () => set(state => ({ isOpen: !state.isOpen })),
  
  setThinking: (isThinking) => set({ isThinking }),

  setCurrentAgent: (agent) => set({ currentAgent: agent }),

  setInputMode: (mode) => set({ inputMode: mode }),

  setContext: (context) => set(state => ({
    currentContext: { ...state.currentContext, ...context }
  })),
  
  addMessage: (message) => set(state => ({
    messages: [...state.messages, message]
  })),

  sendMessage: (content) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    get().addMessage(newMessage);

    // TODO: This will be replaced by a call to the multi-agent simulation API
    set({ isThinking: true, currentAgent: 'DocumentAgent' });
    setTimeout(() => {
      const response: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Mock response to "${content}"`,
        timestamp: new Date(),
        agentName: 'DocumentAgent',
      };
      get().addMessage(response);
      set({ isThinking: false, currentAgent: null });
    }, 1500);
  },

  startListening: () => {
    set({ isListening: true, inputMode: 'voice' });
    // Web Speech API logic will be added in Task 5
  },

  stopListening: () => {
    set({ isListening: false });
    // Web Speech API logic will be added in Task 5
  },

  setSearchValue: (value) => set({ searchValue: value }),

  setFilters: (newFilters) => set(state => ({
    filters: { ...state.filters, ...newFilters }
  })),

  clearFilters: () => set({
    filters: initialFilters,
    searchValue: '',
  }),

  clearHistory: () => set({
    messages: [GREETING_MESSAGE],
    isThinking: false,
    currentAgent: null,
  }),
})); 