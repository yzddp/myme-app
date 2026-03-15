/**
 * MyMe App - User Avatar Screen
 * 头像选择页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text, Avatar, Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { COLORS } from "../../constants/colors";

const PRESET_AVATARS = [
  { id: "avatar_1", label: "A1", color: "#FF6B6B" },
  { id: "avatar_2", label: "A2", color: "#4ECDC4" },
  { id: "avatar_3", label: "A3", color: "#45B7D1" },
  { id: "avatar_4", label: "A4", color: "#96CEB4" },
  { id: "avatar_5", label: "A5", color: "#FFEAA7" },
  { id: "avatar_6", label: "A6", color: "#DDA0DD" },
  { id: "avatar_7", label: "A7", color: "#98D8C8" },
  { id: "avatar_8", label: "A8", color: "#F7DC6F" },
  { id: "avatar_9", label: "A9", color: "#BB8FCE" },
  { id: "avatar_10", label: "B1", color: "#85C1E9" },
  { id: "avatar_11", label: "B2", color: "#F8B500" },
  { id: "avatar_12", label: "B3", color: "#00CED1" },
];

export default function UserAvatarScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarId || null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedAvatar) {
      Alert.alert("提示", "请选择一个头像");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userService.updateAvatar(selectedAvatar);
      updateUser(updatedUser);
      Alert.alert("成功", "头像已更新", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Failed to update avatar:", error);
      Alert.alert("错误", "头像更新失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = ({ item }: { item: (typeof PRESET_AVATARS)[0] }) => {
    const isSelected = selectedAvatar === item.id;
    return (
      <View style={styles.avatarItem}>
        <TouchableOpacity onPress={() => setSelectedAvatar(item.id)}>
          <Avatar.Text
            size={64}
            label={item.label}
            style={[
              styles.avatar,
              { backgroundColor: item.color },
              isSelected && styles.selectedAvatar,
            ]}
          />
        </TouchableOpacity>
        {isSelected && <Text style={styles.selectedLabel}>已选择</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>更换头像</Text>
      </View>

      <View style={styles.preview}>
        <Avatar.Text
          size={100}
          label={
            PRESET_AVATARS.find((a) => a.id === selectedAvatar)?.label ||
            user?.nickname?.substring(0, 2).toUpperCase() ||
            "U"
          }
          style={[
            styles.previewAvatar,
            {
              backgroundColor:
                PRESET_AVATARS.find((a) => a.id === selectedAvatar)?.color ||
                COLORS.primary,
            },
          ]}
        />
        <Text style={styles.previewLabel}>预览</Text>
      </View>

      <Text style={styles.sectionTitle}>选择头像</Text>

      <FlatList
        data={PRESET_AVATARS}
        renderItem={renderAvatar}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.list}
      />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading || !selectedAvatar}
          style={styles.saveButton}
        >
          保存
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          取消
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  preview: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  previewAvatar: {
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  avatarItem: {
    flex: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 4,
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  selectedLabel: {
    fontSize: 12,
    color: COLORS.primary,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: COLORS.surface,
  },
  saveButton: {
    marginBottom: 12,
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    borderColor: COLORS.border,
  },
});
