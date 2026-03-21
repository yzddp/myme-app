import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DiaryStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import AppHeader from "../../components/AppHeader";
import diaryAnalysisService from "../../services/diaryAnalysisService";
import type {
  DiaryAnalyzeSettingsV2,
  DiaryPeriodSetting,
  DiaryScheduleDay,
} from "../../types/diary";

type NavigationProp = NativeStackNavigationProp<DiaryStackParamList>;

const WEEK_DAYS: DiaryScheduleDay[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];
const MONTH_DAY_OPTIONS: DiaryScheduleDay[] = Array.from(
  { length: 28 },
  (_, index) => String(index + 1) as DiaryScheduleDay,
).concat("last");
const YEAR_MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

const LABELS: Record<string, string> = {
  mon: "周一",
  tue: "周二",
  wed: "周三",
  thu: "周四",
  fri: "周五",
  sat: "周六",
  sun: "周日",
  last: "最后一天",
};

const TIME_OPTIONS = ["07:30", "12:00", "18:30", "21:00", "22:30"];

const defaultSettings: DiaryAnalyzeSettingsV2 = {
  daily: { enabled: false, time: "21:00" },
  weekly: { enabled: false, day: "sun", time: "21:00" },
  monthly: { enabled: false, day: "1", time: "21:00" },
  yearly: { enabled: false, month: 1, day: "1", time: "21:00" },
};

function formatDayLabel(day?: DiaryScheduleDay | null) {
  if (day === undefined || day === null) return "--";
  return LABELS[String(day)] || `${day}日`;
}

function PeriodCard({
  title,
  icon,
  summary,
  enabled,
  onToggle,
  children,
  colors,
}: {
  title: string;
  icon: string;
  summary: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.periodCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.periodHeader}>
        <View style={styles.periodTitleWrap}>
          <Text style={[styles.periodEmoji, { color: colors.primary }]}>
            {icon}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.periodTitle, { color: colors.textPrimary }]}>
              {title}
            </Text>
            <Text
              style={[styles.periodSummary, { color: colors.textSecondary }]}
            >
              {summary}
            </Text>
          </View>
        </View>
        <Switch value={enabled} onValueChange={onToggle} />
      </View>
      {enabled ? <View style={styles.periodPanel}>{children}</View> : null}
    </View>
  );
}

function SelectionGroup<T extends string | number>({
  title,
  options,
  value,
  onChange,
  getLabel,
  colors,
}: {
  title: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (value: T) => string;
  colors: any;
}) {
  return (
    <View style={styles.selectionGroup}>
      <Text style={[styles.selectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.optionWrap}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={String(option)}
              style={[
                styles.optionPill,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : colors.surfaceVariant,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onChange(option)}
            >
              <Text
                style={{
                  color: selected ? colors.textOnPrimary : colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                {getLabel(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function DiaryAnalysisSettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [settings, setSettings] =
    useState<DiaryAnalyzeSettingsV2>(defaultSettings);
  const [loadingText, setLoadingText] = useState("加载中...");
  const [savingState, setSavingState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void loadSettings();
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const saveStatusText = useMemo(() => {
    switch (savingState) {
      case "saving":
        return "保存中...";
      case "saved":
        return "已保存";
      case "error":
        return "保存失败";
      default:
        return loadingText;
    }
  }, [loadingText, savingState]);

  const loadSettings = async () => {
    try {
      setLoadingText("加载中...");
      const response = await diaryAnalysisService.getAnalyzeSettings();
      setSettings(response.settings);
      setLoadingText("修改后自动保存");
    } catch (error) {
      setLoadingText("加载失败，可继续本地编辑");
    }
  };

  const scheduleSave = (nextSettings: DiaryAnalyzeSettingsV2) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        setSavingState("saving");
        const response =
          await diaryAnalysisService.updateAnalyzeSettings(nextSettings);
        setSettings(response.settings);
        setSavingState("saved");
      } catch (error) {
        setSavingState("error");
      }
    }, 500);
  };

  const updatePeriod = <K extends keyof DiaryAnalyzeSettingsV2>(
    period: K,
    patch: Partial<DiaryPeriodSetting>,
  ) => {
    setSettings((prev) => {
      const nextSettings = {
        ...prev,
        [period]: {
          ...prev[period],
          ...patch,
        },
      };
      setSavingState("idle");
      scheduleSave(nextSettings);
      return nextSettings;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="日记分析设置"
        subtitle="像 iOS 设置页一样逐项展开，修改后自动保存"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.primaryLight + "22",
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            分析归档节奏
          </Text>
          <Text style={[styles.heroText, { color: colors.textSecondary }]}>
            日报、周报、月报、年报彼此独立；关闭后只收起配置，不清空已有选择。
          </Text>
          <HelperText type={savingState === "error" ? "error" : "info"} visible>
            {saveStatusText}
          </HelperText>
        </View>

        <PeriodCard
          title="日报"
          icon="01"
          summary={`每天 ${settings.daily.time || "--:--"} 自动归档`}
          enabled={settings.daily.enabled}
          onToggle={(enabled) => updatePeriod("daily", { enabled })}
          colors={colors}
        >
          <SelectionGroup
            title="执行时间"
            options={TIME_OPTIONS}
            value={settings.daily.time || "21:00"}
            onChange={(time) => updatePeriod("daily", { time })}
            getLabel={(time) => time}
            colors={colors}
          />
        </PeriodCard>

        <PeriodCard
          title="周报"
          icon="07"
          summary={`每${formatDayLabel(settings.weekly.day)} ${settings.weekly.time || "--:--"} 生成一份`}
          enabled={settings.weekly.enabled}
          onToggle={(enabled) => updatePeriod("weekly", { enabled })}
          colors={colors}
        >
          <SelectionGroup
            title="星期"
            options={WEEK_DAYS}
            value={(settings.weekly.day as DiaryScheduleDay) || "sun"}
            onChange={(day) => updatePeriod("weekly", { day })}
            getLabel={(day) => formatDayLabel(day)}
            colors={colors}
          />
          <SelectionGroup
            title="执行时间"
            options={TIME_OPTIONS}
            value={settings.weekly.time || "21:00"}
            onChange={(time) => updatePeriod("weekly", { time })}
            getLabel={(time) => time}
            colors={colors}
          />
        </PeriodCard>

        <PeriodCard
          title="月报"
          icon="30"
          summary={`每月 ${formatDayLabel(settings.monthly.day)} ${settings.monthly.time || "--:--"} 生成一份`}
          enabled={settings.monthly.enabled}
          onToggle={(enabled) => updatePeriod("monthly", { enabled })}
          colors={colors}
        >
          <SelectionGroup
            title="日期"
            options={MONTH_DAY_OPTIONS}
            value={(settings.monthly.day as DiaryScheduleDay) || "1"}
            onChange={(day) => updatePeriod("monthly", { day })}
            getLabel={(day) => formatDayLabel(day)}
            colors={colors}
          />
          <SelectionGroup
            title="执行时间"
            options={TIME_OPTIONS}
            value={settings.monthly.time || "21:00"}
            onChange={(time) => updatePeriod("monthly", { time })}
            getLabel={(time) => time}
            colors={colors}
          />
        </PeriodCard>

        <PeriodCard
          title="年报"
          icon="12"
          summary={`每年 ${settings.yearly.month || 1} 月 ${formatDayLabel(settings.yearly.day)} ${settings.yearly.time || "--:--"} 生成一份`}
          enabled={settings.yearly.enabled}
          onToggle={(enabled) => updatePeriod("yearly", { enabled })}
          colors={colors}
        >
          <SelectionGroup
            title="月份"
            options={YEAR_MONTH_OPTIONS}
            value={settings.yearly.month || 1}
            onChange={(month) => updatePeriod("yearly", { month })}
            getLabel={(month) => `${month}月`}
            colors={colors}
          />
          <SelectionGroup
            title="日期"
            options={MONTH_DAY_OPTIONS}
            value={(settings.yearly.day as DiaryScheduleDay) || "1"}
            onChange={(day) => updatePeriod("yearly", { day })}
            getLabel={(day) => formatDayLabel(day)}
            colors={colors}
          />
          <SelectionGroup
            title="执行时间"
            options={TIME_OPTIONS}
            value={settings.yearly.time || "21:00"}
            onChange={(time) => updatePeriod("yearly", { time })}
            getLabel={(time) => time}
            colors={colors}
          />
        </PeriodCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  heroCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  heroTitle: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  heroText: { fontSize: 13, lineHeight: 20 },
  periodCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
  },
  periodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  periodTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  periodEmoji: { fontSize: 24, fontWeight: "800", minWidth: 28 },
  periodTitle: { fontSize: 18, fontWeight: "800" },
  periodSummary: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  periodPanel: { marginTop: 16, gap: 14 },
  selectionGroup: { gap: 10 },
  selectionTitle: { fontSize: 14, fontWeight: "700" },
  optionWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
