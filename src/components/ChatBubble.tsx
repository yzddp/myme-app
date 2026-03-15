/**
 * MyMe App - ChatBubble Component
 * 聊天消息气泡组件
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Message, MessageSender } from '../types/chat';

interface ChatBubbleProps {
  /** 消息对象 */
  message: Message;
  /** 是否为自己的消息 */
  isOwn?: boolean;
  /** 消息时间戳显示 */
  timestamp?: boolean;
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * 聊天消息气泡组件
 * 用于显示单条聊天消息，根据发送方显示不同样式
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn = false,
  timestamp = true,
  style,
}) => {
  // 格式化时间
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 获取发送方显示名称
  const getSenderName = (sender: MessageSender): string => {
    switch (sender) {
      case 'user':
        return '我';
      case 'agent':
        return 'AI助手';
      case 'avatar':
        return '分身';
      default:
        return '未知';
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
        style,
      ]}
    >
      {/* 对方名称（非自己的消息） */}
      {!isOwn && message.sender !== 'user' && (
        <Text style={styles.senderName}>
          {getSenderName(message.sender)}
        </Text>
      )}

      {/* 气泡 */}
      <View
        style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.content,
            isOwn ? styles.ownContent : styles.otherContent,
          ]}
        >
          {message.content}
        </Text>
      </View>

      {/* 时间戳 */}
      {timestamp && (
        <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
          {formatTime(message.createdAt)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
    marginLeft: 8,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.agentBubble,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 21,
  },
  ownContent: {
    color: COLORS.userBubbleText,
  },
  otherContent: {
    color: COLORS.agentBubbleText,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTime: {
    color: COLORS.textTertiary,
  },
  otherTime: {
    color: COLORS.textTertiary,
  },
});

export default ChatBubble;
