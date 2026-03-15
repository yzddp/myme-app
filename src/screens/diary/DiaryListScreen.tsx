/**
 * MyMe App - Diary List Screen
 * 日记列表页面 - 支持日记/周报/月报/年报切换
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import {
  Text,
  Card,
  FAB,
  Chip,
  ActivityIndicator,
  SegmentedButtons,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DiaryStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { diaryService } from "../../services/diaryService";
import type { DiaryEntry, DiaryAnalysisReport } from "../../types/diary";

type TabType = "diary" | "weekly" | "monthly" | "yearly";

type DiaryItem = DiaryEntry;

type ReportItem = DiaryAnalysisReport;

type ListItem = DiaryItem | ReportItem;

const getSentimentColor = (sentiment: string | null | undefined) => {
  switch (sentiment) {
    case "positive":
      return COLORS.sentimentPositive;
    case "negative":
      return COLORS.sentimentNegative;
    default:
      return COLORS.sentimentNeutral;
  }
};

const getSentimentLabel = (sentiment: string | null | undefined) => {
  switch (sentiment) {
    case "positive":
      return "积极";
    case "negative":
      return "消极";
    default:
      return "中性";
  }
};

const formatDateRange = (
  startDate: string,
  endDate: string,
  periodType: string,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (periodType === "weekly") {
    const formatDate = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
    return `${formatDate(start)} - ${formatDate(end)}`;
  } else if (periodType === "monthly") {
    return `${start.getFullYear()}年${start.getMonth() + 1}月`;
  } else if (periodType === "yearly") {
    return `${start.getFullYear()}年`;
  }
  return `${startDate} - ${endDate}`;
};

export default function DiaryListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabType>("diary");
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (activeTab === "diary") {
        const response = await diaryService.getDiaries({ page: 1, limit: 50 });
        const mappedDiaries: DiaryItem[] = response.diaries.map((d) => ({
          id: d.id,
          userId: d.userId,
          content: d.content,
          summary: d.summary || "",
          sentiment: d.sentiment || null,
          keywords: d.keywords || [],
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        }));
        setDiaries(mappedDiaries);
      } else if (activeTab === "weekly") {
        const response = await diaryService.getWeeklyReports({
          page: 1,
          limit: 50,
        });
        setReports(response.reports);
      } else if (activeTab === "monthly") {
        const response = await diaryService.getMonthlyReports({
          page: 1,
          limit: 50,
        });
        setReports(response.reports);
      } else if (activeTab === "yearly") {
        const response = await diaryService.getYearlyReports({
          page: 1,
          limit: 50,
        });
        setReports(response.reports);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const renderDiaryItem = ({ item }: { item: DiaryItem }) => {
    const date = new Date(item.createdAt);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate("DiaryEdit", { id: item.id })}
      >
        <Card.Title
          title={dateStr}
          subtitle={item.summary || "暂无摘要"}
          right={(props) =>
            item.sentiment && (
              <Chip
                style={[
                  styles.sentimentChip,
                  { backgroundColor: getSentimentColor(item.sentiment) },
                ]}
                textStyle={styles.sentimentText}
              >
                {getSentimentLabel(item.sentiment)}
              </Chip>
            )
          }
        />
        <Card.Content>
          <Text numberOfLines={3} style={styles.content}>
            {item.content}
          </Text>
          {item.keywords && item.keywords.length > 0 && (
            <View style={styles.keywordList}>
              {item.keywords.slice(0, 5).map((keyword, index) => (
                <Chip
                  key={index}
                  style={styles.keywordChip}
                  textStyle={styles.keywordText}
                >
                  {keyword}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderReportItem = ({ item }: { item: ReportItem }) => {
    const dateRange = formatDateRange(
      item.startDate,
      item.endDate,
      item.periodType,
    );
    const sentimentText = item.sentimentData
      ? `日记${item.diaryCount}篇`
      : "暂无数据";

    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate("DiaryReport", {
            reportId: item.id,
            periodType: item.periodType,
          })
        }
      >
        <Card.Title
          title={dateRange}
          subtitle={sentimentText}
          right={(props) =>
            item.sentimentData && (
              <View style={styles.sentimentRow}>
                <Chip
                  style={[
                    styles.sentimentChip,
                    { backgroundColor: COLORS.sentimentPositive },
                  ]}
                  textStyle={styles.sentimentText}
                >
                  {item.sentimentData.percentage.positive.toFixed(0)}%
                </Chip>
              </View>
            )
          }
        />
        <Card.Content>
          {item.summary && (
            <Text numberOfLines={3} style={styles.content}>
              {item.summary}
            </Text>
          )}
          {item.themes && item.themes.length > 0 && (
            <View style={styles.keywordList}>
              {item.themes.slice(0, 5).map((theme, index) => (
                <Chip
                  key={index}
                  style={styles.keywordChip}
                  textStyle={styles.keywordText}
                >
                  {theme}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyComponent = () => {
    const emptyTexts: Record<TabType, { title: string; subtitle: string }> = {
      diary: { title: "暂无日记", subtitle: "点击右下角开始写日记" },
      weekly: { title: "暂无周报", subtitle: "周报将在每周日自动生成" },
      monthly: { title: "暂无月报", subtitle: "月报将在每月最后一天自动生成" },
      yearly: { title: "暂无年报", subtitle: "年报将在每年12月31日自动生成" },
    };

    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyTexts[activeTab].title}</Text>
        <Text style={styles.emptySubtext}>
          {emptyTexts[activeTab].subtitle}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    const data = activeTab === "diary" ? diaries : reports;

    return (
      <FlatList<ListItem>
        data={data as ListItem[]}
        renderItem={
          activeTab === "diary"
            ? (renderDiaryItem as any)
            : (renderReportItem as any)
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyComponent()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>日记</Text>
      </View>

      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          buttons={[
            { value: "diary", label: "日记" },
            { value: "weekly", label: "周报" },
            { value: "monthly", label: "月报" },
            { value: "yearly", label: "年报" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {renderContent()}

      {activeTab === "diary" && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("DiaryEdit", {})}
        />
      )}
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
  tabContainer: {
    padding: 16,
    backgroundColor: COLORS.primary,
    paddingBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: COLORS.surface,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  sentimentChip: {
    marginRight: 8,
  },
  sentimentText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
  },
  sentimentRow: {
    flexDirection: "row",
    marginRight: 8,
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
