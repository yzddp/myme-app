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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { diaryService } from "../../services/diaryService";
import type { DiaryStackParamList } from "../../navigation/types";
import DatePickerInput from "../../components/DatePickerInput";
import AppHeader from "../../components/AppHeader";

type EditRouteProp = RouteProp<DiaryStackParamList, "DiaryEdit">;
type NavigationProp = NativeStackNavigationProp<DiaryStackParamList>;

export default function DiaryEditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditRouteProp>();
  const { id, date } = route.params || {};

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [diaryDate, setDiaryDate] = useState(
    date || new Date().toISOString().split("T")[0],
  );
  const [isEditing, setIsEditing] = useState(!!id);

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
      setOriginalContent(diary.content);
      // 已存在的日记日期不能修改
      setDiaryDate(new Date(diary.createdAt).toISOString().split("T")[0]);
    } catch (error) {
      console.error("Failed to load diary:", error);
      Alert.alert("错误", "加载日记失败");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return content.trim() !== originalContent.trim();
  };

  const goBack = () => {
    navigation.popToTop();
  };

  const handleBack = () => {
    if (hasChanges()) {
      Alert.alert("确认返回", "内容已修改，是否保存？", [
        { text: "取消", style: "cancel" },
        {
          text: "不保存",
          style: "destructive",
          onPress: () => goBack(),
        },
        {
          text: "保存",
          onPress: async () => {
            await handleSave();
          },
        },
      ]);
    } else {
      goBack();
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    // 不允许保存未来日期的日记
    const today = new Date().toISOString().split("T")[0];
    if (!id && diaryDate > today) {
      Alert.alert("日期错误", "不能保存未来日期的日记");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await diaryService.update(id, { content });
      } else {
        await diaryService.create(content, diaryDate);
      }
      // 保存成功后返回列表页
      navigation.popToTop();
    } catch (error: any) {
      console.error("Save failed:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "保存日记失败";
      Alert.alert("错误", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
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
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
    },
    scrollView: {
      flex: 1,
    },
    form: {
      padding: 20,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    dateLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
    },
    dateText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    dateInput: {
      flex: 1,
      backgroundColor: colors.surface,
      fontSize: 16,
      padding: 12,
      borderRadius: 8,
    },
    datePickerContainer: {
      flex: 1,
    },
    textArea: {
      backgroundColor: colors.surface,
      minHeight: 300,
      fontSize: 16,
      lineHeight: 28,
      padding: 16,
      textAlignVertical: "top",
    },
    tips: {
      marginTop: 24,
      padding: 16,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
    tipsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    tipsText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    charCount: {
      fontSize: 12,
      marginTop: 4,
      textAlign: "right",
    },
    saveButton: {
      marginTop: 24,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader
        title="写日记"
        leftIcon="arrow-left"
        onLeftPress={handleBack}
        centerTitle
      />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>日期：</Text>
            <View style={styles.datePickerContainer}>
              <DatePickerInput
                value={diaryDate}
                onChange={setDiaryDate}
                disabled={isEditing}
              />
            </View>
          </View>

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
