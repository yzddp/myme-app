/**
 * MyMe App - A2A Add Screen
 * 添加A2A关系页面（通过分享码 + 选择授权模块）
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Text, TextInput, Button, Chip, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";
import type { KnowledgeModule } from "../../types/knowledge";
import { KNOWLEDGE_MODULE_DESCRIPTIONS } from "../../types/knowledge";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ALL_MODULES: KnowledgeModule[] = [
  "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10",
];

export default function A2AAddScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [shareCode, setShareCode] = useState("");
  const [selectedModules, setSelectedModules] = useState<KnowledgeModule[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleModule = (module: KnowledgeModule) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module],
    );
  };

  const handleAdd = async () => {
    if (!shareCode.trim()) {
      Alert.alert("提示", "请输入分享码");
      return;
    }
    setLoading(true);
    try {
      await a2aService.createRelation(shareCode.trim(), selectedModules);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("添加失败", error.message || "请检查分享码是否正确");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Icon source="arrow-left" size={24} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textOnPrimary }]}>
          添加A2A关系
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.textPrimary }]}>分享码</Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          输入对方的6位分享码以建立A2A关系
        </Text>
        <TextInput
          value={shareCode}
          onChangeText={setShareCode}
          mode="outlined"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          style={styles.input}
          placeholder="例如: ABC123"
        />

        <Text style={[styles.label, { color: colors.textPrimary }]}>
          授权模块（可选）
        </Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          选择允许对方查看的知识模块，不选则默认不授权
        </Text>
        <View style={styles.moduleGrid}>
          {ALL_MODULES.map((module) => {
            const selected = selectedModules.includes(module);
            return (
              <Chip
                key={module}
                selected={selected}
                onPress={() => toggleModule(module)}
                style={[
                  styles.chip,
                  selected
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surfaceVariant },
                ]}
                textStyle={{ color: selected ? colors.textOnPrimary : colors.textSecondary, fontSize: 12 }}
              >
                {module} {KNOWLEDGE_MODULE_DESCRIPTIONS[module]
                  ? KNOWLEDGE_MODULE_DESCRIPTIONS[module].slice(0, 4)
                  : ""}
              </Chip>
            );
          })}
        </View>

        {selectedModules.length > 0 && (
          <Text style={[styles.selectedHint, { color: colors.primary }]}>
            已选 {selectedModules.length} 个模块: {selectedModules.join(", ")}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleAdd}
          loading={loading}
          disabled={loading || !shareCode.trim()}
          style={styles.addBtn}
        >
          添加
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  iconBtn: { width: 40, padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  body: { padding: 24, gap: 8 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  hint: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  input: { marginBottom: 4 },
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: { marginBottom: 2 },
  selectedHint: { fontSize: 13, marginTop: 4 },
  addBtn: { marginTop: 24 },
});
