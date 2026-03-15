/**
 * MyMe App - My Data Screen
 * 我的数据页面
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { userService, UserData } from "../../services/userService";
import { COLORS } from "../../constants/colors";

export default function MyDataScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<UserData | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await userService.getUserData();
      setData(result);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number | string;
    icon: string;
    color: string;
  }) => (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <Text style={[styles.statIcon, { color }]}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的数据</Text>
        <Text style={styles.subtitle}>查看您的使用统计</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="日记总数"
            value={data?.totalDiaries || 0}
            icon="📔"
            color={COLORS.primary}
          />
          <StatCard
            title="对话次数"
            value={data?.totalChats || 0}
            icon="💬"
            color="#4ECDC4"
          />
          <StatCard
            title="Agent数量"
            value={data?.totalAgents || 0}
            icon="🤖"
            color="#45B7D1"
          />
          <StatCard
            title="分身数量"
            value={data?.totalAvatars || 0}
            icon="👤"
            color="#96CEB4"
          />
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>连续活跃</Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakValue}>{data?.streak || 0}</Text>
              <Text style={styles.streakUnit}>天</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>最近活动</Text>
            <Text style={styles.lastActive}>
              {formatDate(data?.lastActive) || "暂无记录"}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>数据说明</Text>
            <Text style={styles.description}>
              · 日记总数：您创建的所有日记{"\n"}· 对话次数：与Agent的对话轮次
              {"\n"}· Agent数量：您创建或收藏的Agent{"\n"}·
              分身数量：您创建的数字分身{"\n"}· 连续活跃：连续使用天数
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
    fontSize: 24,
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  statTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  streakValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  streakUnit: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  lastActive: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
