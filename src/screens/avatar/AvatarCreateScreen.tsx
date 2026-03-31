import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  TextInput,
} from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { avatarService } from "../../services/avatarService";
import type { AgentStackParamList } from "../../navigation/types";
import type {
  AvatarPresetCategory,
  AvatarPresetRole,
} from "../../types/avatar";
import type { KnowledgeModule } from "../../types/knowledge";
import { KNOWLEDGE_MODULE_DESCRIPTIONS } from "../../types/knowledge";
import AppHeader from "../../components/AppHeader";

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;
type ScreenRouteProp = RouteProp<AgentStackParamList, "AgentCreate">;

const MODULES: KnowledgeModule[] = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6",
  "M7",
  "M8",
  "M9",
  "M10",
];

export default function AvatarCreateScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const avatarId = route.params?.id;
  const isEditMode = Boolean(avatarId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [permissions, setPermissions] = useState<KnowledgeModule[]>([]);
  const [presetCategories, setPresetCategories] = useState<
    AvatarPresetCategory[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetLoadFailed, setPresetLoadFailed] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  useEffect(() => {
    void loadPresets();
  }, []);

  useEffect(() => {
    if (avatarId) {
      void loadAvatar(avatarId);
    }
  }, [avatarId]);

  const loadPresets = async () => {
    setPresetLoading(true);
    setPresetLoadFailed(false);
    try {
      const categories = await avatarService.getPresets();
      setPresetCategories(categories);
      setSelectedCategoryId((current) => current ?? categories[0]?.id ?? null);
    } catch (error) {
      console.error("Failed to load avatar presets:", error);
      setPresetLoadFailed(true);
    } finally {
      setPresetLoading(false);
    }
  };

  const loadAvatar = async (id: string) => {
    setScreenLoading(true);
    try {
      const avatar = await avatarService.getAvatar(id);
      setName(avatar.name);
      setDescription(avatar.description || "");
      setCustomPrompt(avatar.customPrompt || "");
      setPermissions(avatar.permissions || []);
      if (avatar.presetId) {
        setSelectedPresetId(avatar.presetId);
      }
    } catch (error: any) {
      Alert.alert("错误", error.message || "分身详情加载失败");
    } finally {
      setScreenLoading(false);
    }
  };

  const selectedCategory = useMemo(
    () =>
      presetCategories.find((category) => category.id === selectedCategoryId) ??
      null,
    [presetCategories, selectedCategoryId],
  );

  const selectedPreset: AvatarPresetRole | null = useMemo(() => {
    if (!selectedPresetId) {
      return null;
    }

    return (
      presetCategories
        .flatMap((category) => category.roles)
        .find(
          (role) =>
            role.id === selectedPresetId || role.fullId === selectedPresetId,
        ) ?? null
    );
  }, [presetCategories, selectedPresetId]);

  const togglePermission = (module: KnowledgeModule) => {
    setPermissions((prev) =>
      prev.includes(module)
        ? prev.filter((item) => item !== module)
        : [...prev, module],
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("提示", "请填写分身名称");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        presetId: selectedPresetId
          ? (selectedPreset?.fullId ?? selectedPresetId)
          : undefined,
        customPrompt: customPrompt.trim() || undefined,
        permissions,
      };

      if (avatarId) {
        await avatarService.update(avatarId, payload);
      } else {
        await avatarService.create(payload);
      }

      navigation.goBack();
    } catch (error: any) {
      console.error("Failed to submit avatar:", error);
      Alert.alert(
        "错误",
        error.message || `${isEditMode ? "分身更新" : "分身创建"}失败`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title={isEditMode ? "编辑分身" : "创建分身"}
        subtitle={
          isEditMode
            ? "修改模板时会保留你的自定义设定"
            : "角色模板与自定义设定分开填写"
        }
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {screenLoading ? (
          <Card
            style={[styles.sectionCard, { backgroundColor: colors.surface }]}
          >
            <Card.Content>
              <Text style={{ color: colors.textSecondary }}>
                分身信息加载中...
              </Text>
            </Card.Content>
          </Card>
        ) : null}

        <Card style={[styles.guideCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Card.Content>
            <Text style={[styles.guideTitle, { color: colors.primary }]}>
              填写引导
            </Text>
            <Text style={[styles.guideText, { color: colors.textPrimary }]}>
              分身的名称和角色模板，是给对方看到的信息。{"\n"}
              例如：你创建了一个名为"老公"的分身，选择了"老公"模板 -- 这个分身是给你的老婆使用的，你老婆打开后看到的就是"老公"在跟她聊天。
            </Text>
          </Card.Content>
        </Card>

        <TextInput
          label="分身名称"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="分身描述（可选）"
          placeholder="给自己看的备注，不参与 AI 身份设定"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              角色模板
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              更换模板时不会自动清空 `customPrompt`，只更新模板预览。
            </Text>

            <View style={styles.chipRow}>
              {presetCategories.map((category) => (
                <Chip
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                  style={styles.chip}
                >
                  {category.name}
                </Chip>
              ))}
            </View>

            {presetLoading ? (
              <Text
                style={[styles.sectionHint, { color: colors.textSecondary }]}
              >
                角色模板加载中...
              </Text>
            ) : presetLoadFailed ? (
              <View>
                <Text style={[styles.sectionHint, { color: colors.error }]}>
                  角色模板加载失败，你仍可继续纯手动创建。
                </Text>
                <Button mode="text" onPress={loadPresets} compact>
                  重新加载模板
                </Button>
              </View>
            ) : selectedCategory ? (
              <View style={styles.chipRow}>
                {selectedCategory.roles.map((role) => {
                  const selected =
                    selectedPresetId === role.id ||
                    selectedPresetId === role.fullId;
                  return (
                    <Chip
                      key={role.fullId}
                      selected={selected}
                      onPress={() => setSelectedPresetId(role.fullId)}
                      style={styles.chip}
                    >
                      {role.name}
                    </Chip>
                  );
                })}
              </View>
            ) : (
              <Text
                style={[styles.sectionHint, { color: colors.textSecondary }]}
              >
                后端当前返回的模板列表为空，你仍可继续纯手动创建。
              </Text>
            )}

            <Divider style={styles.divider} />
            <View
              style={[
                styles.previewPanel,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.previewBadge, { color: colors.primary }]}>
                模板默认设定
              </Text>
              <Text
                style={[styles.previewTitle, { color: colors.textPrimary }]}
              >
                {selectedPreset ? selectedPreset.name : "未选择角色模板"}
              </Text>
              <Text
                style={[styles.previewText, { color: colors.textSecondary }]}
              >
                {selectedPreset
                  ? selectedPreset.systemPrompt
                  : "未选择模板时，这里不会注入任何默认 prompt。"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              我的补充设定
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              这里填写你额外补充的人设、语气、边界约束；不会覆盖模板默认设定，而是作为追加说明。
            </Text>
            <TextInput
              label="自定义角色设定（可选）"
              placeholder="补充这个分身的说话方式、性格和身份设定"
              value={customPrompt}
              onChangeText={setCustomPrompt}
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              授权模块
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              聊天页会仅展示对方分身已经开放的知识范围。
            </Text>
            <View style={styles.chipRow}>
              {MODULES.map((module) => (
                <Chip
                  key={module}
                  selected={permissions.includes(module)}
                  onPress={() => togglePermission(module)}
                  style={styles.chip}
                >
                  {module}
                </Chip>
              ))}
            </View>

            {permissions.length > 0 ? (
              <View style={styles.permissionList}>
                {permissions.map((module) => (
                  <Text
                    key={module}
                    style={[
                      styles.permissionText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {module} · {KNOWLEDGE_MODULE_DESCRIPTIONS[module]}
                  </Text>
                ))}
              </View>
            ) : (
              <Text
                style={[styles.sectionHint, { color: colors.textSecondary }]}
              >
                未选模块时，对外会显示为未开放知识模块。
              </Text>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !name.trim() || screenLoading}
        >
          {isEditMode ? "保存修改" : "创建分身"}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  input: { marginBottom: 4 },
  sectionCard: { borderRadius: 20 },
  guideCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 4,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  guideText: {
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  sectionHint: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { marginBottom: 8 },
  divider: { marginVertical: 12 },
  previewPanel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  previewBadge: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  previewTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  previewText: { fontSize: 14, lineHeight: 22 },
  permissionList: { marginTop: 12, gap: 6 },
  permissionText: { fontSize: 13, lineHeight: 18 },
});
