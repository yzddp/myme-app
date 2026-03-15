/**
 * MyMe App - User Service
 * 用户服务 - 处理用户资料相关操作
 */

import { apiService } from "./api";
import type { User } from "../store/authStore";

const USER_ENDPOINTS = {
  base: "/user",
  profile: "/user/profile",
};

export interface UpdateProfileRequest {
  nickname?: string;
  theme?: "warm" | "cool" | "dark";
  locale?: string;
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
};

export default userService;
