/**
 * MyMe App - KnowledgeEdit Screen
 * 知识编辑/创建页面
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { ModuleSelector } from '../../components';
import type { KnowledgeModule, KnowledgeItem } from '../../types/knowledge';

interface KnowledgeEditScreenProps {
  navigation?: any;
  route?: any;
}

export const KnowledgeEditScreen: React.FC<KnowledgeEditScreenProps> = ({ navigation, route }) => {
  const [module, setModule] = useState<KnowledgeModule>('M1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { create, update, isLoading } = useKnowledgeStore();

  const item = route?.params?.item as KnowledgeItem | undefined;
  const defaultModule = route?.params?.module as KnowledgeModule | undefined;

  useEffect(() => {
    if (item) {
      setModule(item.module);
      setTitle(item.title || '');
      setContent(item.content || '');
      setTags(item.tags || []);
    } else if (defaultModule) {
      setModule(defaultModule);
    }
  }, [item, defaultModule]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item ? '编辑知识' : '添加知识'}
          </Text>
        </View>

        <View style={styles.content}>
          {/* 模块选择 */}
          <Text style={styles.label}>选择分类</Text>
          <ModuleSelector
            selected={module}
            onSelect={setModule}
          />

          {/* 标题 */}
          <Text style={styles.label}>标题（可选）</Text>
          <TextInput
            style={styles.input}
            placeholder="输入标题"
            value={title}
            onChangeText={setTitle}
          />

          {/* 内容 */}
          <Text style={styles.label}>内容 *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="输入知识内容"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
          />

          {/* 标签 */}
          <Text style={styles.label}>标签</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="输入标签后按添加"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
            />
            <Button mode="contained" onPress={addTag} style={styles.addButton}>
              添加
            </Button>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <IconButton
                  icon="close"
                  size={14}
                  onPress={() => removeTag(tag)}
                  style={styles.removeTag}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading || !content.trim()}
          style={styles.saveButton}
        >
          {item ? '保存修改' : '保存知识'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    height: 40,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.primary,
    marginRight: 4,
  },
  removeTag: {
    margin: 0,
    padding: 0,
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    paddingVertical: 8,
  },
});

export default KnowledgeEditScreen;
