/**
 * MyMe App - Avatar List Screen
 * 分身列表页面
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, FAB, Chip, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AvatarStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { avatarService } from "../../services/avatarService";

interface Avatar {
  id: string;
  name: string;
  description: string | null;
  scenario: string | null;
  status: string;
  permissions: string[];
  shareCode: string | null;
}

export default function AvatarListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AvatarStackParamList>>();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      const response = await avatarService.getAvatars();
      const mappedAvatars: Avatar[] = response.avatars.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        scenario: a.scenario,
        status: a.status,
        permissions: a.permissions,
        shareCode: (a as any).shareCode || null,
      }));
      setAvatars(mappedAvatars);
    } catch (error) {
      console.error("Failed to load avatars:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = ({ item }: { item: Avatar }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        subtitle={item.scenario}
        right={(props) => (
          <Chip style={styles.statusChip} textStyle={styles.statusText}>
            {item.status === "active" ? "活跃" : "停用"}
          </Chip>
        )}
      />
      <Card.Content>
        <Text style={styles.label}>授权模块：</Text>
        <View style={styles.permissionList}>
          {item.permissions.map((p) => (
            <Chip
              key={p}
              style={styles.permissionChip}
              textStyle={styles.permissionText}
            >
              {p}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的分身</Text>
        <Text style={styles.subtitle}>创建可授权的数字分身</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={avatars}
          renderItem={renderAvatar}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无分身</Text>
              <Text style={styles.emptySubtext}>
                点击右下角创建你的第一个分身
              </Text>
            </View>
          }
        />
      )}

      <FAB icon="plus" style={styles.fab} onPress={() => {}} label="创建分身" />
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
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  statusChip: {
    marginRight: 16,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  permissionList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  permissionChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  permissionText: {
    fontSize: 12,
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
