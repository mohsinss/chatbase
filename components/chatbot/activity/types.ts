export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  deleted?: boolean;
  from?: string;
}

export interface Lead {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Conversation {
  _id: string;
  chatbotId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  leadId?: Lead;
  platform?: string;
  metadata?: {
    from?: string,
    to?: string,
    to_name?: string,
    from_name?: string
    page_id?: string
    comment_id?: string
  };
}

export interface ChatbotData {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  icon?: string;
  conversations: Conversation[];
}
