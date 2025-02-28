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