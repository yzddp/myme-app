/**
 * MyMe App - Avatar Service
 * 分身服务 - 处理分身CRUD和对话功能
 */

import { apiService } from "./api";
import type {
  Avatar,
  AvatarPresetCategory,
  AvatarPresetListResponse,
  AvatarScenario,
  AvatarStatus,
  CreateAvatarRequest,
  UpdateAvatarRequest,
  AvatarListResponse,
  AvatarChatRequest,
  AvatarChatResponse,
  ShareCodeResponse,
} from "../types/avatar";
import { KnowledgeModule } from "../types/knowledge";

// API路径
const AVATAR_ENDPOINTS = {
  base: "/avatars",
  chat: "/chat",
  shareCode: "/share-code",
  presets: "/presets",
};

/**
 * 分身服务
 */
export const avatarService = {
  /**
   * 获取用户分身列表
   * @returns 分身列表
   */
  async getAvatars(): Promise<AvatarListResponse> {
    const response = await apiService.get<
      AvatarListResponse & { items?: Avatar[] }
    >(
      AVATAR_ENDPOINTS.base,
    );

    const avatars = response.avatars ?? response.items ?? [];

    return {
      avatars,
      total: response.total ?? avatars.length,
    };
  },

  async getPresets(): Promise<AvatarPresetCategory[]> {
    const response = await apiService.get<
      | AvatarPresetListResponse
      | AvatarPresetCategory[]
      | { avatars?: AvatarPresetCategory[] }
    >(`${AVATAR_ENDPOINTS.base}${AVATAR_ENDPOINTS.presets}`);

    console.log("[avatarService.getPresets] raw response:", response);

    if (Array.isArray(response)) {
      console.log(
        "[avatarService.getPresets] normalized from array, count:",
        response.length,
      );
      return response;
    }

    const avatarWrapped = response as { avatars?: AvatarPresetCategory[] };
    if (Array.isArray(avatarWrapped.avatars)) {
      console.log(
        "[avatarService.getPresets] normalized from avatars wrapper, count:",
        avatarWrapped.avatars.length,
      );
      return avatarWrapped.avatars;
    }

    const categoryWrapped = response as AvatarPresetListResponse;
    const categories = categoryWrapped.categories ?? [];
    console.log(
      "[avatarService.getPresets] normalized from categories wrapper, count:",
      categories.length,
    );
    return categories;
  },

  /**
   * 获取单个分身详情
   * @param id 分身ID
   * @returns 分身详情
   */
  async getAvatar(id: string): Promise<Avatar> {
    return apiService.get<Avatar>(`${AVATAR_ENDPOINTS.base}/${id}`);
  },

  /**
   * 创建分身
   * @param data 分身数据
   * @returns 创建的分身
   */
  async create(data: CreateAvatarRequest): Promise<Avatar> {
    return apiService.post<Avatar>(AVATAR_ENDPOINTS.base, data);
  },

  /**
   * 更新分身
   * @param id 分身ID
   * @param data 更新数据
   * @returns 更新后的分身
   */
  async update(id: string, data: UpdateAvatarRequest): Promise<Avatar> {
    return apiService.put<Avatar>(`${AVATAR_ENDPOINTS.base}/${id}`, data);
  },

  /**
   * 删除分身（软删除）
   * @param id 分身ID
   */
  async delete(id: string): Promise<void> {
    return apiService.delete(`${AVATAR_ENDPOINTS.base}/${id}`);
  },

  /**
   * 分身对话
   * @param id 分身ID
   * @param message 消息内容
   * @returns AI回复
   */
  async chat(id: string, message: string): Promise<AvatarChatResponse> {
    const request: AvatarChatRequest = { message };
    return apiService.post<AvatarChatResponse>(
      `${AVATAR_ENDPOINTS.base}/${id}${AVATAR_ENDPOINTS.chat}`,
      request,
    );
  },

  /**
   * 获取分身分享码
   * @param id 分身ID
   * @returns 分享码
   */
  async getShareCode(id: string): Promise<ShareCodeResponse> {
    return apiService.get<ShareCodeResponse>(
      `${AVATAR_ENDPOINTS.base}/${id}${AVATAR_ENDPOINTS.shareCode}`,
    );
  },

  /**
   * 更新分身权限
   * @param id 分身ID
   * @param permissions 新的权限列表
   * @returns 更新后的分身
   */
  async updatePermissions(
    id: string,
    permissions: KnowledgeModule[],
  ): Promise<Avatar> {
    return this.update(id, { permissions });
  },

  /**
   * 更新分身状态
   * @param id 分身ID
   * @param status 新状态
   * @returns 更新后的分身
   */
  async updateStatus(id: string, status: AvatarStatus): Promise<Avatar> {
    return this.update(id, { status });
  },
};

// 导出默认对象
export default avatarService;
