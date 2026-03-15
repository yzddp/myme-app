/**
 * MyMe App - useChat Hook
 * 对话相关功能Hook
 */

import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { SendMessageResponse } from '../types/chat';

/**
 * 对话Hook
 * 提供发送消息、加载会话等功能
 */
export const useChat = () => {
  // 获取store状态
  const { 
    currentSession,
    messages,
    sessions,
    isLoading,
    isSending,
    error,
    hasMoreMessages,
    currentPage,
    loadSessions,
    loadSession,
    getOrCreateSession,
    sendMessage: storeSendMessage,
    loadMoreMessages,
    clearCurrentSession,
    deleteSession,
    clearError,
  } = useChatStore();

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async (content: string): Promise<SendMessageResponse | null> => {
    if (!content.trim()) {
      return null;
    }
    return storeSendMessage(content);
  }, [storeSendMessage]);

  /**
   * 开始新对话
   */
  const startNewChat = useCallback(async () => {
    clearCurrentSession();
    try {
      const session = await getOrCreateSession('agent');
      return session;
    } catch (error) {
      console.error('Start new chat failed:', error);
      return null;
    }
  }, [clearCurrentSession, getOrCreateSession]);

  /**
   * 加载指定会话
   */
  const loadChatSession = useCallback(async (sessionId: string) => {
    await loadSession(sessionId);
  }, [loadSession]);

  /**
   * 加载所有会话
   */
  const loadAllSessions = useCallback(async () => {
    await loadSessions();
  }, [loadSessions]);

  /**
   * 删除会话
   */
  const removeSession = useCallback(async (sessionId: string) => {
    return deleteSession(sessionId);
  }, [deleteSession]);

  /**
   * 加载更多历史消息
   */
  const loadMore = useCallback(async () => {
    await loadMoreMessages();
  }, [loadMoreMessages]);

  /**
   * 清空当前会话
   */
  const clearChat = useCallback(() => {
    clearCurrentSession();
  }, [clearCurrentSession]);

  return {
    // State
    currentSession,
    messages,
    sessions,
    isLoading,
    isSending,
    error,
    hasMoreMessages,
    currentPage,
    
    // Actions
    sendMessage,
    startNewChat,
    loadChatSession,
    loadAllSessions,
    removeSession,
    loadMore,
    clearChat,
    clearError,
  };
};

export default useChat;
