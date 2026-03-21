/**
 * 分身相关类型定义
 * 对应后端 Avatar 实体
 */

import { KnowledgeModule } from "./knowledge";

// 分身场景类型
export type AvatarScenario =
  | "interview"
  | "work"
  | "dating"
  | "consultation"
  | "company"
  | "psychological";

// 分身状态
export type AvatarStatus = "active" | "inactive" | "deleted";

// 分身实体
export interface Avatar {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  scenario: AvatarScenario | null;
  presetId: string | null;
  customPrompt: string | null;
  permissions: KnowledgeModule[];
  status: AvatarStatus;
  shareCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarPresetRole {
  id: string;
  name: string;
  systemPrompt: string;
  fullId: string;
}

export interface AvatarPresetCategory {
  id: string;
  name: string;
  roles: AvatarPresetRole[];
}

// 创建分身请求
export interface CreateAvatarRequest {
  name: string;
  description?: string;
  scenario?: AvatarScenario;
  presetId?: string;
  customPrompt?: string;
  permissions: KnowledgeModule[];
}

// 更新分身请求
export interface UpdateAvatarRequest {
  name?: string;
  description?: string;
  scenario?: AvatarScenario;
  presetId?: string;
  customPrompt?: string;
  permissions?: KnowledgeModule[];
  status?: AvatarStatus;
}

// 分身列表响应
export interface AvatarListResponse {
  avatars: Avatar[];
  total: number;
}

export interface AvatarPresetListResponse {
  categories: AvatarPresetCategory[];
}

// 分身对话请求
export interface AvatarChatRequest {
  message: string;
}

// 分身对话响应
export interface AvatarChatResponse {
  reply: string;
  avatar: Avatar;
}

// 生成分享码响应
export interface ShareCodeResponse {
  shareCode: string;
  expiresAt: string;
}

// 分身场景描述映射
export const AVATAR_SCENARIO_DESCRIPTIONS: Record<AvatarScenario, string> = {
  interview: "面试模拟 - 模拟面试场景，练习自我介绍和问答",
  work: "工作场景 - 职场沟通、汇报、谈判等场景模拟",
  dating: "约会场景 - 约会沟通、情感表达等场景模拟",
  consultation: "咨询场景 - 心理咨询、职业咨询等场景模拟",
  company: "公司场景 - 公司运营、管理、团队协作等场景模拟",
  psychological: "心理场景 - 心理疏导、情绪陪伴等场景模拟",
};
