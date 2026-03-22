/**
 * MyMe App - User Service
 * 用户服务 - 处理用户资料相关操作
 */

import { apiService } from "./api";
import { authService } from "./authService";
import type { User } from "../types/auth";

const USER_ENDPOINTS = {
  base: "/user",
  profile: "/user/profile",
  avatar: "/user/avatar",
  notifications: "/user/notifications",
  data: "/user/data",
  feedback: "/feedback",
};

export interface UpdateProfileRequest {
  email?: string;
  languageCode?: "zh-CN" | "zh-TW" | "en";
  regionCountryCode?: string | null;
  regionCountryName?: string | null;
  regionProvinceCode?: string | null;
  regionProvinceName?: string | null;
  regionCityCode?: string | null;
  regionCityName?: string | null;
  name?: string;
  nickname?: string;
  gender?: "male" | "female" | "other" | "";
  birthday?: string;
  bio?: string;
  theme?: "warm" | "cool" | "dark";
}

export interface UserData {
  totalDiaries: number;
  totalChats: number;
  totalAgents: number;
  totalAvatars: number;
  streak: number;
  lastActive: string;
}

export interface LanguageOption {
  code: "zh-CN" | "zh-TW" | "en";
  nameEn: string;
  nameNative: string;
}

export interface RegionOption {
  code: string;
  parentCode: string | null;
  level: "country" | "province" | "city";
  countryCode: string;
  nameEn: string;
  nameLocal: string | null;
}

export const userService = {
  /**
   * 获取用户资料
   * @returns 用户资料
   */
  async getProfile(): Promise<User> {
    const response = await apiService.get<User>(USER_ENDPOINTS.profile);
    return authService.normalizeUser(response);
  },

  /**
   * 更新用户资料
   * @param data 更新数据
   * @returns 更新后的用户资料
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiService.put<User>(USER_ENDPOINTS.profile, data);
    return authService.normalizeUser(response);
  },

  /**
   * 更新用户头像
   * @param payload 头像地址或预设头像ID
   * @returns 最新头像地址
   */
  async updateAvatar(payload: {
    avatar?: string;
    avatarId?: string;
  }): Promise<{ avatar: string | null }> {
    return apiService.put<{ avatar: string | null }>(
      USER_ENDPOINTS.avatar,
      payload,
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
    return apiService.put(`${USER_ENDPOINTS.base}/password`, {
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
    const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

    formData.append("avatar", {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any);

    return apiService.upload<{ avatarUrl: string }>(
      `${USER_ENDPOINTS.avatar}/upload`,
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
