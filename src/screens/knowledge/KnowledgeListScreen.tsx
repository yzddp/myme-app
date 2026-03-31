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
import { Text, Card, Button, FAB } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import { useKnowledgeStore } from "../../store/knowledgeStore";
import { KnowledgeCard, ModuleSelector } from "../../components";
import { KNOWLEDGE_MODULES } from "../../components/ModuleSelector";
import type { KnowledgeModule } from "../../types/knowledge";
import AppHeader from "../../components/AppHeader";

interface KnowledgeListScreenProps {
  navigation?: any;
  route?: any;
}

export const KnowledgeListScreen: React.FC<KnowledgeListScreenProps> = ({
  navigation,
  route,
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

  // 仅首次加载模块列表
  useEffect(() => {
    loadModules();
  }, []);

  // 从路由参数设置默认模块（仅首次）
  const initialModuleApplied = React.useRef(false);
  useEffect(() => {
    const defaultModule = route?.params?.module;
    if (defaultModule && !initialModuleApplied.current) {
      initialModuleApplied.current = true;
      setCurrentModule(defaultModule as KnowledgeModule);
    }
  }, [route?.params?.module]);

  // 页面聚焦时静默刷新数据，不触发模块切换
  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener("focus", () => {
      const latestModule = useKnowledgeStore.getState().currentModule;
      if (latestModule) {
        useKnowledgeStore.getState().loadByModule(latestModule);
      }
    });
    return unsubscribe;
  }, [navigation]);

  // 切换模块时加载对应数据
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

  const getModuleTitle = () => {
    if (!currentModule) return "知识库";
    const moduleInfo = KNOWLEDGE_MODULES.find((m) => m.key === currentModule);
    return moduleInfo ? `${moduleInfo.key}${moduleInfo.name}` : currentModule;
  };

  return (
    <View style={styles(colors).container}>
      <AppHeader
        title={getModuleTitle()}
        leftIcon="arrow-left"
        onLeftPress={() => navigation?.goBack?.()}
      />

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
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
