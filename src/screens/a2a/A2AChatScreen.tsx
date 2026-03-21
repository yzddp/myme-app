import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Chip,
  HelperText,
  IconButton,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";
import type { A2AMessage, A2ARelation, A2ASenderType } from "../../types/a2a";
import { KNOWLEDGE_MODULE_DESCRIPTIONS } from "../../types/knowledge";
import AppHeader from "../../components/AppHeader";

type A2AChatRouteProp = RouteProp<ProfileStackParamList, "A2AChat">;

export default function A2AChatScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<A2AChatRouteProp>();
  const { relationId } = route.params;

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<A2AMessage[]>([]);
  const [relation, setRelation] = useState<A2ARelation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [senderType, setSenderType] = useState<A2ASenderType>("user");
  const flatListRef = useRef<FlatList<A2AMessage>>(null);

  useEffect(() => {
    void loadPage();
  }, [relationId]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        banner: {
          margin: 12,
          marginBottom: 0,
          padding: 14,
          borderRadius: 18,
          backgroundColor: colors.surface,
        },
        bannerTitle: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
        bannerText: { fontSize: 13, lineHeight: 19 },
        chipRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 10,
        },
        senderBar: {
          marginHorizontal: 12,
          marginTop: 12,
          padding: 14,
          borderRadius: 18,
          backgroundColor: colors.surface,
        },
        senderLabel: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
        senderHint: { fontSize: 12, marginTop: 8 },
        loading: { flex: 1, justifyContent: "center", alignItems: "center" },
        messageList: { padding: 16, paddingBottom: 24 },
        messageWrap: { marginBottom: 14, maxWidth: "85%" },
        myMessage: { alignSelf: "flex-end" },
        peerMessage: { alignSelf: "flex-start" },
        bubble: { padding: 12, borderRadius: 18 },
        myBubble: {
          backgroundColor: colors.userBubble,
          borderBottomRightRadius: 6,
        },
        peerBubble: {
          backgroundColor: colors.agentBubble,
          borderBottomLeftRadius: 6,
        },
        messageText: { fontSize: 15, lineHeight: 22 },
        meta: { marginTop: 6, flexDirection: "row", gap: 6 },
        metaText: { fontSize: 11 },
        composer: {
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        input: { backgroundColor: colors.background, marginBottom: 10 },
      }),
    [colors],
  );

  const loadPage = async () => {
    try {
      setLoading(true);
      const [relationResult, messagesResult] = await Promise.all([
        a2aService.getRelation(relationId),
        a2aService.getMessages(relationId),
      ]);
      setRelation(relationResult);
      setMessages(messagesResult.messages ?? []);
    } catch (error: any) {
      Alert.alert("错误", error.message || "关系不存在或消息加载失败", [
        { text: "返回列表", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleSwitchSenderType = async (value: string) => {
    const type = value as A2ASenderType;
    try {
      await a2aService.switchSenderType(relationId, type);
      setSenderType(type);
    } catch (error) {
      console.error("Failed to switch sender type:", error);
      Alert.alert("错误", "切换身份失败");
    }
  };

  const sendMessage = async () => {
    if (
      !inputText.trim() ||
      sending ||
      !relation ||
      relation.status === "blocked"
    ) {
      return;
    }

    const optimisticMessage: A2AMessage = {
      id: `temp-${Date.now()}`,
      relationId,
      senderId: "self",
      senderType,
      senderName: senderType === "agent" ? relation.selfAvatar.name : "本人",
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setSending(true);
    setTimeout(scrollToBottom, 50);

    try {
      await a2aService.sendMessage(
        relationId,
        optimisticMessage.content,
        senderType,
      );
      const refreshed = await a2aService.getMessages(relationId);
      setMessages(refreshed.messages ?? []);
    } catch (error) {
      setMessages((prev) =>
        prev.filter((message) => message.id !== optimisticMessage.id),
      );
      Alert.alert("错误", "消息发送失败");
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: A2AMessage }) => {
    const isMine = item.senderType === "user" || item.senderType === "agent";
    const mineByCurrentUser =
      item.senderName === "本人" || item.senderId === "self" || isMine;

    return (
      <View
        style={[
          styles.messageWrap,
          mineByCurrentUser ? styles.myMessage : styles.peerMessage,
        ]}
      >
        <View
          style={[
            styles.bubble,
            mineByCurrentUser ? styles.myBubble : styles.peerBubble,
          ]}
        >
          <Text
            style={{
              color: mineByCurrentUser
                ? colors.userBubbleText
                : colors.agentBubbleText,
            }}
          >
            {item.content}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: colors.primary }]}>
            {item.senderName || item.senderType}
          </Text>
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>
            {new Date(item.createdAt).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={88}
    >
      <AppHeader
        title={
          relation
            ? `正在和 ${relation.counterpartAvatar.name} 对话`
            : "A2A对话"
        }
        subtitle={
          relation
            ? `${relation.counterpartUser.nickname || relation.counterpartUser.username || "对方用户"} · 我方分身 ${relation.selfAvatar.name}`
            : "加载关系上下文中"
        }
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      {relation ? (
        <>
          <View style={styles.banner}>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
              该分身已授权的认知范围
            </Text>
            <Text style={[styles.bannerText, { color: colors.textSecondary }]}>
              聊天页顶部只展示对方分身的权限边界，不再混入我方权限。
            </Text>
            <View style={styles.chipRow}>
              {relation.counterpartAvatar.permissions.length > 0 ? (
                relation.counterpartAvatar.permissions.map((module) => (
                  <Chip key={module}>{module}</Chip>
                ))
              ) : (
                <Text style={{ color: colors.textSecondary }}>
                  未开放知识模块
                </Text>
              )}
            </View>
            {relation.counterpartAvatar.permissions.map((module) => (
              <Text
                key={module}
                style={[
                  styles.bannerText,
                  { color: colors.textSecondary, marginTop: 6 },
                ]}
              >
                {module} · {KNOWLEDGE_MODULE_DESCRIPTIONS[module]}
              </Text>
            ))}
          </View>

          <View style={styles.senderBar}>
            <Text style={[styles.senderLabel, { color: colors.textPrimary }]}>
              发送身份
            </Text>
            <SegmentedButtons
              value={senderType}
              onValueChange={handleSwitchSenderType}
              buttons={[
                { value: "user", label: "本人发送" },
                { value: "agent", label: "由我的分身代发" },
              ]}
            />
            <HelperText
              type="info"
              visible
              style={[styles.senderHint, { color: colors.textSecondary }]}
            >
              {senderType === "agent"
                ? "将由你的当前分身身份代你表达"
                : "将以你本人的口吻直接发送"}
            </HelperText>
          </View>
        </>
      ) : null}

      {loading ? (
        <View style={styles.loading}>
          <Text style={{ color: colors.textSecondary }}>消息加载中...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
        />
      )}

      <View style={styles.composer}>
        {relation?.status === "blocked" ? (
          <Text style={{ color: colors.textSecondary }}>
            该关系已被屏蔽，仅可查看历史消息。
          </Text>
        ) : (
          <>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                senderType === "agent"
                  ? "由我的分身代发消息..."
                  : "本人发送消息..."
              }
              mode="outlined"
              style={styles.input}
              multiline
              editable={!sending}
            />
            <Button
              mode="contained"
              onPress={sendMessage}
              loading={sending}
              disabled={sending || !inputText.trim()}
            >
              发送
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
