/**
 * MyMe App - Avatar Create Screen
 * 创建分身页面
 */

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, Chip, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { avatarService } from "../../services/avatarService";
import type { AgentStackParamList } from "../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;

const MODULES = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"];

export default function AvatarCreateScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePermission = (module: string) => {
    if (permissions.includes(module)) {
      setPermissions(permissions.filter((p) => p !== module));
    } else {
      setPermissions([...permissions, module]);
    }
  };

  const handleCreate = async () => {
    if (!name || permissions.length === 0) {
      Alert.alert("提示", "请填写分身名称并选择至少一个授权模块");
      return;
    }

    setLoading(true);
    try {
      await avatarService.create({
        name,
        description,
        permissions: permissions as any,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create avatar:", error);
      Alert.alert("错误", "分身创建失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles(colors).container}>
      <View style={[styles(colors).header, { paddingTop: insets.top + 8 }]}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles(colors).title}>创建分身</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles(colors).form}>
        <TextInput
          label="分身名称"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={[styles(colors).input, { marginBottom: 4 }]}
        />
        <Text style={styles(colors).hint}>该名称会作为使用方看到的名称</Text>

        <TextInput
          label="备注"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles(colors).input, { marginBottom: 4 }]}
        />
        <Text style={styles(colors).hint}>此备注只做备忘，不展示给对方</Text>

        <Text style={styles(colors).label}>授权模块 (M1-M10)</Text>
        <Text style={styles(colors).hint}>选择分身可以访问的知识模块</Text>
        <View style={styles(colors).moduleList}>
          {MODULES.map((module) => (
            <Chip
              key={module}
              selected={permissions.includes(module)}
              onPress={() => togglePermission(module)}
              style={[
                styles(colors).moduleChip,
                permissions.includes(module) &&
                  styles(colors).moduleChipSelected,
              ]}
              textStyle={
                permissions.includes(module)
                  ? styles(colors).moduleChipTextSelected
                  : undefined
              }
            >
              {module}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleCreate}
          style={styles(colors).button}
          disabled={!name || permissions.length === 0 || loading}
          loading={loading}
        >
          创建分身
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 8,
      paddingTop: 48,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textOnPrimary,
      flex: 1,
      textAlign: "center",
    },
    form: {
      padding: 20,
    },
    input: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 8,
    },
    hint: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    moduleList: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 24,
    },
    moduleChip: {
      marginRight: 8,
      marginBottom: 8,
    },
    moduleChipSelected: {
      backgroundColor: colors.primary,
    },
    moduleChipTextSelected: {
      color: colors.textOnPrimary,
    },
    button: {
      marginTop: 16,
    },
  });
