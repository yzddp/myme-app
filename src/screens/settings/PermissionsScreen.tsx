/**
 * MyMe App - Permissions Screen
 * 授权管理页面
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useA2AStore } from '../../store/a2aStore';
import type { A2ARelation } from '../../types/a2a';

interface PermissionsScreenProps {
  navigation?: any;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const { relations, loadRelations, deleteRelation } = useA2AStore();

  useEffect(() => {
    loadRelations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRelations();
    setRefreshing(false);
  };

  const handleRevoke = async (relation: A2ARelation) => {
    await deleteRelation(relation.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>授权管理</Text>
        <Text style={styles.subtitle}>管理已授权的A2A关系</Text>
      </View>

      <FlatList
        data={relations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.peerName}>Peer User</Text>
                <Text style={[styles.status, item.status === 'active' ? styles.activeStatus : styles.blockedStatus]}>
                  {item.status === 'active' ? '活跃' : '已阻止'}
                </Text>
              </View>
              <Text style={styles.permissionsLabel}>已授权模块:</Text>
              <View style={styles.permissionsContainer}>
                {item.permissions.map((p: string, idx: number) => (
                  <Text key={idx} style={styles.permissionChip}>{p}</Text>
                ))}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined" onPress={() => handleRevoke(item)}>
                撤销授权
              </Button>
            </Card.Actions>
          </Card>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无授权关系</Text>
          </View>
        }
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
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  peerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeStatus: {
    backgroundColor: COLORS.success + '20',
    color: COLORS.success,
  },
  blockedStatus: {
    backgroundColor: COLORS.error + '20',
    color: COLORS.error,
  },
  permissionsLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionChip: {
    backgroundColor: COLORS.primaryLight + '30',
    color: COLORS.primary,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default PermissionsScreen;
