import { api } from './apiClient';
import { AIMessage, SocraticIntent } from '../types/ai';

export interface BackendChatResponse {
  id: number;
  exercise_id?: number | null;
  role: string;
  content: string;
  intent?: string | null;
  created_at: string;
}

export interface SendMessagePayload {
  exerciseId?: number;
  message: string;
  intent?: SocraticIntent;
  currentCode?: string;
  terminalError?: string;
  language?: string;
}

const VALID_SOCRATIC_INTENTS: SocraticIntent[] = [
  'explain_error',
  'hint_next_step',
  'analyze_complexity',
  'suggest_test_cases',
  'free_chat',
  'greeting',
];

function normalizeIntent(val?: string | null, fallback: SocraticIntent = 'free_chat'): SocraticIntent {
  if (val && VALID_SOCRATIC_INTENTS.includes(val as SocraticIntent)) {
    return val as SocraticIntent;
  }
  return fallback;
}

/**
 * Gửi tin nhắn hỏi AI Mentor qua Backend (/ai/chat)
 */
export async function sendAIMessage(payload: SendMessagePayload): Promise<AIMessage> {
  const data = await api.post<BackendChatResponse>('/ai/chat', {
    exercise_id: payload.exerciseId,
    role: 'user',
    content: payload.message,
    intent: payload.intent || 'free_chat',
    current_code: payload.currentCode,
    terminal_error: payload.terminalError,
    language: payload.language || 'vie',
  });

  return {
    id: `be-${data.id}`,
    role: (data.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: data.content,
    timestamp: new Date(data.created_at).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    intent: normalizeIntent(data.intent, payload.intent || 'free_chat'),
  };
}

/**
 * Lấy lịch sử hội thoại của một bài tập (/ai/history/{exercise_id})
 */
export async function fetchAIConversationHistory(
  exerciseId: number
): Promise<AIMessage[]> {
  try {
    const list = await api.get<BackendChatResponse[]>(`/ai/history/${exerciseId}`);
    return list.map((msg) => ({
      id: `be-${msg.id}`,
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      intent: normalizeIntent(msg.intent, 'free_chat'),
    }));
  } catch {
    return [];
  }
}

export { QUICK_PROMPTS } from './mockAIService';
