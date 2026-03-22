/**
 * MyMe App - Feedback Screen
 * 意见反馈页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button, IconButton, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userService } from "../../services/userService";
import AppHeader from "../../components/AppHeader";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const FEEDBACK_TYPES = [
  { key: "bug", label: "Bug反馈" },
  { key: "feature", label: "功能建议" },
  { key: "experience", label: "体验问题" },
  { key: "other", label: "其他" },
];

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [feedbackType, setFeedbackType] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("提示", "请填写反馈内容");
      return;
    }

    if (!feedbackType) {
      Alert.alert("提示", "请选择反馈类型");
      return;
    }

    setSubmitting(true);
    try {
      await userService.submitFeedback({
        type: feedbackType,
        content: content.trim(),
        contact: contact.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      Alert.alert("提交失败", "请稍后再试");
    } finally {
      setSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
      marginTop: 8,
    },
    typeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 20,
    },
    typeChip: {
      marginBottom: 4,
    },
    textArea: {
      backgroundColor: colors.surface,
      minHeight: 160,
      fontSize: 15,
      textAlignVertical: "top",
    },
    charCount: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "right",
      marginTop: 4,
      marginBottom: 20,
    },
    contactInput: {
      backgroundColor: colors.surface,
      marginBottom: 32,
    },
    submitButton: {
      borderRadius: 8,
    },
    submitContent: {
      paddingVertical: 6,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader
        title="意见反馈"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        centerTitle
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>反馈类型</Text>
          <View style={styles.typeRow}>
            {FEEDBACK_TYPES.map((t) => (
              <Chip
                key={t.key}
                selected={feedbackType === t.key}
                onPress={() => setFeedbackType(t.key)}
                style={[
                  styles.typeChip,
                  feedbackType === t.key && { backgroundColor: colors.primary },
                ]}
                textStyle={
                  feedbackType === t.key
                    ? { color: colors.textOnPrimary }
                    : undefined
                }
              >
                {t.label}
              </Chip>
            ))}
          </View>

          <Text style={styles.sectionLabel}>反馈内容 *</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="请描述您的问题或建议..."
            multiline
            style={styles.textArea}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            maxLength={500}
          />
          <Text style={styles.charCount}>{content.length}/500</Text>

          <Text style={styles.sectionLabel}>联系方式（选填）</Text>
          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="邮箱或手机号，方便我们回复您"
            mode="outlined"
            style={styles.contactInput}
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !content.trim()}
            style={styles.submitButton}
            contentStyle={styles.submitContent}
          >
            提交反馈
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
