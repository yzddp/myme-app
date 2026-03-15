/**
 * MyMe App - useAuth Hook
 * 认证相关功能Hook
 */

import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

/**
 * 认证Hook
 * 提供登录、注册、登出等功能
 */
export const useAuth = () => {
  // 获取store状态
  const { 
    token, 
    refreshToken, 
    user, 
    isAuthenticated, 
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    setUser: storeSetUser,
    setLoading: storeSetLoading,
    updateToken: storeUpdateToken,
  } = useAuthStore();

  /**
   * 登录
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    storeSetLoading(true);
    try {
      const response = await authService.login(email, password);
      
      storeLogin(
        response.accessToken,
        response.refreshToken,
        response.user
      );
      
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      storeSetLoading(false);
    }
  }, [storeLogin, storeSetLoading]);

  /**
   * 注册
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string
  ): Promise<boolean> => {
    storeSetLoading(true);
    try {
      const response = await authService.register(email, password, name);
      
      // 注册后自动登录
      storeLogin(
        response.accessToken,
        response.refreshToken,
        response.user
      );
      
      return true;
    } catch (error: any) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      storeSetLoading(false);
    }
  }, [storeLogin, storeSetLoading]);

  /**
   * 登出
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // 调用后端登出接口（如果需要）
      await authService.logout();
    } catch (error) {
      // 即使后端调用失败，也清除本地状态
      console.error('Logout error:', error);
    } finally {
      storeLogout();
    }
  }, [storeLogout]);

  /**
   * 刷新Token
   */
  const refreshTokenHandler = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      storeUpdateToken(response.accessToken);
      return true;
    } catch (error) {
      console.error('Refresh token failed:', error);
      storeLogout();
      return false;
    }
  }, [storeUpdateToken, storeLogout]);

  /**
   * 检查是否已认证
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    // 可以在这里验证token有效性
    return true;
  }, [token]);

  /**
   * 更新用户信息
   */
  const updateUser = useCallback((user: User): void => {
    storeSetUser(user);
  }, [storeSetUser]);

  return {
    // State
    token,
    refreshToken,
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    refreshTokenHandler,
    checkAuth,
    updateUser,
  };
};

export default useAuth;
