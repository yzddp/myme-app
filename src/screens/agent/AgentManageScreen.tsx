/**
 * MyMe App - Agent Manage Screen
 * Agent管理页面 - PRD v3.0
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  IconButton,
  SegmentedButtons,
  Button,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AgentStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { avatarService } from "../../services/avatarService";
import { a2aService } from "../../services/a2aService";
import AppHeader from "../../components/AppHeader";

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

interface AgentRelation {
  id: string;
  peerId: string;
  peerName: string;
  shareCode: string | null;
  permissions: string[];
  status: "active" | "blocked";
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
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"relations" | "agents">(
    "relations",
  );
  const [agents, setAgents] = useState<Agent[]>([]);
  const [relations, setRelations] = useState<AgentRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareCode, setShareCode] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [avatarResponse, relationResponse] = await Promise.all([
        avatarService.getAvatars(),
        a2aService.getRelations(),
      ]);

      const avatarList = Array.isArray(avatarResponse)
        ? avatarResponse
        : avatarResponse.avatars || (avatarResponse as any).data || [];

      const mappedAgents: Agent[] = avatarList.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        scenario: a.scenario,
        status: a.status,
        permissions: a.permissions || [],
        shareCode: a.shareCode || null,
        createdAt: a.createdAt || new Date().toISOString(),
      }));

      const mappedRelations: AgentRelation[] = (
        relationResponse.relations || []
      ).map((r: any) => ({
        id: r.id,
        peerId: r.counterpartUser?.id || "",
        peerName:
          r.counterpartUser?.nickname ||
          r.counterpartUser?.username ||
          r.counterpartAvatar?.name ||
          "未知",
        shareCode: null,
        permissions: r.counterpartAvatar?.permissions || [],
        status: r.status,
        createdAt: r.createdAt,
      }));

      setAgents(mappedAgents);
      setRelations(mappedRelations);
    } catch (error) {
      console.error("Failed to load agent data:", error);
      Alert.alert("错误", "加载Agent数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const handleCopyShareCode = (code: string) => {
    Alert.alert("分享码", `分享码: ${code}`);
  };

  const handleAddPress = () => {
    if (activeTab === "agents") {
      navigation.navigate("AgentCreate", {});
      return;
    }
    setShareModalVisible(true);
  };

  const handleConfirmShareCode = () => {
    if (!shareCode.trim()) {
      Alert.alert("错误", "请输入分享码");
      return;
    }
    setShareModalVisible(false);
    setShareCode("");
    Alert.alert("提示", "功能开发中");
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        tabContainer: {
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: colors.background,
        },
        segmentedButtons: {
          borderRadius: 24,
        },
        list: {
          padding: 16,
          flexGrow: 1,
        },
        card: {
          marginBottom: 12,
          backgroundColor: colors.surface,
        },
        avatarCircle: {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        },
        avatarText: {
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
        relationMeta: {
          paddingTop: 4,
        },
        relationStatus: {
          fontSize: 12,
          marginTop: 6,
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
          marginTop: 8,
          color: colors.textTertiary,
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        shareOverlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
        shareBox: {
          width: "85%",
          borderRadius: 16,
          padding: 24,
          backgroundColor: colors.surface,
        },
        shareTitle: {
          fontSize: 17,
          fontWeight: "bold",
          marginBottom: 6,
          color: colors.textPrimary,
        },
        shareSubtitle: {
          fontSize: 14,
          marginBottom: 16,
          color: colors.textSecondary,
        },
        shareInput: {
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          fontSize: 16,
          marginBottom: 20,
          letterSpacing: 2,
          backgroundColor: colors.background,
          color: colors.textPrimary,
          borderColor: colors.border,
        },
        shareButtons: {
          flexDirection: "row",
          gap: 12,
        },
        shareBtn: {
          flex: 1,
        },
      }),
    [colors],
  );

  const renderAgent = ({ item }: { item: Agent }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("AgentDetail", { id: item.id })}
    >
      <Card style={styles.card}>
        <Card.Title
          title={item.name}
          subtitle={
            item.description || SCENARIO_LABELS[item.scenario || ""] || "无描述"
          }
          left={() => (
            <View
              style={[styles.avatarCircle, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.avatarText, { color: colors.textOnPrimary }]}
              >
                {item.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          right={() => (
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

  const renderRelation = ({ item }: { item: AgentRelation }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.peerName}
        subtitle={`分享码: ${item.shareCode}`}
        left={() => (
          <View
            style={[styles.avatarCircle, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.avatarText, { color: colors.textOnPrimary }]}>
              {item.peerName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.permissionList}>
          {item.permissions.length > 0 ? (
            item.permissions.map((p) => (
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
            ))
          ) : (
            <Text style={[styles.moreText, { color: colors.textTertiary }]}>
              暂无授权
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.relationStatus,
            {
              color:
                item.status === "active" ? colors.success : colors.textTertiary,
            },
          ]}
        >
          {item.status === "active" ? "关系有效" : "已阻止"}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Agent管理"
        rightIcon="plus"
        onRightPress={handleAddPress}
      />

      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "relations" | "agents")
          }
          buttons={[
            { value: "relations", label: "Agent关系" },
            { value: "agents", label: "我的Agent" },
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
          data={activeTab === "agents" ? agents : relations}
          renderItem={
            activeTab === "agents"
              ? (renderAgent as any)
              : (renderRelation as any)
          }
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {activeTab === "agents" ? "暂无Agent分身" : "暂无Agent关系"}
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === "agents"
                  ? "点击右上角+创建你的第一个Agent"
                  : "点击右上角+添加Agent"}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={shareModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShareModalVisible(false)}>
          <View style={styles.shareOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.shareBox}>
                <Text style={styles.shareTitle}>添加其他人的Agent</Text>
                <Text style={styles.shareSubtitle}>输入对方的Agent分享码</Text>
                <TextInput
                  style={styles.shareInput}
                  placeholder="输入分享码"
                  placeholderTextColor={colors.textTertiary}
                  value={shareCode}
                  onChangeText={setShareCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={6}
                />
                <View style={styles.shareButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setShareModalVisible(false);
                      setShareCode("");
                    }}
                    style={styles.shareBtn}
                  >
                    取消
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleConfirmShareCode}
                    style={styles.shareBtn}
                  >
                    添加
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
