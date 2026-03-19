/**
 * MyMe App - Date Picker Input Component
 * 日期选择输入组件
 */

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Portal, Modal, Button } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

interface DatePickerInputProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  disabled?: boolean;
  minimumDate?: string;
  maximumDate?: string;
}

export default function DatePickerInput({
  value,
  onChange,
  label = "选择日期",
  disabled = false,
  minimumDate,
  maximumDate,
}: DatePickerInputProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    parseInt(value.split("-")[0]) || new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    parseInt(value.split("-")[1]) || new Date().getMonth() + 1,
  );
  const [selectedDay, setSelectedDay] = useState(
    parseInt(value.split("-")[2]) || new Date().getDate(),
  );

  // 生成年份列表（支持选择前后10年）
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }

  // 生成月份列表（1-12月）
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 生成天数列表（根据当前选择的年月）
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1,
  );

  // 检查日期是否在范围内
  const isDateInRange = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (minimumDate && dateStr < minimumDate) return false;
    if (maximumDate && dateStr > maximumDate) return false;
    return true;
  };

  const handleConfirm = () => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    onChange(dateStr);
    setShowPicker(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputContainer: {
      flex: 1,
    },
    input: {
      backgroundColor: colors.surface,
      fontSize: 16,
      padding: 12,
      borderRadius: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      width: "80%",
      maxWidth: 350,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 20,
      textAlign: "center",
    },
    pickerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      height: 200,
    },
    pickerColumn: {
      flex: 1,
      alignItems: "center",
    },
    pickerLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    pickerScroll: {
      flex: 1,
      width: "100%",
    },
    pickerItem: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      marginVertical: 2,
      minWidth: 50,
      alignItems: "center",
    },
    pickerItemSelected: {
      backgroundColor: colors.primary,
    },
    pickerItemText: {
      color: colors.textPrimary,
      fontSize: 16,
    },
    pickerItemSelectedText: {
      color: colors.textOnPrimary,
    },
    pickerItemDisabled: {
      opacity: 0.3,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <TextInput
          value={formatDateDisplay(value)}
          editable={false}
          style={[styles.input, disabled && { opacity: 0.5 }]}
          placeholder={label}
        />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择日期</Text>

            <View style={styles.pickerContainer}>
              {/* 年份选择 - 支持滑动 */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>年</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedYear === year &&
                            styles.pickerItemSelectedText,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 月份选择 - 支持滑动 */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>月</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        selectedMonth === month && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMonth === month &&
                            styles.pickerItemSelectedText,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 日期选择 - 支持滑动 */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>日</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {days.map((day) => {
                    const inRange = isDateInRange(
                      selectedYear,
                      selectedMonth,
                      day,
                    );
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.pickerItem,
                          selectedDay === day && styles.pickerItemSelected,
                          !inRange && styles.pickerItemDisabled,
                        ]}
                        onPress={() => inRange && setSelectedDay(day)}
                        disabled={!inRange}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedDay === day &&
                              styles.pickerItemSelectedText,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
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
