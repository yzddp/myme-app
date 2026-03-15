/**
 * MyMe App - KnowledgeCard Component
 * 知识项卡片组件
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { COLORS } from "../constants/colors";
import type { KnowledgeItem, KnowledgeModule } from "../types/knowledge";

interface KnowledgeCardProps {
  /** 知识项 */
  item: KnowledgeItem;
  /** 点击事件 */
  onPress?: (item: KnowledgeItem) => void;
  /** 编辑事件 */
  onEdit?: (item: KnowledgeItem) => void;
  /** 删除事件 */
  onDelete?: (item: KnowledgeItem) => void;
  /** 自定义样式 */
  style?: ViewStyle;
}

/** 模块名称映射 - PRD v3.0 */
const MODULE_NAMES: Record<KnowledgeModule, string> = {
  M1: "个人信息",
  M2: "记忆与经历",
  M3: "知识与技能",
  M4: "兴趣与偏好",
  M5: "社会关系",
  M6: "价值观与信念",
  M7: "决策与思考",
  M8: "情感与心理",
  M9: "抽象与创意",
  M10: "整合与自省",
};

/** 来源名称映射 */
const SOURCE_NAMES: Record<string, string> = {
  agent: "AI提取",
  diary_analyzed: "日记分析",
  manual: "手动添加",
};

/**
 * 知识项卡片组件
 * 用于显示单个知识条目的摘要信息
 */
export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  style,
}) => {
  // 截断内容
  const truncateContent = (
    content: string,
    maxLength: number = 100,
  ): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 获取模块颜色 - PRD v3.0: 统一使用primary
  const getModuleColor = (module: KnowledgeModule): string => {
    return COLORS.primary;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      {/* 模块标签 */}
      <View style={styles.header}>
        <View
          style={[
            styles.moduleTag,
            { backgroundColor: getModuleColor(item.module) },
          ]}
        >
          <Text style={styles.moduleText}>
            {item.module} {MODULE_NAMES[item.module]}
          </Text>
        </View>
        <Text style={styles.sourceText}>
          {SOURCE_NAMES[item.source] || item.source}
        </Text>
      </View>

      {/* 标题 */}
      {item.title && (
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
      )}

      {/* 内容摘要 */}
      <Text style={styles.content} numberOfLines={3}>
        {truncateContent(item.content)}
      </Text>

      {/* 标签 */}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}

      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(item)}
            >
              <Text style={styles.actionText}>编辑</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(item)}
            >
              <Text style={[styles.actionText, styles.deleteText]}>删除</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moduleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moduleText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    alignItems: "center",
  },
  tag: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  moreTagsText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  deleteButton: {},
  deleteText: {
    color: COLORS.error,
  },
});

export default KnowledgeCard;
