/**
 * MyMe App - InputBox Component
 * 消息输入框组件
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';

interface InputBoxProps {
  /** 发送消息回调 */
  onSend?: (text: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最大字符数 */
  maxLength?: number;
  /** 自动聚焦 */
  autoFocus?: boolean;
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * 消息输入框组件
 * 用于输入聊天消息
 */
export const InputBox: React.FC<InputBoxProps> = ({
  onSend,
  placeholder = '输入消息...',
  disabled = false,
  maxLength = 2000,
  autoFocus = false,
  style,
}) => {
  const [text, setText] = useState('');

  // 检查是否可以发送
  const canSend = text.trim().length > 0 && !disabled;

  // 处理发送
  const handleSend = () => {
    if (canSend) {
      onSend?.(text.trim());
      setText('');
      Keyboard.dismiss();
    }
  };

  // 处理文本变化
  const handleChangeText = (newText: string) => {
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          multiline
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        
        {/* 字符计数 */}
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              canSend && styles.sendButtonActive,
              disabled && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <View style={[
              styles.sendIcon,
              canSend && styles.sendIconActive,
            ]}>
              <View style={styles.arrow} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: 0,
  },
  counterContainer: {
    marginLeft: 12,
    justifyContent: 'flex-end',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIconActive: {
    // 白色箭头
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: COLORS.textTertiary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
});

export default InputBox;
