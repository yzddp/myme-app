/**
 * MyMe App - App Navigator
 * 主导航器 - PRD v3.0
 */

import React from "react";
import { Icon } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  ChatStackParamList,
  AgentStackParamList,
  DiaryStackParamList,
  ProfileStackParamList,
} from "./types";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import MarketScreen from "../screens/market/MarketScreen";

import HomeScreen from "../screens/home/HomeScreen";
import AgentManageScreen from "../screens/agent/AgentManageScreen";
import AgentDetailScreen from "../screens/agent/AgentDetailScreen";
import AgentSessionListScreen from "../screens/agent/AgentSessionListScreen";
import AgentChatScreen from "../screens/agent/AgentChatScreen";
import DiaryListScreen from "../screens/diary/DiaryListScreen";
import DiaryEditScreen from "../screens/diary/DiaryEditScreen";
import DiaryReportScreen from "../screens/diary/DiaryReportScreen";
import DiaryAnalysisScreen from "../screens/diary/DiaryAnalysisScreen";
import ProfileScreen from "../screens/settings/ProfileScreen";
import ProfileEditScreen from "../screens/settings/ProfileEditScreen";
import UserAvatarScreen from "../screens/settings/UserAvatarScreen";
import MyDataScreen from "../screens/settings/MyDataScreen";
import ThemeScreen from "../screens/settings/ThemeScreen";
import NotificationSettingsScreen from "../screens/settings/NotificationSettingsScreen";
import SecurityScreen from "../screens/settings/SecurityScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import FeedbackScreen from "../screens/settings/FeedbackScreen";
import KnowledgeListScreen from "../screens/knowledge/KnowledgeListScreen";
import KnowledgeEditScreen from "../screens/knowledge/KnowledgeEditScreen";
import KnowledgeDetailScreen from "../screens/knowledge/KnowledgeDetailScreen";
import A2ARelationListScreen from "../screens/a2a/A2ARelationListScreen";
import A2AChatScreen from "../screens/a2a/A2AChatScreen";
import A2AAddScreen from "../screens/a2a/A2AAddScreen";
import AvatarCreateScreen from "../screens/avatar/AvatarCreateScreen";
import PermissionsScreen from "../screens/settings/PermissionsScreen";
import AddConversationScreen from "../screens/home/AddConversationScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const AgentStack = createNativeStackNavigator<AgentStackParamList>();
const DiaryStack = createNativeStackNavigator<DiaryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    chat: "chat",
    book: "book-open-variant",
    robot: "robot",
    store: "store",
    user: "account",
  };
  return <Icon source={icons[name] || "circle"} size={24} color={color} />;
}

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatList" component={HomeScreen} />
      <ChatStack.Screen name="Chat" component={AgentChatScreen} />
      <ChatStack.Screen name="AddConversation" component={AddConversationScreen} />
    </ChatStack.Navigator>
  );
}

function AgentStackNavigator() {
  return (
    <AgentStack.Navigator screenOptions={{ headerShown: false }}>
      <AgentStack.Screen name="AgentManage" component={AgentManageScreen} />
      <AgentStack.Screen name="AgentCreate" component={AvatarCreateScreen} />
      <AgentStack.Screen name="AgentDetail" component={AgentDetailScreen} />
      <AgentStack.Screen
        name="AgentSessionList"
        component={AgentSessionListScreen}
      />
      <AgentStack.Screen name="AgentChat" component={AgentChatScreen} />
    </AgentStack.Navigator>
  );
}

function DiaryStackNavigator() {
  return (
    <DiaryStack.Navigator screenOptions={{ headerShown: false }}>
      <DiaryStack.Screen name="DiaryList" component={DiaryListScreen} />
      <DiaryStack.Screen name="DiaryEdit" component={DiaryEditScreen} />
      <DiaryStack.Screen name="DiaryReport" component={DiaryReportScreen} />
      <DiaryStack.Screen name="DiaryAnalysis" component={DiaryAnalysisScreen} />
    </DiaryStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <ProfileStack.Screen name="UserAvatar" component={UserAvatarScreen} />
      <ProfileStack.Screen name="MyData" component={MyDataScreen} />
      <ProfileStack.Screen
        name="KnowledgeList"
        component={KnowledgeListScreen}
      />
      <ProfileStack.Screen
        name="KnowledgeEdit"
        component={KnowledgeEditScreen}
      />
      <ProfileStack.Screen name="A2AList" component={A2ARelationListScreen} />
      <ProfileStack.Screen name="A2AChat" component={A2AChatScreen} />
      <ProfileStack.Screen name="A2AAdd" component={A2AAddScreen} />
      <ProfileStack.Screen name="KnowledgeDetail" component={KnowledgeDetailScreen} />
      <ProfileStack.Screen name="Permissions" component={PermissionsScreen} />
      <ProfileStack.Screen name="Theme" component={ThemeScreen} />
      <ProfileStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <ProfileStack.Screen name="Security" component={SecurityScreen} />
      <ProfileStack.Screen name="About" component={AboutScreen} />
      <ProfileStack.Screen name="Feedback" component={FeedbackScreen} />
    </ProfileStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ChatTab"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: "对话",
          tabBarIcon: ({ color }) => <TabIcon name="chat" color={color} />,
        }}
      />
      <Tab.Screen
        name="DiaryTab"
        component={DiaryStackNavigator}
        options={{
          tabBarLabel: "日记",
          tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
        }}
      />
      <Tab.Screen
        name="AgentTab"
        component={AgentStackNavigator}
        options={{
          tabBarLabel: "Agent",
          tabBarIcon: ({ color }) => <TabIcon name="robot" color={color} />,
        }}
      />
      <Tab.Screen
        name="MarketTab"
        component={MarketScreen}
        options={{
          tabBarLabel: "市场",
          tabBarIcon: ({ color }) => <TabIcon name="store" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ color }) => <TabIcon name="user" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
