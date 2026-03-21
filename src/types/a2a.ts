/**
 * A2A (Avatar-to-Avatar) 相关类型定义
 */

import type { KnowledgeModule } from "./knowledge";

export type A2ARelationStatus = "active" | "blocked";

export type A2ASenderType = "user" | "agent";

export interface A2ARelationAvatar {
  id: string;
  name: string;
  permissions: KnowledgeModule[];
  presetId: string | null;
}

export interface A2ACounterpartUser {
  id: string;
  nickname: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface A2ARelation {
  id: string;
  status: A2ARelationStatus;
  selfAvatar: A2ARelationAvatar;
  counterpartAvatar: A2ARelationAvatar;
  counterpartUser: A2ACounterpartUser;
  latestMessagePreview: string | null;
  latestMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateA2ARelationRequest {
  shareCode: string;
  peerAvatarId: string;
}

export interface UpdateA2ARelationRequest {
  status?: A2ARelationStatus;
}

export interface A2ARelationListResponse {
  relations: A2ARelation[];
  total: number;
}

export interface A2AMessage {
  id: string;
  relationId: string;
  senderId: string;
  senderType: A2ASenderType;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface SendA2AMessageRequest {
  content: string;
  senderType?: A2ASenderType;
}

export interface A2AMessageListResponse {
  messages: A2AMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface SwitchSenderTypeRequest {
  senderType: A2ASenderType;
}

export interface CurrentSenderResponse {
  currentSenderType: A2ASenderType;
  relation: A2ARelation;
}

export interface ShareCodePreview {
  valid: boolean;
  ownerUser: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  } | null;
  ownerAvatar: {
    id: string;
    name: string;
    permissions: KnowledgeModule[];
    presetId: string | null;
  } | null;
}

export interface ValidateShareCodeResponse extends ShareCodePreview {}

export interface LegacyA2ARelation {
  id: string;
  status?: A2ARelationStatus;
  selfAvatar?: Partial<A2ARelationAvatar> | null;
  counterpartAvatar?: Partial<A2ARelationAvatar> | null;
  counterpartUser?: Partial<A2ACounterpartUser> | null;
  ownerAvatar?: Partial<A2ARelationAvatar> | null;
  peerAvatar?: Partial<A2ARelationAvatar> | null;
  ownerUser?: Partial<A2ACounterpartUser> | null;
  peerUser?: Partial<A2ACounterpartUser> | null;
  peerId?: string;
  peerName?: string;
  peerEmail?: string;
  permissions?: KnowledgeModule[];
  latestMessagePreview?: string | null;
  latestMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
