import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

const ITEM_HEIGHT = 48;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PADDING_ITEMS = Math.floor(VISIBLE_COUNT / 2); // 2

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, "0");

const parseTime = (value?: string | null) => {
  const [h = "0", m = "0"] = String(value || "00:00").split(":");
  return {
    hour: Math.min(Math.max(parseInt(h, 10) || 0, 0), 23),
    minute: Math.min(Math.max(parseInt(m, 10) || 0, 0), 59),
  };
};

/**
 * 单列滚轮选择器 — 使用 ScrollView + 手动 snapTo 实现可靠吸附
 */
function WheelColumn({
  label,
  data,
  selectedIndex,
  onSelect,
  colors,
}: {
  label: string;
  data: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  colors: any;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const pendingSnap = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 程序化滚动到指定 index
  const scrollToIndex = useCallback(
    (idx: number, animated = false) => {
      scrollRef.current?.scrollTo({
        y: idx * ITEM_HEIGHT,
        animated,
      });
    },
    [],
  );

  // visible 后初始定位
  useEffect(() => {
    // 用 requestAnimationFrame 确保 ScrollView 已布局
    const raf = requestAnimationFrame(() => {
      scrollToIndex(selectedIndex, false);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 外部 selectedIndex 改变时同步滚动
  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex]);

  const snapToNearest = useCallback(
    (offsetY: number) => {
      const idx = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(data.length - 1, idx));
      scrollRef.current?.scrollTo({
        y: clamped * ITEM_HEIGHT,
        animated: true,
      });
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

  // Android 没有 onMomentumScrollEnd 在快速滑动时，用 onScroll 做 fallback
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
    column: { flex: 1 },
    label: {
      textAlign: "center",
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    scroll: { height: PICKER_HEIGHT },
    paddingView: { height: PADDING_ITEMS * ITEM_HEIGHT },
    item: {
      height: ITEM_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
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
            <View key={value} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextSelected,
                ]}
              >
                {pad(value)}
              </Text>
            </View>
          );
        })}
        <View style={styles.paddingView} />
      </ScrollView>
    </View>
  );
}

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
  const [hourIdx, setHourIdx] = useState(parsed.hour);
  const [minuteIdx, setMinuteIdx] = useState(parsed.minute);

  // 每次打开时重置
  useEffect(() => {
    if (visible) {
      const p = parseTime(value);
      setHourIdx(p.hour);
      setMinuteIdx(p.minute);
    }
  }, [visible, value]);

  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
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
      height: PICKER_HEIGHT + 32,
      position: "relative",
      marginBottom: 16,
    },
    highlight: {
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
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  });

  if (!visible) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.pickerContainer}>
            <View pointerEvents="none" style={styles.highlight} />
            <WheelColumn
              label="时"
              data={HOURS}
              selectedIndex={hourIdx}
              onSelect={setHourIdx}
              colors={colors}
            />
            <WheelColumn
              label="分"
              data={MINUTES}
              selectedIndex={minuteIdx}
              onSelect={setMinuteIdx}
              colors={colors}
            />
          </View>
          <View style={styles.actions}>
            <Button mode="outlined" onPress={onDismiss}>
              取消
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                onConfirm(`${pad(HOURS[hourIdx])}:${pad(MINUTES[minuteIdx])}`)
              }
            >
              确定
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
