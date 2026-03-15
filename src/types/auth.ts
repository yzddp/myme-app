/**
 * 认证相关类型定义
 * 对应后端 DTO 和实体类型
 */

// 用户类型 - PRD v3.0
export interface User {
  id: string;
  email: string;
  username: string | null;
  nickname: string | null;
  name: string | null;
  theme: "warm" | "cool" | "dark";
  locale: string;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// 注册请求
export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  name?: string;
  nickname?: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// Token 刷新请求
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 认证响应
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Token 载荷
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// 账户锁定信息
export interface AccountLockInfo {
  isLocked: boolean;
  lockedUntil: string | null;
  failedAttempts: number;
}
