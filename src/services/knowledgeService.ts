/**
 * MyMe App - Knowledge Service
 * 知识库服务 - 处理知识条目CRUD操作
 */

import { apiService } from './api';
import type {
  KnowledgeItem,
  KnowledgeModule,
  CreateKnowledgeRequest,
  UpdateKnowledgeRequest,
  KnowledgeQueryParams,
  AllModulesResponse,
  KnowledgeListResponse,
} from '../types/knowledge';

// API路径
const KNOWLEDGE_ENDPOINTS = {
  base: '/knowledge',
  modules: '/knowledge',
};

/**
 * 知识库服务
 */
export const knowledgeService = {
  /**
   * 获取知识库概览（所有模块）
   * @returns 各模块的知识数量
   */
  async getModules(): Promise<AllModulesResponse> {
    return apiService.get<AllModulesResponse>(KNOWLEDGE_ENDPOINTS.base);
  },

  /**
   * 获取指定模块的知识列表
   * @param module 模块（M1-M10）
   * @param params 查询参数
   * @returns 知识列表
   */
  async getByModule(
    module: KnowledgeModule,
    params?: Omit<KnowledgeQueryParams, 'module'>
  ): Promise<KnowledgeListResponse> {
    return apiService.get<KnowledgeListResponse>(
      `${KNOWLEDGE_ENDPOINTS.base}/${module}`,
      params
    );
  },

  /**
   * 获取单个知识条目
   * @param id 知识ID
   * @returns 知识详情
   */
  async getById(id: string): Promise<KnowledgeItem> {
    return apiService.get<KnowledgeItem>(`${KNOWLEDGE_ENDPOINTS.base}/${id}`);
  },

  /**
   * 创建知识条目
   * @param module 模块（M1-M10）
   * @param data 知识数据
   * @returns 创建的知识
   */
  async create(
    module: KnowledgeModule,
    data: Omit<CreateKnowledgeRequest, 'module'>
  ): Promise<KnowledgeItem> {
    const request: CreateKnowledgeRequest = {
      module,
      ...data,
    };
    return apiService.post<KnowledgeItem>(
      `${KNOWLEDGE_ENDPOINTS.base}/${module}`,
      request
    );
  },

  /**
   * 更新知识条目
   * @param id 知识ID
   * @param data 更新数据
   * @returns 更新后的知识
   */
  async update(id: string, data: UpdateKnowledgeRequest): Promise<KnowledgeItem> {
    return apiService.put<KnowledgeItem>(
      `${KNOWLEDGE_ENDPOINTS.base}/${id}`,
      data
    );
  },

  /**
   * 删除知识条目
   * @param id 知识ID
   */
  async delete(id: string): Promise<void> {
    return apiService.delete(`${KNOWLEDGE_ENDPOINTS.base}/${id}`);
  },

  /**
   * 搜索知识
   * @param params 搜索参数
   * @returns 搜索结果
   */
  async search(params: KnowledgeQueryParams): Promise<KnowledgeListResponse> {
    return apiService.get<KnowledgeListResponse>(KNOWLEDGE_ENDPOINTS.base, params);
  },

  /**
   * 获取所有知识（不分模块）
   * @param params 查询参数
   * @returns 知识列表
   */
  async getAll(params?: KnowledgeQueryParams): Promise<KnowledgeListResponse> {
    return apiService.get<KnowledgeListResponse>(KNOWLEDGE_ENDPOINTS.base, params);
  },
};

// 导出默认对象
export default knowledgeService;
