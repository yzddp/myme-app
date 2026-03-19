/**
 * MyMe App - Agent Chat Screen
 * AI对话聊天页面 - PRD v3.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AgentStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { chatService } from "../../services/chatService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  createdAt: string;
}

type AgentChatRouteProp = RouteProp<AgentStackParamList, "AgentChat">;

export default function AgentChatScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<AgentStackParamList>>();
  const route = useRoute<AgentChatRouteProp>();
  const { sessionId } = route.params || {};

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("AI对话");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessionId || null,
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
      // 加载会话标题
      chatService.getSession(currentSessionId).then((s) => {
        if (s.title) setSessionTitle(s.title);
      }).catch(() => {});
    } else {
      setMessages([
        {
          id: "1",
          content:
            "你好！我是MyMe AI助手，可以帮助你记录和梳理人生经历。有什么想聊的吗？",
          sender: "agent",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [currentSessionId]);

  const loadMessages = async (sid: string) => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(sid);
      const loadedMessages: Message[] = response.messages.map((m: any) => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        createdAt: m.createdAt,
      }));
      setMessages(loadedMessages);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Failed to load messages:", error);
      Alert.alert("错误", "加载消息失败");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSending(true);

    setTimeout(() => scrollToBottom(), 50);

    try {
      const response = await chatService.sendMessage({
        sessionId: currentSessionId || undefined,
        content: userMessage.content,
      });

      if (!currentSessionId && response.sessionId) {
        setCurrentSessionId(response.sessionId);
      }

      const agentReply: Message = {
        id: Date.now().toString(),
        content: response.agentReply || "（无回复）",
        sender: "agent",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, agentReply]);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("错误", "消息发送失败");
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.primary,
          paddingTop: insets.top + 4,
          paddingBottom: 12,
          paddingHorizontal: 8,
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.textOnPrimary,
          flex: 1,
          textAlign: "center",
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        messageList: {
          padding: 16,
          flexGrow: 1,
        },
        messageContainer: {
          marginBottom: 12,
          maxWidth: "85%",
        },
        userMessage: {
          alignSelf: "flex-end",
        },
        agentMessage: {
          alignSelf: "flex-start",
        },
        messageBubble: {
          padding: 12,
          borderRadius: 16,
        },
        userBubble: {
          backgroundColor: colors.userBubble,
          borderBottomRightRadius: 4,
        },
        agentBubble: {
          backgroundColor: colors.agentBubble,
          borderBottomLeftRadius: 4,
        },
        messageText: {
          fontSize: 16,
          lineHeight: 22,
        },
        userText: {
          color: colors.userBubbleText,
        },
        agentText: {
          color: colors.agentBubbleText,
        },
        messageTime: {
          fontSize: 11,
          color: colors.textTertiary,
          marginTop: 4,
          marginHorizontal: 4,
        },
        inputContainer: {
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        input: {
          flex: 1,
          marginRight: 8,
          maxHeight: 100,
          backgroundColor: colors.background,
        },
      }),
    [colors, insets],
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.agentMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.agentBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === "user" ? styles.userText : styles.agentText,
          ]}
        >
          {item.content}
        </Text>
      </View>
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{sessionTitle}</Text>
        <IconButton
          icon="history"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.navigate("AgentSessionList")}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="输入消息..."
          style={styles.input}
          mode="outlined"
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <IconButton
          icon="send"
          mode="contained"
          containerColor={colors.primary}
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={sendMessage}
          disabled={!inputText.trim() || sending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
