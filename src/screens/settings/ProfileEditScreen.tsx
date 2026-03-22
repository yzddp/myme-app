/**
 * MyMe App - Profile Edit Screen
 * 资料编辑页面
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import type { ProfileStackParamList } from "../../navigation/types";
import AppHeader from "../../components/AppHeader";
import DatePickerInput from "../../components/DatePickerInput";
import { resolveAvatarUrl } from "../../utils/avatar";

const GENDER_OPTIONS = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "other", label: "其他" },
];

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileEditScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [birthday, setBirthday] = useState(
    user?.birthday ? user.birthday.split("T")[0] : "",
  );
  const [bio, setBio] = useState(user?.bio || "");
  const [locale, setLocale] = useState(user?.locale || "zh-CN");
  const avatarUri = resolveAvatarUrl(user?.avatar);
  const bypassUnsavedPromptRef = useRef(false);

  useEffect(() => {
    setEmail(user?.email || "");
    setName(user?.name || "");
    setNickname(user?.nickname || "");
    setGender(user?.gender || "");
    setBirthday(user?.birthday ? user.birthday.split("T")[0] : "");
    setBio(user?.bio || "");
    setLocale(user?.locale || "zh-CN");
    bypassUnsavedPromptRef.current = false;
  }, [user]);

  const initialValues = useMemo(
    () => ({
      email: user?.email || "",
      name: user?.name || "",
      nickname: user?.nickname || "",
      gender: user?.gender || "",
      birthday: user?.birthday ? user.birthday.split("T")[0] : "",
      bio: user?.bio || "",
      locale: user?.locale || "zh-CN",
    }),
    [user],
  );

  const isDirty =
    email !== initialValues.email ||
    name !== initialValues.name ||
    nickname !== initialValues.nickname ||
    gender !== initialValues.gender ||
    birthday !== initialValues.birthday ||
    bio !== initialValues.bio ||
    locale !== initialValues.locale;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
  });

  const getAvatarLabel = (value?: string) => {
    return value?.substring(0, 2).toUpperCase() || "U";
  };

  const handleSave = async () => {
    if (!email.trim()) {
      Alert.alert("错误", "请输入邮箱");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert("错误", "请输入有效的邮箱地址");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile({
        email: normalizedEmail,
        name: name.trim(),
        nickname: nickname.trim(),
        gender: gender as "male" | "female" | "other" | "",
        birthday: birthday || "",
        bio: bio.trim(),
        locale: locale.trim() || "zh-CN",
      });
      updateUser(updatedUser);
      bypassUnsavedPromptRef.current = true;
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update profile:", error);
      const message =
        error instanceof Error ? error.message : "资料更新失败，请重试";
      Alert.alert("错误", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (!isDirty || bypassUnsavedPromptRef.current || loading) {
        return;
      }

      event.preventDefault();
      Alert.alert("保存修改", "资料已修改，是否保存后返回？", [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "保存",
          onPress: () => {
            void handleSave();
          },
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, isDirty, loading, email, name, nickname, gender, birthday, bio, locale]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader
        title="编辑资料"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="check"
        onRightPress={() => {
          void handleSave();
        }}
        centerTitle
      />

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("UserAvatar")}>
            {avatarUri ? (
              <Avatar.Image size={100} source={{ uri: avatarUri }} />
            ) : (
              <Avatar.Text
                size={100}
                label={getAvatarLabel(nickname || name || user?.name || undefined)}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>点击头像可更换</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="账号"
            value={user?.username || ""}
            mode="outlined"
            style={styles.input}
            disabled
          />

          <TextInput
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
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

          <Text style={[styles.avatarHint, { marginTop: 0, marginBottom: 8 }]}>性别</Text>
          <SegmentedButtons
            value={gender}
            onValueChange={(value) => setGender(value as typeof gender)}
            buttons={GENDER_OPTIONS}
            style={{ marginBottom: 16 }}
          />

          <DatePickerInput
            value={birthday}
            onChange={setBirthday}
            label="生日"
            minimumDate="1900-01-01"
            maximumDate={new Date().toISOString().split("T")[0]}
            defaultPickerDate="2000-01-01"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
