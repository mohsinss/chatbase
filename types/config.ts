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