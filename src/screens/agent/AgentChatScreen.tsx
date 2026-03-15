/**
 * MyMe App - Agent Chat Screen
 * AI对话聊天页面
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, Appbar } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  createdAt: string;
}

export default function AgentChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是MyMe AI助手，可以帮助你记录和梳理人生经历。有什么想聊的吗？',
      sender: 'agent',
      createdAt: new Date().toISOString(),
    },
  ]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // 模拟AI回复
    setTimeout(() => {
      const agentReply: Message = {
        id: (Date.now() + 1).toString(),
        content: '感谢你的分享！我理解你的意思。让我们继续深入聊聊...',
        sender: 'agent',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentReply]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.agentMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.agentBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.agentText
        ]}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="AI对话" />
      </Appbar.Header>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="输入消息..."
          style={styles.input}
          mode="outlined"
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          mode="contained"
          containerColor={COLORS.primary}
          iconColor={COLORS.textOnPrimary}
          size={24}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  agentMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: COLORS.agentBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: COLORS.userBubbleText,
  },
  agentText: {
    color: COLORS.agentBubbleText,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
});
