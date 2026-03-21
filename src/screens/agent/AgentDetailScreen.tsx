/**
 * MyMe App - Agent Detail Screen
 * Agent详情页面 - PRD v3.0
 */

import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AgentStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { avatarService } from "../../services/avatarService";
import AppHeader from "../../components/AppHeader";

const SCENARIO_LABELS: Record<string, string> = {
  interview: "面试",
  work: "工作",
  dating: "相亲",
  consultation: "咨询",
};

const MODULE_LABELS: Record<string, string> = {
  M1: "个人信息与背景",
  M2: "记忆与经历",
  M3: "知识与技能",
  M4: "兴趣与偏好",
  M5: "社会关系",
  M6: "价值观与信念",
  M7: "决策与思考模式",
  M8: "情感与心理",
  M9: "抽象与创意",
  M10: "整合与自省",
};

type AgentDetailRouteProp = RouteProp<AgentStackParamList, "AgentDetail">;

export default function AgentDetailScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AgentStackParamList>>();
  const route = useRoute<AgentDetailRouteProp>();
  const { id } = route.params;

  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        },
        content: {
          padding: 16,
        },
        avatarSection: {
          alignItems: "center",
          marginBottom: 24,
        },
        avatar: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        },
        avatarText: {
          fontSize: 32,
          fontWeight: "bold",
          color: colors.textOnPrimary,
        },
        agentName: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 8,
        },
        statusChip: {
          marginTop: 4,
        },
        activeChip: {
          backgroundColor: colors.success,
        },
        inactiveChip: {
          backgroundColor: colors.textTertiary,
        },
        statusText: {
          color: colors.textOnPrimary,
          fontSize: 12,
        },
        card: {
          marginBottom: 16,
          backgroundColor: colors.surface,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 12,
        },
        infoRow: {
          marginBottom: 12,
        },
        infoLabel: {
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 4,
        },
        infoValue: {
          fontSize: 16,
          color: colors.textPrimary,
        },
        shareCodeRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        shareCode: {
          fontSize: 20,
          fontWeight: "bold",
          color: colors.primary,
          letterSpacing: 4,
        },
        noShareCode: {
          fontSize: 14,
          color: colors.textTertiary,
        },
        permissionList: {
          marginTop: 8,
        },
        permissionItem: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },
        permissionChip: {
          marginRight: 12,
          backgroundColor: colors.surfaceVariant,
        },
        permissionLabel: {
          fontSize: 14,
          color: colors.textSecondary,
        },
        actions: {
          marginTop: 16,
          marginBottom: 32,
        },
        actionButton: {
          marginBottom: 12,
        },
      }),
    [colors],
  );

  useEffect(() => {
    loadAgent();
  }, [id]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      const data = await avatarService.getAvatar(id);
      setAgent(data);
    } catch (error) {
      console.error("Failed to load agent:", error);
      Alert.alert("错误", "加载Agent详情失败", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("AgentCreate", { id });
  };

  const handleDelete = () => {
    Alert.alert("删除Agent", "确定要删除这个Agent吗？此操作不可撤销。", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          try {
            await avatarService.delete(id);
            Alert.alert("成功", "Agent已删除", [
              { text: "确定", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Failed to delete agent:", error);
            Alert.alert("错误", "删除失败");
          }
        },
      },
    ]);
  };

  const handleCopyShareCode = () => {
    if (agent?.shareCode) {
      Alert.alert("分享码", `分享码: ${agent.shareCode}\n\n已复制到剪贴板`, [
        { text: "确定" },
      ]);
    }
  };

  const handleToggleStatus = async () => {
    if (!agent) return;
    const newStatus = agent.status === "active" ? "inactive" : "active";
    try {
      await avatarService.updateStatus(id, newStatus);
      setAgent({ ...agent, status: newStatus });
      Alert.alert("成功", `Agent已${newStatus === "active" ? "激活" : "停用"}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      Alert.alert("错误", "状态更新失败");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Agent详情"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="pencil"
        onRightPress={handleEdit}
        centerTitle
      />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {agent.name?.substring(0, 2).toUpperCase() || "AG"}
            </Text>
          </View>
          <Text style={styles.agentName}>{agent.name}</Text>
          <Chip
            style={[
              styles.statusChip,
              agent.status === "active"
                ? styles.activeChip
                : styles.inactiveChip,
            ]}
            textStyle={styles.statusText}
          >
            {agent.status === "active" ? "活跃" : "停用"}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>描述</Text>
              <Text style={styles.infoValue}>
                {agent.description || "无描述"}
              </Text>
            </View>
            {agent.scenario && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>场景</Text>
                <Text style={styles.infoValue}>
                  {SCENARIO_LABELS[agent.scenario] || agent.scenario}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>分享码</Text>
            {agent.shareCode ? (
              <View style={styles.shareCodeRow}>
                <Text style={styles.shareCode}>{agent.shareCode}</Text>
                <Button mode="outlined" onPress={handleCopyShareCode} compact>
                  复制
                </Button>
              </View>
            ) : (
              <Text style={styles.noShareCode}>暂无分享码</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>授权模块</Text>
            <View style={styles.permissionList}>
              {agent.permissions?.map((p: string) => (
                <View key={p} style={styles.permissionItem}>
                  <Chip style={styles.permissionChip}>{p}</Chip>
                  <Text style={styles.permissionLabel}>
                    {MODULE_LABELS[p] || ""}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleToggleStatus}
            style={styles.actionButton}
            buttonColor={
              agent.status === "active" ? colors.warning : colors.primary
            }
          >
            {agent.status === "active" ? "停用Agent" : "激活Agent"}
          </Button>
          <Button
            mode="outlined"
            onPress={handleEdit}
            style={styles.actionButton}
          >
            编辑
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            textColor={colors.error}
          >
            删除
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
