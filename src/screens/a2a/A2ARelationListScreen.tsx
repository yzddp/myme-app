/**
 * MyMe App - A2A Relation List Screen
 * A2A关系列表页面 - PRD v3.0
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
  FAB,
  Chip,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";

interface A2ARelation {
  id: string;
  peerId: string;
  peerName: string;
  shareCode: string;
  permissions: string[];
  status: "active" | "blocked";
  createdAt: string;
}

const MODULE_LABELS: Record<string, string> = {
  M1: "个人信息",
  M2: "记忆经历",
  M3: "知识技能",
  M4: "兴趣偏好",
  M5: "社会关系",
  M6: "价值观",
  M7: "决策模式",
  M8: "情感心理",
  M9: "抽象创意",
  M10: "整合自省",
};

export default function A2ARelationListScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [relations, setRelations] = useState<A2ARelation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRelations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await a2aService.getRelations();
      const mappedRelations: A2ARelation[] = response.relations.map(
        (r: any) => ({
          id: r.id,
          peerId: r.peerId,
          peerName: r.peerName || r.peer?.name || "未知",
          shareCode: r.shareCode,
          permissions: r.permissions || [],
          status: r.status,
          createdAt: r.createdAt,
        }),
      );
      setRelations(mappedRelations);
    } catch (error) {
      console.error("Failed to load A2A relations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadRelations);
    return unsubscribe;
  }, [navigation, loadRelations]);

  const handleChat = (relation: A2ARelation) => {
    navigation.navigate("A2AChat", { relationId: relation.id });
  };

  const handleEdit = (relation: A2ARelation) => {
    Alert.alert("编辑权限", `编辑与 ${relation.peerName} 的权限设置`, [
      { text: "取消", style: "cancel" },
      { text: "确定", onPress: () => {} },
    ]);
  };

  const handleDelete = (relation: A2ARelation) => {
    Alert.alert("删除关系", `确定要删除与 ${relation.peerName} 的关系吗？`, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          try {
            await a2aService.deleteRelation(relation.id);
            loadRelations();
          } catch (error) {
            console.error("Failed to delete relation:", error);
            Alert.alert("错误", "删除失败");
          }
        },
      },
    ]);
  };

  const handleAddRelation = () => {
    Alert.alert("添加关系", "请输入分享码（功能开发中）", [
      { text: "取消", style: "cancel" },
      { text: "确定" },
    ]);
  };

  const renderRelation = ({ item }: { item: A2ARelation }) => (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <Card.Title
        title={item.peerName}
        subtitle={`分享码: ${item.shareCode}`}
        left={(props) => (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.textOnPrimary }]}>
              {item.peerName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        right={(props) => (
          <View style={styles.actionButtons}>
            <IconButton
              icon="chat"
              size={20}
              iconColor={colors.primary}
              onPress={() => handleChat(item)}
            />
            <IconButton
              icon="pencil"
              size={20}
              iconColor={colors.textSecondary}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor={colors.error}
              onPress={() => handleDelete(item)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          授权模块:
        </Text>
        <View style={styles.permissionList}>
          {item.permissions.map((p) => (
            <Chip
              key={p}
              style={[
                styles.permissionChip,
                { backgroundColor: colors.surfaceVariant },
              ]}
              compact
            >
              {p}
            </Chip>
          ))}
          {item.permissions.length === 0 && (
            <Text style={[styles.noPermission, { color: colors.textTertiary }]}>
              暂无授权
            </Text>
          )}
        </View>
        <View style={styles.statusRow}>
          <Chip
            style={[
              styles.statusChip,
              item.status === "active"
                ? { backgroundColor: colors.success }
                : { backgroundColor: colors.textTertiary },
            ]}
            textStyle={{ color: colors.textOnPrimary, fontSize: 12 }}
          >
            {item.status === "active" ? "活跃" : "已阻止"}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.title, { color: colors.textOnPrimary }]}>
          A2A关系
        </Text>
        <Text style={[styles.subtitle, { color: colors.textOnPrimary }]}>
          与你共享AI分身的伙伴
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={relations}
          renderItem={renderRelation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                暂无A2A关系
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                点击右下角添加新的伙伴关系
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddRelation}
        label="添加"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 48,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginLeft: 48,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  permissionList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  permissionChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  noPermission: {
    fontSize: 14,
    fontStyle: "italic",
  },
  statusRow: {
    marginTop: 12,
  },
  statusChip: {
    alignSelf: "flex-start",
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
