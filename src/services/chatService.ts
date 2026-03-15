/**
 * MyMe App - Chat Service
 * 对话服务 - 处理Agent对话功能
 */

import { apiService } from './api';
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
  session: '/agent/session',
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
    return apiService.post<Session>(CHAT_ENDPOINTS.session, request);
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
   * 获取单个会话详情
   * @param sessionId 会话ID
   * @returns 会话详情
   */
  async getSession(sessionId: string): Promise<Session> {
    return apiService.get<Session>(`${CHAT_ENDPOINTS.session}/${sessionId}`);
  },

  /**
   * 发送消息
   * @param request 消息请求
   * @returns 响应消息
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return apiService.post<SendMessageResponse>(CHAT_ENDPOINTS.message, request);
  },

  /**
   * 获取会话消息列表
   * @param sessionId 会话ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 消息列表
   */
  async getMessages(
    sessionId: string,
    page?: number,
    limit?: number
  ): Promise<MessageListResponse> {
    return apiService.get<MessageListResponse>(
      `${CHAT_ENDPOINTS.sessions}/${sessionId}/messages`,
      { page, limit }
    );
  },

  /**
   * 删除会话
   * @param sessionId 会话ID
   */
  async deleteSession(sessionId: string): Promise<void> {
    return apiService.delete(`${CHAT_ENDPOINTS.session}/${sessionId}`);
  },

  /**
   * 创建新会话
   * @param type 会话类型
   * @param title 会话标题
   * @returns 新会话
   */
  async createSession(type?: SessionType, title?: string): Promise<Session> {
    const request: CreateSessionRequest = { type, title };
    return apiService.post<Session>(CHAT_ENDPOINTS.sessions, request);
  },
};

// 导出默认对象
export default chatService;
