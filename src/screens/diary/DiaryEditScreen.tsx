/**
 * MyMe App - Diary Edit Screen
 * 日记编辑页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";

export default function DiaryEditScreen() {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      console.log("Saving diary:", content);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon source="arrow-left" size={24} color={COLORS.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>写日记</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="今天发生了什么让你印象深刻的事情？&#10;有什么想法或感受？"
            multiline
            style={styles.textArea}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>写作提示：</Text>
            <Text style={styles.tipsText}>• 描述今天最让你印象深刻的事情</Text>
            <Text style={styles.tipsText}>• 分享你的感受和想法</Text>
            <Text style={styles.tipsText}>• 可以写下明天的计划或期待</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={!content.trim() || saving}
            style={styles.saveButton}
          >
            保存日记
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  textArea: {
    backgroundColor: COLORS.surface,
    minHeight: 300,
    fontSize: 16,
    lineHeight: 28,
    padding: 16,
    textAlignVertical: "top",
  },
  tips: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 24,
  },
});
