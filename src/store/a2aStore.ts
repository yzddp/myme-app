import { create } from "zustand";
import a2aService from "../services/a2aService";
import avatarService from "../services/avatarService";
import type { A2AMessage, A2ARelation, ShareCodePreview } from "../types/a2a";
import type { Avatar } from "../types/avatar";
import type { A2ASenderType } from "../types/a2a";

interface A2AState {
  relations: A2ARelation[];
  currentRelation: A2ARelation | null;
  messagesByRelationId: Record<string, A2AMessage[]>;
  shareCodePreview: ShareCodePreview | null;
  myAvatars: Avatar[];
  isLoading: boolean;
  error: string | null;

  loadRelations: () => Promise<void>;
  loadRelation: (relationId: string) => Promise<A2ARelation | null>;
  loadMyAvatars: () => Promise<void>;
  validateShareCode: (shareCode: string) => Promise<ShareCodePreview | null>;
  clearShareCodePreview: () => void;
  createRelation: (
    shareCode: string,
    peerAvatarId: string,
  ) => Promise<A2ARelation | null>;
  deleteRelation: (id: string) => Promise<void>;
  sendMessage: (
    relationId: string,
    content: string,
    senderType?: A2ASenderType,
  ) => Promise<void>;
  loadMessages: (relationId: string) => Promise<void>;
}

export const useA2AStore = create<A2AState>((set, get) => ({
  relations: [],
  currentRelation: null,
  messagesByRelationId: {},
  shareCodePreview: null,
  myAvatars: [],
  isLoading: false,
  error: null,

  loadRelations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await a2aService.getRelations();
      set({ relations: response.relations, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadRelation: async (relationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const relation = await a2aService.getRelation(relationId);
      set({ currentRelation: relation, isLoading: false });
      return relation;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  loadMyAvatars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await avatarService.getAvatars();
      set({
        myAvatars: response.avatars.filter(
          (avatar) => avatar.status === "active",
        ),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  validateShareCode: async (shareCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const preview = await a2aService.validateShareCode(shareCode);
      set({ shareCodePreview: preview, isLoading: false });
      return preview;
    } catch (error: any) {
      set({ shareCodePreview: null, error: error.message, isLoading: false });
      return null;
    }
  },

  clearShareCodePreview: () => set({ shareCodePreview: null, error: null }),

  createRelation: async (shareCode: string, peerAvatarId: string) => {
    set({ isLoading: true, error: null });
    try {
      const relation = await a2aService.createRelation(shareCode, peerAvatarId);
      set({ relations: [...get().relations, relation], isLoading: false });
      return relation;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  deleteRelation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await a2aService.deleteRelation(id);
      set({
        relations: get().relations.filter((relation) => relation.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (
    relationId: string,
    content: string,
    senderType = "user",
  ) => {
    set({ isLoading: true, error: null });
    try {
      await a2aService.sendMessage(relationId, content, senderType);
      await get().loadMessages(relationId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadMessages: async (relationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await a2aService.getMessages(relationId);
      set({
        messagesByRelationId: {
          ...get().messagesByRelationId,
          [relationId]: response.messages ?? [],
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useA2AStore;
