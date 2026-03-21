/**
 * MyMe App - Knowledge Detail Screen
 * 知识详情页面
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card, Chip, ActivityIndicator, Icon } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKnowledgeStore } from "../../store/knowledgeStore";
import { KNOWLEDGE_MODULE_DESCRIPTIONS } from "../../types/knowledge";
import type { KnowledgeItem } from "../../types/knowledge";
import AppHeader from "../../components/AppHeader";

type DetailRouteProp = RouteProp<ProfileStackParamList, "KnowledgeDetail">;
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function KnowledgeDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;
  const { getById } = useKnowledgeStore();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<KnowledgeItem | null>(null);

  useEffect(() => {
    getById(id)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>未找到该知识条目</Text>
      </View>
    );
  }

  const moduleLabel = KNOWLEDGE_MODULE_DESCRIPTIONS[item.module] || item.module;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="知识详情"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="pencil"
        onRightPress={() => navigation.navigate("KnowledgeEdit", { id })}
        centerTitle
      />

      <ScrollView contentContainerStyle={styles.body}>
        <Chip
          style={[styles.chip, { backgroundColor: colors.primaryLight + "30" }]}
        >
          {moduleLabel}
        </Chip>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.content, { color: colors.textPrimary }]}>
              {item.content}
            </Text>
          </Card.Content>
        </Card>
        <Text style={[styles.meta, { color: colors.textTertiary }]}>
          创建于 {new Date(item.createdAt).toLocaleDateString("zh-CN")}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { padding: 20, gap: 16 },
  chip: { alignSelf: "flex-start", marginBottom: 4 },
  card: { marginBottom: 4 },
  content: { fontSize: 15, lineHeight: 24 },
  meta: { fontSize: 12 },
});
