/**
 * MyMe App - A2A Chat Screen
 * A2A对话页面 - PRD v3.0
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
  SegmentedButtons,
} from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";

type SenderType = "user" | "agent";

interface Message {
  id: string;
  content: string;
  sender: SenderType;
  createdAt: string;
}

type A2AChatRouteProp = RouteProp<ProfileStackParamList, "A2AChat">;

export default function A2AChatScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<A2AChatRouteProp>();
  const { relationId } = route.params;

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [senderType, setSenderType] = useState<SenderType>("user");
  const [peerName, setPeerName] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    loadRelation();
  }, [relationId]);

  const loadRelation = async () => {
    try {
      const relation = await a2aService.getRelation(relationId);
      setPeerName(
        (relation as any).peerName || (relation as any).peer?.name || "伙伴",
      );
    } catch (error) {
      console.error("Failed to load relation:", error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await a2aService.getMessages(relationId);
      const loadedMessages: Message[] =
        (response as any).messages?.map((m: any) => ({
          id: m.id,
          content: m.content,
          sender: m.senderType || m.sender,
          createdAt: m.createdAt,
        })) || [];
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleSwitchSenderType = async (type: SenderType) => {
    try {
      await a2aService.switchSenderType(relationId, type);
      setSenderType(type);
    } catch (error) {
      console.error("Failed to switch sender type:", error);
      Alert.alert("错误", "切换身份失败");
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const message: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: senderType,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setInputText("");
    setSending(true);

    setTimeout(() => scrollToBottom(), 50);

    try {
      await a2aService.sendMessage(relationId, message.content, message.sender);
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("错误", "消息发送失败");
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
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
          paddingTop: 48,
          paddingBottom: 12,
          paddingHorizontal: 8,
        },
        headerCenter: {
          flex: 1,
          alignItems: "center",
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.textOnPrimary,
        },
        headerSubtitle: {
          fontSize: 12,
          color: colors.textOnPrimary,
          opacity: 0.8,
        },
        senderTypeBar: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        senderTypeLabel: {
          fontSize: 14,
          color: colors.textSecondary,
          marginRight: 12,
        },
        segmentedButtons: {
          flex: 1,
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
        messageMeta: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 4,
          marginHorizontal: 4,
        },
        senderLabel: {
          fontSize: 11,
          color: colors.primary,
          fontWeight: "500",
          marginRight: 6,
        },
        messageTime: {
          fontSize: 11,
          color: colors.textTertiary,
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
    [colors],
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
      <View style={styles.messageMeta}>
        <Text style={styles.senderLabel}>
          {item.sender === "user" ? "我" : "Agent"}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{peerName}</Text>
          <Text style={styles.headerSubtitle}>A2A对话</Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.senderTypeBar}>
        <Text style={styles.senderTypeLabel}>当前身份:</Text>
        <SegmentedButtons
          value={senderType}
          onValueChange={(value) => handleSwitchSenderType(value as SenderType)}
          buttons={[
            { value: "user", label: "人工" },
            { value: "agent", label: "Agent" },
          ]}
          style={styles.segmentedButtons}
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
          onContentSizeChange={() => scrollToBottom()}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={`以${senderType === "user" ? "人工" : "Agent"}身份发送消息...`}
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
