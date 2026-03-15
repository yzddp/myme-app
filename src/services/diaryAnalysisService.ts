/**
 * MyMe App - Diary Analysis Service
 * 日记分析服务 - 处理日记AI分析功能
 */

import { apiService } from './api';
import type {
  DiaryAnalysisReport,
  DiaryPeriodType,
  GenerateAnalysisRequest,
  DiaryAnalysisSettings,
  UpdateAnalysisSettingsRequest,
  AnalysisReportListResponse,
} from '../types/diary';

// 定义响应类型
interface LatestAnalysisResponse {
  report: DiaryAnalysisReport | null;
}

interface AnalysisHistoryResponse {
  reports: DiaryAnalysisReport[];
  total: number;
  page: number;
  limit: number;
}

interface AnalysisSettingsResponse {
  settings: DiaryAnalysisSettings;
}

// API路径
const DIARY_ANALYSIS_ENDPOINTS = {
  analyze: '/diary/analyze',
  latest: '/diary/analyze/latest',
  history: '/diary/analyze/history',
  settings: '/diary/analyze/settings',
};

/**
 * 日记分析服务
 */
export const diaryAnalysisService = {
  /**
   * 生成日记分析报告
   * @param request 分析请求参数
   * @returns 分析报告
   */
  async analyze(request: GenerateAnalysisRequest): Promise<DiaryAnalysisReport> {
    return apiService.post<DiaryAnalysisReport>(
      DIARY_ANALYSIS_ENDPOINTS.analyze,
      request
    );
  },

  /**
   * 按周期类型生成分析报告
   * @param periodType 周期类型
   * @returns 分析报告
   */
  async analyzeByPeriod(periodType: DiaryPeriodType): Promise<DiaryAnalysisReport> {
    const request: GenerateAnalysisRequest = { periodType };
    return this.analyze(request);
  },

  /**
   * 获取最新分析报告
   * @param periodType 周期类型（可选）
   * @returns 最新报告
   */
  async getLatest(periodType?: DiaryPeriodType): Promise<LatestAnalysisResponse> {
    return apiService.get<LatestAnalysisResponse>(
      DIARY_ANALYSIS_ENDPOINTS.latest,
      { periodType }
    );
  },

  /**
   * 获取分析历史
   * @param page 页码
   * @param limit 每页数量
   * @returns 分析历史列表
   */
  async getHistory(
    page?: number,
    limit?: number
  ): Promise<AnalysisHistoryResponse> {
    return apiService.get<AnalysisHistoryResponse>(
      DIARY_ANALYSIS_ENDPOINTS.history,
      { page, limit }
    );
  },

  /**
   * 获取指定报告详情
   * @param reportId 报告ID
   * @returns 分析报告
   */
  async getReport(reportId: string): Promise<DiaryAnalysisReport> {
    return apiService.get<DiaryAnalysisReport>(
      `${DIARY_ANALYSIS_ENDPOINTS.analyze}/${reportId}`
    );
  },

  /**
   * 删除分析报告
   * @param reportId 报告ID
   */
  async deleteReport(reportId: string): Promise<void> {
    return apiService.delete(`${DIARY_ANALYSIS_ENDPOINTS.analyze}/${reportId}`);
  },

  /**
   * 获取分析设置
   * @returns 分析设置
   */
  async getSettings(): Promise<AnalysisSettingsResponse> {
    return apiService.get<AnalysisSettingsResponse>(
      DIARY_ANALYSIS_ENDPOINTS.settings
    );
  },

  /**
   * 更新分析设置
   * @param settings 更新数据
   * @returns 更新后的设置
   */
  async updateSettings(
    settings: UpdateAnalysisSettingsRequest
  ): Promise<AnalysisSettingsResponse> {
    return apiService.put<AnalysisSettingsResponse>(
      DIARY_ANALYSIS_ENDPOINTS.settings,
      settings
    );
  },

  /**
   * 启用/禁用自动分析
   * @param autoAnalyze 是否自动分析
   * @returns 更新后的设置
   */
  async setAutoAnalyze(autoAnalyze: boolean): Promise<AnalysisSettingsResponse> {
    return this.updateSettings({ autoAnalyze });
  },

  /**
   * 启用/禁用通知
   * @param notificationEnabled 是否启用通知
   * @returns 更新后的设置
   */
  async setNotification(
    notificationEnabled: boolean
  ): Promise<AnalysisSettingsResponse> {
    return this.updateSettings({ notificationEnabled });
  },

  /**
   * 设置默认分析周期
   * @param periodType 周期类型
   * @returns 更新后的设置
   */
  async setDefaultPeriod(
    periodType: DiaryPeriodType
  ): Promise<AnalysisSettingsResponse> {
    return this.updateSettings({ defaultPeriodType: periodType });
  },
};

// 导出默认对象
export default diaryAnalysisService;
