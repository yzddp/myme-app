/**
 * MyMe App - DiaryCard Component
 * 日记卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import type { DiaryEntry, DiarySentiment } from '../types/diary';

/** 情感颜色映射 */
const SENTIMENT_COLORS: Record<DiarySentiment, string> = {
  positive: COLORS.sentimentPositive,
  neutral: COLORS.sentimentNeutral,
  negative: COLORS.sentimentNegative,
};

/** 情感名称映射 */
const SENTIMENT_NAMES: Record<DiarySentiment, string> = {
  positive: '积极',
  neutral: '中性',
  negative: '消极',
};

interface DiaryCardProps {
  /** 日记对象 */
  diary: DiaryEntry;
  /** 点击事件 */
  onPress?: (diary: DiaryEntry) => void;
  /** 分析事件 */
  onAnalyze?: (diary: DiaryEntry) => void;
  /** 删除事件 */
  onDelete?: (diary: DiaryEntry) => void;
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * 日记卡片组件
 * 用于显示日记的摘要信息
 */
export const DiaryCard: React.FC<DiaryCardProps> = ({
  diary,
  onPress,
  onAnalyze,
  onDelete,
  style,
}) => {
  // 截断内容
  const truncateContent = (content: string, maxLength: number = 120): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // 今天
    if (diffDays === 0) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    // 昨天
    if (diffDays === 1) {
      return '昨天';
    }
    // 一周内
    if (diffDays < 7) {
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekDays[date.getDay()];
    }
    // 更早
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(diary)}
      activeOpacity={0.7}
    >
      {/* 头部：日期和情感 */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {formatDate(diary.createdAt)}
        </Text>
        
        {diary.sentiment && (
          <View
            style={[
              styles.sentimentTag,
              { backgroundColor: SENTIMENT_COLORS[diary.sentiment] + '20' },
            ]}
          >
            <View
              style={[
                styles.sentimentDot,
                { backgroundColor: SENTIMENT_COLORS[diary.sentiment] },
              ]}
            />
            <Text
              style={[
                styles.sentimentText,
                { color: SENTIMENT_COLORS[diary.sentiment] },
              ]}
            >
              {SENTIMENT_NAMES[diary.sentiment]}
            </Text>
          </View>
        )}
      </View>

      {/* 内容摘要 */}
      <Text style={styles.content} numberOfLines={4}>
        {truncateContent(diary.content)}
      </Text>

      {/* 摘要（如果存在） */}
      {diary.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>摘要：</Text>
          <Text style={styles.summaryText} numberOfLines={2}>
            {diary.summary}
          </Text>
        </View>
      )}

      {/* 关键词 */}
      {diary.keywords && diary.keywords.length > 0 && (
        <View style={styles.keywordsContainer}>
          {diary.keywords.slice(0, 4).map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>#{keyword}</Text>
            </View>
          ))}
          {diary.keywords.length > 4 && (
            <Text style={styles.moreKeywordsText}>
              +{diary.keywords.length - 4}
            </Text>
          )}
        </View>
      )}

      {/* 底部操作 */}
      <View style={styles.footer}>
        {/* 字数统计 */}
        <Text style={styles.wordCount}>
          {diary.content.length} 字
        </Text>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {onAnalyze && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAnalyze(diary)}
            >
              <Text style={styles.analyzeText}>分析</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(diary)}
            >
              <Text style={styles.deleteText}>删除</Text>
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
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sentimentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginRight: 6,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  keywordTag: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  keywordText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  moreKeywordsText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    alignSelf: 'center',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  wordCount: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 8,
  },
  analyzeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deleteButton: {},
  deleteText: {
    fontSize: 13,
    color: COLORS.error,
  },
});

export default DiaryCard;
