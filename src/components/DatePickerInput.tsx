import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

interface DatePickerInputProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  disabled?: boolean;
  minimumDate?: string;
  maximumDate?: string;
  defaultPickerDate?: string;
}

const ITEM_HEIGHT = 48;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PADDING_ITEMS = Math.floor(VISIBLE_COUNT / 2); // 2

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const parseDateParts = (dateStr?: string) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return null;
  return { year: y, month: m, day: d };
};

const buildDateString = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

/* ─── 单列滚轮 ─── */

function WheelColumn({
  label,
  data,
  selectedIndex,
  onSelect,
  formatter,
  colors,
}: {
  label: string;
  data: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  formatter?: (v: number) => string;
  colors: any;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const pendingSnap = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToIndex = useCallback((idx: number, animated = false) => {
    scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => scrollToIndex(selectedIndex, false));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex]);

  const snapToNearest = useCallback(
    (offsetY: number) => {
      const idx = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(data.length - 1, idx));
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
      onSelect(clamped);
    },
    [data.length, onSelect],
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;
      snapToNearest(e.nativeEvent.contentOffset.y);
    },
    [snapToNearest],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
    if (pendingSnap.current) {
      clearTimeout(pendingSnap.current);
      pendingSnap.current = null;
    }
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isUserScrolling.current) return;
      if (pendingSnap.current) clearTimeout(pendingSnap.current);
      const y = e.nativeEvent.contentOffset.y;
      pendingSnap.current = setTimeout(() => {
        isUserScrolling.current = false;
        snapToNearest(y);
      }, 150);
    },
    [snapToNearest],
  );

  const styles = StyleSheet.create({
    column: { flex: 1, alignItems: "center" },
    label: { fontSize: 13, marginBottom: 8, color: colors.textSecondary },
    scroll: { height: PICKER_HEIGHT, width: "100%" },
    paddingView: { height: PADDING_ITEMS * ITEM_HEIGHT },
    item: {
      height: ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    itemText: { fontSize: 20, color: colors.textSecondary },
    itemTextSelected: { color: colors.textPrimary, fontWeight: "700" },
  });

  return (
    <View style={styles.column}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        onScroll={Platform.OS === "android" ? handleScroll : undefined}
        scrollEventThrottle={16}
      >
        <View style={styles.paddingView} />
        {data.map((value, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <View key={`${label}-${value}`} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextSelected,
                ]}
              >
                {formatter ? formatter(value) : String(value)}
              </Text>
            </View>
          );
        })}
        <View style={styles.paddingView} />
      </ScrollView>
    </View>
  );
}

/* ─── 主组件 ─── */

export default function DatePickerInput({
  value,
  onChange,
  label = "选择日期",
  disabled = false,
  minimumDate,
  maximumDate,
  defaultPickerDate,
}: DatePickerInputProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const minParts = parseDateParts(minimumDate) || {
    year: 1900,
    month: 1,
    day: 1,
  };
  const maxParts = parseDateParts(maximumDate) || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  const fallbackParts =
    parseDateParts(value) ||
    parseDateParts(defaultPickerDate) || { year: 2000, month: 1, day: 1 };

  const [selectedYear, setSelectedYear] = useState(fallbackParts.year);
  const [selectedMonth, setSelectedMonth] = useState(fallbackParts.month);
  const [selectedDay, setSelectedDay] = useState(fallbackParts.day);

  // 年份范围
  const years = Array.from(
    { length: maxParts.year - minParts.year + 1 },
    (_, i) => minParts.year + i,
  );

  // 月份范围（受年份约束）
  const monthStart = selectedYear === minParts.year ? minParts.month : 1;
  const monthEnd = selectedYear === maxParts.year ? maxParts.month : 12;
  const months = Array.from(
    { length: monthEnd - monthStart + 1 },
    (_, i) => monthStart + i,
  );

  // 天数范围（受年月约束）
  const dayStart =
    selectedYear === minParts.year && selectedMonth === minParts.month
      ? minParts.day
      : 1;
  const dayEnd =
    selectedYear === maxParts.year && selectedMonth === maxParts.month
      ? maxParts.day
      : getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from(
    { length: dayEnd - dayStart + 1 },
    (_, i) => dayStart + i,
  );

  // 联动：月份越界时修正
  useEffect(() => {
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
  }, [selectedYear]);

  // 联动：天越界时修正
  useEffect(() => {
    if (!days.includes(selectedDay)) {
      setSelectedDay(days[0]);
    }
  }, [selectedYear, selectedMonth]);

  // 打开弹窗时重置选中值
  const handleOpen = () => {
    const parts =
      parseDateParts(value) ||
      parseDateParts(defaultPickerDate) || { year: 2000, month: 1, day: 1 };
    setSelectedYear(clamp(parts.year, minParts.year, maxParts.year));
    setSelectedMonth(clamp(parts.month, 1, 12));
    setSelectedDay(clamp(parts.day, 1, 31));
    setShowPicker(true);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    input: { backgroundColor: colors.surface },
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      width: "100%",
      maxWidth: 380,
      borderRadius: 20,
      padding: 20,
      backgroundColor: colors.surface,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 20,
    },
    pickerContainer: {
      flexDirection: "row",
      gap: 12,
      height: PICKER_HEIGHT + 32,
      marginBottom: 20,
      position: "relative",
    },
    pickerHighlight: {
      position: "absolute",
      top: 8 + PADDING_ITEMS * ITEM_HEIGHT,
      left: 0,
      right: 0,
      height: ITEM_HEIGHT,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.surfaceVariant,
      zIndex: -1,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpen} disabled={disabled}>
        <View pointerEvents="none">
          <TextInput
            value={formatDateDisplay(value)}
            editable={false}
            mode="outlined"
            style={[styles.input, disabled && { opacity: 0.5 }]}
            placeholder={label}
            placeholderTextColor={colors.textSecondary}
            right={
              <TextInput.Icon
                icon="calendar-month-outline"
                onPress={() => {
                  if (!disabled) handleOpen();
                }}
              />
            }
          />
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <View style={styles.pickerContainer}>
              <View pointerEvents="none" style={styles.pickerHighlight} />
              <WheelColumn
                label="年"
                data={years}
                selectedIndex={Math.max(years.indexOf(selectedYear), 0)}
                onSelect={(idx) => setSelectedYear(years[idx])}
                colors={colors}
              />
              <WheelColumn
                label="月"
                data={months}
                selectedIndex={Math.max(months.indexOf(selectedMonth), 0)}
                onSelect={(idx) => setSelectedMonth(months[idx])}
                formatter={(v) => `${v}`}
                colors={colors}
              />
              <WheelColumn
                label="日"
                data={days}
                selectedIndex={Math.max(days.indexOf(selectedDay), 0)}
                onSelect={(idx) => setSelectedDay(days[idx])}
                formatter={(v) => `${v}`}
                colors={colors}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => setShowPicker(false)}>
                取消
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  onChange(
                    buildDateString(selectedYear, selectedMonth, selectedDay),
                  );
                  setShowPicker(false);
                }}
              >
                确定
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
