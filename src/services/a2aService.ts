/**
 * MyMe App - A2A Service
 * A2A服务 - 处理A2A关系和聊天功能
 */

import { apiService } from './api';
import type {
  A2ARelation,
  A2ASenderType,
  CreateA2ARelationRequest,
  UpdateA2ARelationRequest,
  A2ARelationListResponse,
  SendA2AMessageRequest,
  A2AMessageListResponse,
  SwitchSenderTypeRequest,
  CurrentSenderResponse,
} from '../types/a2a';
import { KnowledgeModule } from '../types/knowledge';

// API路径
const A2A_ENDPOINTS = {
  base: '/a2a',
  messages: '/messages',
  switch: '/switch',
};

/**
 * A2A服务
 */
export const a2aService = {
  /**
   * 获取A2A关系列表
   * @returns 关系列表
   */
  async getRelations(): Promise<A2ARelationListResponse> {
    return apiService.get<A2ARelationListResponse>(A2A_ENDPOINTS.base);
  },

  /**
   * 获取单个关系详情
   * @param id 关系ID
   * @returns 关系详情
   */
  async getRelation(id: string): Promise<A2ARelation> {
    return apiService.get<A2ARelation>(`${A2A_ENDPOINTS.base}/${id}`);
  },

  /**
   * 创建A2A关系（通过分享码）
   * @param shareCode 分享码
   * @param permissions 授权的模块
   * @returns 创建的关系
   */
  async createRelation(
    shareCode: string,
    permissions: KnowledgeModule[]
  ): Promise<A2ARelation> {
    const request: CreateA2ARelationRequest = { shareCode, permissions };
    return apiService.post<A2ARelation>(A2A_ENDPOINTS.base, request);
  },

  /**
   * 更新A2A关系
   * @param id 关系ID
   * @param data 更新数据
   * @returns 更新后的关系
   */
  async updateRelation(
    id: string,
    data: UpdateA2ARelationRequest
  ): Promise<A2ARelation> {
    return apiService.put<A2ARelation>(
      `${A2A_ENDPOINTS.base}/${id}`,
      data
    );
  },

  /**
   * 删除A2A关系
   * @param id 关系ID
   */
  async deleteRelation(id: string): Promise<void> {
    return apiService.delete(`${A2A_ENDPOINTS.base}/${id}`);
  },

  /**
   * 发送A2A消息
   * @param relationId 关系ID
   * @param content 消息内容
   * @param senderType 发送者类型
   * @returns 发送的消息
   */
  async sendMessage(
    relationId: string,
    content: string,
    senderType?: A2ASenderType
  ): Promise<A2AMessageListResponse> {
    const request: SendA2AMessageRequest = { content, senderType };
    return apiService.post<A2AMessageListResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.messages}`,
      request
    );
  },

  /**
   * 获取消息历史
   * @param relationId 关系ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 消息列表
   */
  async getMessages(
    relationId: string,
    page?: number,
    limit?: number
  ): Promise<A2AMessageListResponse> {
    return apiService.get<A2AMessageListResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.messages}`,
      { page, limit }
    );
  },

  /**
   * 切换发送者类型
   * @param relationId 关系ID
   * @param senderType 发送者类型
   * @returns 当前状态
   */
  async switchSenderType(
    relationId: string,
    senderType: A2ASenderType
  ): Promise<CurrentSenderResponse> {
    const request: SwitchSenderTypeRequest = { senderType };
    return apiService.post<CurrentSenderResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.switch}`,
      request
    );
  },

  /**
   * 更新关系权限
   * @param id 关系ID
   * @param permissions 新的权限列表
   * @returns 更新后的关系
   */
  async updatePermissions(
    id: string,
    permissions: KnowledgeModule[]
  ): Promise<A2ARelation> {
    return this.updateRelation(id, { permissions });
  },

  /**
   * 阻止/解除阻止关系
   * @param id 关系ID
   * @param blocked 是否阻止
   * @returns 更新后的关系
   */
  async setBlocked(id: string, blocked: boolean): Promise<A2ARelation> {
    const status = blocked ? 'blocked' : 'active';
    return this.updateRelation(id, { status });
  },
};

// 导出默认对象
export default a2aService;
