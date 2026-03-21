/**
 * MyMe App - Chat Store
 * 对话状态管理
 */

import { create } from 'zustand';
import chatService from '../services/chatService';
import { Session, Message, SendMessageResponse, CreateSessionRequest } from '../types/chat';

// 对话状态接口
interface ChatState {
  // State
  currentSession: Session | null;
  messages: Message[];
  sessions: Session[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  currentPage: number;

  // Actions
  loadSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  getOrCreateSession: (type?: 'agent' | 'avatar' | 'human') => Promise<Session>;
  sendMessage: (content: string) => Promise<SendMessageResponse | null>;
  loadMoreMessages: () => Promise<void>;
  clearCurrentSession: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
}

// 创建对话状态管理
export const useChatStore = create<ChatState>((set, get) => ({
  // Initial State
  currentSession: null,
  messages: [],
  sessions: [],
  isLoading: false,
  isSending: false,
  error: null,
  hasMoreMessages: true,
  currentPage: 1,

  // 加载会话列表
  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getSessions();
      set({ 
        sessions: response.sessions || [], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载会话列表失败', 
        isLoading: false 
      });
    }
  },

  // 加载指定会话
  loadSession: async (sessionId: string) => {
    set({ isLoading: true, error: null, currentPage: 1 });
    try {
      const [session, messagesResponse] = await Promise.all([
        chatService.getSession(sessionId),
        chatService.getMessages(sessionId),
      ]);
      
      set({ 
        currentSession: session,
        messages: messagesResponse.messages || [],
        hasMoreMessages: messagesResponse.messages?.length === 20,
        currentPage: 1,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载会话失败', 
        isLoading: false 
      });
    }
  },

  // 获取或创建会话
  getOrCreateSession: async (type: 'agent' | 'avatar' | 'human' = 'agent') => {
    set({ isLoading: true, error: null });
    try {
      const request: CreateSessionRequest = { type };
      const session = await chatService.getOrCreateSession(request);
      set({ 
        currentSession: session,
        isLoading: false 
      });
      return session;
    } catch (error: any) {
      set({ 
        error: error.message || '创建会话失败', 
        isLoading: false 
      });
      throw error;
    }
  },

  // 发送消息
  sendMessage: async (content: string) => {
    const { currentSession } = get();
    
    // 如果没有当前会话，先创建一个
    let session = currentSession;
    if (!session) {
      try {
        session = await get().getOrCreateSession('agent');
      } catch (error) {
        set({ error: '请先创建会话', isSending: false });
        return null;
      }
    }

    set({ isSending: true, error: null });
    try {
      const response = await chatService.sendMessage({
        sessionId: session!.id,
        content
      });
      
      // 更新消息列表
      const currentMessages = get().messages;
      
      const userMessage: Message = {
        id: Date.now().toString() + '_user',
        sessionId: currentSession?.id || response.sessionId,
        sender: 'user',
        content,
        tokensUsed: 0,
        createdAt: new Date().toISOString()
      };
      
      const agentMessage: Message = {
        id: Date.now().toString() + '_agent',
        sessionId: response.sessionId,
        sender: 'agent',
        content: response.agentReply,
        tokensUsed: response.tokensUsed,
        createdAt: new Date().toISOString()
      };
      
      set({ 
        messages: [...currentMessages, userMessage, agentMessage],
        isSending: false 
      });
      
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || '发送消息失败', 
        isSending: false 
      });
      return null;
    }
  },

  // 加载更多历史消息
  loadMoreMessages: async () => {
    const { currentSession, currentPage, hasMoreMessages, isLoading } = get();
    
    if (!currentSession || !hasMoreMessages || isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const response = await chatService.getMessages(currentSession.id);
      
      const currentMessages = get().messages;
      set({ 
        messages: [...response.messages, ...currentMessages],
        hasMoreMessages: response.messages?.length === 20,
        currentPage: nextPage,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载更多消息失败', 
        isLoading: false 
      });
    }
  },

  // 清空当前会话
  clearCurrentSession: () => {
    set({ 
      currentSession: null, 
      messages: [], 
      currentPage: 1, 
      hasMoreMessages: true 
    });
  },

  // 删除会话
  deleteSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await chatService.deleteSession(sessionId);
      
      // 从列表中移除
      const { sessions, currentSession } = get();
      const newSessions = sessions.filter(s => s.id !== sessionId);
      
      set({ 
        sessions: newSessions,
        isLoading: false 
      });

      // 如果删除的是当前会话，清空
      if (currentSession?.id === sessionId) {
        set({ 
          currentSession: null, 
          messages: [] 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || '删除会话失败', 
        isLoading: false 
      });
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));

export default useChatStore;
