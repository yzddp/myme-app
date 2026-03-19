/**
 * MyMe App - Agent Session List Screen
 * AI对话会话列表页面 - PRD v3.0
 */

import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Text,
  Card,
  FAB,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AgentStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { chatService } from "../../services/chatService";

interface Session {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  messageCount: number;
}

export default function AgentSessionListScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AgentStackParamList>>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSessions();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await chatService.getSessions();
      const mappedSessions: Session[] = response.sessions.map((s: any) => ({
        id: s.id,
        title: s.title || "新对话",
        lastMessage: "",
        updatedAt: new Date(s.updatedAt).toLocaleString("zh-CN"),
        messageCount: s.messageCount || 0,
      }));
      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert("删除会话", "确定要删除这个会话吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          try {
            await chatService.deleteSession(sessionId);
            loadSessions();
          } catch (error) {
            console.error("Failed to delete session:", error);
            Alert.alert("错误", "删除失败");
          }
        },
      },
    ]);
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
          padding: 16,
          paddingTop: 48,
          backgroundColor: colors.primary,
        },
        title: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.textOnPrimary,
          marginLeft: 8,
        },
        list: {
          padding: 16,
        },
        card: {
          marginBottom: 12,
          backgroundColor: colors.surface,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary,
          color: colors.textOnPrimary,
          textAlign: "center",
          lineHeight: 40,
          fontWeight: "bold",
        },
        lastMessage: {
          color: colors.textSecondary,
          marginTop: 8,
        },
        empty: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 60,
        },
        emptyText: {
          fontSize: 18,
          color: colors.textSecondary,
        },
        emptySubtext: {
          fontSize: 14,
          color: colors.textTertiary,
          marginTop: 8,
        },
        fab: {
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: colors.primary,
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [colors],
  );

  const renderItem = ({ item }: { item: Session }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("AgentChat", { sessionId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.messageCount}条消息 · ${item.updatedAt}`}
        left={(props) => <Text style={styles.avatar}>AI</Text>}
        right={(props) => (
          <IconButton
            icon="delete"
            size={20}
            iconColor={colors.textTertiary}
            onPress={() => handleDeleteSession(item.id)}
          />
        )}
      />
      <Card.Content>
        <Text numberOfLines={2} style={styles.lastMessage}>
          {item.lastMessage || "暂无消息"}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>AI对话历史</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无对话记录</Text>
              <Text style={styles.emptySubtext}>点击右下角开始新的对话</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AgentChat", {})}
      />
    </View>
  );
}
