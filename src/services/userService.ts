/**
 * MyMe App - User Service
 * 用户服务 - 处理用户资料相关操作
 */

import { apiService } from "./api";
import type { User } from "../store/authStore";

const USER_ENDPOINTS = {
  base: "/user",
  profile: "/user/profile",
  avatar: "/user/avatar",
  notifications: "/user/notifications",
  data: "/user/data",
  feedback: "/feedback",
};

export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  theme?: "warm" | "cool" | "dark";
  locale?: string;
}

export interface NotificationSettings {
  diaryReminder: boolean;
  aiInsight: boolean;
  marketing: boolean;
  email: boolean;
}

export interface UserData {
  totalDiaries: number;
  totalChats: number;
  totalAgents: number;
  totalAvatars: number;
  streak: number;
  lastActive: string;
}

export const userService = {
  /**
   * 获取用户资料
   * @returns 用户资料
   */
  async getProfile(): Promise<User> {
    return apiService.get<User>(USER_ENDPOINTS.profile);
  },

  /**
   * 更新用户资料
   * @param data 更新数据
   * @returns 更新后的用户资料
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiService.put<User>(USER_ENDPOINTS.profile, data);
  },

  /**
   * 更新用户头像
   * @param avatarId 头像ID
   * @returns 更新后的用户资料
   */
  async updateAvatar(avatarId: string): Promise<User> {
    return apiService.put<User>(USER_ENDPOINTS.avatar, { avatarId });
  },

  /**
   * 获取通知设置
   * @returns 通知设置
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    return apiService.get<NotificationSettings>(USER_ENDPOINTS.notifications);
  },

  /**
   * 更新通知设置
   * @param settings 通知设置
   * @returns 更新后的通知设置
   */
  async updateNotificationSettings(
    settings: NotificationSettings,
  ): Promise<NotificationSettings> {
    return apiService.put<NotificationSettings>(
      USER_ENDPOINTS.notifications,
      settings,
    );
  },

  /**
   * 获取用户数据统计
   * @returns 用户数据统计
   */
  async getUserData(): Promise<UserData> {
    return apiService.get<UserData>(USER_ENDPOINTS.data);
  },

  /**
   * 修改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    return apiService.post(`${USER_ENDPOINTS.base}/change-password`, {
      oldPassword,
      newPassword,
    });
  },
  /**
   * 上传自定义头像图片
   * @param imageUri 本地图片URI
   * @returns { avatarUrl: string } 服务端存储的头像路径
   */
  async uploadAvatarImage(imageUri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "avatar.jpg";
    const ext = (filename.split(".").pop() || "jpg").toLowerCase();
    formData.append("avatar", {
      uri: imageUri,
      name: filename,
      type: `image/${ext}`,
    } as any);
    return apiService.upload<{ avatarUrl: string }>(
      `${USER_ENDPOINTS.profile}/avatar`,
      formData,
    );
  },

  /**
   * 提交意见反馈
   */
  async submitFeedback(data: {
    type: string;
    content: string;
    contact?: string;
  }): Promise<void> {
    return apiService.post(USER_ENDPOINTS.feedback, data);
  },
};

export default userService;
