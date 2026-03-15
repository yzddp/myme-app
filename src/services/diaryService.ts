/**
 * MyMe App - Diary Service
 * 日记服务 - 处理日记CRUD操作
 */

import { apiService } from "./api";
import { encryptDiaryContent, decryptDiaryContent } from "./encryption";
import type {
  DiaryEntry,
  CreateDiaryRequest,
  UpdateDiaryRequest,
  DiaryListResponse,
  DiaryQueryParams,
  DiarySentiment,
  DiaryAnalysisReport,
  AnalysisReportListResponse,
} from "../types/diary";

// API路径
const DIARY_ENDPOINTS = {
  base: "/diary",
  list: "/diary/list",
  summary: "/summary",
  reports: "/diary/reports",
  weekly: "/diary/weekly",
  monthly: "/diary/monthly",
  yearly: "/diary/yearly",
};

/**
 * 日记服务
 */
export const diaryService = {
  /**
   * 获取日记列表
   * @param params 查询参数
   * @returns 日记列表
   */
  async getDiaries(params?: DiaryQueryParams): Promise<DiaryListResponse> {
    const response = await apiService.get<any>(DIARY_ENDPOINTS.list, params);

    // API返回格式: { items: [...], total, page, limit, totalPages }
    // 需要转换为 DiaryListResponse 格式
    const diaries = (response.items || response.diaries || []).map(
      (diary: any) => ({
        ...diary,
        content: decryptDiaryContent(diary.content),
        summary: diary.summary ? decryptDiaryContent(diary.summary) : null,
      }),
    );

    return {
      diaries,
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
    };
  },

  /**
   * 获取单个日记详情
   * @param id 日记ID
   * @returns 日记详情
   */
  async getDiary(id: string): Promise<DiaryEntry> {
    const diary = await apiService.get<DiaryEntry>(
      `${DIARY_ENDPOINTS.base}/${id}`,
    );

    // 解密日记内容
    return {
      ...diary,
      content: decryptDiaryContent(diary.content),
      summary: diary.summary ? decryptDiaryContent(diary.summary) : null,
    };
  },

  /**
   * 创建日记
   * @param content 日记内容
   * @returns 创建的日记
   */
  async create(content: string): Promise<DiaryEntry> {
    // 加密日记内容
    const encryptedContent = encryptDiaryContent(content);
    const request: CreateDiaryRequest = { content: encryptedContent };

    const diary = await apiService.post<DiaryEntry>(
      DIARY_ENDPOINTS.base,
      request,
    );

    // 返回解密后的内容供前端使用
    return {
      ...diary,
      content,
    };
  },

  /**
   * 更新日记
   * @param id 日记ID
   * @param data 更新数据
   * @returns 更新后的日记
   */
  async update(id: string, data: UpdateDiaryRequest): Promise<DiaryEntry> {
    const updateData = { ...data };

    // 如果更新内容，加密
    if (updateData.content) {
      updateData.content = encryptDiaryContent(updateData.content);
    }

    const diary = await apiService.put<DiaryEntry>(
      `${DIARY_ENDPOINTS.base}/${id}`,
      updateData,
    );

    // 返回解密后的内容
    return {
      ...diary,
      content: data.content || diary.content,
      summary: data.content ? null : diary.summary || null,
    };
  },

  /**
   * 删除日记
   * @param id 日记ID
   */
  async delete(id: string): Promise<void> {
    return apiService.delete(`${DIARY_ENDPOINTS.base}/${id}`);
  },

  /**
   * 生成日记摘要
   * @param id 日记ID
   * @returns 包含摘要的日记
   */
  async generateSummary(id: string): Promise<DiaryEntry> {
    const diary = await apiService.post<DiaryEntry>(
      `${DIARY_ENDPOINTS.base}/${id}${DIARY_ENDPOINTS.summary}`,
    );

    return {
      ...diary,
      content: decryptDiaryContent(diary.content),
      summary: diary.summary ? decryptDiaryContent(diary.summary) : null,
    };
  },

  /**
   * 按日期范围获取日记
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 日记列表
   */
  async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<DiaryListResponse> {
    return this.getDiaries({ startDate, endDate });
  },

  /**
   * 按情感筛选日记
   * @param sentiment 情感类型
   * @returns 日记列表
   */
  async getBySentiment(sentiment: DiarySentiment): Promise<DiaryListResponse> {
    return this.getDiaries({ sentiment });
  },

  /**
   * 获取周报列表
   * @param params 查询参数
   * @returns 周报列表
   */
  async getWeeklyReports(
    params?: DiaryQueryParams,
  ): Promise<AnalysisReportListResponse> {
    const response = await apiService.get<any>(DIARY_ENDPOINTS.weekly, params);
    return {
      reports: response.items || response.reports || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
    };
  },

  /**
   * 获取月报列表
   * @param params 查询参数
   * @returns 月报列表
   */
  async getMonthlyReports(
    params?: DiaryQueryParams,
  ): Promise<AnalysisReportListResponse> {
    const response = await apiService.get<any>(DIARY_ENDPOINTS.monthly, params);
    return {
      reports: response.items || response.reports || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
    };
  },

  /**
   * 获取年报列表
   * @param params 查询参数
   * @returns 年报列表
   */
  async getYearlyReports(
    params?: DiaryQueryParams,
  ): Promise<AnalysisReportListResponse> {
    const response = await apiService.get<any>(DIARY_ENDPOINTS.yearly, params);
    return {
      reports: response.items || response.reports || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
    };
  },

  /**
   * 获取单个报告详情
   * @param id 报告ID
   * @param periodType 周期类型
   * @returns 报告详情
   */
  async getReport(
    id: string,
    periodType: string,
  ): Promise<DiaryAnalysisReport> {
    return apiService.get<DiaryAnalysisReport>(
      `${DIARY_ENDPOINTS.reports}/${id}`,
      { periodType },
    );
  },
};

// 导出默认对象
export default diaryService;
