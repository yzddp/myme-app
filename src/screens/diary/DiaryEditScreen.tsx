/**
 * MyMe App - Diary Edit Screen
 * 日记编辑页面
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, TextInput, Button, Icon } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { diaryService } from "../../services/diaryService";
import type { DiaryStackParamList } from "../../navigation/types";

type EditRouteProp = RouteProp<DiaryStackParamList, "DiaryEdit">;

export default function DiaryEditScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditRouteProp>();
  const { id } = route.params || {};
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadDiary();
    }
  }, [id]);

  const loadDiary = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const diary = await diaryService.getDiary(id);
      setContent(diary.content);
    } catch (error) {
      console.error("Failed to load diary:", error);
      Alert.alert("错误", "加载日记失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (content.trim()) {
      Alert.alert("确认返回", "内容尚未保存，确定要返回吗？", [
        { text: "取消", style: "cancel" },
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      if (id) {
        await diaryService.update(id, { content });
        Alert.alert("成功", "日记已更新", [
          { text: "确定", onPress: () => navigation.goBack() },
        ]);
      } else {
        await diaryService.create(content);
        Alert.alert("成功", "日记已保存", [
          { text: "确定", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("错误", "保存日记失败");
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
