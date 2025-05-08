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
  // 'claude-3-opus-20240229': 'claude-3-opus-20240229',
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
    // { value: "claude-3-opus-20240229", label: "Claude 3 Opus", default: false},
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
      "id": "1",
      "type": "node",
      "position": {
        "x": 145.7474048442907,
        "y": -179.85813148788935
      },
      "data": {
        "label": "Welcome",
        "message": "Hello! How can I help you today?",
        "question": "What would you like to do?",
        "options": [
          "Get Support",
          "Learn More",
          "Provide Feedback"
        ],
        "id": "1",
        "position": {
          "x": 145.7474048442907,
          "y": -179.85813148788935
        }
      },
      "width": 256,
      "height": 394,
      "selected": false,
      "positionAbsolute": {
        "x": 145.7474048442907,
        "y": -179.85813148788935
      },
      "dragging": false
    },
    {
      "id": "2",
      "type": "node",
      "position": {
        "x": -167.3497444177745,
        "y": 262.02049386656955
      },
      "data": {
        "label": "Support",
        "message": "Our support team is available 24/7. What issue are you experiencing?",
        "id": "2",
        "position": {
          "x": -167.3497444177745,
          "y": 262.02049386656955
        }
      },
      "width": 256,
      "height": 242,
      "selected": true,
      "positionAbsolute": {
        "x": -167.3497444177745,
        "y": 262.02049386656955
      },
      "dragging": false
    },
    {
      "id": "3",
      "type": "node",
      "position": {
        "x": 140.54183508867038,
        "y": 252.38292898741372
      },
      "data": {
        "label": "Learn More",
        "message": "We offer a variety of products and services. What would you like to learn more about?",
        "id": "3",
        "position": {
          "x": 140.54183508867038,
          "y": 252.38292898741372
        }
      },
      "width": 256,
      "height": 242,
      "selected": false,
      "positionAbsolute": {
        "x": 140.54183508867038,
        "y": 252.38292898741372
      },
      "dragging": false
    },
    {
      "id": "4",
      "type": "node",
      "position": {
        "x": 438.91429498190985,
        "y": 256.15109507737907
      },
      "data": {
        "label": "Feedback",
        "message": "We appreciate your feedback! What would you like to share with us?",
        "id": "4",
        "position": {
          "x": 438.91429498190985,
          "y": 256.15109507737907
        }
      },
      "width": 256,
      "height": 242,
      "selected": false,
      "positionAbsolute": {
        "x": 438.91429498190985,
        "y": 256.15109507737907
      },
      "dragging": false
    }
  ],
  edges: [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "sourceHandle": "0"
    },
    {
      "id": "e1-3",
      "source": "1",
      "target": "3",
      "sourceHandle": "1"
    },
    {
      "id": "e1-4",
      "source": "1",
      "target": "4",
      "sourceHandle": "2"
    }
  ],
}

// Supported languages for selection
export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' }
];

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  KRW: '₩',
  BRL: 'R$',
  ZAR: 'R',
  SAR: '﷼',
};