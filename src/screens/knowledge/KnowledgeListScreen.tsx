/**
 * MyMe App - KnowledgeList Screen
 * 知识库列表页面
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Card, Button, FAB, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useKnowledgeStore } from "../../store/knowledgeStore";
import { KnowledgeCard, ModuleSelector } from "../../components";
import type { KnowledgeModule } from "../../types/knowledge";

interface KnowledgeListScreenProps {
  navigation?: any;
}

export const KnowledgeListScreen: React.FC<KnowledgeListScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    modules,
    currentModule,
    items,
    isLoading,
    loadModules,
    loadByModule,
    setCurrentModule,
    delete: deleteItem, // use the delete action from store
  } = useKnowledgeStore();

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener("focus", () => {
      loadModules();
      if (currentModule) loadByModule(currentModule);
    });
    return unsubscribe;
  }, [navigation]);

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
    navigation?.navigate?.("KnowledgeEdit", { module: currentModule });
  };

  const handleEdit = (item: any) => {
    navigation?.navigate?.("KnowledgeEdit", { item });
  };

  const handleDelete = async (item: any) => {
    await deleteItem(item.id);
  };

  return (
    <SafeAreaView style={styles(colors).container}>
      <View style={styles(colors).header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textPrimary}
          size={24}
          onPress={() => navigation?.goBack?.()}
        />
        <View>
          <Text style={styles(colors).title}>知识库</Text>
          <Text style={styles(colors).subtitle}>M1-M10 分类管理</Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      <ModuleSelector selected={currentModule} onSelect={handleModuleSelect} />

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
          <View style={styles(colors).emptyContainer}>
            <Text style={styles(colors).emptyText}>暂无知识条目</Text>
            <Button
              mode="contained"
              onPress={handleCreate}
              style={styles(colors).createButton}
            >
              添加第一条知识
            </Button>
          </View>
        }
        style={styles(colors).list}
      />

      <FAB
        style={styles(colors).fab}
        icon="plus"
        onPress={handleCreate}
        label="添加"
      />
    </SafeAreaView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    list: {
      flex: 1,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    createButton: {
      width: "80%",
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

export default KnowledgeListScreen;
