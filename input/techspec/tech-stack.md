---
language: JavaScript/TypeScript
framework: React Native (Expo)
test_framework: Jest
build_tool: Expo CLI / EAS Build
file_patterns:
  screen:
    - "src/screens/**/*.tsx"
    - "src/screens/**/*Screen.tsx"
  component:
    - "src/components/**/*.tsx"
    - "src/components/**/*Component.tsx"
  service:
    - "src/services/**/*.ts"
    - "src/services/**/*Service.ts"
  store:
    - "src/store/**/*.ts"
    - "src/store/**/*Store.ts"
  utils:
    - "src/utils/**/*.ts"
    - "src/utils/**/*Util.ts"
  type:
    - "src/types/**/*.ts"
    - "src/types/**/*Type.ts"
  hook:
    - "src/hooks/**/*.ts"
    - "src/hooks/**/*Hook.ts"
  constants:
    - "src/constants/**/*.ts"
  navigation:
    - "src/navigation/**/*.ts"
  test:
    - "src/**/*.test.tsx"
    - "src/**/*.test.ts"
    - "__tests__/**/*.test.tsx"
category_chain:
  screen:
    - "screen"
    - "component"
    - "service"
    - "store"
  service:
    - "service"
    - "store"
    - "utils"
  component:
    - "component"
    - "hook"
    - "type"
startup:
  test: npm test
  build: expo export
  run: npx expo start
---

# MyMe App 移动端技术栈文档

## 项目概述

MyMe App 是一款AI驱动的个人记忆助手应用，基于React Native (Expo)开发，支持Android和iOS双平台。

**核心功能** (依据PRD):

1. 用户认证 (登录/注册/忘记密码)
2. 对话列表 (类似微信)
3. me_agent对话 (引导式提问，沉淀M1-M10数据)
4. A2A聊天 (可切换Agent/真人身份)
5. 日记功能 (日记/周报/月报/年报)
6. Agent创建与管理 (可授权的AI分身)
7. 主题切换 (暖色/冷色/暗色)
8. 我的数据管理 (M1-M10知识库)

---

## 技术栈

### 核心框架

- **React Native**: 0.73+
- **Expo SDK**: 52
- **TypeScript**: 5.x
- **React**: 18.x

### UI组件库

- **React Native Paper**: 5.x (Material Design组件)
- **react-native-vector-icons**: 10.x (MaterialCommunityIcons图标库)
- **@expo/vector-icons**: Expo内置图标

### 状态管理

- **Zustand**: 4.x (轻量级全局状态)
- **React Context**: 主题切换、多语言等

### 数据请求

- **Axios**: 1.x (HTTP客户端)
- **API封装**: 统一拦截器处理Token和错误

### 本地存储

- **@react-native-async-storage/async-storage**: 2.x (通用存储)
- **加密密钥存储**: 使用AsyncStorage存储设备生成的密钥

### 加密库

- **crypto-js**: 4.x (AES-256-CBC加密)

### 导航

- **React Navigation**: 6.x
  - @react-navigation/native
  - @react-navigation/native-stack
  - @react-navigation/bottom-tabs

### 表单处理

- **React Hook Form**: 7.x
- **Yup**: 1.x (表单验证)

### 样式处理

- **StyleSheet**: React Native内置
- **Neumorphism设计**: 自定义阴影样式

---

## 项目结构

```
myme-app/
├── src/
│   ├── screens/                    # 页面组件
│   │   ├── auth/                   # 认证相关
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── chat/                  # 对话相关
│   │   │   ├── ChatListScreen.tsx     # 对话列表(首页)
│   │   │   ├── ChatScreen.tsx          # 聊天页面
│   │   │   └── AddChatScreen.tsx        # 添加对话(系统Agent/其他Agent)
│   │   ├── diary/                  # 日记相关
│   │   │   ├── DiaryScreen.tsx          # 日记Tab(含日记/周报/月报/年报)
│   │   │   ├── DiaryEditScreen.tsx      # 写/编辑日记
│   │   │   ├── WeeklyReportScreen.tsx   # 周报详情
│   │   │   ├── MonthlyReportScreen.tsx  # 月报详情
│   │   │   └── YearlyReportScreen.tsx    # 年报详情
│   │   ├── agent/                  # Agent相关
│   │   │   ├── AgentListScreen.tsx      # 我的Agent列表
│   │   │   └── AgentCreateScreen.tsx     # 创建/编辑Agent
│   │   ├── market/                 # 市场(暂空)
│   │   │   └── MarketScreen.tsx
│   │   └── profile/                 # 我的
│   │       ├── ProfileScreen.tsx         # 我的主页
│   │       ├── DataScreen.tsx            # 我的过去(M1-M10数据)
│   │       ├── DataDetailScreen.tsx      # 模块详情
│   │       ├── EditProfileScreen.tsx      # 编辑资料
│   │       ├── ThemeScreen.tsx            # 主题设置
│   │       └── SecurityScreen.tsx          # 账号安全
│   │
│   ├── components/                 # 公共组件
│   │   ├── ChatBubble.tsx         # 聊天气泡
│   │   ├── DiaryCard.tsx           # 日记卡片
│   │   ├── ModuleSelector.tsx      # M1-M10选择器
│   │   ├── Button.tsx              # 自定义按钮
│   │   ├── Input.tsx               # 自定义输入框
│   │   └── Card.tsx                # 卡片组件
│   │
│   ├── services/                  # API服务
│   │   ├── api.ts                 # Axios封装
│   │   ├── authService.ts         # 认证服务
│   │   ├── chatService.ts         # 对话服务
│   │   ├── agentService.ts        # Agent服务
│   │   ├── diaryService.ts         # 日记服务
│   │   ├── knowledgeService.ts     # 知识库服务
│   │   ├── encryption.ts           # 加密服务
│   │   └── storage.ts             # 本地存储
│   │
│   ├── store/                     # Zustand状态
│   │   ├── authStore.ts           # 认证状态
│   │   ├── chatStore.ts           # 对话状态
│   │   ├── diaryStore.ts          # 日记状态
│   │   ├── agentStore.ts          # Agent状态
│   │   ├── themeStore.ts          # 主题状态
│   │   └── index.ts               # store导出
│   │
│   ├── navigation/                # 导航配置
│   │   ├── AppNavigator.tsx      # 根导航
│   │   ├── TabNavigator.tsx       # 底部Tab导航
│   │   ├── ChatStack.tsx          # 对话栈
│   │   ├── DiaryStack.tsx         # 日记栈
│   │   ├── AgentStack.tsx          # Agent栈
│   │   ├── ProfileStack.tsx       # 我的栈
│   │   ├── types.ts               # 类型定义
│   │   └── index.ts               # 导航导出
│   │
│   ├── constants/                  # 常量
│   │   ├── colors.ts              # 颜色配置(主题色)
│   │   ├── theme.ts               # 主题配置
│   │   └── index.ts               # 常量导出
│   │
│   ├── hooks/                     # 自定义Hook
│   │   ├── useAuth.ts             # 认证相关
│   │   ├── useTheme.ts            # 主题相关
│   │   ├── useChat.ts             # 聊天相关
│   │   └── index.ts               # Hook导出
│   │
│   ├── types/                     # TypeScript类型
│   │   ├── auth.ts               # 认证类型
│   │   ├── chat.ts                # 聊天类型
│   │   ├── diary.ts               # 日记类型
│   │   ├── agent.ts               # Agent类型
│   │   ├── knowledge.ts           # 知识库类型
│   │   └── index.ts               # 类型导出
│   │
│   ├── utils/                     # 工具函数
│   │   ├── storage.ts             # AsyncStorage封装
│   │   ├── date.ts                # 日期格式化
│   │   ├── validation.ts          # 验证函数
│   │   └── index.ts               # 工具导出
│   │
│   └── App.tsx                    # 应用入口
│
├── assets/                         # 静态资源
│   ├── images/
│   └── fonts/
│
├── __tests__/                     # 测试文件
│
├── .env                            # 环境变量
├── app.json                        # Expo配置
├── package.json                    # 依赖配置
├── tsconfig.json                   # TypeScript配置
└── babel.config.js                # Babel配置
```

---

## 导航结构

### TabBar配置 (依据PRD)

```
┌─────────────────────────────────────────────┐
│              [页面内容]                      │
├─────────────────────────────────────────────┤
│ [对话]  [日记]  [Agent]  [市场]   [我的]   │
└─────────────────────────────────────────────┘
```

| Tab | 名称  | 入口Screen      | Stack        |
| --- | ----- | --------------- | ------------ |
| 1   | 对话  | ChatListScreen  | ChatStack    |
| 2   | 日记  | DiaryScreen     | DiaryStack   |
| 3   | Agent | AgentListScreen | AgentStack   |
| 4   | 市场  | MarketScreen    | -            |
| 5   | 我的  | ProfileScreen   | ProfileStack |

---

## 开发环境配置

### 环境要求

- **Node.js**: 18.x+
- **npm/yarn**: 最新稳定版
- **Expo CLI**: latest
- **Android Studio**: (Android开发)
- **Xcode**: (iOS开发，仅macOS)

### 环境变量配置

创建 `.env` 文件：

```env
# API配置
API_URL=https://your-api-domain.com
API_VERSION=/api/v1
API_TIMEOUT=10000

# 加密配置(设备自动生成)
ENCRYPTION_KEY= (设备本地生成，不提交)

# 应用配置
APP_NAME=MyMe
APP_VERSION=1.0.0
```

---

## 关键技术实现

### 1. 主题系统 (Neumorphism)

```typescript
// src/constants/theme.ts
export const themes = {
  warm: {
    background: "#FFF8F0",
    surface: "#FFF8F0",
    primary: "#C87D56",
    primaryLight: "#D99B7A",
    primaryDark: "#A8653D",
    secondary: "#8FA998",
    textPrimary: "#2D3E50",
    textSecondary: "#4A5568",
    textTertiary: "#A0AEC0",
    shadow: "rgba(150,130,110,0.15)",
  },
  cool: {
    background: "#A9C5E0",
    surface: "#A9C5E0",
    primary: "#0077B6",
    // ...
  },
  dark: {
    background: "#1A1C1E",
    surface: "#1A1C1E",
    primary: "#BB86FC",
    // ...
  },
};

export type ThemeMode = "warm" | "cool" | "dark";
```

### 2. 数据加密 (AES-256-CBC)

```typescript
// src/services/encryption.ts
import CryptoJS from "crypto-js";
import { storage } from "../utils/storage";

const ENCRYPTION_KEY_STORAGE = "encryptionKey";

// 生成随机密钥
export const generateKey = (): string => {
  const key = CryptoJS.lib.WordArray.random(32);
  return key.toString(CryptoJS.enc.Base64);
};

// 加密
export const encryptData = (text: string, key?: string): string => {
  const encryptionKey = key || getOrCreateKey();
  const keyWordArray = CryptoJS.enc.Base64.parse(encryptionKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  const cipherBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  return `${ivBase64}:${cipherBase64}`;
};

// 解密
export const decryptData = (encryptedText: string, key?: string): string => {
  const [ivBase64, cipherBase64] = encryptedText.split(":");
  // ... 解密逻辑
};
```

### 3. API封装 (Axios拦截器)

```typescript
// src/services/api.ts
import axios from "axios";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.API_URL + process.env.API_VERSION,
  timeout: 10000,
});

// 请求拦截器 - 添加Token
api.interceptors.request.use((config) => {
  const token = storage.getString("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理401
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      storage.delete("token");
      // 跳转登录
    }
    return Promise.reject(error);
  },
);

export default api;
```

### 4. 状态管理 (Zustand)

```typescript
// src/store/authStore.ts
import { create } from "zustand";
import { storage } from "../utils/storage";

interface AuthState {
  token: string | null;
  user: User | null;
  theme: ThemeMode;
  login: (token: string, user: User) => void;
  logout: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getString("token") || null,
  user: null,
  theme: "warm",

  login: (token, user) => {
    storage.set("token", token);
    set({ token, user });
  },

  logout: () => {
    storage.delete("token");
    set({ token: null, user: null });
  },

  setTheme: (theme) => {
    storage.set("theme", theme);
    set({ theme });
  },
}));
```

### 5. M1-M10知识模块

```typescript
// src/constants/knowledge.ts
export const KNOWLEDGE_MODULES = [
  { key: "M1", name: "个人信息与背景" },
  { key: "M2", name: "记忆与经历" },
  { key: "M3", name: "知识与技能" },
  { key: "M4", name: "兴趣与偏好" },
  { key: "M5", name: "社会关系" },
  { key: "M6", name: "价值观与信念" },
  { key: "M7", name: "决策与思考模式" },
  { key: "M8", name: "情感与心理" },
  { key: "M9", name: "抽象与创意" },
  { key: "M10", name: "整合与自省" },
] as const;

export type KnowledgeModule = (typeof KNOWLEDGE_MODULES)[number]["key"];
```

---

## API接口 (依据PRD)

### 认证

```
POST /api/v1/auth/register    # 注册 (邮箱+用户名+密码)
POST /api/v1/auth/login     # 登录
POST /api/v1/auth/refresh   # 刷新Token
POST /api/v1/auth/reset-password  # 重置密码
GET  /api/v1/auth/me        # 获取当前用户
```

### 对话

```
GET  /api/v1/chat              # 获取对话列表
POST /api/v1/chat              # 创建对话
DELETE /api/v1/chat/:id       # 删除对话
GET  /api/v1/chat/:id/messages # 获取消息列表
POST /api/v1/chat/:id/message  # 发送消息
POST /api/v1/chat/:id/switch   # 切换Agent/人工
```

### Agent

```
GET  /api/v1/agents             # 我的Agent列表
POST /api/v1/agents            # 创建Agent
PUT  /api/v1/agents/:id        # 更新Agent
DELETE /api/v1/agents/:id      # 删除Agent
POST /api/v1/agents/join       # 通过分享码添加Agent
GET  /api/v1/system-agents     # 系统内置Agent列表
```

### 日记

```
GET  /api/v1/diary              # 日记列表
POST /api/v1/diary             # 创建日记
PUT  /api/v1/diary/:id         # 编辑日记
DELETE /api/v1/diary/:id       # 删除日记
GET  /api/v1/diary/weekly      # 周报列表
GET  /api/v1/diary/monthly     # 月报列表
GET  /api/v1/diary/yearly      # 年报列表
```

### 知识库

```
GET  /api/v1/knowledge              # 获取知识概览
GET  /api/v1/knowledge/:module     # 获取指定模块知识
DELETE /api/v1/knowledge/:id       # 删除知识
DELETE /api/v1/knowledge/:module   # 清空模块
```

---

## 构建与部署

### 开发构建

```bash
# 启动开发服务器
npx expo start

# Android运行
npx expo run:android

# iOS运行 (macOS)
npx expo run:ios
```

### 生产构建

```bash
# 导出Web版
npx expo export

# 构建Android APK
npx expo run:android --variant release

# 使用EAS Build
eas build --platform android --local
```

---

## 代码规范

### 命名规范

- **页面组件**: PascalCase + Screen后缀 (如: `ChatListScreen.tsx`)
- **业务组件**: PascalCase + 功能名 (如: `ChatBubble.tsx`)
- **工具函数**: camelCase (如: `formatDate.ts`)
- **类型定义**: PascalCase (如: `UserType.ts`)
- **常量**: UPPER_SNAKE_CASE 或 首字母大写驼峰

### 目录规范

```
screens/[功能模块]/[页面名]Screen.tsx
components/[组件名]Component.tsx
services/[功能]Service.ts
store/[功能]Store.ts
types/[功能].ts
hooks/use[功能].ts
```

### 导入规范

```typescript
// 按顺序导入
// 1. React相关
import React from "react";

// 2. React Native
import { View, Text, StyleSheet } from "react-native";

// 3. 第三方库
import { useNavigation } from "@react-navigation/native";

// 4. 项目组件
import { Button } from "../components";

// 5. 项目服务/状态
import { useAuthStore } from "../store";

// 6. 类型
import type { User } from "../types";
```

---

## 测试框架

### Jest配置

```json
{
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|crypto-js)"
  ]
}
```

### 测试示例

```typescript
// __tests__/services/auth.test.ts
import { encryptData, decryptData } from "../../src/services/encryption";

describe("EncryptionService", () => {
  it("should encrypt and decrypt data", () => {
    const original = "Hello World";
    const encrypted = encryptData(original);
    const decrypted = decryptData(encrypted);
    expect(decrypted).toBe(original);
  });
});
```

---

## 应用商店审核注意事项

### iOS App Store

1. **隐私**
   - 提供隐私政策URL
   - 说明数据收集和使用方式
   - 提供账户删除功能

2. **数据安全**
   - 数据加密存储说明
   - HTTPS传输

3. **用户体验**
   - 清晰的新手引导
   - 适当的年龄分级

### Google Play

1. **隐私**
   - 隐私政策URL
   - 数据安全说明

2. **内容合规**
   - 无违规内容
   - 符合应用质量指南

---

## 注意事项

1. **数据加密**: 所有敏感数据本地加密后存储
2. **API安全**: HTTPS + Token认证
3. **主题切换**: 三套主题(暖色/冷色/暗色)动态切换
4. **性能优化**: 列表使用FlatList优化
5. **错误处理**: 全局异常捕获，友好提示

---

## 参考文档

- [React Native官方文档](https://reactnative.dev/)
- [Expo官方文档](https://docs.expo.dev/)
- [React Navigation文档](https://reactnavigation.org/)
- [React Native Paper文档](https://callstack.github.io/react-native-paper/)
- [Zustand文档](https://github.com/pmndrs/zustand)
