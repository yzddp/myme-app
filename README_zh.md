<div align="center">

<img src="https://raw.githubusercontent.com/yzddp/myme-app/main/assets/logo.svg" alt="MyMe Logo" width="400" />

# MyMe

### 数字分身，数字永生

[![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-Private-888?style=flat-square)]()

🌐 **[English Documentation](README.md)**

</div>

---

### 概述

**MyMe** 是一款 AI 驱动的数字分身应用，帮助用户创建、管理和交互 AI 数字人格。我们的理念是：真正的数字永生不仅仅是静态问答——它捕捉你的思维模式、学习能力和多维度人格，创造出一个鲜活的数字自我。

### 核心理念

> **记忆数据 + 大脑引擎 = 数字永生**

与只能回答预设问题的传统数字分身不同，MyMe 捕捉：

- **多维度数据** — 覆盖 10 大人生模块的结构化知识
- **动态信息采集** — 持续记录日常思考和经历
- **模式识别** — AI 分析你的思维逻辑和学习能力
- **过去 + 未来 + 模式创造 = 完整数字分身**

### 功能特性

#### 💬 智能对话

- 与 AI Agent 对话，包括"我的过去"和"人生导师"
- AI 自动回复，附带 token 用量和推荐话题
- 从对话中自动提取知识数据

#### 📔 加密日记

- **AES-256-CBC 端到端加密**保护所有日记内容
- AI 自动生成分析报告（日/周/月/年）
- 情感分析、主题提取、个性化人生建议
- 可配置的分析调度周期

#### 🤖 数字分身 (Agent)

- 创建个性化 AI 分身，自定义系统提示词
- 6 种场景：面试、工作、约会、咨询、公司、心理
- 知识库权限控制（M1-M10 模块）
- 分享码机制，让他人发现并与你的分身交互

#### 🌐 社交匹配 (市场)

- **交友匹配** — 基于职业、心理健康、兴趣数据的兴趣匹配
- **恋人匹配** — 跨 5 大知识模块的深度情感相容性分析
- AI 生成匹配理由和综合相容报告

#### 📚 知识库

- **10 大人生模块**，覆盖人格的方方面面：
  - M1: 人生观 — 人生意义、目标、价值观
  - M2: 自我认知 — 优势、劣势、性格特点
  - M3: 人际关系 — 家人、朋友、伴侣
  - M4: 职业发展 — 工作、规划、技能
  - M5: 学习方法 — 策略、知识管理
  - M6: 心理健康 — 情绪、压力、成长
  - M7: 财务管理 — 收入、支出、财富
  - M8: 健康生活 — 运动、饮食、作息
  - M9: 兴趣爱好 — 个人爱好、生活乐趣
  - M10: 其他 — 未分类的个人知识

#### 🔗 分身互联 (A2A)

- 通过分享码连接两个用户的数字分身
- 跨分身对话，支持身份切换
- 拉黑/解除拉黑关系管理

#### ⚙️ 个性化

- 3 套主题：暖色、冷色、暗色
- 多语言支持：英文、简体中文、繁体中文
- 个人资料管理，支持自定义头像

### 技术栈

| 类别        | 技术                              |
| ----------- | --------------------------------- |
| 框架        | React Native (Expo 55)            |
| 语言        | TypeScript 5.9                    |
| 导航        | React Navigation v7 + Expo Router |
| 状态管理    | Zustand                           |
| UI 组件     | React Native Paper                |
| HTTP 客户端 | Axios + React Query               |
| 本地存储    | AsyncStorage + MMKV               |
| 加密        | CryptoJS (AES-256-CBC)            |
| 表单验证    | Formik + Yup                      |

### 项目结构

```
src/
├── components/      # 可复用 UI 组件
├── constants/       # 颜色、主题、常量
├── context/         # 主题 & 国际化 React Contexts
├── hooks/           # 自定义 React hooks
├── i18n/            # 国际化 (en/zh-CN/zh-TW)
├── navigation/      # 导航配置
├── screens/         # 按功能模块组织的页面
│   ├── a2a/         # 分身互联页面
│   ├── agent/       # Agent 管理与对话
│   ├── auth/        # 登录、注册、忘记密码
│   ├── avatar/      # 分身创建
│   ├── diary/       # 日记列表、编辑、分析
│   ├── home/        # 对话列表、新建对话
│   ├── knowledge/   # 知识库 CRUD
│   ├── market/      # 社交匹配
│   └── settings/    # 个人资料、主题、安全
├── services/        # API 服务层
├── store/           # Zustand 状态管理
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

### 快速开始

#### 前置要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS 模拟器 / Android 模拟器 / 安装了 Expo Go 的真机

#### 安装

```bash
# 克隆仓库
git clone https://github.com/yzddp/myme-app.git
cd myme-app

# 安装依赖
npm install

# 启动开发服务器
npx expo start
```

#### 环境配置

在项目根目录创建 `.env` 文件：

```env
API_BASE_URL=http://your-backend-server:8080
```

#### 生产构建

```bash
# 预构建原生项目
npx expo prebuild

# 构建 iOS
npx expo run:ios

# 构建 Android
npx expo run:android
```

### 脚本命令

| 命令              | 描述                 |
| ----------------- | -------------------- |
| `npm start`       | 启动 Expo 开发服务器 |
| `npm run android` | 在 Android 上运行    |
| `npm run ios`     | 在 iOS 上运行        |
| `npm run web`     | 在 Web 上运行        |
| `npm run lint`    | 运行 ESLint 检查     |
| `npm run test`    | 运行 Jest 测试       |

---

<div align="center">

**MyMe** — 数字分身，数字永生

</div>
