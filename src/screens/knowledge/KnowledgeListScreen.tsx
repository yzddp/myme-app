/**
 * MyMe App - KnowledgeList Screen
 * 知识库列表页面
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { KnowledgeCard, ModuleSelector } from '../../components';
import type { KnowledgeModule } from '../../types/knowledge';

interface KnowledgeListScreenProps {
  navigation?: any;
}

export const KnowledgeListScreen: React.FC<KnowledgeListScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    modules,
    currentModule,
    items,
    isLoading,
    loadModules,
    loadByModule,
    setCurrentModule,
    delete: deleteItem,  // use the delete action from store
  } = useKnowledgeStore();

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (currentModule) {
      loadByModule(currentModule);
    }
  }, [currentModule]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadModules();
    if (currentModule) {
      await loadByModule(currentModule);
    }
    setRefreshing(false);
  };

  const handleModuleSelect = (module: KnowledgeModule) => {
    setCurrentModule(module);
  };

  const handleCreate = () => {
    navigation?.navigate?.('KnowledgeEdit', { module: currentModule });
  };

  const handleEdit = (item: any) => {
    navigation?.navigate?.('KnowledgeEdit', { item });
  };

  const handleDelete = async (item: any) => {
    await deleteItem(item.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>知识库</Text>
        <Text style={styles.subtitle}>M1-M10 分类管理</Text>
      </View>

      <ModuleSelector
        selected={currentModule}
        onSelect={handleModuleSelect}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <KnowledgeCard
            item={item}
            onPress={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无知识条目</Text>
            <Button mode="contained" onPress={handleCreate} style={styles.createButton}>
              添加第一条知识
            </Button>
          </View>
        }
        style={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreate}
        label="添加"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  createButton: {
    width: '80%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default KnowledgeListScreen;
