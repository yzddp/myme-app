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
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  SegmentedButtons,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";
import AppHeader from "../../components/AppHeader";
import DatePickerInput from "../../components/DatePickerInput";
import { resolveAvatarUrl } from "../../utils/avatar";

const GENDER_OPTIONS = [
  { value: "", label: "不设置" },
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "other", label: "其他" },
];

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [birthday, setBirthday] = useState(
    user?.birthday ? user.birthday.split("T")[0] : "",
  );
  const [bio, setBio] = useState(user?.bio || "");
  const [locale, setLocale] = useState(user?.locale || "zh-CN");
  const avatarUri = resolveAvatarUrl(user?.avatar);

  useEffect(() => {
    setUsername(user?.username || "");
    setName(user?.name || "");
    setNickname(user?.nickname || "");
    setGender(user?.gender || "");
    setBirthday(user?.birthday ? user.birthday.split("T")[0] : "");
    setBio(user?.bio || "");
    setLocale(user?.locale || "zh-CN");
  }, [user]);

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
    if (!username.trim()) {
      Alert.alert("错误", "请输入用户名");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile({
        username: username.trim(),
        name: name.trim(),
        nickname: nickname.trim(),
        gender: gender as "male" | "female" | "other" | "",
        birthday: birthday || "",
        bio: bio.trim(),
        locale: locale.trim() || "zh-CN",
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
      <AppHeader
        title="编辑资料"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        centerTitle
      />

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("UserAvatar" as never)}
          >
            {avatarUri ? (
              <Avatar.Image size={100} source={{ uri: avatarUri }} />
            ) : (
              <Avatar.Text
                size={100}
                label={getAvatarLabel(
                  nickname || name || user?.name || undefined,
                )}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>点击头像可更换</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="用户名"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            maxLength={30}
          />

          <TextInput
            label="邮箱"
            value={user?.email || ""}
            mode="outlined"
            style={styles.input}
            disabled
          />

          <TextInput
            label="姓名"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            maxLength={30}
            placeholder="请输入真实姓名或常用称呼"
          />

          <TextInput
            label="昵称"
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
            style={styles.input}
            maxLength={20}
            placeholder="可留空"
          />

          <Text style={[styles.avatarHint, { marginTop: 0, marginBottom: 8 }]}>
            性别
          </Text>
          <SegmentedButtons
            value={gender}
            onValueChange={setGender}
            buttons={GENDER_OPTIONS}
            style={{ marginBottom: 16 }}
          />

          <DatePickerInput
            value={birthday}
            onChange={setBirthday}
            label="生日"
            maximumDate={new Date().toISOString().split("T")[0]}
          />

          <TextInput
            label="语言地区"
            value={locale}
            onChangeText={setLocale}
            mode="outlined"
            style={[styles.input, { marginTop: 16 }]}
            autoCapitalize="none"
            placeholder="例如 zh-CN"
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
            placeholder="介绍一下自己，可留空"
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
