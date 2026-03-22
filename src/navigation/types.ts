/**
 * MyMe App - Navigation Types
 * 导航类型定义 - PRD v3.0
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { KnowledgeModule } from "../types/knowledge";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  DiaryTab: NavigatorScreenParams<DiaryStackParamList>;
  AgentTab: NavigatorScreenParams<AgentStackParamList>;
  MarketTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: {
    sessionId?: string;
    type?: "personal" | "agent_self" | "agent_other";
  };
  AddConversation: undefined;
};

export type DiaryStackParamList = {
  DiaryList: undefined;
  DiaryEdit: { id?: string; date?: string };
  DiaryReport: {
    reportId: string;
    periodType: "weekly" | "monthly" | "yearly";
  };
  DiaryAnalysis: { periodType?: string } | undefined;
  DiaryAnalysisSettings: { from?: "profile" | "diary" } | undefined;
};

export type AgentStackParamList = {
  AgentManage: undefined;
  AgentCreate: { id?: string };
  AgentDetail: { id: string };
  AgentSessionList: undefined;
  AgentChat: { sessionId?: string };
  SessionHistory: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  UserAvatar: undefined;
  MyData: undefined;
  KnowledgeList: { module?: KnowledgeModule };
  Permissions: undefined;
  KnowledgeDetail: { id: string };
  KnowledgeEdit: { id?: string; module?: string };
  A2AList: undefined;
  A2AChat: { relationId: string };
  A2AAdd: undefined;
  Theme: undefined;
  Security: undefined;
  About: undefined;
  Feedback: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
