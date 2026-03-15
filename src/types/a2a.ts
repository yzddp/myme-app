/**
 * A2A (Avatar-to-Avatar) 相关类型定义
 * 对应后端 A2ARelation 和 A2AMessage 实体
 */

import { KnowledgeModule } from './knowledge';

// A2A 关系状态
export type A2ARelationStatus = 'active' | 'blocked';

// A2A 消息发送者类型
export type A2ASenderType = 'user' | 'agent';

// A2A 关系实体
export interface A2ARelation {
  id: string;
  ownerId: string;
  peerId: string;
  peerName: string;
  peerEmail: string;
  permissions: KnowledgeModule[];
  status: A2ARelationStatus;
  createdAt: string;
  updatedAt: string;
}

// 创建 A2A 关系请求
export interface CreateA2ARelationRequest {
  shareCode: string;
  permissions: KnowledgeModule[];
}

// 更新 A2A 关系请求
export interface UpdateA2ARelationRequest {
  permissions?: KnowledgeModule[];
  status?: A2ARelationStatus;
}

// A2A 关系列表响应
export interface A2ARelationListResponse {
  relations: A2ARelation[];
  total: number;
}

// A2A 消息实体
export interface A2AMessage {
  id: string;
  relationId: string;
  senderId: string;
  senderType: A2ASenderType;
  senderName: string;
  content: string;
  createdAt: string;
}

// 发送 A2A 消息请求
export interface SendA2AMessageRequest {
  content: string;
  senderType?: A2ASenderType;
}

// A2A 消息列表响应
export interface A2AMessageListResponse {
  messages: A2AMessage[];
  total: number;
  page: number;
  limit: number;
}

// 切换发送者类型请求
export interface SwitchSenderTypeRequest {
  senderType: A2ASenderType;
}

// 当前发送者类型响应
export interface CurrentSenderResponse {
  currentSenderType: A2ASenderType;
  relation: A2ARelation;
}

// 验证分享码响应
export interface ValidateShareCodeResponse {
  valid: boolean;
  peerName?: string;
  peerEmail?: string;
  avatarId?: string;
}
