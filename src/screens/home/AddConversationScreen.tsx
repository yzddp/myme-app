/**
 * MyMe App - Add Conversation Screen
 * 添加新对话页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Text, List, Icon, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { chatService } from "../../services/chatService";

type NavigationProp = NativeStackNavigationProp<ChatStackParamList>;

const SYSTEM_AGENTS = [
  { id: "me_agent", name: "我的过去Agent", description: "引导用户回忆过去，沉淀M1-M10数据" },
  { id: "career_agent", name: "职业顾问", description: "职业发展相关问题" },
  { id: "emotion_agent", name: "情感顾问", description: "情感关系相关问题" },
];

export default function AddConversationScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareCode, setShareCode] = useState("");

  const handleSelectAgent = async (agent: typeof SYSTEM_AGENTS[0]) => {
    try {
      const session = await chatService.createSession("agent" as any, agent.name);
      navigation.replace("Chat", { sessionId: (session as any)?.id });
    } catch (error) {
      Alert.alert("错误", "创建对话失败");
    }
  };

  const handleAddByShareCode = async () => {
    if (!shareCode.trim()) {
      Alert.alert("错误", "请输入分享码");
      return;
    }
    setShareModalVisible(false);
    setShareCode("");
    Alert.alert("提示", "功能开发中");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Icon source="arrow-left" size={24} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textOnPrimary }]}>
          新建对话
        </Text>
        <View style={styles.back} />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        系统Agent
      </Text>
      {SYSTEM_AGENTS.map((agent) => (
        <List.Item
          key={agent.id}
          title={agent.name}
          description={agent.description}
          titleStyle={{ color: colors.textPrimary }}
          descriptionStyle={{ color: colors.textSecondary }}
          left={(props) => (
            <List.Icon {...props} icon="robot" color={colors.primary} />
          )}
          right={(props) => (
            <List.Icon {...props} icon="chevron-right" color={colors.textTertiary} />
          )}
          onPress={() => handleSelectAgent(agent)}
          style={{ backgroundColor: colors.surface, marginBottom: 1 }}
        />
      ))}

      <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 8 }]}>
        其他人的Agent
      </Text>
      <List.Item
        title="通过分享码添加"
        description="输入对方的Agent分享码进行对话"
        titleStyle={{ color: colors.textPrimary }}
        descriptionStyle={{ color: colors.textSecondary }}
        left={(props) => (
          <List.Icon {...props} icon="qrcode-scan" color={colors.primary} />
        )}
        right={(props) => (
          <List.Icon {...props} icon="chevron-right" color={colors.textTertiary} />
        )}
        onPress={() => setShareModalVisible(true)}
        style={{ backgroundColor: colors.surface }}
      />

      <Modal
        visible={shareModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              添加其他人的Agent
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              请输入对方的分享码
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="输入分享码"
              placeholderTextColor={colors.textTertiary}
              value={shareCode}
              onChangeText={setShareCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => { setShareModalVisible(false); setShareCode(""); }}
                style={styles.modalButton}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleAddByShareCode}
                style={styles.modalButton}
              >
                添加
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  back: { width: 40, padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  sectionLabel: { fontSize: 13, paddingHorizontal: 16, paddingVertical: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    padding: 24,
    borderRadius: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalSubtitle: { fontSize: 14, marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: { flex: 1 },
});
