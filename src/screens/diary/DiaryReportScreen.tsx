/**
 * MyMe App - Diary Report Screen
 * 周期报告详情页面 - 周报/月报/年报详情
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DiaryStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { diaryService } from "../../services/diaryService";
import type { DiaryAnalysisReport } from "../../types/diary";

type ReportRouteProp = RouteProp<DiaryStackParamList, "DiaryReport">;

export default function DiaryReportScreen() {
  const route = useRoute<ReportRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<DiaryStackParamList>>();
  const { reportId, periodType } = route.params;
  const [report, setReport] = useState<DiaryAnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportId, periodType]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await diaryService.getReport(reportId, periodType);
      setReport(data);
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (type: string) => {
    switch (type) {
      case "weekly":
        return "周报";
      case "monthly":
        return "月报";
      case "yearly":
        return "年报";
      default:
        return "报告";
    }
  };

  const formatDateRange = () => {
    if (!report) return "";
    const start = new Date(report.startDate);
    const end = new Date(report.endDate);

    if (periodType === "weekly") {
      const formatDate = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
      return `${formatDate(start)} - ${formatDate(end)}`;
    } else if (periodType === "monthly") {
      return `${start.getFullYear()}年${start.getMonth() + 1}月`;
    } else if (periodType === "yearly") {
      return `${start.getFullYear()}年`;
    }
    return `${report.startDate} - ${report.endDate}`;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getPeriodLabel(periodType)}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>报告加载失败</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getPeriodLabel(periodType)}</Text>
        <Text style={styles.subtitle}>{formatDateRange()}</Text>
      </View>

      <ScrollView style={styles.content}>
        {report.summary && (
          <Card style={styles.card}>
            <Card.Title title="摘要" />
            <Card.Content>
              <Text style={styles.text}>{report.summary}</Text>
            </Card.Content>
          </Card>
        )}

        {report.sentimentData && (
          <Card style={styles.card}>
            <Card.Title title="情感分析" />
            <Card.Content>
              <View style={styles.sentimentRow}>
                <Chip
                  style={[
                    styles.sentimentChip,
                    { backgroundColor: COLORS.sentimentPositive },
                  ]}
                >
                  积极 {report.sentimentData.percentage.positive.toFixed(0)}%
                </Chip>
                <Chip
                  style={[
                    styles.sentimentChip,
                    { backgroundColor: COLORS.sentimentNeutral },
                  ]}
                >
                  中性 {report.sentimentData.percentage.neutral.toFixed(0)}%
                </Chip>
                <Chip
                  style={[
                    styles.sentimentChip,
                    { backgroundColor: COLORS.sentimentNegative },
                  ]}
                >
                  消极 {report.sentimentData.percentage.negative.toFixed(0)}%
                </Chip>
              </View>
              <Text style={styles.metaText}>
                共{report.diaryCount}篇日记，{report.totalWords}字
              </Text>
            </Card.Content>
          </Card>
        )}

        {report.themes && report.themes.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="主题" />
            <Card.Content>
              <View style={styles.tagList}>
                {report.themes.map((theme, index) => (
                  <Chip key={index} style={styles.tagChip}>
                    {theme}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {report.positiveFindings && report.positiveFindings.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="积极发现" />
            <Card.Content>
              {report.positiveFindings.map((finding, index) => (
                <View key={index} style={styles.findingItem}>
                  <Text style={styles.findingText}>{finding.content}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {report.negativeFindings && report.negativeFindings.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="待改进" />
            <Card.Content>
              {report.negativeFindings.map((finding, index) => (
                <View key={index} style={styles.findingItem}>
                  <Text style={styles.findingText}>{finding.content}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {report.lifeAdvice && report.lifeAdvice.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="人生建议" />
            <Card.Content>
              {report.lifeAdvice.map((advice, index) => (
                <View key={index} style={styles.adviceItem}>
                  <Text style={styles.adviceText}>{advice.advice}</Text>
                  <Text style={styles.adviceCategory}>{advice.category}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {report.questions && report.questions.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="引导问题" />
            <Card.Content>
              {report.questions.map((q, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Text style={styles.questionContext}>{q.context}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  text: {
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  sentimentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  sentimentChip: {
    marginRight: 8,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  findingItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  findingText: {
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  adviceItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  adviceText: {
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  adviceCategory: {
    color: COLORS.primary,
    fontSize: 12,
  },
  questionItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  questionText: {
    color: COLORS.textPrimary,
    fontWeight: "bold",
    lineHeight: 22,
    marginBottom: 8,
  },
  questionContext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 32,
  },
});
