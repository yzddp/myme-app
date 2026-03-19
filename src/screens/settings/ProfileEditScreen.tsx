/**
 * MyMe App - Profile Edit Screen
 * 资料编辑页面
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileEditScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [bio, setBio] = useState(user?.bio || "");

  useEffect(() => {
    if (user?.nickname) setNickname(user.nickname);
    if (user?.bio) setBio(user.bio);
  }, [user?.nickname, user?.bio]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primary,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textOnPrimary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 32,
    },
    avatar: {
      backgroundColor: colors.primary,
    },
    avatarHint: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textSecondary,
    },
    form: {
      marginBottom: 24,
    },
    input: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    charCount: {
      textAlign: "right",
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: -8,
      marginBottom: 8,
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
    if (!nickname.trim()) {
      Alert.alert("错误", "请输入昵称");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile({
        nickname: nickname.trim(),
        bio: bio.trim() || undefined,
      });
      updateUser(updatedUser);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("错误", "资料更新失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarLabel = (name?: string) => {
    return name?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>编辑资料</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={100}
            label={getAvatarLabel(nickname || user?.name || undefined)}
            style={styles.avatar}
          />
          <Text style={styles.avatarHint}>点击头像可更换</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="邮箱"
            value={user?.email || ""}
            mode="outlined"
            style={styles.input}
            disabled
          />

          <TextInput
            label="昵称"
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
            style={styles.input}
            maxLength={20}
          />

          <TextInput
            label="简介"
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            maxLength={200}
            placeholder="介绍一下自己..."
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
