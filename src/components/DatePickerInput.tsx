/**
 * MyMe App - Date Picker Input Component
 * 日期选择输入组件
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
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

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const CENTER_PADDING = ITEM_HEIGHT * 2;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const parseDateParts = (dateStr?: string) => {
  if (!dateStr) {
    return null;
  }

  const [year, month, day] = dateStr.split("-").map((part) => parseInt(part, 10));
  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
};

const buildDateString = (year: number, month: number, day: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
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
    parseDateParts(value) ||
    parseDateParts(defaultPickerDate) ||
    parseDateParts(maximumDate) ||
    { year: 2000, month: 1, day: 1 };

  const clampDateParts = (year: number, month: number, day: number) => {
    const maxDay = getDaysInMonth(year, month);
    const safeDay = clamp(day, 1, maxDay);
    let dateStr = buildDateString(year, month, safeDay);

    if (minimumDate && dateStr < minimumDate) {
      return parseDateParts(minimumDate) || minParts;
    }

    if (maximumDate && dateStr > maximumDate) {
      return parseDateParts(maximumDate) || maxParts;
    }

    return { year, month, day: safeDay };
  };

  const initialParts = clampDateParts(
    fallbackParts.year,
    fallbackParts.month,
    fallbackParts.day,
  );

  const [selectedYear, setSelectedYear] = useState(initialParts.year);
  const [selectedMonth, setSelectedMonth] = useState(initialParts.month);
  const [selectedDay, setSelectedDay] = useState(initialParts.day);

  const yearScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const nextParts = clampDateParts(
      fallbackParts.year,
      fallbackParts.month,
      fallbackParts.day,
    );
    setSelectedYear(nextParts.year);
    setSelectedMonth(nextParts.month);
    setSelectedDay(nextParts.day);
  }, [value, defaultPickerDate, minimumDate, maximumDate]);

  const years = useMemo(() => {
    const result: number[] = [];
    for (let year = minParts.year; year <= maxParts.year; year += 1) {
      result.push(year);
    }
    return result;
  }, [minParts.year, maxParts.year]);

  const months = useMemo(() => {
    let start = 1;
    let end = 12;

    if (selectedYear === minParts.year) {
      start = minParts.month;
    }

    if (selectedYear === maxParts.year) {
      end = maxParts.month;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [selectedYear, minParts.year, minParts.month, maxParts.year, maxParts.month]);

  const days = useMemo(() => {
    const totalDays = getDaysInMonth(selectedYear, selectedMonth);
    let start = 1;
    let end = totalDays;

    if (selectedYear === minParts.year && selectedMonth === minParts.month) {
      start = minParts.day;
    }

    if (selectedYear === maxParts.year && selectedMonth === maxParts.month) {
      end = maxParts.day;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [selectedYear, selectedMonth, minParts, maxParts]);

  useEffect(() => {
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  useEffect(() => {
    if (!days.includes(selectedDay)) {
      setSelectedDay(days[Math.min(days.length - 1, 0)]);
    }
  }, [days, selectedDay]);

  const scrollToValue = (
    ref: React.RefObject<ScrollView | null>,
    values: number[],
    currentValue: number,
    animated = false,
  ) => {
    const index = Math.max(values.indexOf(currentValue), 0);
    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated,
    });
  };

  useEffect(() => {
    if (!showPicker) {
      return;
    }

    const timer = setTimeout(() => {
      scrollToValue(yearScrollRef, years, selectedYear);
      scrollToValue(monthScrollRef, months, selectedMonth);
      scrollToValue(dayScrollRef, days, selectedDay);
    }, 0);

    return () => clearTimeout(timer);
  }, [showPicker, years, months, days, selectedYear, selectedMonth, selectedDay]);

  const pickNearestValue = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    values: number[],
    onPick: (value: number) => void,
  ) => {
    const index = clamp(
      Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT),
      0,
      Math.max(values.length - 1, 0),
    );
    onPick(values[index]);
  };

  const openPicker = () => {
    const nextParts = clampDateParts(
      fallbackParts.year,
      fallbackParts.month,
      fallbackParts.day,
    );
    setSelectedYear(nextParts.year);
    setSelectedMonth(nextParts.month);
    setSelectedDay(nextParts.day);
    setShowPicker(true);
  };

  const handleConfirm = () => {
    onChange(buildDateString(selectedYear, selectedMonth, selectedDay));
    setShowPicker(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) {
      return "";
    }

    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      backgroundColor: colors.surface,
    },
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
      height: PICKER_HEIGHT,
      marginBottom: 20,
      position: "relative",
    },
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
      opacity: 0.9,
    },
    pickerColumn: {
      flex: 1,
      alignItems: "center",
    },
    pickerLabel: {
      fontSize: 13,
      marginBottom: 8,
      color: colors.textSecondary,
    },
    pickerScroll: {
      flex: 1,
      width: "100%",
    },
    pickerContent: {
      paddingTop: CENTER_PADDING,
      paddingBottom: CENTER_PADDING,
    },
    pickerItem: {
      height: ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
    },
    pickerItemText: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    pickerItemTextSelected: {
      color: colors.textPrimary,
      fontWeight: "700",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
  });

  const renderColumn = (
    title: string,
    values: number[],
    selectedValue: number,
    ref: React.RefObject<ScrollView | null>,
    onPick: (value: number) => void,
    formatter?: (value: number) => string,
  ) => {
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{title}</Text>
        <ScrollView
          ref={ref}
          style={styles.pickerScroll}
          contentContainerStyle={styles.pickerContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={(event) => pickNearestValue(event, values, onPick)}
          onScrollEndDrag={(event) => pickNearestValue(event, values, onPick)}
          scrollEventThrottle={16}
        >
          {values.map((item) => {
            const isSelected = item === selectedValue;
            return (
              <View key={`${title}-${item}`} style={styles.pickerItem}>
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.pickerItemTextSelected,
                  ]}
                >
                  {formatter ? formatter(item) : item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openPicker} disabled={disabled}>
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
        <Modal
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>

            <View style={styles.pickerContainer}>
              <View pointerEvents="none" style={styles.pickerHighlight} />
              {renderColumn("年", years, selectedYear, yearScrollRef, setSelectedYear)}
              {renderColumn(
                "月",
                months,
                selectedMonth,
                monthScrollRef,
                setSelectedMonth,
                (item) => `${item}`,
              )}
              {renderColumn(
                "日",
                days,
                selectedDay,
                dayScrollRef,
                setSelectedDay,
                (item) => `${item}`,
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => setShowPicker(false)}>
                取消
              </Button>
              <Button mode="contained" onPress={handleConfirm}>
                确定
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
