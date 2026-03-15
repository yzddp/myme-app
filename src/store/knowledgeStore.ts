/**
 * MyMe App - Knowledge Store
 * 知识库状态管理
 */

import { create } from 'zustand';
import knowledgeService from '../services/knowledgeService';
import { 
  KnowledgeItem, 
  KnowledgeModule, 
  CreateKnowledgeRequest, 
  UpdateKnowledgeRequest,
  ModuleKnowledgeSummary,
  AllModulesResponse 
} from '../types/knowledge';

// 知识库状态接口
interface KnowledgeState {
  // State
  modules: ModuleKnowledgeSummary[];
  currentModule: KnowledgeModule | null;
  items: KnowledgeItem[];
  currentItem: KnowledgeItem | null;
  total: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;

  // Actions
  loadModules: () => Promise<void>;
  loadByModule: (module: KnowledgeModule, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  create: (module: KnowledgeModule, data: Omit<CreateKnowledgeRequest, 'module'>) => Promise<KnowledgeItem | null>;
  update: (id: string, data: UpdateKnowledgeRequest) => Promise<KnowledgeItem | null>;
  delete: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<KnowledgeItem | null>;
  setCurrentModule: (module: KnowledgeModule | null) => void;
  setCurrentItem: (item: KnowledgeItem | null) => void;
  clearError: () => void;
  reset: () => void;
}

// 创建知识库状态管理
export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  // Initial State
  modules: [],
  currentModule: null,
  items: [],
  currentItem: null,
  total: 0,
  isLoading: false,
  isSaving: false,
  error: null,
  hasMore: true,
  currentPage: 1,

  // 加载所有模块概览
  loadModules: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await knowledgeService.getModules();
      set({ 
        modules: response.modules || [], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载模块失败', 
        isLoading: false 
      });
    }
  },

  // 加载指定模块知识
  loadByModule: async (module: KnowledgeModule, page: number = 1) => {
    set({ isLoading: true, error: null, currentPage: page });
    try {
      const response = await knowledgeService.getByModule(module, { page, limit: 20 });
      set({ 
        currentModule: module,
        items: response.items || [],
        total: response.total,
        hasMore: (response.items?.length || 0) >= 20,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载知识列表失败', 
        isLoading: false 
      });
    }
  },

  // 加载更多
  loadMore: async () => {
    const { currentModule, currentPage, hasMore, isLoading } = get();
    
    if (!currentModule || !hasMore || isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const response = await knowledgeService.getByModule(currentModule, { 
        page: nextPage, 
        limit: 20 
      });
      
      const currentItems = get().items;
      set({ 
        items: [...currentItems, ...(response.items || [])],
        hasMore: (response.items?.length || 0) >= 20,
        currentPage: nextPage,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '加载更多失败', 
        isLoading: false 
      });
    }
  },

  // 创建知识
  create: async (module: KnowledgeModule, data: Omit<CreateKnowledgeRequest, 'module'>) => {
    set({ isSaving: true, error: null });
    try {
      const item = await knowledgeService.create(module, data);
      
      // 添加到列表
      const { items } = get();
      set({ 
        items: [item, ...items],
        isSaving: false 
      });
      
      // 更新模块计数
      const { modules } = get();
      const updatedModules = modules.map(m => 
        m.module === module 
          ? { ...m, count: m.count + 1, latestUpdated: item.createdAt }
          : m
      );
      set({ modules: updatedModules });
      
      return item;
    } catch (error: any) {
      set({ 
        error: error.message || '创建知识失败', 
        isSaving: false 
      });
      return null;
    }
  },

  // 更新知识
  update: async (id: string, data: UpdateKnowledgeRequest) => {
    set({ isSaving: true, error: null });
    try {
      const item = await knowledgeService.update(id, data);
      
      // 更新列表
      const { items } = get();
      const updatedItems = items.map(i => i.id === id ? item : i);
      set({ 
        items: updatedItems,
        currentItem: item,
        isSaving: false 
      });
      
      return item;
    } catch (error: any) {
      set({ 
        error: error.message || '更新知识失败', 
        isSaving: false 
      });
      return null;
    }
  },

  // 删除知识
  delete: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await knowledgeService.delete(id);
      
      // 从列表中移除
      const { items, currentModule, modules } = get();
      const newItems = items.filter(i => i.id !== id);
      
      // 更新模块计数
      const updatedModules = currentModule 
        ? modules.map(m => 
            m.module === currentModule 
              ? { ...m, count: Math.max(0, m.count - 1) }
              : m
          )
        : modules;
      
      set({ 
        items: newItems,
        modules: updatedModules,
        total: get().total - 1,
        isLoading: false 
      });
      
      return true;
    } catch (error: any) {
      set({ 
        error: error.message || '删除知识失败', 
        isLoading: false 
      });
      return false;
    }
  },

  // 获取知识详情
  getById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await knowledgeService.getById(id);
      set({ 
        currentItem: item,
        isLoading: false 
      });
      return item;
    } catch (error: any) {
      set({ 
        error: error.message || '获取知识详情失败', 
        isLoading: false 
      });
      return null;
    }
  },

  // 设置当前模块
  setCurrentModule: (module: KnowledgeModule | null) => {
    set({ currentModule: module });
  },

  // 设置当前知识
  setCurrentItem: (item: KnowledgeItem | null) => {
    set({ currentItem: item });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 重置状态
  reset: () => {
    set({
      modules: [],
      currentModule: null,
      items: [],
      currentItem: null,
      total: 0,
      isLoading: false,
      isSaving: false,
      error: null,
      hasMore: true,
      currentPage: 1,
    });
  },
}));

export default useKnowledgeStore;
