import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { navigationRef } from "../../navigation/navigationRef";
import type { DiaryStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import AppHeader from "../../components/AppHeader";
import diaryAnalysisService from "../../services/diaryAnalysisService";
import TimePickerModal from "../../components/TimePickerModal";
import SimplePickerModal from "../../components/SimplePickerModal";
import type {
  DiaryAnalyzeSettingsV2,
  DiaryPeriodSetting,
  DiaryScheduleDay,
} from "../../types/diary";

type NavigationProp = NativeStackNavigationProp<DiaryStackParamList>;
type DiaryAnalysisSettingsRouteProp = RouteProp<
  DiaryStackParamList,
  "DiaryAnalysisSettings"
>;

const WEEK_DAYS: DiaryScheduleDay[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];
const LABELS: Record<string, string> = {
  mon: "周一",
  tue: "周二",
  wed: "周三",
  thu: "周四",
  fri: "周五",
  sat: "周六",
  sun: "周日",
};

const defaultSettings: DiaryAnalyzeSettingsV2 = {
  daily: { enabled: false, time: "21:00" },
  weekly: { enabled: false, day: "sun", time: "21:00" },
  monthly: { enabled: false, day: 1, time: "21:00" },
  yearly: { enabled: false, month: 1, day: 1, time: "21:00" },
};

function PickerField({
  label,
  value,
  onPress,
  disabled,
}: {
  label: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85}>
      <View pointerEvents="none">
        <TextInput
          label={label}
          value={value}
          mode="outlined"
          editable={false}
          disabled={disabled}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </View>
    </TouchableOpacity>
  );
}

function formatDayLabel(day?: DiaryScheduleDay | null) {
  if (day === undefined || day === null) return "--";
  return LABELS[String(day)] || `${day}日`;
}

function PeriodCard({
  title,
  summary,
  enabled,
  onToggle,
  children,
  colors,
}: {
  title: string;
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

export default function DiaryAnalysisSettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DiaryAnalysisSettingsRouteProp>();
  const { colors } = useTheme();
  const [settings, setSettings] =
    useState<DiaryAnalyzeSettingsV2>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [activeTimeKey, setActiveTimeKey] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | null
  >(null);
  const bypassUnsavedPromptRef = useRef(false);
  const [showWeeklyPicker, setShowWeeklyPicker] = useState(false);
  const initialSettingsRef = useRef<DiaryAnalyzeSettingsV2>(defaultSettings);
  const from = route.params?.from ?? "diary";

  const navigateAfterSave = () => {
    if (from === "profile") {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Main", {
          screen: "ProfileTab",
          params: {
            screen: "Profile",
          },
        });
        return;
      }
    }

    navigation.goBack();
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await diaryAnalysisService.getAnalyzeSettings();
      setSettings(response.settings);
      initialSettingsRef.current = response.settings;
    } catch (error) {
      Alert.alert("错误", "加载日记设置失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const updatePeriod = <K extends keyof DiaryAnalyzeSettingsV2>(
    period: K,
    patch: Partial<DiaryPeriodSetting>,
  ) => {
    setSettings((prev) => {
      return {
        ...prev,
        [period]: {
          ...prev[period],
          ...patch,
        },
      };
    });
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(initialSettingsRef.current);
  }, [settings]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await diaryAnalysisService.updateAnalyzeSettings(settings);
      initialSettingsRef.current = response.settings;
      setSettings(response.settings);
      bypassUnsavedPromptRef.current = true;
      navigateAfterSave();
    } catch (error) {
      Alert.alert("错误", "保存日记设置失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (!isDirty || bypassUnsavedPromptRef.current || loading) {
        return;
      }

      event.preventDefault();
      Alert.alert("保存修改", "日记设置已修改，是否保存后返回？", [
        { text: "取消", style: "cancel" },
        {
          text: "保存",
          onPress: () => {
            void handleSave();
          },
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, isDirty, loading, settings]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="日记设置"
        leftIcon="arrow-left"
        onLeftPress={navigateAfterSave}
        rightIcon="check"
        onRightPress={() => {
          void handleSave();
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <PeriodCard
          title="日报"
          summary="会在设置的时间生成昨天的日报"
          enabled={settings.daily.enabled}
          onToggle={(enabled) => updatePeriod("daily", { enabled })}
          colors={colors}
        >
          <PickerField label="时间" value={settings.daily.time || "22:00"} onPress={() => setActiveTimeKey("daily")} />
        </PeriodCard>

        <PeriodCard
          title="周报"
          summary="会在选择的时间生成上一周7天的周报"
          enabled={settings.weekly.enabled}
          onToggle={(enabled) => updatePeriod("weekly", { enabled })}
          colors={colors}
        >
          <PickerField label="生成日" value={formatDayLabel(settings.weekly.day)} onPress={() => setShowWeeklyPicker(true)} />
          <PickerField label="时间" value={settings.weekly.time || "20:00"} onPress={() => setActiveTimeKey("weekly")} />
        </PeriodCard>

        <PeriodCard
          title="月报"
          summary="会在每月1日选择的时间生成上一月的月报"
          enabled={settings.monthly.enabled}
          onToggle={(enabled) => updatePeriod("monthly", { enabled })}
          colors={colors}
        >
          <PickerField label="时间" value={settings.monthly.time || "20:00"} onPress={() => setActiveTimeKey("monthly")} />
        </PeriodCard>

        <PeriodCard
          title="年报"
          summary="会在每年1月1日选择的时间生成上一年的年报"
          enabled={settings.yearly.enabled}
          onToggle={(enabled) => updatePeriod("yearly", { enabled })}
          colors={colors}
        >
          <PickerField label="时间" value={settings.yearly.time || "20:00"} onPress={() => setActiveTimeKey("yearly")} />
        </PeriodCard>
      </ScrollView>

      <TimePickerModal
        visible={activeTimeKey !== null}
        title="选择时间"
        value={activeTimeKey ? settings[activeTimeKey].time : "20:00"}
        onDismiss={() => setActiveTimeKey(null)}
        onConfirm={(value) => {
          if (activeTimeKey) {
            updatePeriod(activeTimeKey, { time: value });
          }
          setActiveTimeKey(null);
        }}
      />

      <SimplePickerModal
        visible={showWeeklyPicker}
        title="选择周报生成日"
        selectedValue={(settings.weekly.day as string) || "sun"}
        options={WEEK_DAYS.map((day) => ({ value: String(day), label: formatDayLabel(day) }))}
        onDismiss={() => setShowWeeklyPicker(false)}
        onSelect={(value) => updatePeriod("weekly", { day: value as DiaryScheduleDay })}
        searchable={false}
        minListHeight={220}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
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
    flex: 1,
  },
  periodTitle: { fontSize: 18, fontWeight: "800" },
  periodSummary: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  periodPanel: { marginTop: 16, gap: 14 },
  optionWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
