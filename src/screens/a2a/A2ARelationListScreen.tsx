import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Card, FAB, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";
import type { A2ARelation } from "../../types/a2a";
import AppHeader from "../../components/AppHeader";
import { resolveAvatarUrl } from "../../utils/avatar";

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
      setRelations(response.relations);
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

  const renderRelation = ({ item }: { item: A2ARelation }) => {
    const displayName =
      item.counterpartUser.nickname ||
      item.counterpartUser.username ||
      "未命名用户";
    const avatarUri = resolveAvatarUrl(item.counterpartUser.avatarUrl);

    return (
      <Card
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate("A2AChat", { relationId: item.id })}
      >
        <Card.Content style={styles.cardContent}>
          {avatarUri ? (
            <Avatar.Image size={50} source={{ uri: avatarUri }} />
          ) : (
            <Avatar.Text size={50} label={displayName.slice(0, 2)} />
          )}

          <View style={styles.textWrap}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {displayName}
              </Text>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      item.status === "active"
                        ? colors.primary
                        : colors.textTertiary,
                  },
                ]}
              >
                {item.status === "active" ? "可聊天" : "已屏蔽"}
              </Text>
            </View>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              对方分身：{item.counterpartAvatar.name} · 我方分身：
              {item.selfAvatar.name}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.preview, { color: colors.textSecondary }]}
            >
              {item.latestMessagePreview || "还没有消息，点击开始对话"}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="A2A 会话"
        subtitle="明确展示双方正在使用的分身身份"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={relations}
          renderItem={renderRelation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textSecondary }}>暂无 A2A 会话</Text>
              <Text style={{ color: colors.textTertiary, marginTop: 8 }}>
                点击右下角，先校验分享码再选择你的分身
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        label="添加"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("A2AAdd")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  list: { padding: 16, paddingBottom: 96, gap: 12 },
  card: { borderRadius: 20, marginBottom: 12 },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 14 },
  textWrap: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 17, fontWeight: "700" },
  status: { fontSize: 12, fontWeight: "700" },
  subtitle: { fontSize: 13, lineHeight: 20, marginTop: 6 },
  preview: { fontSize: 13, marginTop: 8 },
  fab: { position: "absolute", right: 16, bottom: 16 },
});
