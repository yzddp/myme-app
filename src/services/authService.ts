/**
 * MyMe App - Auth Service
 * 认证服务 - 处理用户注册、登录、Token管理
 */

import { apiService, TOKEN_KEY, REFRESH_TOKEN_KEY } from "./api";
import { storage } from "../utils/storage";
import { normalizeLanguageCode } from "../i18n";
import type {
  User,
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
} from "../types/auth";

// API路径
const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  refresh: "/auth/refresh",
  me: "/auth/me",
};

/**
 * 认证服务
 */
export const authService = {
  normalizeUser(user: User): User {
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? null,
      nickname: user.nickname ?? null,
      name: user.name ?? null,
      avatar: user.avatar ?? null,
      gender: user.gender ?? null,
      birthday: user.birthday ?? null,
      bio: user.bio ?? null,
      theme: user.theme ?? "warm",
      languageCode: normalizeLanguageCode(
        (user as any).languageCode ?? (user as any).language_code,
      ),
      regionCountryCode:
        (user as any).regionCountryCode ?? (user as any).region_country_code ?? null,
      regionCountryName:
        (user as any).regionCountryName ?? (user as any).region_country_name ?? null,
      regionProvinceCode:
        (user as any).regionProvinceCode ?? (user as any).region_province_code ?? null,
      regionProvinceName:
        (user as any).regionProvinceName ?? (user as any).region_province_name ?? null,
      regionCityCode:
        (user as any).regionCityCode ?? (user as any).region_city_code ?? null,
      regionCityName:
        (user as any).regionCityName ?? (user as any).region_city_name ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? user.createdAt,
    };
  },

  /**
   * 用户注册
   * @param payload 注册信息
   * @returns 认证响应（包含token和用户信息）
   */
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const request: RegisterRequest = payload;
    const response = await apiService.post<AuthResponse>(
      AUTH_ENDPOINTS.register,
      request,
    );

    // 保存token
    if (response.accessToken) {
      storage.set(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    return {
      ...response,
      user: authService.normalizeUser(response.user),
    };
  },

  /**
   * 用户登录
   * @param identifier 邮箱或用户名
   * @param password 密码
   * @returns 认证响应（包含token和用户信息）
   */
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const normalized = identifier.trim();
    const request: LoginRequest = normalized.includes("@")
      ? { email: normalized, password }
      : { username: normalized, password };
    const response = await apiService.post<AuthResponse>(
      AUTH_ENDPOINTS.login,
      request,
    );

    // 保存token
    if (response.accessToken) {
      storage.set(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    return {
      ...response,
      user: authService.normalizeUser(response.user),
    };
  },

  /**
   * 刷新Token
   * @returns 新的认证响应
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = storage.getString(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const request: RefreshTokenRequest = { refreshToken };
    const response = await apiService.post<AuthResponse>(
      AUTH_ENDPOINTS.refresh,
      request,
    );

    // 更新存储的token
    if (response.accessToken) {
      storage.set(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    return {
      ...response,
      user: authService.normalizeUser(response.user),
    };
  },

  /**
   * 用户登出
   * 清除本地存储的token
   */
  async logout(): Promise<void> {
    // 清除本地存储的token
    storage.delete(TOKEN_KEY);
    storage.delete(REFRESH_TOKEN_KEY);

    // 可以在这里添加调用后端登出接口的逻辑（如使refreshToken失效）
    // await apiService.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>(AUTH_ENDPOINTS.me);
    return authService.normalizeUser(response);
  },

  /**
   * 检查是否已登录
   * @returns 是否已登录
   */
  isAuthenticated(): boolean {
    const token = storage.getString(TOKEN_KEY);
    return !!token;
  },

  /**
   * 获取存储的AccessToken
   * @returns AccessToken或null
   */
  getAccessToken(): string | null {
    return storage.getString(TOKEN_KEY) || null;
  },

  /**
   * 获取存储的RefreshToken
   * @returns RefreshToken或null
   */
  getRefreshToken(): string | null {
    return storage.getString(REFRESH_TOKEN_KEY) || null;
  },
};

// 导出默认实例
export default authService;
