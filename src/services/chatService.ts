/**
 * MyMe App - Chat Service
 * 对话服务 - 处理Agent对话功能
 */

import { apiService, AI_TIMEOUT } from './api';
import type {
  Session,
  SessionType,
  CreateSessionRequest,
  SendMessageRequest,
  SendMessageResponse,
  SessionListResponse,
  MessageListResponse,
  SessionQueryParams,
} from '../types/chat';

// API路径
const CHAT_ENDPOINTS = {
  sessions: '/agent/sessions',
  message: '/agent/message',
};

/**
 * 对话服务
 */
export const chatService = {
  /**
   * 获取或创建会话
   * @param request 创建会话参数
   * @returns 会话信息
   */
  async getOrCreateSession(request?: CreateSessionRequest): Promise<Session> {
    return apiService.post<Session>(CHAT_ENDPOINTS.sessions, request);
  },

  /**
   * 获取会话列表
   * @param params 查询参数
   * @returns 会话列表
   */
  async getSessions(params?: SessionQueryParams): Promise<SessionListResponse> {
    return apiService.get<SessionListResponse>(CHAT_ENDPOINTS.sessions, params);
  },

  /**
   * 获取单个会话详情（含消息列表）
   * @param sessionId 会话ID
   * @returns 会话详情
   */
  async getSession(sessionId: string): Promise<Session> {
    return apiService.get<Session>(`${CHAT_ENDPOINTS.sessions}/${sessionId}`);
  },

  /**
   * 发送消息
   * @param request 消息请求
   * @returns 响应消息
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const { sessionId } = request;
    // AI 对话超时设为 60 秒（默认 10 秒对 AI 生成太短）
    const config = { timeout: AI_TIMEOUT };
    if (sessionId) {
      return apiService.post<SendMessageResponse>(
        `${CHAT_ENDPOINTS.sessions}/${sessionId}/messages`,
        { content: request.content },
        config
      );
    }
    return apiService.post<SendMessageResponse>(CHAT_ENDPOINTS.message, request, config);
  },

  /**
   * 获取会话消息列表（通过会话详情接口）
   * @param sessionId 会话ID
   * @returns 消息列表
   */
  async getMessages(sessionId: string): Promise<MessageListResponse> {
    const session = await apiService.get<any>(`${CHAT_ENDPOINTS.sessions}/${sessionId}`);
    const messages = session.messages || [];
    return { messages, total: messages.length, page: 1, limit: messages.length };
  },

  /**
   * 删除会话
   * @param sessionId 会话ID
   */
  async deleteSession(sessionId: string): Promise<void> {
    return apiService.delete(`${CHAT_ENDPOINTS.sessions}/${sessionId}`);
  },

  /**
   * 创建新会话
   * @param type 会话类型
   * @param title 会话标题
   * @returns 新会话
   */
  async createSession(type?: SessionType, title?: string, agentType?: string): Promise<Session> {
    const request: CreateSessionRequest = { type, title, agentType };
    return apiService.post<Session>(CHAT_ENDPOINTS.sessions, request);
  },
};

// 导出默认对象
export default chatService;
