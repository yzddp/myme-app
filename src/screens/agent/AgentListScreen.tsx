/**
 * MyMe App - Agent List Screen
 * AI对话列表页面
 */

import React, { useEffect, useState, useMemo } from "react";
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
import { useTheme } from "../../context/ThemeContext";
import { chatService } from "../../services/chatService";

interface Session {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  messageCount: number;
}

export default function AgentListScreen() {
  const { colors } = useTheme();
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          padding: 20,
          paddingTop: 48,
          backgroundColor: colors.primary,
        },
        title: {
          fontSize: 28,
          fontWeight: "bold",
          color: colors.textOnPrimary,
          marginBottom: 12,
        },
        searchContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 8,
        },
        searchbar: {
          backgroundColor: colors.surface,
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
            iconColor={colors.textTertiary}
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
