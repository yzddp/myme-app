import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Text,
  TextInput,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { a2aService } from "../../services/a2aService";
import { avatarService } from "../../services/avatarService";
import type { Avatar as MyAvatar } from "../../types/avatar";
import { KNOWLEDGE_MODULE_DESCRIPTIONS } from "../../types/knowledge";
import AppHeader from "../../components/AppHeader";
import { resolveAvatarUrl } from "../../utils/avatar";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function A2AAddScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [shareCode, setShareCode] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof a2aService.validateShareCode>
  > | null>(null);
  const [myAvatars, setMyAvatars] = useState<MyAvatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const previewOwnerAvatarUrl = resolveAvatarUrl(preview?.ownerUser?.avatarUrl);

  useEffect(() => {
    loadMyAvatars();
  }, []);

  const activeAvatars = useMemo(
    () => myAvatars.filter((avatar) => avatar.status === "active"),
    [myAvatars],
  );

  const loadMyAvatars = async () => {
    try {
      const response = await avatarService.getAvatars();
      setMyAvatars(response.avatars ?? []);
    } catch (error) {
      console.error("Failed to load avatars:", error);
    }
  };

  const handleValidate = async () => {
    if (!shareCode.trim()) {
      Alert.alert("提示", "请输入分享码");
      return;
    }

    setPreviewLoading(true);
    try {
      const result = await a2aService.validateShareCode(shareCode.trim());
      if (!result.valid || !result.ownerAvatar) {
        setPreview(null);
        Alert.alert("校验失败", "分享码无效或已过期");
        return;
      }

      setPreview(result);
    } catch (error: any) {
      setPreview(null);
      Alert.alert("校验失败", error.message || "分享码无效或已过期");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreateRelation = async () => {
    if (!preview?.ownerAvatar) {
      Alert.alert("提示", "请先校验分享码");
      return;
    }

    if (!selectedAvatarId) {
      Alert.alert("提示", "请选择我方要使用的分身");
      return;
    }

    setSubmitting(true);
    try {
      const relation = await a2aService.createRelation(
        shareCode.trim(),
        selectedAvatarId,
      );
      navigation.replace("A2AChat", { relationId: relation.id });
    } catch (error: any) {
      Alert.alert("添加失败", error.message || "关系创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader
        title="添加 A2A 关系"
        subtitle="先确认对方分身，再选择我方分身"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              1. 校验分享码
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              分享码通过后，先看到对方公开分享的是哪个分身与哪些知识模块。
            </Text>
            <TextInput
              value={shareCode}
              onChangeText={setShareCode}
              mode="outlined"
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
              placeholder="输入分享码"
            />
            <Button
              mode="outlined"
              onPress={handleValidate}
              loading={previewLoading}
              disabled={previewLoading || !shareCode.trim()}
            >
              校验分享码
            </Button>
          </Card.Content>
        </Card>

        {preview?.ownerAvatar ? (
          <Card
            style={[styles.sectionCard, { backgroundColor: colors.surface }]}
          >
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                2. 对方分身预览
              </Text>
              <View style={styles.previewHeader}>
                {previewOwnerAvatarUrl ? (
                  <Avatar.Image
                    size={52}
                    source={{ uri: previewOwnerAvatarUrl }}
                  />
                ) : (
                  <Avatar.Text
                    size={52}
                    label={(
                      preview.ownerUser?.nickname || preview.ownerAvatar.name
                    ).slice(0, 2)}
                  />
                )}
                <View style={styles.previewMeta}>
                  <Text
                    style={[styles.previewName, { color: colors.textPrimary }]}
                  >
                    {preview.ownerUser?.nickname || "对方用户"}
                  </Text>
                  <Text
                    style={[
                      styles.previewSubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    对方分身：{preview.ownerAvatar.name}
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.sectionHint, { color: colors.textSecondary }]}
              >
                对方分身已开放的知识模块
              </Text>
              <View style={styles.chipRow}>
                {preview.ownerAvatar.permissions.length > 0 ? (
                  preview.ownerAvatar.permissions.map((module) => (
                    <Chip key={module} style={styles.chip}>
                      {module}
                    </Chip>
                  ))
                ) : (
                  <Text style={{ color: colors.textSecondary }}>
                    未开放知识模块
                  </Text>
                )}
              </View>

              {preview.ownerAvatar.permissions.map((module) => (
                <Text
                  key={module}
                  style={[styles.moduleText, { color: colors.textSecondary }]}
                >
                  {module} · {KNOWLEDGE_MODULE_DESCRIPTIONS[module]}
                </Text>
              ))}
            </Card.Content>
          </Card>
        ) : null}

        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              3. 选择我方分身
            </Text>
            {activeAvatars.length === 0 ? (
              <>
                <Text
                  style={[styles.sectionHint, { color: colors.textSecondary }]}
                >
                  当前没有 active Avatar，请先创建分身再建立关系。
                </Text>
                <Button
                  mode="contained-tonal"
                  onPress={() => navigation.navigate("Profile")}
                >
                  返回我的页面
                </Button>
              </>
            ) : (
              <View style={styles.avatarList}>
                {activeAvatars.map((avatar) => {
                  const selected = avatar.id === selectedAvatarId;
                  return (
                    <Card
                      key={avatar.id}
                      style={[
                        styles.avatarCard,
                        {
                          backgroundColor: selected
                            ? colors.primaryLight
                            : colors.background,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedAvatarId(avatar.id)}
                    >
                      <Card.Content>
                        <Text
                          style={[
                            styles.avatarName,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {avatar.name}
                        </Text>
                        <Text
                          style={[
                            styles.avatarDesc,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {avatar.description || "未填写备注"}
                        </Text>
                      </Card.Content>
                    </Card>
                  );
                })}
              </View>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCreateRelation}
          loading={submitting}
          disabled={submitting || !preview?.ownerAvatar || !selectedAvatarId}
        >
          确认建立关系
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  sectionCard: { borderRadius: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  sectionHint: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  input: { marginBottom: 12 },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  previewMeta: { flex: 1 },
  previewName: { fontSize: 17, fontWeight: "700" },
  previewSubtext: { fontSize: 13, marginTop: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: { marginBottom: 8 },
  moduleText: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  avatarList: { gap: 10 },
  avatarCard: { borderWidth: 1, borderRadius: 16 },
  avatarName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  avatarDesc: { fontSize: 13, lineHeight: 18 },
});
