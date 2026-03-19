/**
 * MyMe App - Diary List Screen
 * 日记列表页面 - 支持日记/周报/月报/年报切换
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from "react-native";
import {
  Text,
  Card,
  IconButton,
  ActivityIndicator,
  SegmentedButtons,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DiaryStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { diaryService } from "../../services/diaryService";
import type { DiaryEntry, DiaryAnalysisReport } from "../../types/diary";

type TabType = "diary" | "weekly" | "monthly" | "yearly";

type DiaryItem = DiaryEntry;

type ReportItem = DiaryAnalysisReport;

type ListItem = DiaryItem | ReportItem;

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
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabType>("diary");
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fabLoading, setFabLoading] = useState(false);

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
      } else {
        let response;
        if (activeTab === "weekly") {
          response = await diaryService.getWeeklyReports({
            page: 1,
            limit: 50,
          });
        } else if (activeTab === "monthly") {
          response = await diaryService.getMonthlyReports({
            page: 1,
            limit: 50,
          });
        } else {
          response = await diaryService.getYearlyReports({
            page: 1,
            limit: 50,
          });
        }
        const mappedReports: DiaryAnalysisReport[] = response.reports.map(
          (r: any) => ({
            id: r.id,
            userId: r.userId,
            periodType: r.periodType,
            startDate: r.startDate,
            endDate: r.endDate,
            diaryCount: r.diaryCount || 0,
            totalWords: r.totalWords || 0,
            sentimentData: r.sentimentData,
            themes: r.themes || [],
            positiveFindings: r.positiveFindings || [],
            negativeFindings: r.negativeFindings || [],
            lifeAdvice: r.lifeAdvice || [],
            questions: r.questions || [],
            summary: r.summary,
            createdAt: r.createdAt,
          }),
        );
        setReports(mappedReports);
      }
    } catch (error) {
      console.error("Failed to load diary data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getNearestAvailableDate = (): string => {
    const today = new Date();
    const createdDates = diaries.map(
      (d) => new Date(d.createdAt).toISOString().split("T")[0],
    );

    // 从今天往前找，找到第一个没有创建日记的日期
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (!createdDates.includes(dateStr)) {
        return dateStr;
      }
    }

    // 如果30天内都有日记，返回今天
    return today.toISOString().split("T")[0];
  };

  const handleDeleteDiary = (id: string) => {
    Alert.alert("删除日记", "确定要永久删除这篇日记吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          try {
            await diaryService.delete(id);
            setDiaries((prev) => prev.filter((d) => d.id !== id));
          } catch (error) {
            Alert.alert("错误", "删除失败，请重试");
          }
        },
      },
    ]);
  };

  const renderDiaryItem = ({ item }: { item: DiaryItem }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("DiaryEdit", { id: item.id })}
    >
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {new Date(item.createdAt).toLocaleDateString("zh-CN")}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => handleDeleteDiary(item.id)}
          >
            <IconButton
              icon="delete-outline"
              size={18}
              iconColor={colors.error}
              style={{ margin: 0 }}
            />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={3}
          style={[styles.content, { color: colors.textPrimary }]}
        >
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }: { item: ReportItem }) => {
    const dateRange = formatDateRange(
      item.startDate,
      item.endDate,
      item.periodType,
    );

    return (
      <Card
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={() =>
          navigation.navigate("DiaryReport", {
            reportId: item.id,
            periodType: item.periodType as "weekly" | "monthly" | "yearly",
          })
        }
      >
        <Card.Content>
          <View style={styles.row}>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {dateRange}
            </Text>
          </View>
          {item.summary && (
            <Text
              numberOfLines={3}
              style={[styles.content, { color: colors.textPrimary }]}
            >
              {item.summary}
            </Text>
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
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {emptyTexts[activeTab].title}
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
          {emptyTexts[activeTab].subtitle}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
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
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          padding: 20,
          paddingTop: insets.top + 12,
          paddingBottom: 0,
          backgroundColor: colors.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        title: {
          fontSize: 28,
          fontWeight: "bold",
          color: colors.textOnPrimary,
        },
        tabContainer: {
          padding: 16,
          backgroundColor: colors.primary,
          paddingBottom: 8,
        },
        segmentedButtons: {
          backgroundColor: colors.surface,
          borderRadius: 24,
        },
        list: {
          padding: 16,
          flexGrow: 1,
        },
        card: {
          marginBottom: 16,
          borderRadius: 12,
          elevation: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        cardContent: {
          padding: 16,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        },
        date: {
          fontSize: 12,
        },
        content: {
          lineHeight: 22,
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
      }),
    [colors, insets],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>日记</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {activeTab === "diary" && (
            <IconButton
              icon="plus"
              iconColor={colors.textOnPrimary}
              size={24}
              disabled={fabLoading}
              onPress={async () => {
                setFabLoading(true);
                try {
                  navigation.navigate("DiaryEdit", {
                    date: getNearestAvailableDate(),
                  });
                } finally {
                  setFabLoading(false);
                }
              }}
            />
          )}
        </View>
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
    </View>
  );
}
