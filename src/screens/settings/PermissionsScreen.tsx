/**
 * MyMe App - Permissions Screen
 * 授权管理页面
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Card, Button, IconButton, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useA2AStore } from "../../store/a2aStore";
import type { A2ARelation } from "../../types/a2a";
import AppHeader from "../../components/AppHeader";

interface PermissionsScreenProps {
  navigation?: any;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { relations, loadRelations, deleteRelation } = useA2AStore();

  useEffect(() => {
    loadRelations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRelations();
    setRefreshing(false);
  };

  const handleRevoke = async (relation: A2ARelation) => {
    await deleteRelation(relation.id);
  };

  return (
    <View style={styles(colors).container}>
      <AppHeader
        title="授权管理"
        subtitle="管理已授权的A2A关系"
        leftIcon="arrow-left"
        onLeftPress={() => navigation?.goBack()}
      />

      <FlatList
        data={relations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles(colors).card}>
            <Card.Content>
              <View style={styles(colors).cardHeader}>
                <Text style={styles(colors).peerName}>
                  {item.counterpartUser.nickname ||
                    item.counterpartUser.username ||
                    item.counterpartAvatar.name}
                </Text>
                <Text
                  style={[
                    styles(colors).status,
                    item.status === "active"
                      ? styles(colors).activeStatus
                      : styles(colors).blockedStatus,
                  ]}
                >
                  {item.status === "active" ? "活跃" : "已阻止"}
                </Text>
              </View>
              <Text style={styles(colors).summaryText}>
                对方分身：{item.counterpartAvatar.name} · 我方分身：
                {item.selfAvatar.name}
              </Text>
              <Text style={styles(colors).permissionsLabel}>已授权模块:</Text>
              <View style={styles(colors).permissionsContainer}>
                {item.counterpartAvatar.permissions.map(
                  (p: string, idx: number) => (
                    <Text key={idx} style={styles(colors).permissionChip}>
                      {p}
                    </Text>
                  ),
                )}
                {item.counterpartAvatar.permissions.length === 0 ? (
                  <Text style={styles(colors).emptyPermissionText}>
                    未开放知识模块
                  </Text>
                ) : null}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined" onPress={() => handleRevoke(item)}>
                撤销授权
              </Button>
            </Card.Actions>
          </Card>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles(colors).emptyContainer}>
            <Text style={styles(colors).emptyText}>暂无授权关系</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    peerName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    status: {
      fontSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    activeStatus: {
      backgroundColor: colors.success + "20",
      color: colors.success,
    },
    blockedStatus: {
      backgroundColor: colors.error + "20",
      color: colors.error,
    },
    permissionsLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      marginTop: 10,
    },
    summaryText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 18,
    },
    permissionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    emptyPermissionText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    permissionChip: {
      backgroundColor: colors.primaryLight + "30",
      color: colors.primary,
      fontSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

export default PermissionsScreen;
