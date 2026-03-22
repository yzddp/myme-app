import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Searchbar, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
}

export default function SimplePickerModal({
  visible,
  title,
  options,
  selectedValue,
  onDismiss,
  onSelect,
  searchable = true,
}: {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue?: string | null;
  onDismiss: () => void;
  onSelect: (value: string) => void;
  searchable?: boolean;
}) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }

    return options.filter((option) => {
      return (
        option.label.toLowerCase().includes(normalized) ||
        option.description?.toLowerCase().includes(normalized)
      );
    });
  }, [options, query]);

  const styles = StyleSheet.create({
    modalContainer: {
      padding: 20,
      justifyContent: "center",
    },
    modalContent: {
      maxHeight: "80%",
      borderRadius: 20,
      padding: 20,
      backgroundColor: colors.surface,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 12,
    },
    search: {
      marginBottom: 12,
      backgroundColor: colors.surfaceVariant,
    },
    option: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
    },
    selected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    optionLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    optionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          {searchable ? (
            <Searchbar
              placeholder="搜索"
              value={query}
              onChangeText={setQuery}
              style={styles.search}
            />
          ) : null}
          <ScrollView>
            {filteredOptions.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <Button
                  key={option.value}
                  mode={selected ? "contained" : "outlined"}
                  style={[styles.option, selected && styles.selected]}
                  onPress={() => {
                    onSelect(option.value);
                    onDismiss();
                  }}
                  contentStyle={{ justifyContent: "flex-start" }}
                  labelStyle={{ color: selected ? colors.textOnPrimary : colors.textPrimary }}
                >
                  {option.label}
                </Button>
              );
            })}
          </ScrollView>
          <View style={styles.footer}>
            <Button onPress={onDismiss}>关闭</Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
