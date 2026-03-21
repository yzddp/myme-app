/**
 * MyMe App - A2A Service
 * A2A服务 - 处理A2A关系和聊天功能
 */

import { apiService } from "./api";
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
  LegacyA2ARelation,
  ShareCodePreview,
} from "../types/a2a";
import {
  normalizeA2ARelation,
  normalizeShareCodePreview,
} from "./a2aNormalizer";

// API路径
const A2A_ENDPOINTS = {
  base: "/a2a",
  messages: "/messages",
  switch: "/switch",
};

const AVATAR_ENDPOINTS = {
  validateShareCode: "/avatars/validate-share-code",
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
    const response = await apiService.get<
      A2ARelationListResponse | { relations?: LegacyA2ARelation[] }
    >(A2A_ENDPOINTS.base);
    const typedResponse = response as A2ARelationListResponse & {
      relations?: LegacyA2ARelation[];
      total?: number;
    };
    const relations = (typedResponse.relations ?? []).map((relation) =>
      normalizeA2ARelation(relation as LegacyA2ARelation),
    );

    return {
      relations,
      total: typedResponse.total ?? relations.length,
    };
  },

  /**
   * 获取单个关系详情
   * @param id 关系ID
   * @returns 关系详情
   */
  async getRelation(id: string): Promise<A2ARelation> {
    const response = await apiService.get<A2ARelation | LegacyA2ARelation>(
      `${A2A_ENDPOINTS.base}/${id}`,
    );
    return normalizeA2ARelation(response as LegacyA2ARelation);
  },

  /**
   * 创建A2A关系（通过分享码）
   * @param shareCode 分享码
   * @param peerAvatarId 我方分身ID
   * @returns 创建的关系
   */
  async createRelation(
    shareCode: string,
    peerAvatarId: string,
  ): Promise<A2ARelation> {
    const request: CreateA2ARelationRequest = { shareCode, peerAvatarId };
    const response = await apiService.post<A2ARelation | LegacyA2ARelation>(
      A2A_ENDPOINTS.base,
      request,
    );
    return normalizeA2ARelation(response as LegacyA2ARelation);
  },

  async validateShareCode(shareCode: string): Promise<ShareCodePreview> {
    const response = await apiService.get<any>(
      AVATAR_ENDPOINTS.validateShareCode,
      {
        shareCode,
      },
    );
    return normalizeShareCodePreview(response);
  },

  /**
   * 更新A2A关系
   * @param id 关系ID
   * @param data 更新数据
   * @returns 更新后的关系
   */
  async updateRelation(
    id: string,
    data: UpdateA2ARelationRequest,
  ): Promise<A2ARelation> {
    const response = await apiService.put<A2ARelation | LegacyA2ARelation>(
      `${A2A_ENDPOINTS.base}/${id}`,
      data,
    );
    return normalizeA2ARelation(response as LegacyA2ARelation);
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
    senderType?: A2ASenderType,
  ): Promise<A2AMessageListResponse> {
    const request: SendA2AMessageRequest = { content, senderType };
    return apiService.post<A2AMessageListResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.messages}`,
      request,
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
    limit?: number,
  ): Promise<A2AMessageListResponse> {
    return apiService.get<A2AMessageListResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.messages}`,
      { page, limit },
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
    senderType: A2ASenderType,
  ): Promise<CurrentSenderResponse> {
    const request: SwitchSenderTypeRequest = { senderType };
    return apiService.post<CurrentSenderResponse>(
      `${A2A_ENDPOINTS.base}/${relationId}${A2A_ENDPOINTS.switch}`,
      request,
    );
  },

  /**
   * 阻止/解除阻止关系
   * @param id 关系ID
   * @param blocked 是否阻止
   * @returns 更新后的关系
   */
  async setBlocked(id: string, blocked: boolean): Promise<A2ARelation> {
    const status = blocked ? "blocked" : "active";
    return this.updateRelation(id, { status });
  },
};

// 导出默认对象
export default a2aService;
