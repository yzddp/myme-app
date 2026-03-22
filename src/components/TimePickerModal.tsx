import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

const ITEM_HEIGHT = 44;
const PADDING_ROWS = 2;
const HOURS = Array.from({ length: 24 }, (_, index) => index);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

type PickerItem = { key: string; value: number; type: "value" | "spacer" };

const buildItems = (values: number[]): PickerItem[] => {
  const top = Array.from({ length: PADDING_ROWS }, (_, index) => ({ key: `top-${index}`, value: 0, type: "spacer" as const }));
  const bottom = Array.from({ length: PADDING_ROWS }, (_, index) => ({ key: `bottom-${index}`, value: 0, type: "spacer" as const }));
  return [...top, ...values.map((value) => ({ key: `value-${value}`, value, type: "value" as const })), ...bottom];
};

const parseTime = (value?: string | null) => {
  const [hour = "00", minute = "00"] = String(value || "00:00").split(":");
  return {
    hour: Math.min(Math.max(parseInt(hour, 10) || 0, 0), 23),
    minute: Math.min(Math.max(parseInt(minute, 10) || 0, 0), 59),
  };
};

const formatTime = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

export default function TimePickerModal({
  visible,
  title,
  value,
  onDismiss,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  value?: string | null;
  onDismiss: () => void;
  onConfirm: (value: string) => void;
}) {
  const { colors } = useTheme();
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const hourRef = useRef<FlatList<PickerItem>>(null);
  const minuteRef = useRef<FlatList<PickerItem>>(null);

  useEffect(() => {
    setHour(parsed.hour);
    setMinute(parsed.minute);
  }, [parsed.hour, parsed.minute]);

  const scrollToValue = (ref: React.RefObject<FlatList<PickerItem> | null>, values: number[], currentValue: number) => {
    const index = Math.max(values.indexOf(currentValue), 0) + PADDING_ROWS;
    ref.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: false });
  };

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      scrollToValue(hourRef, HOURS, hour);
      scrollToValue(minuteRef, MINUTES, minute);
    }, 0);
    return () => clearTimeout(timer);
  }, [visible, hour, minute]);

  const styles = StyleSheet.create({
    modalContainer: { justifyContent: "center", alignItems: "center", padding: 20 },
    modalContent: {
      width: "100%",
      maxWidth: 360,
      borderRadius: 20,
      padding: 20,
      backgroundColor: colors.surface,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 16,
    },
    pickerContainer: {
      flexDirection: "row",
      gap: 12,
      height: ITEM_HEIGHT * 5,
      position: "relative",
      marginBottom: 16,
    },
    highlight: {
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
    column: { flex: 1 },
    label: { textAlign: "center", fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
    list: { flex: 1 },
    item: { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
    itemText: { fontSize: 18, color: colors.textSecondary },
    itemTextSelected: { color: colors.textPrimary, fontWeight: "700" },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  });

  const snapToValue = (
    offsetY: number,
    ref: React.RefObject<FlatList<PickerItem> | null>,
    values: number[],
    onPick: (value: number) => void,
  ) => {
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
    const valueIndex = Math.max(0, Math.min(values.length - 1, rawIndex - PADDING_ROWS));
    ref.current?.scrollToOffset({ offset: (valueIndex + PADDING_ROWS) * ITEM_HEIGHT, animated: true });
    onPick(values[valueIndex]);
  };

  const renderColumn = (
    label: string,
    values: number[],
    selected: number,
    ref: React.RefObject<FlatList<PickerItem> | null>,
    onPick: (value: number) => void,
  ) => (
    <View style={styles.column}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        ref={ref}
        data={buildItems(values)}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        disableIntervalMomentum
        decelerationRate="fast"
        bounces={false}
        keyExtractor={(item) => `${label}-${item.key}`}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        onMomentumScrollEnd={(event) => snapToValue(event.nativeEvent.contentOffset.y, ref, values, onPick)}
        onScrollEndDrag={(event) => snapToValue(event.nativeEvent.contentOffset.y, ref, values, onPick)}
        renderItem={({ item }) => {
          if (item.type === "spacer") return <View style={styles.item} />;
          const isSelected = item.value === selected;
          return (
            <View style={styles.item}>
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {String(item.value).padStart(2, "0")}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.pickerContainer}>
            <View pointerEvents="none" style={styles.highlight} />
            {renderColumn("时", HOURS, hour, hourRef, setHour)}
            {renderColumn("分", MINUTES, minute, minuteRef, setMinute)}
          </View>
          <View style={styles.actions}>
            <Button mode="outlined" onPress={onDismiss}>取消</Button>
            <Button mode="contained" onPress={() => onConfirm(formatTime(hour, minute))}>确定</Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
