/**
 * 类型定义统一导出
 * 从这里导入所有类型定义
 */

// 认证相关类型
export * from './auth';

// 对话相关类型
export * from './chat';

// 知识库相关类型
export * from './knowledge';

// 分身相关类型
export * from './avatar';

// 日记相关类型
export * from './diary';

// A2A 相关类型
export * from './a2a';

// ===== 通用类型 =====

/**
 * 通用 API 响应
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API 错误
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 空响应（用于删除操作）
 */
export interface EmptyResponse {
  success: boolean;
  message: string;
}

/**
 * 操作成功响应
 */
export interface SuccessResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}
