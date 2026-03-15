/**
 * MyMe App - ModuleSelector Component
 * M1-M10模块选择器组件
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from "react-native";
import { COLORS } from "../constants/colors";
import type { KnowledgeModule } from "../types/knowledge";

/** 模块信息 */
interface ModuleInfo {
  key: KnowledgeModule;
  name: string;
  description: string;
}

/** 所有模块列表 - PRD v3.0 */
const MODULES: ModuleInfo[] = [
  { key: "M1", name: "个人信息", description: "身份信息、教育背景、工作经历" },
  {
    key: "M2",
    name: "记忆与经历",
    description: "人生重要事件、里程碑、难忘回忆",
  },
  { key: "M3", name: "知识与技能", description: "专业技能、证书、语言能力" },
  { key: "M4", name: "兴趣与偏好", description: "爱好、习惯、消费偏好" },
  { key: "M5", name: "社会关系", description: "人脉、社交圈、亲密关系" },
  {
    key: "M6",
    name: "价值观与信念",
    description: "人生信条、道德观、政治观点",
  },
  { key: "M7", name: "决策与思考", description: "做决定的方式、思维习惯" },
  {
    key: "M8",
    name: "情感与心理",
    description: "情绪模式、心理状态、情感需求",
  },
  {
    key: "M9",
    name: "抽象与创意",
    description: "创意想法、艺术品味、抽象思维",
  },
  {
    key: "M10",
    name: "整合与自省",
    description: "自我认知、人生复盘、成长反思",
  },
];

interface ModuleSelectorProps {
  /** 当前选中的模块 */
  selected?: KnowledgeModule | null;
  /** 模块选择事件 */
  onSelect?: (module: KnowledgeModule) => void;
  /** 是否多选模式 */
  multiple?: boolean;
  /** 已选中的模块列表（多选模式） */
  selectedModules?: KnowledgeModule[];
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * M1-M10模块选择器组件
 * 用于选择知识模块
 */
export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  selected,
  onSelect,
  multiple = false,
  selectedModules = [],
  style,
}) => {
  // 检查模块是否被选中
  const isSelected = (module: KnowledgeModule): boolean => {
    if (multiple) {
      return selectedModules.includes(module);
    }
    return selected === module;
  };

  // 获取模块颜色 - PRD v3.0: 统一使用primary颜色
  const getModuleColor = (module: KnowledgeModule): string => {
    return COLORS.primary;
  };

  // 处理点击
  const handlePress = (module: KnowledgeModule) => {
    onSelect?.(module);
  };

  // 渲染单选模式
  if (!multiple) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.container, style]}
        contentContainerStyle={styles.scrollContent}
      >
        {MODULES.map((module) => {
          const selected = isSelected(module.key);
          const color = getModuleColor(module.key);

          return (
            <TouchableOpacity
              key={module.key}
              style={[styles.chip, selected && { backgroundColor: color }]}
              onPress={() => handlePress(module.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {module.key} {module.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  // 渲染多选模式（网格布局）
  return (
    <View style={[styles.gridContainer, style]}>
      {MODULES.map((module) => {
        const selected = isSelected(module.key);
        const color = getModuleColor(module.key);

        return (
          <TouchableOpacity
            key={module.key}
            style={[
              styles.gridItem,
              selected && { backgroundColor: color + "20", borderColor: color },
            ]}
            onPress={() => handlePress(module.key)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                selected && { backgroundColor: color, borderColor: color },
              ]}
            >
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.gridItemContent}>
              <Text style={[styles.gridItemTitle, selected && { color }]}>
                {module.key} {module.name}
              </Text>
              <Text style={styles.gridItemDesc} numberOfLines={1}>
                {module.description}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/** 导出模块列表供外部使用 */
export const KNOWLEDGE_MODULES = MODULES;

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceVariant,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: COLORS.textOnPrimary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  gridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    marginRight: "2%",
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkmark: {
    color: COLORS.textOnPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  gridItemContent: {
    flex: 1,
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  gridItemDesc: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});

export default ModuleSelector;
