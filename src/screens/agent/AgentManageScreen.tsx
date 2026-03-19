/**
 * MyMe App - Agent Manage Screen
 * Agent管理页面 - PRD v3.0
 * 显示用户创建的Agent分身列表
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AgentStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext"; // 使用 useTheme
import { avatarService } from "../../services/avatarService";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  scenario: string | null;
  status: string;
  permissions: string[];
  shareCode: string | null;
  createdAt: string;
}

const SCENARIO_LABELS: Record<string, string> = {
  interview: "面试",
  work: "工作",
  dating: "相亲",
  consultation: "咨询",
};

export default function AgentManageScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AgentStackParamList>>();
  const { colors } = useTheme(); // 获取动态颜色
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await avatarService.getAvatars();
      const list = Array.isArray(response)
        ? response
        : (response.avatars || (response as any).data || []);
      const mappedAgents: Agent[] = list.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        scenario: a.scenario,
        status: a.status,
        permissions: a.permissions,
        shareCode: a.shareCode || null,
        createdAt: a.createdAt || new Date().toISOString(),
      }));
      setAgents(mappedAgents);
    } catch (error) {
      console.error("Failed to load agents:", error);
      Alert.alert("错误", "加载Agent列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadAgents);
    return unsubscribe;
  }, [navigation, loadAgents]);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate("AgentDetail", { id: agent.id });
  };

  const handleCopyShareCode = (shareCode: string) => {
    Alert.alert("分享码", `分享码: ${shareCode}\n\n已复制到剪贴板`, [
      { text: "确定" },
    ]);
  };

  const renderAgent = ({ item }: { item: Agent }) => (
    <TouchableOpacity onPress={() => handleAgentPress(item)}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title={item.name}
          subtitle={
            item.description || SCENARIO_LABELS[item.scenario || ""] || "无描述"
          }
          left={(props) => (
            <Text
              style={[
                styles.avatarText,
                {
                  backgroundColor: colors.primary,
                  color: colors.textOnPrimary,
                },
              ]}
            >
              {item.name.substring(0, 2).toUpperCase()}
            </Text>
          )}
          right={(props) => (
            <View style={styles.cardRight}>
              {item.shareCode && (
                <IconButton
                  icon="content-copy"
                  size={20}
                  iconColor={colors.textSecondary}
                  onPress={() => handleCopyShareCode(item.shareCode!)}
                />
              )}
            </View>
          )}
        />
        <Card.Content>
          <View style={styles.permissionsRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              授权模块:
            </Text>
            <View style={styles.permissionList}>
              {item.permissions.slice(0, 5).map((p) => (
                <Chip
                  key={p}
                  style={[
                    styles.permissionChip,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                  textStyle={styles.permissionText}
                  compact
                >
                  {p}
                </Chip>
              ))}
              {item.permissions.length > 5 && (
                <Text style={[styles.moreText, { color: colors.textTertiary }]}>
                  +{item.permissions.length - 5}
                </Text>
              )}
            </View>
          </View>
          {item.shareCode && (
            <Text
              style={[styles.shareCodeText, { color: colors.textTertiary }]}
            >
              分享码: {item.shareCode}
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={[styles.title, { color: colors.textOnPrimary }]}>
            我的Agent
          </Text>
          <Text style={[styles.subtitle, { color: colors.textOnPrimary }]}>
            创建可授权的数字分身
          </Text>
        </View>
        <IconButton
          icon="plus"
          iconColor={colors.textOnPrimary}
          size={26}
          onPress={() => navigation.navigate("AgentCreate", {})}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={agents}
          renderItem={renderAgent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                暂无Agent分身
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                点击右上角+创建你的第一个Agent
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
  header: {
    padding: 20,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  avatarText: {
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    lineHeight: 40,
    fontWeight: "bold",
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    marginRight: 8,
  },
  permissionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  permissionChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    marginLeft: 4,
  },
  shareCodeText: {
    fontSize: 12,
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
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
