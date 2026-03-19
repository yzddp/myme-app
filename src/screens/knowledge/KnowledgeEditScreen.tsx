/**
 * MyMe App - KnowledgeEdit Screen
 * 知识编辑/创建页面
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import { Text, Button, Card, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useKnowledgeStore } from "../../store/knowledgeStore";
import { ModuleSelector } from "../../components";
import type { KnowledgeModule, KnowledgeItem } from "../../types/knowledge";

interface KnowledgeEditScreenProps {
  navigation?: any;
  route?: any;
}

export const KnowledgeEditScreen: React.FC<KnowledgeEditScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const [module, setModule] = useState<KnowledgeModule>("M1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { create, update, isLoading } = useKnowledgeStore();

  const item = route?.params?.item as KnowledgeItem | undefined;
  const defaultModule = route?.params?.module as KnowledgeModule | undefined;

  useEffect(() => {
    if (item) {
      setModule(item.module);
      setTitle(item.title || "");
      setContent(item.content || "");
      setTags(item.tags || []);
    } else if (defaultModule) {
      setModule(defaultModule);
    }
  }, [item, defaultModule]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    const data = { title, content, tags };

    if (item) {
      await update(item.id, data);
    } else {
      await create(module, data);
    }

    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles(colors).container}>
      <ScrollView style={styles(colors).scrollView}>
        <View style={styles(colors).header}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.primary}
            size={24}
            onPress={() => navigation?.goBack()}
            style={{ marginLeft: -8 }}
          />
          <Text style={styles(colors).title}>
            {item ? "编辑知识" : "添加知识"}
          </Text>
        </View>

        <View style={styles(colors).content}>
          {/* 模块选择 */}
          <Text style={styles(colors).label}>选择分类</Text>
          <ModuleSelector selected={module} onSelect={setModule} />

          {/* 标题 */}
          <Text style={styles(colors).label}>标题（可选）</Text>
          <TextInput
            style={styles(colors).input}
            placeholder="输入标题"
            value={title}
            onChangeText={setTitle}
          />

          {/* 内容 */}
          <Text style={styles(colors).label}>内容 *</Text>
          <TextInput
            style={[styles(colors).input, styles(colors).textArea]}
            placeholder="输入知识内容"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
          />

          {/* 标签 */}
          <Text style={styles(colors).label}>标签</Text>
          <View style={styles(colors).tagInputContainer}>
            <TextInput
              style={styles(colors).tagInput}
              placeholder="输入标签后按添加"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
            />
            <Button
              mode="contained"
              onPress={addTag}
              style={styles(colors).addButton}
            >
              添加
            </Button>
          </View>
          <View style={styles(colors).tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles(colors).tag}>
                <Text style={styles(colors).tagText}>#{tag}</Text>
                <IconButton
                  icon="close"
                  size={14}
                  onPress={() => removeTag(tag)}
                  style={styles(colors).removeTag}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles(colors).footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading || !content.trim()}
          style={styles(colors).saveButton}
        >
          {item ? "保存修改" : "保存知识"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingBottom: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 12,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    textArea: {
      height: 150,
      textAlignVertical: "top",
    },
    tagInputContainer: {
      flexDirection: "row",
      gap: 8,
    },
    tagInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addButton: {
      height: 40,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primaryLight + "30",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 13,
      color: colors.primary,
      marginRight: 4,
    },
    removeTag: {
      margin: 0,
      padding: 0,
    },
    footer: {
      backgroundColor: colors.surface,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveButton: {
      paddingVertical: 8,
    },
  });

export default KnowledgeEditScreen;
