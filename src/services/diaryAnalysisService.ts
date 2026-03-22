/**
 * MyMe App - Diary Analysis Service
 * 日记分析服务 - 处理日记AI分析功能
 */

import { apiService } from "./api";
import type {
  DiaryAnalysisReport,
  DiaryPeriodType,
  GenerateAnalysisRequest,
  DiaryAnalyzeSettingsV2,
  UpdateDiaryAnalyzeSettingsRequest,
} from "../types/diary";

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

interface AnalysisSettingsV2Response {
  settings: DiaryAnalyzeSettingsV2;
}

function normalizeAnalyzeSettings(raw: any): DiaryAnalyzeSettingsV2 {
  if (raw?.daily || raw?.weekly || raw?.monthly || raw?.yearly) {
    return {
      daily: {
        enabled: Boolean(raw.daily?.enabled),
        time: raw.daily?.time ?? null,
      },
      weekly: {
        enabled: Boolean(raw.weekly?.enabled),
        day: raw.weekly?.day ?? "sun",
        time: raw.weekly?.time ?? null,
      },
      monthly: {
        enabled: Boolean(raw.monthly?.enabled),
        day: raw.monthly?.day ?? "1",
        time: raw.monthly?.time ?? null,
      },
      yearly: {
        enabled: Boolean(raw.yearly?.enabled),
        month: raw.yearly?.month ?? 1,
        day: raw.yearly?.day ?? "1",
        time: raw.yearly?.time ?? null,
      },
    };
  }

  return {
    daily: { enabled: false, time: "22:00" },
    weekly: { enabled: true, day: "sun", time: "20:00" },
    monthly: { enabled: true, day: "last", time: "20:00" },
    yearly: { enabled: false, month: 12, day: "31", time: "20:00" },
  };
}

// API路径
const DIARY_ANALYSIS_ENDPOINTS = {
  analyze: "/diary/analyze",
  latest: "/diary/analyze/latest",
  history: "/diary/analyze/history",
  settings: "/diary/analyze/settings",
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
  async analyze(
    request: GenerateAnalysisRequest,
  ): Promise<DiaryAnalysisReport> {
    return apiService.post<DiaryAnalysisReport>(
      DIARY_ANALYSIS_ENDPOINTS.analyze,
      request,
    );
  },

  /**
   * 按周期类型生成分析报告
   * @param periodType 周期类型
   * @returns 分析报告
   */
  async analyzeByPeriod(
    periodType: DiaryPeriodType,
  ): Promise<DiaryAnalysisReport> {
    const request: GenerateAnalysisRequest = { periodType };
    return this.analyze(request);
  },

  /**
   * 获取最新分析报告
   * @param periodType 周期类型（可选）
   * @returns 最新报告
   */
  async getLatest(
    periodType?: DiaryPeriodType,
  ): Promise<LatestAnalysisResponse> {
    return apiService.get<LatestAnalysisResponse>(
      DIARY_ANALYSIS_ENDPOINTS.latest,
      { periodType },
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
    limit?: number,
  ): Promise<AnalysisHistoryResponse> {
    return apiService.get<AnalysisHistoryResponse>(
      DIARY_ANALYSIS_ENDPOINTS.history,
      { page, limit },
    );
  },

  /**
   * 获取指定报告详情
   * @param reportId 报告ID
   * @returns 分析报告
   */
  async getReport(reportId: string): Promise<DiaryAnalysisReport> {
    return apiService.get<DiaryAnalysisReport>(
      `${DIARY_ANALYSIS_ENDPOINTS.analyze}/${reportId}`,
    );
  },

  /**
   * 删除分析报告
   * @param reportId 报告ID
   */
  async deleteReport(reportId: string): Promise<void> {
    return apiService.delete(`${DIARY_ANALYSIS_ENDPOINTS.analyze}/${reportId}`);
  },

  async getAnalyzeSettings(): Promise<AnalysisSettingsV2Response> {
    const response = await apiService.get<any>(
      DIARY_ANALYSIS_ENDPOINTS.settings,
    );
    return {
      settings: normalizeAnalyzeSettings(response.settings ?? response),
    };
  },

  async updateAnalyzeSettings(
    settings: UpdateDiaryAnalyzeSettingsRequest,
  ): Promise<AnalysisSettingsV2Response> {
    const response = await apiService.put<any>(
      DIARY_ANALYSIS_ENDPOINTS.settings,
      settings,
    );
    return {
      settings: normalizeAnalyzeSettings(response.settings ?? response),
    };
  },

};

// 导出默认对象
export default diaryAnalysisService;
