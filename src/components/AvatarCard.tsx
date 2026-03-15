/**
 * MyMe App - AvatarCard Component
 * 分身卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Avatar, AvatarScenario } from '../types/avatar';

/** 场景名称映射 */
const SCENARIO_NAMES: Record<AvatarScenario, string> = {
  interview: '面试',
  work: '工作',
  dating: '约会',
  consultation: '咨询',
  company: '陪伴',
  psychological: '心理',
};

/** 场景图标映射 */
const SCENARIO_ICONS: Record<AvatarScenario, string> = {
  interview: '👔',
  work: '💼',
  dating: '💕',
  consultation: '💬',
  company: '🤝',
  psychological: '🧠',
};

interface AvatarCardProps {
  /** 分身对象 */
  avatar: Avatar;
  /** 点击事件 */
  onPress?: (avatar: Avatar) => void;
  /** 分享事件 */
  onShare?: (avatar: Avatar) => void;
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * 分身卡片组件
 * 用于显示分身的摘要信息
 */
export const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  onPress,
  onShare,
  style,
}) => {
  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 获取权限模块名称
  const getPermissionModules = (permissions: string[]): string => {
    if (!permissions || permissions.length === 0) {
      return '未授权';
    }
    if (permissions.length <= 3) {
      return permissions.join('、');
    }
    return `${permissions.slice(0, 3).join('、')}等${permissions.length}个`;
  };

  // 状态颜色
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return COLORS.success;
      case 'inactive':
        return COLORS.warning;
      case 'deleted':
        return COLORS.error;
      default:
        return COLORS.textTertiary;
    }
  };

  // 状态名称
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '已暂停';
      case 'deleted':
        return '已删除';
      default:
        return '未知';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(avatar)}
      activeOpacity={0.7}
    >
      {/* 头部 */}
      <View style={styles.header}>
        {/* 头像图标 */}
        <View style={styles.avatarIcon}>
          <Text style={styles.avatarEmoji}>
            {avatar.scenario ? SCENARIO_ICONS[avatar.scenario] || '👤' : '👤'}
          </Text>
        </View>

        {/* 名称和状态 */}
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {avatar.name}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(avatar.status) },
              ]}
            />
            <Text style={styles.statusText}>
              {getStatusName(avatar.status)}
            </Text>
          </View>
        </View>
      </View>

      {/* 描述 */}
      {avatar.description && (
        <Text style={styles.description} numberOfLines={2}>
          {avatar.description}
        </Text>
      )}

      {/* 场景标签 */}
      {avatar.scenario && (
        <View style={styles.scenarioContainer}>
          <View style={styles.scenarioTag}>
            <Text style={styles.scenarioText}>
              {SCENARIO_NAMES[avatar.scenario] || avatar.scenario}
            </Text>
          </View>
        </View>
      )}

      {/* 权限信息 */}
      <View style={styles.permissionSection}>
        <Text style={styles.permissionLabel}>已授权模块：</Text>
        <Text style={styles.permissionValue}>
          {getPermissionModules(avatar.permissions)}
        </Text>
      </View>

      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          创建于 {formatDate(avatar.createdAt)}
        </Text>

        {/* 分享按钮 */}
        {onShare && avatar.status === 'active' && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => onShare(avatar)}
          >
            <Text style={styles.shareText}>分享</Text>
          </TouchableOpacity>
        )}
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  scenarioContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  scenarioTag: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scenarioText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  permissionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  permissionLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  permissionValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  shareText: {
    color: COLORS.textOnPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AvatarCard;
