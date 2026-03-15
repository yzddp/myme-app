/**
 * MyMe App - API Service
 * 统一API请求封装 - 使用Axios
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { storage } from "../utils/storage";
import { Alert } from "react-native";

// 从环境变量获取配置
const API_URL = "http://192.168.31.196:8080";
const API_VERSION = "/api/v1";
const TIMEOUT = 10000;

// 存储key
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: API_URL + API_VERSION,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器
 * - 添加Authorization header
 * - 添加token到请求
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getString(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 * - 处理401错误（token过期）
 * - 统一错误处理
 * - 返回数据
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    const url = response.config.url || "";

    // 如果是成功响应并且有data字段，直接返回data
    // 后端返回格式: { success: true, data: {...}, message: "..." }
    if (data && data.success === true && data.data !== undefined) {
      // 如果data是数组，根据URL端点返回对应格式
      if (Array.isArray(data.data)) {
        // 根据端点名称确定返回的字段名
        if (url.includes("/avatars")) {
          return { avatars: data.data };
        } else if (
          url.includes("/sessions") ||
          url.includes("/conversations")
        ) {
          return { sessions: data.data, total: data.data.length };
        }
        return { items: data.data, total: data.data.length };
      }
      return data.data;
    }
    return data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 处理401错误 - Token过期
    if (error.response?.status === 401) {
      // 清除token
      storage.delete(TOKEN_KEY);
      storage.delete(REFRESH_TOKEN_KEY);

      // 提示用户并跳转登录
      Alert.alert("登录已过期", "您的登录已过期，请重新登录", [
        {
          text: "确定",
          onPress: () => {
            // 可以在这里触发导航到登录页面
            // 需要在App层面处理导航跳转
            // 通过事件或全局状态触发
          },
        },
      ]);

      // 如果是刷新token的请求失败，不要重试
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // 标记请求为重试，避免无限循环
      if (!originalRequest._retry) {
        originalRequest._retry = true;
      }
    }

    // 统一错误处理
    const errorMessage = getErrorMessage(error, originalRequest.url);
    return Promise.reject(new Error(errorMessage));
  },
);

/**
 * 获取错误消息
 */
const getErrorMessage = (error: AxiosError, requestUrl?: string): string => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as any;
    const message = data?.message || "";

    // 登录接口的特殊错误处理
    if (
      requestUrl?.includes("/auth/login") ||
      requestUrl?.includes("/auth/register")
    ) {
      if (status === 401) {
        return "邮箱或密码错误，请重新输入";
      }
      if (status === 409) {
        return message || "该邮箱已被注册";
      }
    }

    switch (status) {
      case 400:
        return data?.message || "请求参数错误";
      case 401:
        return "登录已过期，请重新登录";
      case 403:
        return "没有权限访问";
      case 404:
        return "请求的资源不存在";
      case 409:
        return data?.message || "资源冲突";
      case 500:
        return "服务器内部错误";
      default:
        return data?.message || "请求失败";
    }
  } else if (error.request) {
    return "网络连接失败，请检查网络";
  } else {
    return error.message || "请求失败";
  }
};

/**
 * API请求方法封装
 */
export const apiService = {
  // GET请求
  get: <T = any>(url: string, params?: object, config?: object): Promise<T> => {
    return api.get(url, { params, ...config });
  },

  // POST请求
  post: <T = any>(url: string, data?: object, config?: object): Promise<T> => {
    return api.post(url, data, config);
  },

  // PUT请求
  put: <T = any>(url: string, data?: object, config?: object): Promise<T> => {
    return api.put(url, data, config);
  },

  // PATCH请求
  patch: <T = any>(url: string, data?: object, config?: object): Promise<T> => {
    return api.patch(url, data, config);
  },

  // DELETE请求
  delete: <T = any>(url: string, config?: object): Promise<T> => {
    return api.delete(url, config);
  },

  // 上传文件
  upload: <T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
  ): Promise<T> => {
    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });
  },

  // 下载文件
  download: (
    url: string,
    onProgress?: (progress: number) => void,
  ): Promise<Blob> => {
    return api.get(url, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });
  },
};

// 导出默认实例和工具
export default api;
export { TOKEN_KEY, REFRESH_TOKEN_KEY };
