/**
 * 知识库相关类型定义
 * 对应后端 KnowledgeItem 实体
 */

// 知识模块类型 (M1-M10)
export type KnowledgeModule = 
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' 
  | 'M6' | 'M7' | 'M8' | 'M9' | 'M10';

// 知识来源类型
export type KnowledgeSource = 'agent' | 'diary_analyzed' | 'manual';

// 知识条目实体
export interface KnowledgeItem {
  id: string;
  userId: string;
  module: KnowledgeModule;
  title: string | null;
  content: string;
  source: KnowledgeSource;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

// 创建知识请求
export interface CreateKnowledgeRequest {
  module: KnowledgeModule;
  title?: string;
  content: string;
  tags?: string[];
}

// 更新知识请求
export interface UpdateKnowledgeRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

// 知识查询参数
export interface KnowledgeQueryParams {
  module?: KnowledgeModule;
  keyword?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

// 知识列表响应
export interface KnowledgeListResponse {
  items: KnowledgeItem[];
  total: number;
  page: number;
  limit: number;
}

// 按模块分类的知识概览
export interface ModuleKnowledgeSummary {
  module: KnowledgeModule;
  count: number;
  latestUpdated: string | null;
}

// 所有模块概览响应
export interface AllModulesResponse {
  modules: ModuleKnowledgeSummary[];
  total: number;
}

// 知识模块描述映射
export const KNOWLEDGE_MODULE_DESCRIPTIONS: Record<KnowledgeModule, string> = {
  M1: '人生观 - 关于人生意义、目标、价值观的思考',
  M2: '自我认知 - 自我优势、劣势、性格特点的认知',
  M3: '人际关系 - 家人、朋友、伴侣等关系处理',
  M4: '职业发展 - 工作、职业规划、职业技能提升',
  M5: '学习方法 - 学习策略、知识管理、能力提升',
  M6: '心理健康 - 情绪管理、压力应对、心理成长',
  M7: '财务管理 - 理财观念、收入支出、财富积累',
  M8: '健康生活 - 运动、饮食、作息、健康管理',
  M9: '兴趣爱好 - 个人爱好、兴趣培养、生活乐趣',
  M10: '其他 - 不属于以上分类的个人知识',
};
