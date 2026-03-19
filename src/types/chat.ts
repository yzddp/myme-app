/**
 * 对话相关类型定义
 * 对应后端 Session 和 Message 实体
 */

// 会话类型
export type SessionType = 'agent' | 'avatar' | 'human';

// 会话状态
export type SessionStatus = 'active' | 'deleted' | 'inactive';

// 发送者类型
export type MessageSender = 'user' | 'agent' | 'avatar';

// 会话实体
export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  title: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

// 消息实体
export interface Message {
  id: string;
  sessionId: string;
  sender: MessageSender;
  content: string;
  tokensUsed: number;
  createdAt: string;
}

// 创建会话请求
export interface CreateSessionRequest {
  type?: SessionType;
  title?: string;
  agentType?: string;  // 指定系统Agent类型，如 "me_agent"
}

// 发送消息请求
export interface SendMessageRequest {
  sessionId?: string;
  content: string;
}

// 发送消息响应
export interface SendMessageResponse {
  sessionId: string;
  agentReply: string;
  tokensUsed: number;
  suggestedTopics?: string[];
  extractedData?: Array<{
    module: string;
    content: string;
    confidence: number;
  }>;
}

// 会话列表响应
export interface SessionListResponse {
  sessions: Session[];
  total: number;
}

// 消息列表响应
export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

// 会话查询参数
export interface SessionQueryParams {
  type?: SessionType;
  status?: SessionStatus;
  page?: number;
  limit?: number;
}
