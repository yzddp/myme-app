import type {
  A2ACounterpartUser,
  A2ARelation,
  A2ARelationAvatar,
  LegacyA2ARelation,
  ShareCodePreview,
} from "../types/a2a";
import type { KnowledgeModule } from "../types/knowledge";

const EMPTY_AVATAR: A2ARelationAvatar = {
  id: "",
  name: "未命名分身",
  permissions: [],
  presetId: null,
};

const EMPTY_USER: A2ACounterpartUser = {
  id: "",
  nickname: null,
  username: null,
  avatarUrl: null,
};

function normalizeAvatar(input: any, fallbackName?: string): A2ARelationAvatar {
  return {
    id: input?.id ?? "",
    name: input?.name ?? fallbackName ?? EMPTY_AVATAR.name,
    permissions: Array.isArray(input?.permissions)
      ? (input.permissions as KnowledgeModule[])
      : [],
    presetId: input?.presetId ?? null,
  };
}

function normalizeUser(input: any, fallbackName?: string): A2ACounterpartUser {
  return {
    id: input?.id ?? "",
    nickname: input?.nickname ?? fallbackName ?? null,
    username: input?.username ?? input?.email ?? null,
    avatarUrl: input?.avatarUrl ?? null,
  };
}

export function normalizeA2ARelation(raw: LegacyA2ARelation): A2ARelation {
  const selfAvatar = raw.selfAvatar ?? raw.peerAvatar ?? raw.ownerAvatar;
  const counterpartAvatar =
    raw.counterpartAvatar ?? raw.ownerAvatar ?? raw.peerAvatar;
  const counterpartUser = raw.counterpartUser ??
    raw.ownerUser ??
    raw.peerUser ?? { nickname: raw.peerName };

  return {
    id: raw.id,
    status: raw.status ?? "active",
    selfAvatar: selfAvatar
      ? normalizeAvatar(selfAvatar, "我的分身")
      : { ...EMPTY_AVATAR, name: "我的分身" },
    counterpartAvatar: counterpartAvatar
      ? normalizeAvatar(counterpartAvatar, raw.peerName ?? "对方分身")
      : {
          ...EMPTY_AVATAR,
          name: raw.peerName ?? "对方分身",
          permissions: Array.isArray(raw.permissions)
            ? (raw.permissions as KnowledgeModule[])
            : [],
        },
    counterpartUser: normalizeUser(counterpartUser, raw.peerName ?? "对方"),
    latestMessagePreview: raw.latestMessagePreview ?? null,
    latestMessageAt: raw.latestMessageAt ?? null,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? raw.createdAt ?? "",
  };
}

export function normalizeShareCodePreview(raw: any): ShareCodePreview {
  const ownerAvatar = raw?.ownerAvatar ?? raw?.counterpartAvatar ?? null;
  const ownerUser = raw?.ownerUser ?? raw?.counterpartUser ?? null;

  return {
    valid: Boolean(raw?.valid),
    ownerUser: ownerUser
      ? {
          id: ownerUser.id ?? "",
          nickname: ownerUser.nickname ?? ownerUser.name ?? null,
          avatarUrl: ownerUser.avatarUrl ?? null,
        }
      : null,
    ownerAvatar: ownerAvatar
      ? {
          id: ownerAvatar.id ?? "",
          name: ownerAvatar.name ?? "对方分身",
          permissions: Array.isArray(ownerAvatar.permissions)
            ? (ownerAvatar.permissions as KnowledgeModule[])
            : [],
          presetId: ownerAvatar.presetId ?? null,
        }
      : null,
  };
}
