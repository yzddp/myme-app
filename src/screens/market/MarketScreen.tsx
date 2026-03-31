/**
 * MyMe App - Market Screen
 * 市场页面 - 交友匹配 / 恋人匹配
 * 基于 M1-M10 知识库数据进行 AI 智能匹配
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, Button, Chip } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import AppHeader from "../../components/AppHeader";
import squareService, {
  MatchResult,
  MatchProfileResponse,
} from "../../services/squareService";

type MatchMode = "friend" | "partner";

// 匹配结果卡片
function MatchCard({
  profile,
  colors,
}: {
  profile: MatchProfileResponse;
  colors: any;
}) {
  return (
    <View
      style={[
        cardStyles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* 头部：昵称 + 匹配率 */}
      <View style={cardStyles.header}>
        <View
          style={[cardStyles.avatar, { backgroundColor: colors.primary + "30" }]}
        >
          <Text style={[cardStyles.avatarText, { color: colors.primary }]}>
            {profile.nickname.charAt(profile.nickname.length - 1)}
          </Text>
        </View>
        <View style={cardStyles.info}>
          <Text style={[cardStyles.nickname, { color: colors.textPrimary }]}>
            {profile.nickname}
          </Text>
          <View style={cardStyles.rateRow}>
            <View
              style={[
                cardStyles.rateBadge,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[cardStyles.rateText, { color: colors.primary }]}>
                匹配度 {profile.matchRate}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 匹配理由 */}
      {profile.matchReasons.length > 0 && (
        <View style={cardStyles.section}>
          {profile.matchReasons.map((reason, i) => (
            <View key={i} style={cardStyles.reasonRow}>
              <Text style={[cardStyles.reasonDot, { color: colors.primary }]}>
                ·
              </Text>
              <Text
                style={[cardStyles.reasonText, { color: colors.textSecondary }]}
              >
                {reason}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* 共同兴趣标签 */}
      {profile.commonInterests && profile.commonInterests.length > 0 && (
        <View style={cardStyles.tagsRow}>
          {profile.commonInterests.map((interest, i) => (
            <View
              key={i}
              style={[
                cardStyles.tag,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <Text
                style={[cardStyles.tagText, { color: colors.textSecondary }]}
              >
                {interest}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: { flex: 1 },
  nickname: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  rateRow: { flexDirection: "row" },
  rateBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  rateText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: { marginBottom: 10 },
  reasonRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reasonDot: {
    fontSize: 18,
    lineHeight: 20,
    marginRight: 6,
    marginTop: -2,
  },
  reasonText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { fontSize: 13 },
});

// 主页面
export default function MarketScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<MatchMode>("friend");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let res: MatchResult;
      if (mode === "partner") {
        res = await squareService.loverMatch({});
      } else {
        res = await squareService.friendMatch({});
      }
      setResult(res);
    } catch (e) {
      setError("匹配失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 16, paddingBottom: 32 },
    modeRow: {
      flexDirection: "row",
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      padding: 4,
      marginBottom: 20,
    },
    modeBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    modeBtnActive: { backgroundColor: colors.surface },
    modeBtnText: { fontSize: 15, color: colors.textTertiary },
    modeBtnTextActive: { color: colors.textPrimary, fontWeight: "600" },
    descCard: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      backgroundColor: colors.surfaceVariant,
    },
    descTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    descText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    matchBtn: { borderRadius: 16, marginBottom: 20 },
    summaryBox: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      backgroundColor: colors.primary + "15",
    },
    summaryLabel: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    resultsLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 12,
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
      marginBottom: 12,
    },
    emptyHint: {
      textAlign: "center",
      color: colors.textTertiary,
      marginTop: 40,
      fontSize: 15,
      lineHeight: 24,
    },
  });

  const modeConfig = {
    friend: {
      title: "交友匹配",
      description:
        "基于你的兴趣爱好(M4)、价值观(M6)和创意思维(M9)，为你寻找志同道合的朋友。完善这些模块的知识库，匹配会更精准。",
    },
    partner: {
      title: "恋人匹配",
      description:
        "基于你的兴趣偏好(M4)、社会关系模式(M5)、价值观(M6)、思维方式(M7)和情感特质(M8)，进行深度情感相容性分析。",
    },
  };

  return (
    <View style={styles.container}>
      <AppHeader title="市场" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 模式切换 */}
        <View style={styles.modeRow}>
          {(["friend", "partner"] as MatchMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => {
                setMode(m);
                setResult(null);
                setError(null);
              }}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  mode === m && styles.modeBtnTextActive,
                ]}
              >
                {m === "friend" ? "交友" : "恋人"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 功能说明 */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>{modeConfig[mode].title}</Text>
          <Text style={styles.descText}>{modeConfig[mode].description}</Text>
        </View>

        {/* 开始匹配按钮 */}
        <Button
          mode="contained"
          onPress={handleMatch}
          loading={loading}
          disabled={loading}
          style={styles.matchBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          {loading ? "AI 分析中..." : "开始匹配"}
        </Button>

        {/* 错误提示 */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 匹配结果 */}
        {result ? (
          <>
            {/* AI 综合说明 */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>AI 分析</Text>
              <Text style={styles.summaryText}>{result.aiSummary}</Text>
            </View>

            <Text style={styles.resultsLabel}>
              为你找到 {result.total} 个匹配
            </Text>

            {result.matches.map((profile) => (
              <MatchCard key={profile.id} profile={profile} colors={colors} />
            ))}
          </>
        ) : !loading ? (
          <Text style={styles.emptyHint}>
            {`点击「开始匹配」\nAI 将分析你的知识库为你推荐`}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
