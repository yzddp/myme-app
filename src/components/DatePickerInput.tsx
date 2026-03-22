import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
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

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const PADDING_ROWS = 2;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseDateParts = (dateStr?: string) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map((part) => parseInt(part, 10));
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const buildDateString = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

type PickerItem = { key: string; value: number; type: "value" | "spacer" };

const buildPickerItems = (values: number[]): PickerItem[] => {
  const spacers = Array.from({ length: PADDING_ROWS }, (_, index) => ({
    key: `spacer-top-${index}`,
    value: 0,
    type: "spacer" as const,
  }));
  const bottomSpacers = Array.from({ length: PADDING_ROWS }, (_, index) => ({
    key: `spacer-bottom-${index}`,
    value: 0,
    type: "spacer" as const,
  }));
  return [...spacers, ...values.map((value) => ({ key: `value-${value}`, value, type: "value" as const })), ...bottomSpacers];
};

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

  const minParts = parseDateParts(minimumDate) || { year: 1900, month: 1, day: 1 };
  const maxParts = parseDateParts(maximumDate) || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  const fallbackParts =
    parseDateParts(value) || parseDateParts(defaultPickerDate) || { year: 2000, month: 1, day: 1 };

  const clampDateParts = (year: number, month: number, day: number) => {
    const maxDay = getDaysInMonth(year, month);
    const safeDay = clamp(day, 1, maxDay);
    const dateStr = buildDateString(year, month, safeDay);
    if (minimumDate && dateStr < minimumDate) return parseDateParts(minimumDate) || minParts;
    if (maximumDate && dateStr > maximumDate) return parseDateParts(maximumDate) || maxParts;
    return { year, month, day: safeDay };
  };

  const initial = clampDateParts(fallbackParts.year, fallbackParts.month, fallbackParts.day);
  const [selectedYear, setSelectedYear] = useState(initial.year);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);
  const [selectedDay, setSelectedDay] = useState(initial.day);

  const yearRef = useRef<FlatList<PickerItem>>(null);
  const monthRef = useRef<FlatList<PickerItem>>(null);
  const dayRef = useRef<FlatList<PickerItem>>(null);

  useEffect(() => {
    const next = clampDateParts(fallbackParts.year, fallbackParts.month, fallbackParts.day);
    setSelectedYear(next.year);
    setSelectedMonth(next.month);
    setSelectedDay(next.day);
  }, [value, defaultPickerDate, minimumDate, maximumDate]);

  const years = Array.from({ length: maxParts.year - minParts.year + 1 }, (_, i) => minParts.year + i);
  const monthStart = selectedYear === minParts.year ? minParts.month : 1;
  const monthEnd = selectedYear === maxParts.year ? maxParts.month : 12;
  const months = Array.from({ length: monthEnd - monthStart + 1 }, (_, i) => monthStart + i);
  const dayStart = selectedYear === minParts.year && selectedMonth === minParts.month ? minParts.day : 1;
  const dayEnd = selectedYear === maxParts.year && selectedMonth === maxParts.month ? maxParts.day : getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: dayEnd - dayStart + 1 }, (_, i) => dayStart + i);

  useEffect(() => {
    if (!months.includes(selectedMonth)) setSelectedMonth(months[0]);
  }, [selectedMonth, months]);

  useEffect(() => {
    if (!days.includes(selectedDay)) setSelectedDay(days[0]);
  }, [selectedDay, days]);

  const scrollToValue = (ref: React.RefObject<FlatList<PickerItem> | null>, values: number[], currentValue: number) => {
    const index = Math.max(values.indexOf(currentValue), 0) + PADDING_ROWS;
    ref.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: false });
  };

  useEffect(() => {
    if (!showPicker) return;
    const timer = setTimeout(() => {
      scrollToValue(yearRef, years, selectedYear);
      scrollToValue(monthRef, months, selectedMonth);
      scrollToValue(dayRef, days, selectedDay);
    }, 0);
    return () => clearTimeout(timer);
  }, [showPicker, selectedYear, selectedMonth, selectedDay, years, months, days]);

  const snapToValue = (
    offsetY: number,
    ref: React.RefObject<FlatList<PickerItem> | null>,
    values: number[],
    onPick: (value: number) => void,
  ) => {
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
    const valueIndex = clamp(rawIndex - PADDING_ROWS, 0, values.length - 1);
    const snappedOffset = (valueIndex + PADDING_ROWS) * ITEM_HEIGHT;
    ref.current?.scrollToOffset({ offset: snappedOffset, animated: true });
    onPick(values[valueIndex]);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    input: { backgroundColor: colors.surface },
    modalContainer: { justifyContent: "center", alignItems: "center", padding: 20 },
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
    pickerContainer: { flexDirection: "row", gap: 12, height: PICKER_HEIGHT, marginBottom: 20, position: "relative" },
    pickerHighlight: {
      position: "absolute",
      top: ITEM_HEIGHT * 2,
      left: 0,
      right: 0,
      height: ITEM_HEIGHT,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.surfaceVariant,
    },
    pickerColumn: { flex: 1, alignItems: "center" },
    pickerLabel: { fontSize: 13, marginBottom: 8, color: colors.textSecondary },
    pickerScroll: { flex: 1, width: "100%" },
    pickerItem: { height: ITEM_HEIGHT, alignItems: "center", justifyContent: "center" },
    pickerItemText: { fontSize: 18, color: colors.textSecondary },
    pickerItemTextSelected: { color: colors.textPrimary, fontWeight: "700" },
    buttonContainer: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  });

  const renderColumn = (
    title: string,
    values: number[],
    selectedValue: number,
    ref: React.RefObject<FlatList<PickerItem> | null>,
    onPick: (value: number) => void,
    formatter?: (value: number) => string,
  ) => {
    const data = buildPickerItems(values);
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{title}</Text>
        <FlatList
          ref={ref}
          data={data}
          style={styles.pickerScroll}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          disableIntervalMomentum
          decelerationRate="fast"
          bounces={false}
          keyExtractor={(item) => `${title}-${item.key}`}
          getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          onMomentumScrollEnd={(event) => snapToValue(event.nativeEvent.contentOffset.y, ref, values, onPick)}
          onScrollEndDrag={(event) => snapToValue(event.nativeEvent.contentOffset.y, ref, values, onPick)}
          renderItem={({ item }) => {
            if (item.type === "spacer") return <View style={styles.pickerItem} />;
            const isSelected = item.value === selectedValue;
            return (
              <View style={styles.pickerItem}>
                <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                  {formatter ? formatter(item.value) : item.value}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          const next = clampDateParts(fallbackParts.year, fallbackParts.month, fallbackParts.day);
          setSelectedYear(next.year);
          setSelectedMonth(next.month);
          setSelectedDay(next.day);
          setShowPicker(true);
        }}
        disabled={disabled}
      >
        <TextInput
          value={formatDateDisplay(value)}
          editable={false}
          mode="outlined"
          style={[styles.input, disabled && { opacity: 0.5 }]}
          placeholder={label}
          placeholderTextColor={colors.textSecondary}
          right={<TextInput.Icon icon="calendar-month-outline" />}
        />
      </TouchableOpacity>

      <Portal>
        <Modal visible={showPicker} onDismiss={() => setShowPicker(false)} contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <View style={styles.pickerContainer}>
              <View pointerEvents="none" style={styles.pickerHighlight} />
              {renderColumn("年", years, selectedYear, yearRef, setSelectedYear)}
              {renderColumn("月", months, selectedMonth, monthRef, setSelectedMonth, (item) => `${item}`)}
              {renderColumn("日", days, selectedDay, dayRef, setSelectedDay, (item) => `${item}`)}
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => setShowPicker(false)}>取消</Button>
              <Button mode="contained" onPress={() => {
                onChange(buildDateString(selectedYear, selectedMonth, selectedDay));
                setShowPicker(false);
              }}>确定</Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
