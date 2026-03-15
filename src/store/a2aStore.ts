/**
 * MyMe App - A2A Store
 * A2A关系状态管理
 */

import { create } from 'zustand';
import a2aService from '../services/a2aService';
import { 
  A2ARelation, 
  A2AMessage, 
  CreateA2ARelationRequest, 
  UpdateA2ARelationRequest,
  A2ARelationListResponse,
  A2AMessageListResponse
} from '../types/a2a';

interface A2AState {
  relations: A2ARelation[];
  currentRelation: A2ARelation | null;
  messages: A2AMessage[];
  isLoading: boolean;
  error: string | null;

  loadRelations: () => Promise<void>;
  createRelation: (shareCode: string, permissions: string[]) => Promise<A2ARelation | null>;
  deleteRelation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMessages: () => Promise<void>;
}

export const useA2AStore = create<A2AState>((set, get) => ({
  relations: [],
  currentRelation: null,
  messages: [],
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

  createRelation: async (shareCode: string, permissions: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const relation = await a2aService.createRelation(shareCode, permissions as any);
      set({ 
        relations: [...get().relations, relation],
        isLoading: false 
      });
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
        relations: get().relations.filter(r => r.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { currentRelation } = get();
    if (!currentRelation) return;

    set({ isLoading: true, error: null });
    try {
      await a2aService.sendMessage(currentRelation.id, content, 'user');
      await get().loadMessages();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadMessages: async () => {
    const { currentRelation } = get();
    if (!currentRelation) return;

    set({ isLoading: true, error: null });
    try {
      const response = await a2aService.getMessages(currentRelation.id);
      set({ messages: response.messages, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useA2AStore;
