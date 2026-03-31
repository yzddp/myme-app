<div align="center">

<img src="https://raw.githubusercontent.com/yzddp/myme-app/main/assets/logo.svg" alt="MyMe Logo" width="400" />

# MyMe

### Your Digital Twin, Your Digital Immortality

[![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-Private-888?style=flat-square)]()

🌐 **[中文文档](README_zh.md)**

</div>

---

### Overview

**MyMe** is an AI-powered digital twin application that enables users to create, manage, and interact with AI-driven digital personas. Built on the philosophy that true digital immortality goes beyond static Q&A — it captures your thinking patterns, learning capacity, and multi-dimensional personality to create a living digital extension of yourself.

### Core Philosophy

> **Memory + Brain Engine = Digital Immortality**

Unlike traditional digital avatars that only answer preset questions, MyMe captures:

- **Multi-dimensional data** — structured knowledge across 10 life modules
- **Dynamic information collection** — continuous recording of daily thoughts and experiences
- **Pattern recognition** — AI-powered analysis of your thinking logic and learning capacity
- **Past + Future + Pattern Creation = Complete Digital Twin**

### Features

#### 💬 Smart Chat

- Chat with AI agents including "My Past" and "Life Mentor"
- AI-powered auto-replies with token usage and suggested topics
- Automatic knowledge extraction from conversations

#### 📔 Encrypted Diary

- **AES-256-CBC end-to-end encryption** for all diary entries
- AI-generated analysis reports (daily/weekly/monthly/yearly)
- Sentiment analysis, theme extraction, and personalized life advice
- Configurable analysis scheduling

#### 🤖 Digital Twin (Agent)

- Create personalized AI avatars with custom system prompts
- 6 scenario types: Interview, Work, Dating, Consultation, Company, Psychological
- Knowledge base permission control (M1-M10 modules)
- Share code mechanism for others to discover and interact with your twin

#### 🌐 Social Matching (Market)

- **Friend Matching** — interest-based matching using career, mental health, and hobby data
- **Romantic Matching** — deep compatibility analysis across 5 knowledge modules
- AI-generated match reasons and comprehensive compatibility reports

#### 📚 Knowledge Base

- **10 Life Modules** covering every aspect of your persona:
  - M1: Life Philosophy — meaning, purpose, values
  - M2: Self-Awareness — strengths, weaknesses, personality
  - M3: Interpersonal Relationships — family, friends, partners
  - M4: Career Development — work, planning, skills
  - M5: Learning Methods — strategies, knowledge management
  - M6: Mental Health — emotions, stress, growth
  - M7: Financial Management — income, spending, wealth
  - M8: Healthy Living — exercise, diet, sleep
  - M9: Hobbies & Interests — personal interests, life enrichment
  - M10: Others — uncategorized personal knowledge

#### 🔗 Avatar-to-Avatar (A2A) Connection

- Connect two users' digital twins via share codes
- Cross-avatar conversations with identity switching
- Block/unblock relationship management

#### ⚙️ Personalization

- 3 themes: Warm, Cool, Dark
- Multi-language support: English, Simplified Chinese, Traditional Chinese
- Profile management with avatar customization

### Tech Stack

| Category         | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | React Native (Expo 55)            |
| Language         | TypeScript 5.9                    |
| Navigation       | React Navigation v7 + Expo Router |
| State Management | Zustand                           |
| UI Components    | React Native Paper                |
| HTTP Client      | Axios + React Query               |
| Local Storage    | AsyncStorage + MMKV               |
| Encryption       | CryptoJS (AES-256-CBC)            |
| Form Validation  | Formik + Yup                      |

### Project Structure

```
src/
├── components/      # Reusable UI components
├── constants/       # Colors, themes, constants
├── context/         # Theme & i18n React Contexts
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization (en/zh-CN/zh-TW)
├── navigation/      # Navigation configuration
├── screens/         # App screens organized by feature
│   ├── a2a/         # Avatar-to-Avatar screens
│   ├── agent/       # Agent management & chat
│   ├── auth/        # Login, Register, Forgot Password
│   ├── avatar/      # Avatar creation
│   ├── diary/       # Diary list, edit, analysis
│   ├── home/        # Chat list, add conversation
│   ├── knowledge/   # Knowledge base CRUD
│   ├── market/      # Social matching
│   └── settings/    # Profile, theme, security
├── services/        # API service layer
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Getting Started

#### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / physical device with Expo Go

#### Installation

```bash
# Clone the repository
git clone https://github.com/yzddp/myme-app.git
cd myme-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

#### Environment Configuration

Create a `.env` file in the project root:

```env
API_BASE_URL=http://your-backend-server:8080
```

#### Build for Production

```bash
# Prebuild native projects
npx expo prebuild

# Build for iOS
npx expo run:ios

# Build for Android
npx expo run:android
```

### Scripts

| Command           | Description           |
| ----------------- | --------------------- |
| `npm start`       | Start Expo dev server |
| `npm run android` | Start on Android      |
| `npm run ios`     | Start on iOS          |
| `npm run web`     | Start on web          |
| `npm run lint`    | Run ESLint            |
| `npm run test`    | Run Jest tests        |

---

<div align="center">

**MyMe** — Your Digital Twin, Your Digital Immortality

</div>
