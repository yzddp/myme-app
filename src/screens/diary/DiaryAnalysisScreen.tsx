/**
 * MyMe App - Diary Analysis Screen
 * 日记分析页面
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, SegmentedButtons, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useDiaryStore } from '../../store/diaryStore';
import type { DiaryPeriodType } from '../../types/diary';

interface DiaryAnalysisScreenProps {
  navigation?: any;
}

/**
 * 日记分析页面
 * 显示日记分析报告和统计
 */
export const DiaryAnalysisScreen: React.FC<DiaryAnalysisScreenProps> = ({ navigation }) => {
  const [periodType, setPeriodType] = useState<DiaryPeriodType>('weekly');
  const [refreshing, setRefreshing] = useState(false);

  const { 
    latestReport, 
    isAnalyzing, 
    isLoading,
    analyzeDiary,
    loadLatestReport 
  } = useDiaryStore();

  // 加载最新报告
  useEffect(() => {
    loadLatestReport(periodType);
  }, [periodType]);

  // 刷新
  const onRefresh = async () => {
    setRefreshing(true);
    await loadLatestReport(periodType);
    setRefreshing(false);
  };

  // 生成分析
  const handleAnalyze = async () => {
    await analyzeDiary({ periodType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>日记分析</Text>
          <Text style={styles.subtitle}>了解你的内心世界</Text>
        </View>

        {/* 周期选择 */}
        <View style={styles.periodContainer}>
          <SegmentedButtons
            value={periodType}
            onValueChange={(value) => setPeriodType(value as DiaryPeriodType)}
            buttons={[
              { value: 'daily', label: '日' },
              { value: 'weekly', label: '周' },
              { value: 'monthly', label: '月' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* 分析按钮 */}
        <Button
          mode="contained"
          onPress={handleAnalyze}
          loading={isAnalyzing}
          disabled={isAnalyzing}
          style={styles.analyzeButton}
          icon="robot"
        >
          {isAnalyzing ? '分析中...' : '生成分析报告'}
        </Button>

        {/* 分析报告 */}
        {latestReport ? (
          <View style={styles.reportContainer}>
            {/* 统计卡片 */}
            <Card style={styles.statCard}>
              <Card.Content>
                <Text style={styles.cardTitle}>📊 数据概览</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{latestReport.diaryCount}</Text>
                    <Text style={styles.statLabel}>日记篇数</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{latestReport.totalWords}</Text>
                    <Text style={styles.statLabel}>总字数</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* 情感分布 */}
            {latestReport.sentimentData && (
              <Card style={styles.sentimentCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>💭 情感分布</Text>
                  <View style={styles.sentimentRow}>
                    <Chip style={[styles.sentimentChip, styles.positiveChip]}>
                      积极 {latestReport.sentimentData.percentage.positive}%
                    </Chip>
                    <Chip style={[styles.sentimentChip, styles.neutralChip]}>
                      中性 {latestReport.sentimentData.percentage.neutral}%
                    </Chip>
                    <Chip style={[styles.sentimentChip, styles.negativeChip]}>
                      消极 {latestReport.sentimentData.percentage.negative}%
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* 主题 */}
            {latestReport.themes && latestReport.themes.length > 0 && (
              <Card style={styles.themesCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>🏷️ 主题标签</Text>
                  <View style={styles.themesContainer}>
                    {latestReport.themes.map((theme, index) => (
                      <Chip key={index} style={styles.themeChip}>
                        {theme}
                      </Chip>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* 总结 */}
            {latestReport.summary && (
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>📝 分析总结</Text>
                  <Text style={styles.summaryText}>{latestReport.summary}</Text>
                </Card.Content>
              </Card>
            )}

            {/* 建议 */}
            {latestReport.lifeAdvice && latestReport.lifeAdvice.length > 0 && (
              <Card style={styles.adviceCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>💡 人生建议</Text>
                  {latestReport.lifeAdvice.map((advice, index) => (
                    <View key={index} style={styles.adviceItem}>
                      <Text style={styles.adviceText}>{advice.advice}</Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}

            {/* 问题 */}
            {latestReport.questions && latestReport.questions.length > 0 && (
              <Card style={styles.questionsCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>❓ 引导问题</Text>
                  {latestReport.questions.map((question, index) => (
                    <View key={index} style={styles.questionItem}>
                      <Text style={styles.questionText}>{question.question}</Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无分析报告</Text>
            <Text style={styles.emptyHint}>点击上方按钮生成分析</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: COLORS.surface,
  },
  analyzeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  reportContainer: {
    padding: 16,
  },
  statCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sentimentCard: {
    marginBottom: 12,
  },
  sentimentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sentimentChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  positiveChip: {
    backgroundColor: COLORS.sentimentPositive + '20',
  },
  neutralChip: {
    backgroundColor: COLORS.sentimentNeutral + '20',
  },
  negativeChip: {
    backgroundColor: COLORS.sentimentNegative + '20',
  },
  themesCard: {
    marginBottom: 12,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  themeChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.primaryLight + '30',
  },
  summaryCard: {
    marginBottom: 12,
    backgroundColor: COLORS.primaryLight + '15',
  },
  summaryText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  adviceCard: {
    marginBottom: 12,
  },
  adviceItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  adviceText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  questionsCard: {
    marginBottom: 12,
  },
  questionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  questionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});

export default DiaryAnalysisScreen;
