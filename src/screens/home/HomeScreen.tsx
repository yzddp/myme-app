/**
 * MyMe App - Chat List Screen
 * 对话列表页 - 类似微信聊天列表
 * PRD v3.0 - Tab 1: 对话
 */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, FAB, ActivityIndicator, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { chatService } from "../../services/chatService";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  type: "agent" | "avatar" | "human";
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await chatService.getSessions();
      const mapped: ChatSession[] = response.sessions.map((s) => ({
        id: s.id,
        title: s.title || "新对话",
        lastMessage: "",
        updatedAt: new Date(s.updatedAt).toLocaleString("zh-CN"),
        type: s.type as any,
      }));
      setSessions(mapped);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert("删除对话", `确定删除与"${title}"的对话吗？`, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          try {
            await chatService.deleteSession(id);
            loadSessions();
          } catch (error) {
            console.error("Failed to delete session:", error);
          }
        },
      },
    ]);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "昨天";
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getAvatar = (type: string, title: string) => {
    const firstChar = title.charAt(0);
    return firstChar.toUpperCase();
  };

  const renderItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("A2AChat", { relationId: item.id })}
      onLongPress={() => handleDelete(item.id, item.title)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getAvatar(item.type, item.title)}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.chatTime}>{formatTime(item.updatedAt)}</Text>
        </View>
        <Text style={styles.chatPreview} numberOfLines={1}>
          {item.lastMessage || "暂无消息"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>对话</Text>
        <IconButton
          icon="plus"
          iconColor={COLORS.textOnPrimary}
          size={24}
          onPress={() => {
            Alert.alert("添加对话", "选择添加方式", [
              {
                text: "添加系统Agent",
                onPress: () => navigation.navigate("A2AList"),
              },
              { text: "取消", style: "cancel" },
            ]);
          }}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无对话</Text>
              <Text style={styles.emptySubtext}>点击右上角+开始新对话</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  list: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  chatPreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: 8,
  },
});
