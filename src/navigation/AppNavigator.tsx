import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../constants/colors";

// 导入类型
import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  AgentStackParamList,
  AvatarStackParamList,
  DiaryStackParamList,
  ProfileStackParamList,
} from "./types";

// 导入屏幕组件
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/home/HomeScreen";
import AgentListScreen from "../screens/agent/AgentListScreen";
import AgentChatScreen from "../screens/agent/AgentChatScreen";
import AvatarListScreen from "../screens/avatar/AvatarListScreen";
import AvatarCreateScreen from "../screens/avatar/AvatarCreateScreen";
import DiaryListScreen from "../screens/diary/DiaryListScreen";
import DiaryEditScreen from "../screens/diary/DiaryEditScreen";
import DiaryReportScreen from "../screens/diary/DiaryReportScreen";
import ProfileScreen from "../screens/settings/ProfileScreen";

// 创建导航器
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AgentStack = createNativeStackNavigator<AgentStackParamList>();
const AvatarStack = createNativeStackNavigator<AvatarStackParamList>();
const DiaryStack = createNativeStackNavigator<DiaryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Tab图标组件
 */
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

/**
 * 首页Stack导航器
 */
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

/**
 * AI对话Stack导航器
 */
function AgentStackNavigator() {
  return (
    <AgentStack.Navigator screenOptions={{ headerShown: false }}>
      <AgentStack.Screen name="AgentList" component={AgentListScreen} />
      <AgentStack.Screen name="AgentChat" component={AgentChatScreen} />
    </AgentStack.Navigator>
  );
}

/**
 * 分身Stack导航器
 */
function AvatarStackNavigator() {
  return (
    <AvatarStack.Navigator screenOptions={{ headerShown: false }}>
      <AvatarStack.Screen name="AvatarList" component={AvatarListScreen} />
      <AvatarStack.Screen name="AvatarCreate" component={AvatarCreateScreen} />
    </AvatarStack.Navigator>
  );
}

/**
 * 日记Stack导航器
 */
function DiaryStackNavigator() {
  return (
    <DiaryStack.Navigator screenOptions={{ headerShown: false }}>
      <DiaryStack.Screen name="DiaryList" component={DiaryListScreen} />
      <DiaryStack.Screen name="DiaryEdit" component={DiaryEditScreen} />
      <DiaryStack.Screen name="DiaryReport" component={DiaryReportScreen} />
    </DiaryStack.Navigator>
  );
}

/**
 * 我的Stack导航器
 */
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

/**
 * 认证栈导航器
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * 主Tab导航器
 * PRD v3.0: 5个Tab - 对话 | 日记 | Agent | 市场 | 我的
 */
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
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
        component={HomeStackNavigator}
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
        component={AvatarStackNavigator}
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

/**
 * 主导航器 - 根据登录状态显示不同界面
 */
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
