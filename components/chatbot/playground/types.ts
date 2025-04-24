export interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  reasonal_content?: string;
}

export interface ChatbotSettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  language?: string;
}

export interface Chatbot {
  name: string;
  id: string;
  settings?: ChatbotSettings;
}

export interface PlaygroundProps {
  chatbot: Chatbot;
  embed?: boolean;
  mocking?: boolean;
  team?: any;
  standalone?: boolean;
  mockingData?: Object;
  isMockingDataValid?: boolean;
}

export interface ChatConfig {
  chatWidth: number;
  theme: string;
  roundedHeaderCorners: boolean;
  roundedChatCorners: boolean;
  userMessageColor: string;
  displayName: string;
  profilePictureUrl?: string;
  chatIconUrl?: string;
  initialMessage: string;
  messagePlaceholder: string;
  suggestedMessages?: string;
  footerText?: string;
  syncColors: boolean;
  bubbleAlignment: string;
  chatBackgroundUrl?: string;
  chatBackgroundOpacity?: number;
  conversationId?: string;
}

export interface ChatbotLeadSettings {
  enable: string;
  delay?: number;
  title?: string;
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  customQuestions?: string[];
}

export interface ChatContainerProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  config: ChatConfig;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentNodeId: React.Dispatch<React.SetStateAction<Number>>;
  input: string;
  chatbotId: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRefresh: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  aiSettings: any;
  embed?: boolean;
  mocking?: boolean;
  setConfig: React.Dispatch<React.SetStateAction<ChatConfig>>;
  leadSetting?: ChatbotLeadSettings;
  conversationId?: string;
  currentNodeId?: Number;
  qFlowAIEnabled: boolean;
  standalone?: boolean;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  availableSlots: Record<string, { time: string }[]>;
  handleSendMessage: (message: string) => Promise<void>;
  meetingUrl?: string;
}
