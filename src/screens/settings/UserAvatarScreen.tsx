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
  Image,
} from "react-native";
import { Text, Avatar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import AppHeader from "../../components/AppHeader";
import { resolveAvatarUrl } from "../../utils/avatar";

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
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const avatarUri = resolveAvatarUrl(user?.avatar);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "需要相册访问权限才能选择照片");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setCustomImageUri(result.assets[0].uri);
      setSelectedAvatar(null);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.textOnPrimary,
    },
    preview: {
      alignItems: "center",
      paddingVertical: 24,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    previewAvatar: {
      marginBottom: 8,
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },
    previewLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    uploadSection: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    uploadButton: {
      borderStyle: "dashed",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
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
      borderColor: colors.primary,
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: colors.surface,
    },
    saveButton: {
      marginBottom: 12,
      backgroundColor: colors.primary,
    },
    cancelButton: {
      borderColor: colors.border,
    },
  });

  const handleSave = async () => {
    if (!selectedAvatar && !customImageUri) {
      Alert.alert("提示", "请选择一个头像");
      return;
    }

    try {
      setLoading(true);
      if (customImageUri) {
        const result = await userService.uploadAvatarImage(customImageUri);
        updateUser({ avatar: result.avatarUrl });
      } else {
        const result = await userService.updateAvatar({
          avatarId: selectedAvatar!,
        });
        updateUser({ avatar: result.avatar });
      }
      navigation.goBack();
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
        <TouchableOpacity
          onPress={() => {
            setSelectedAvatar(item.id);
            setCustomImageUri(null);
          }}
        >
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="更换头像"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        centerTitle
      />

      <View style={styles.preview}>
        {customImageUri ? (
          <Image source={{ uri: customImageUri }} style={styles.previewImage} />
        ) : avatarUri && !selectedAvatar ? (
          <Image source={{ uri: avatarUri }} style={styles.previewImage} />
        ) : (
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
                  colors.primary,
              },
            ]}
          />
        )}
        <Text style={styles.previewLabel}>预览</Text>
      </View>

      <View style={styles.uploadSection}>
        <Button
          mode="outlined"
          icon="camera"
          onPress={handlePickImage}
          style={styles.uploadButton}
        >
          从相册选择照片
        </Button>
      </View>

      <Text style={styles.sectionTitle}>或选择预设头像</Text>

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
          disabled={loading || (!selectedAvatar && !customImageUri)}
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
