/**
 * 日记相关类型定义
 * 对应后端 DiaryEntry 和 DiaryAnalysisReport 实体
 */

// 日记情感类型
export type DiarySentiment = "positive" | "neutral" | "negative";

// 分析周期类型
export type DiaryPeriodType = "daily" | "weekly" | "monthly" | "custom";

// 通知日期类型
export type NotificationDay =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun"
  | "all";

// 日记实体
export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  summary: string | null;
  sentiment: DiarySentiment | null;
  keywords: string[] | null;
  createdAt: string;
  updatedAt: string;
}

// 创建日记请求
export interface CreateDiaryRequest {
  content: string;
  diaryDate?: string; // 可选的日记日期 (格式: YYYY-MM-DD)
  type?: "create" | "update"; // 操作类型
  diaryId?: string; // 日记ID (update时必填)
}

// 更新日记请求
export interface UpdateDiaryRequest {
  content?: string;
}

// 日记查询参数
export interface DiaryQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sentiment?: DiarySentiment;
}

// 日记列表响应
export interface DiaryListResponse {
  diaries: DiaryEntry[];
  total: number;
  page: number;
  limit: number;
}

// 情感数据统计
export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  percentage: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

// 分析发现项
export interface FindingItem {
  content: string;
  relatedDiaries: string[];
  date?: string;
}

// 人生建议项
export interface LifeAdviceItem {
  advice: string;
  category: string;
  priority: number;
}

// 引导问题项
export interface QuestionItem {
  question: string;
  context: string;
  suggestedTopic?: string;
}

// 日记分析报告实体
export interface DiaryAnalysisReport {
  id: string;
  userId: string;
  periodType: DiaryPeriodType;
  startDate: string;
  endDate: string;
  diaryCount: number;
  totalWords: number;
  sentimentData: SentimentData | null;
  themes: string[] | null;
  positiveFindings: FindingItem[] | null;
  negativeFindings: FindingItem[] | null;
  lifeAdvice: LifeAdviceItem[] | null;
  questions: QuestionItem[] | null;
  summary: string | null;
  createdAt: string;
}

// 生成分析请求
export interface GenerateAnalysisRequest {
  periodType: DiaryPeriodType;
  startDate?: string;
  endDate?: string;
}

// 分析报告列表响应
export interface AnalysisReportListResponse {
  reports: DiaryAnalysisReport[];
  total: number;
  page: number;
  limit: number;
}

// 日记分析设置实体
export interface DiaryAnalysisSettings {
  id: string;
  userId: string;
  defaultPeriodType: DiaryPeriodType;
  notificationEnabled: boolean;
  notificationDay: NotificationDay | null;
  notificationTime: string | null;
  autoAnalyze: boolean;
  createdAt: string;
  updatedAt: string;
}

// 更新分析设置请求
export interface UpdateAnalysisSettingsRequest {
  defaultPeriodType?: DiaryPeriodType;
  notificationEnabled?: boolean;
  notificationDay?: NotificationDay;
  notificationTime?: string;
  autoAnalyze?: boolean;
}

// 摘要生成响应
export interface SummaryResponse {
  summary: string;
  keywords: string[];
  sentiment: DiarySentiment;
}
