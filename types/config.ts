export type Theme =
  | "light"
  | "dark"
  | "cupcake"
  | "bumblebee"
  | "emerald"
  | "corporate"
  | "synthwave"
  | "retro"
  | "cyberpunk"
  | "valentine"
  | "halloween"
  | "garden"
  | "forest"
  | "aqua"
  | "lofi"
  | "pastel"
  | "fantasy"
  | "wireframe"
  | "black"
  | "luxury"
  | "dracula"
  | "";

export interface PLAN {
  isFeatured?: boolean;
  priceId: string;
  name: string;
  description?: string;
  price: number;
  priceAnchor?: number;
  features: {
    name: string;
  }[];
  credits: number;
  charactersLimit: number;
  teamMemberLimit: number;
  chatbotLimit: number;
  linksLimit: number;
}

export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  crisp: {
    id?: string;
    onlyShowOnRoutes?: string[];
  };
  stripe: {
    plans: {
      Free: PLAN,
      Standard: PLAN,
      Hobby: PLAN,
      Unlimited: PLAN,
    };
  };
  aws?: {
    bucket?: string;
    bucketUrl?: string;
    cdn?: string;
  };
  resend: {
    fromNoReply: string;
    fromAdmin: string;
    supportEmail?: string;
  };
  colors: {
    theme: Theme;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}

export const MODEL_MAPPING: { [key: string]: string } = {
  // OpenAI models
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'o1': 'o1',
  'o1-mini': 'o1-mini',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4.5-preview-2025-02-27': 'gpt-4.5-preview-2025-02-27',
  // Anthropic models (latest versions)
  'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022': 'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229': 'claude-3-opus-20240229',
  'claude-3-7-sonnet-20250219': 'claude-3-7-sonnet-20250219',
  // Gemini models
  'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
  'gemini-1.5-flash': 'gemini-1.5-flash',
  'gemini-1.5-flash-8b': 'gemini-1.5-flash-8b',
  'gemini-1.5-pro': 'gemini-1.5-pro',
  // Deepseek models
  'deepseek-chat': 'deepseek-chat',
  'deepseek-reasoner': 'deepseek-reasoner',
  // Grok models
  'grok-2': 'grok-2',
  'grok-2-latest': 'grok-2-latest',
  'grok-beta': 'grok-beta',
};

type ModelInfo = {
  value: string;
  label: string;
  default: boolean;
}

type AIModelProviders = {
  OpenAI: ModelInfo[];
  Anthropic: ModelInfo[];
  Gemini: ModelInfo[];
  Deepseek: ModelInfo[];
  Grok: ModelInfo[];
}

// Group models by provider with proper typing
export const AI_MODELS: AIModelProviders = {
  OpenAI: [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", default: false},
    { value: "gpt-4o", label: "GPT-4o (Flagship)", default: true},
    { value: "gpt-4o-mini", label: "GPT-4o Mini", default: false},
    { value: "o1", label: "O1 (Advanced Reasoning)", default: false},
    { value: "o1-mini", label: "O1 Mini", default: false},
    { value: "gpt-4.5-preview-2025-02-27", label: "GPT-4.5 (Preview)", default: false},
  ],
  Anthropic: [
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus", default: false},
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", default: false},
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku", default: false},
    { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet", default: true},
  ],
  Gemini: [
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", default: true},
    { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash", default: false},
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", default: false},
    { value: "gemini-1.5-flash-8b", label: "Gemini 1.5 Flash-8B", default: false},
  ],
  Deepseek: [
    { value: "deepseek-chat", label: "Deepseek Chat", default: true},
    { value: "deepseek-reasoner", label: "Deepseek Reasoner", default: false},
  ],
  Grok: [
    { value: "grok-2", label: "Grok 2", default: true},
    { value: "grok-2-latest", label: "Grok 2 latest", default: false},
    { value: "grok-beta", label: "Grok Beta", default: false},
  ]
};

export const sampleFlow = {
  nodes: [
    {
      id: "1",
      type: "trigger",
      data: {
        label: "Start Conversation",
        question: "Hello! I'm your assistant bot. How can I help you today?",
        options: ["I need help with my order", "I have a technical issue", "I want to provide feedback"],
      },
    },
    {
      id: "2",
      type: "option",
      data: {
        label: "Order Help",
        condition: "User needs help with order",
        question: "What kind of order issue are you experiencing?",
        options: ["Missing item", "Delayed delivery", "Wrong item received"],
      },
    },
    {
      id: "3",
      type: "option",
      data: {
        label: "Technical Issue",
        condition: "User has technical issue",
        question: "What device are you using?",
        options: ["Smartphone", "Computer", "Tablet"],
      },
    },
    {
      id: "4",
      type: "option",
      data: {
        label: "Feedback",
        condition: "User wants to provide feedback",
        question: "What type of feedback would you like to provide?",
        options: ["Product feedback", "Service feedback", "Website feedback"],
      },
    },
    {
      id: "5",
      type: "message",
      data: {
        label: "Missing Item Response",
        content:
          "I'm sorry to hear about your missing item. I'll help you resolve this issue. Could you please provide your order number?",
        nextQuestion: "While I look into this, can you confirm the item that's missing from your order?",
        options: ["Yes, it's [item name]", "Actually, multiple items are missing", "I don't remember what's missing"],
      },
    },
    {
      id: "6",
      type: "message",
      data: {
        label: "Delayed Delivery Response",
        content:
          "I understand your delivery is delayed. Let me check the status for you. Could you share your tracking number?",
        nextQuestion: "Has the tracking information been updated recently?",
        options: ["Yes, but it's not moving", "No, there are no updates", "I can't access the tracking"],
      },
    },
    {
      id: "7",
      type: "message",
      data: {
        label: "Wrong Item Response",
        content:
          "I apologize that you received the wrong item. We'll make this right. Could you tell me what item you received versus what you ordered?",
        nextQuestion: "Would you prefer a refund or a replacement for the correct item?",
        options: ["I want a refund", "I want the correct item", "I want both a refund and the correct item"],
      },
    },
    {
      id: "8",
      type: "message",
      data: {
        label: "Final Response",
        content:
          "Thank you for providing all the details. I've created a support ticket for your issue. A customer service representative will contact you within 24 hours. Your ticket number is #12345.",
        nextQuestion: "Is there anything else I can help you with today?",
        options: ["No, that's all", "Yes, I have another question"],
      },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2", sourceHandle: "a", targetHandle: "b", label: "Order Help" },
    { id: "e1-3", source: "1", target: "3", sourceHandle: "a", targetHandle: "b", label: "Technical Issue" },
    { id: "e1-4", source: "1", target: "4", sourceHandle: "a", targetHandle: "b", label: "Feedback" },
    { id: "e2-5", source: "2", target: "5", sourceHandle: "a", targetHandle: "b", label: "Missing Item" },
    { id: "e2-6", source: "2", target: "6", sourceHandle: "a", targetHandle: "b", label: "Delayed Delivery" },
    { id: "e2-7", source: "2", target: "7", sourceHandle: "a", targetHandle: "b", label: "Wrong Item" },
    { id: "e5-8", source: "5", target: "8", sourceHandle: "a", targetHandle: "b" },
    { id: "e6-8", source: "6", target: "8", sourceHandle: "a", targetHandle: "b" },
    { id: "e7-8", source: "7", target: "8", sourceHandle: "a", targetHandle: "b" },
  ],
}