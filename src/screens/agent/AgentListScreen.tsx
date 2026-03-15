/**
 * MyMe App - Agent List Screen
 * AI对话列表页面
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  Card,
  FAB,
  Searchbar,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AgentStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { chatService } from "../../services/chatService";

interface Session {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  messageCount: number;
}

export default function AgentListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AgentStackParamList>>();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await chatService.getSessions();
      const mappedSessions: Session[] = response.sessions.map((s) => ({
        id: s.id,
        title: s.title || "新对话",
        lastMessage: "",
        updatedAt: new Date(s.updatedAt).toLocaleString("zh-CN"),
        messageCount: 0,
      }));
      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Session }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("AgentChat", { sessionId: item.id })}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.messageCount}条消息 · ${item.updatedAt}`}
        left={(props) => <Text style={styles.avatar}>AI</Text>}
      />
      <Card.Content>
        <Text numberOfLines={2} style={styles.lastMessage}>
          {item.lastMessage}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI对话</Text>
        <View style={styles.searchContainer}>
          <IconButton
            icon="magnify"
            iconColor={COLORS.textTertiary}
            size={20}
          />
          <Searchbar
            placeholder="搜索会话..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
          />
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  searchbar: {
    backgroundColor: COLORS.surface,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    color: COLORS.textOnPrimary,
    textAlign: "center",
    lineHeight: 40,
    fontWeight: "bold",
  },
  lastMessage: {
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
