/**
 * MyMe App - Navigation Types
 * 导航类型定义
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

// 认证栈
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// 主Tab栈 - PRD v3.0: 5个Tab
export type MainTabParamList = {
  ChatTab: NavigatorScreenParams<HomeStackParamList>;
  DiaryTab: NavigatorScreenParams<DiaryStackParamList>;
  AgentTab: NavigatorScreenParams<AgentStackParamList>;
  MarketTab: NavigatorScreenParams<AvatarStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Home栈
export type HomeStackParamList = {
  Home: undefined;
  KnowledgeList: { module?: string };
  KnowledgeDetail: { id: string };
  KnowledgeEdit: { id?: string; module?: string };
  A2AList: undefined;
  A2AChat: { relationId: string };
};

// Agent栈
export type AgentStackParamList = {
  AgentList: undefined;
  AgentChat: { sessionId?: string };
  SessionHistory: undefined;
};

// Avatar栈
export type AvatarStackParamList = {
  AvatarList: undefined;
  AvatarCreate: undefined;
  AvatarDetail: { id: string };
  AvatarEdit: { id: string };
  AvatarChat: { id: string };
};

// Diary栈
export type DiaryStackParamList = {
  DiaryList: undefined;
  DiaryDetail: { id: string };
  DiaryEdit: { id?: string };
  DiaryAnalysis: undefined;
  AnalysisResult: { reportId: string };
  AnalysisSettings: undefined;
};

// Profile栈
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  About: undefined;
};

// 组合所有栈
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// 屏幕props类型
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// 声明全局导航类型
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
