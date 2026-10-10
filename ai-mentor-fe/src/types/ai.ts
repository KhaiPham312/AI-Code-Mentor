export type AIMessageRole = 'user' | 'assistant' | 'system';

export type SocraticIntent = 
  | 'explain_error' 
  | 'hint_next_step' 
  | 'analyze_complexity' 
  | 'suggest_test_cases' 
  | 'free_chat'
  | 'greeting';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: string;
  intent?: SocraticIntent;
  relatedCode?: string;
  terminalError?: string;
  isStreaming?: boolean;
}

export interface QuickPrompt {
  id: SocraticIntent;
  title: string;
  desc: string;
  icon: string;
  badge?: string;
}
