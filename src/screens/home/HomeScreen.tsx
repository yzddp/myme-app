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
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, ActivityIndicator, IconButton, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { chatService } from "../../services/chatService";
import AppHeader from "../../components/AppHeader";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  type: "personal" | "agent_self" | "agent_other";
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

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
      const mappedSessions: ChatSession[] = (
        (response as any).items ||
        (response as any).sessions ||
        []
      ).map((s: any) => ({
        id: s.id,
        title: s.title || "新对话",
        lastMessage: s.lastMessage || "",
        updatedAt: s.updatedAt || new Date().toISOString(),
        type: s.type || "agent_self",
      }));
      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
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
        month: "numeric",
        day: "numeric",
      });
    }
  };

  const handleDelete = (sessionId: string, title: string) => {
    Alert.alert("删除对话", `确定要删除与 ${title} 的对话吗？`, [
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

  const handleAddChat = () => {
    setMenuVisible(true);
  };

  const handleMyPastAgent = async () => {
    setMenuVisible(false);
    try {
      const session = await chatService.createSession(
        "agent" as any,
        "我的过去",
        "me_agent",
      );
      navigation.navigate("Chat", {
        sessionId: (session as any)?.id,
        type: "agent_self",
      });
    } catch (error) {
      Alert.alert("错误", "创建我的过去对话失败");
    }
  };

  const handleLifePlanner = async () => {
    setMenuVisible(false);
    try {
      const session = await chatService.createSession(
        "agent" as any,
        "人生规划",
        "life_planner",
      );
      navigation.navigate("Chat", { sessionId: (session as any)?.id });
    } catch (error) {
      Alert.alert("错误", "创建人生规划对话失败");
    }
  };

  const getAvatarLabel = (type: string, title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "personal":
        return "account";
      case "agent_other":
        return "robot-excited";
      default:
        return "robot"; // agent_self
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "personal":
        return colors.success;
      case "agent_other":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const renderSession = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: colors.divider }]}
      onPress={() => {
        navigation.navigate("Chat", { sessionId: item.id, type: item.type });
      }}
      onLongPress={() => handleDelete(item.id, item.title)}
    >
      <View style={styles.avatarWrapper}>
        <View
          style={[styles.avatar, { backgroundColor: getTypeColor(item.type) }]}
        >
          <Text style={[styles.avatarText, { color: colors.textOnPrimary }]}>
            {getAvatarLabel(item.type, item.title)}
          </Text>
        </View>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Icon
            source={getTypeIcon(item.type)}
            size={11}
            color={getTypeColor(item.type)}
          />
        </View>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text
            style={[styles.chatTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.chatTime, { color: colors.textTertiary }]}>
            {formatTime(item.updatedAt)}
          </Text>
        </View>
        <Text
          style={[styles.chatPreview, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {item.lastMessage || "暂无消息"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="对话" rightIcon="plus" onRightPress={handleAddChat} />

      {/* WeChat-style 下拉菜单 */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuBox, { backgroundColor: "#3A3A3C" }]}>
                {/* 小箭头 */}
                <View style={styles.menuArrow} />
                {/* 我的过去 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleMyPastAgent}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuText}>我的过去</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                {/* 人生导师 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLifePlanner}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuText}>人生导师</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                暂无对话
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                点击右上角+开始新对话
              </Text>
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
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  chatPreview: {
    fontSize: 14,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  // WeChat-style 下拉菜单
  menuOverlay: {
    flex: 1,
  },
  menuBox: {
    position: "absolute",
    top: 60,
    right: 12,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuArrow: {
    position: "absolute",
    top: -8,
    right: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#3A3A3C",
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
    color: "#fff",
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 16,
  },

  shareBox: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
  },
  shareTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
  },
  shareSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  shareInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    letterSpacing: 2,
  },
  shareButtons: {
    flexDirection: "row",
    gap: 12,
  },
  shareBtn: {
    flex: 1,
  },
});
