/**
 * MyMe App - Diary List Screen
 * 日记列表页面
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, FAB, Chip, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DiaryStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { diaryService } from "../../services/diaryService";

interface Diary {
  id: string;
  content: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
  createdAt: string;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return COLORS.sentimentPositive;
    case "negative":
      return COLORS.sentimentNegative;
    default:
      return COLORS.sentimentNeutral;
  }
};

const getSentimentLabel = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "积极";
    case "negative":
      return "消极";
    default:
      return "中性";
  }
};

export default function DiaryListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      setLoading(true);
      const response = await diaryService.getDiaries({ page: 1, limit: 20 });
      const mappedDiaries: Diary[] = response.diaries.map((d: any) => ({
        id: d.id,
        content: d.content,
        summary: d.summary || "",
        sentiment: d.sentiment || "neutral",
        keywords: d.keywords || [],
        createdAt: d.createdAt,
      }));
      setDiaries(mappedDiaries);
    } catch (error) {
      console.error("Failed to load diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDiary = ({ item }: { item: Diary }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.summary}
        subtitle={item.createdAt}
        right={(props) => (
          <Chip
            style={[
              styles.sentimentChip,
              { backgroundColor: getSentimentColor(item.sentiment) },
            ]}
            textStyle={styles.sentimentText}
          >
            {getSentimentLabel(item.sentiment)}
          </Chip>
        )}
      />
      <Card.Content>
        <Text numberOfLines={3} style={styles.content}>
          {item.content}
        </Text>
        <View style={styles.keywordList}>
          {item.keywords.map((keyword, index) => (
            <Chip
              key={index}
              style={styles.keywordChip}
              textStyle={styles.keywordText}
            >
              {keyword}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的日记</Text>
        <Text style={styles.subtitle}>记录生活，AI分析</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={diaries}
          renderItem={renderDiary}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无日记</Text>
              <Text style={styles.emptySubtext}>点击右下角开始写日记</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("DiaryEdit", {})}
      />
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
  sentimentChip: {
    marginRight: 16,
  },
  sentimentText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
  },
  content: {
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  keywordList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  keywordChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  keywordText: {
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
