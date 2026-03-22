/**
 * MyMe App - Diary Store
 * 日记状态管理
 */

import { create } from 'zustand';
import diaryService from '../services/diaryService';
import diaryAnalysisService from '../services/diaryAnalysisService';
import { 
  DiaryEntry, 
  CreateDiaryRequest, 
  UpdateDiaryRequest,
  DiaryAnalysisReport,
  DiaryAnalyzeSettingsV2,
  DiaryQueryParams,
  DiaryPeriodType,
  GenerateAnalysisRequest,
  UpdateDiaryAnalyzeSettingsRequest,
} from '../types/diary';

// 日记状态接口
interface DiaryState {
  // State - Diary
  diaries: DiaryEntry[];
  currentDiary: DiaryEntry | null;
  total: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  
  // State - Analysis
  analysisReports: DiaryAnalysisReport[];
  currentReport: DiaryAnalysisReport | null;
  latestReport: DiaryAnalysisReport | null;
  settings: DiaryAnalyzeSettingsV2 | null;
  isAnalyzing: boolean;

  // Actions - Diary
  loadDiaries: (params?: DiaryQueryParams) => Promise<void>;
  loadMore: () => Promise<void>;
  createDiary: (content: string) => Promise<DiaryEntry | null>;
  updateDiary: (id: string, data: UpdateDiaryRequest) => Promise<DiaryEntry | null>;
  deleteDiary: (id: string) => Promise<boolean>;
  getDiary: (id: string) => Promise<DiaryEntry | null>;
  generateSummary: (id: string) => Promise<DiaryEntry | null>;
  setCurrentDiary: (diary: DiaryEntry | null) => void;
  clearError: () => void;
  
  // Actions - Analysis
  analyzeDiary: (params: GenerateAnalysisRequest) => Promise<DiaryAnalysisReport | null>;
  loadLatestReport: (periodType?: DiaryPeriodType) => Promise<void>;
  loadReportHistory: (page?: number, limit?: number) => Promise<void>;
  getReport: (id: string) => Promise<DiaryAnalysisReport | null>;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: UpdateDiaryAnalyzeSettingsRequest) => Promise<DiaryAnalyzeSettingsV2 | null>;
  
  // Reset
  reset: () => void;
}

// 创建日记状态管理
export const useDiaryStore = create<DiaryState>((set, get) => ({
  // Initial State - Diary
  diaries: [],
  currentDiary: null,
  total: 0,
  isLoading: false,
  isSaving: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  
  // Initial State - Analysis
  analysisReports: [],
  currentReport: null,
  latestReport: null,
  settings: null,
  isAnalyzing: false,

  // ===== Diary Actions =====

  // 加载日记列表
  loadDiaries: async (params?: DiaryQueryParams) => {
    set({ isLoading: true, error: null, currentPage: 1 });
    try {
      const response = await diaryService.getDiaries({ 
        page: 1, 
        limit: 20, 
        ...params 
      });
      set({ 
        diaries: response.diaries || [],
        total: response.total,
        hasMore: (response.diaries?.length || 0) >= 20,
        currentPage: 1,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载日记列表失败', 
        isLoading: false 
      });
    }
  },

  // 加载更多
  loadMore: async () => {
    const { currentPage, hasMore, isLoading } = get();
    
    if (!hasMore || isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const response = await diaryService.getDiaries({ page: nextPage, limit: 20 });
      
      const currentDiaries = get().diaries;
      set({ 
        diaries: [...currentDiaries, ...(response.diaries || [])],
        hasMore: (response.diaries?.length || 0) >= 20,
        currentPage: nextPage,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载更多日记失败', 
        isLoading: false 
      });
    }
  },

  // 创建日记
  createDiary: async (content: string) => {
    set({ isSaving: true, error: null });
    try {
      const diary = await diaryService.create(content);
      
      // 添加到列表
      const { diaries } = get();
      set({ 
        diaries: [diary, ...diaries],
        total: get().total + 1,
        isSaving: false 
      });
      
      return diary;
    } catch (error: any) {
      set({ 
        error: error.message || '创建日记失败', 
        isSaving: false 
      });
      return null;
    }
  },

  // 更新日记
  updateDiary: async (id: string, data: UpdateDiaryRequest) => {
    set({ isSaving: true, error: null });
    try {
      const diary = await diaryService.update(id, data);
      
      // 更新列表
      const { diaries } = get();
      const updatedDiaries = diaries.map(d => d.id === id ? diary : d);
      set({ 
        diaries: updatedDiaries,
        currentDiary: diary,
        isSaving: false 
      });
      
      return diary;
    } catch (error: any) {
      set({ 
        error: error.message || '更新日记失败', 
        isSaving: false 
      });
      return null;
    }
  },

  // 删除日记
  deleteDiary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await diaryService.delete(id);
      
      // 从列表中移除
      const { diaries } = get();
      const newDiaries = diaries.filter(d => d.id !== id);
      
      set({ 
        diaries: newDiaries,
        total: get().total - 1,
        isLoading: false 
      });
      
      return true;
    } catch (error: any) {
      set({ 
        error: error.message || '删除日记失败', 
        isLoading: false 
      });
      return false;
    }
  },

  // 获取日记详情
  getDiary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const diary = await diaryService.getDiary(id);
      set({ 
        currentDiary: diary,
        isLoading: false 
      });
      return diary;
    } catch (error: any) {
      set({ 
        error: error.message || '获取日记详情失败', 
        isLoading: false 
      });
      return null;
    }
  },

  // 生成摘要
  generateSummary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const diary = await diaryService.generateSummary(id);
      
      // 更新列表
      const { diaries } = get();
      const updatedDiaries = diaries.map(d => d.id === id ? diary : d);
      set({ 
        diaries: updatedDiaries,
        currentDiary: diary,
        isLoading: false 
      });
      
      return diary;
    } catch (error: any) {
      set({ 
        error: error.message || '生成摘要失败', 
        isLoading: false 
      });
      return null;
    }
  },

  // 设置当前日记
  setCurrentDiary: (diary: DiaryEntry | null) => {
    set({ currentDiary: diary });
  },

  // ===== Analysis Actions =====

  // 分析日记
  analyzeDiary: async (params: GenerateAnalysisRequest) => {
    set({ isAnalyzing: true, error: null });
    try {
      const report = await diaryAnalysisService.analyze(params);
      
      set({ 
        currentReport: report,
        latestReport: report,
        isAnalyzing: false 
      });
      
      return report;
    } catch (error: any) {
      set({ 
        error: error.message || '分析日记失败', 
        isAnalyzing: false 
      });
      return null;
    }
  },

  // 加载最新报告
  loadLatestReport: async (periodType?: DiaryPeriodType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await diaryAnalysisService.getLatest(periodType);
      set({ 
        latestReport: response.report,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载最新报告失败', 
        isLoading: false 
      });
    }
  },

  // 加载报告历史
  loadReportHistory: async (page: number = 1, limit: number = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await diaryAnalysisService.getHistory(page, limit);
      set({ 
        analysisReports: response.reports || [],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载报告历史失败', 
        isLoading: false 
      });
    }
  },

  // 获取报告详情
  getReport: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const report = await diaryAnalysisService.getReport(id);
      set({ 
        currentReport: report,
        isLoading: false 
      });
      return report;
    } catch (error: any) {
      set({ 
        error: error.message || '获取报告详情失败', 
        isLoading: false 
      });
      return null;
    }
  },

  // 加载分析设置
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await diaryAnalysisService.getAnalyzeSettings();
      set({ 
        settings: response.settings,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载设置失败', 
        isLoading: false 
      });
    }
  },

  // 更新分析设置
  updateSettings: async (settings: UpdateDiaryAnalyzeSettingsRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await diaryAnalysisService.updateAnalyzeSettings(settings);
      set({ 
        settings: response.settings,
        isLoading: false 
      });
      return response.settings;
    } catch (error: any) {
      set({ 
        error: error.message || '更新设置失败', 
        isLoading: false 
      });
      return null;
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 重置状态
  reset: () => {
    set({
      // Diary
      diaries: [],
      currentDiary: null,
      total: 0,
      isLoading: false,
      isSaving: false,
      error: null,
      hasMore: true,
      currentPage: 1,
      // Analysis
      analysisReports: [],
      currentReport: null,
      latestReport: null,
      settings: null,
      isAnalyzing: false,
    });
  },
}));

export default useDiaryStore;
