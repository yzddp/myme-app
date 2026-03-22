import React, { createContext, useContext, useMemo, useState } from "react";

export type AppLanguage = "zh-CN" | "zh-TW" | "en";

type TranslationKey =
  | "auth.login.title"
  | "auth.login.subtitle"
  | "auth.login.identifier"
  | "auth.login.password"
  | "auth.login.submit"
  | "auth.login.forgotPassword"
  | "auth.login.noAccount"
  | "auth.login.registerNow"
  | "auth.login.required"
  | "auth.login.failed"
  | "auth.register.title"
  | "auth.register.subtitle"
  | "auth.register.username"
  | "auth.register.usernamePlaceholder"
  | "auth.register.email"
  | "auth.register.nickname"
  | "auth.register.password"
  | "auth.register.confirmPassword"
  | "auth.register.submit"
  | "auth.register.hasAccount"
  | "auth.register.loginNow"
  | "auth.register.required"
  | "auth.register.passwordMismatch"
  | "auth.register.passwordShort"
  | "auth.register.usernameInvalid"
  | "auth.register.failed"
  | "profile.title"
  | "profile.userFallback"
  | "profile.usernameUnset"
  | "profile.myData"
  | "profile.profile"
  | "profile.theme"
  | "profile.diarySettings"
  | "profile.security"
  | "profile.feedback"
  | "profile.about"
  | "profile.logout"
  | "profile.logoutTitle"
  | "profile.logoutMessage"
  | "common.confirm"
  | "common.cancel";

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  "zh-CN": {
    "auth.login.title": "MyMe",
    "auth.login.subtitle": "AI驱动的数字分身应用",
    "auth.login.identifier": "邮箱或账号",
    "auth.login.password": "密码",
    "auth.login.submit": "登录",
    "auth.login.forgotPassword": "忘记密码？",
    "auth.login.noAccount": "还没有账号？",
    "auth.login.registerNow": "立即注册",
    "auth.login.required": "请输入邮箱或账号，以及密码",
    "auth.login.failed": "登录失败，请重试",
    "auth.register.title": "创建账号",
    "auth.register.subtitle": "开启你的数字分身之旅",
    "auth.register.username": "账号",
    "auth.register.usernamePlaceholder": "请输入英文和数字组合",
    "auth.register.email": "邮箱",
    "auth.register.nickname": "昵称",
    "auth.register.password": "密码 (至少6位)",
    "auth.register.confirmPassword": "确认密码",
    "auth.register.submit": "注册",
    "auth.register.hasAccount": "已有账号？",
    "auth.register.loginNow": "立即登录",
    "auth.register.required": "请填写所有必填项",
    "auth.register.passwordMismatch": "两次输入的密码不一致",
    "auth.register.passwordShort": "密码长度至少为6位",
    "auth.register.usernameInvalid": "账号只能包含英文字母和阿拉伯数字",
    "auth.register.failed": "注册失败，请重试",
    "profile.title": "我的",
    "profile.userFallback": "用户",
    "profile.usernameUnset": "未设置账号",
    "profile.myData": "我的数据",
    "profile.profile": "资料",
    "profile.theme": "主题",
    "profile.diarySettings": "日记设置",
    "profile.security": "安全",
    "profile.feedback": "意见反馈",
    "profile.about": "关于",
    "profile.logout": "退出登录",
    "profile.logoutTitle": "退出登录",
    "profile.logoutMessage": "确定要退出登录吗？",
    "common.confirm": "确定",
    "common.cancel": "取消",
  },
  "zh-TW": {
    "auth.login.title": "MyMe",
    "auth.login.subtitle": "AI 驅動的數位分身應用",
    "auth.login.identifier": "電子郵件或帳號",
    "auth.login.password": "密碼",
    "auth.login.submit": "登入",
    "auth.login.forgotPassword": "忘記密碼？",
    "auth.login.noAccount": "還沒有帳號？",
    "auth.login.registerNow": "立即註冊",
    "auth.login.required": "請輸入電子郵件或帳號，以及密碼",
    "auth.login.failed": "登入失敗，請稍後再試",
    "auth.register.title": "建立帳號",
    "auth.register.subtitle": "開啟你的數位分身之旅",
    "auth.register.username": "帳號",
    "auth.register.usernamePlaceholder": "請輸入英文與數字組合",
    "auth.register.email": "電子郵件",
    "auth.register.nickname": "暱稱",
    "auth.register.password": "密碼（至少 6 位）",
    "auth.register.confirmPassword": "確認密碼",
    "auth.register.submit": "註冊",
    "auth.register.hasAccount": "已有帳號？",
    "auth.register.loginNow": "立即登入",
    "auth.register.required": "請填寫所有必填項",
    "auth.register.passwordMismatch": "兩次輸入的密碼不一致",
    "auth.register.passwordShort": "密碼長度至少為 6 位",
    "auth.register.usernameInvalid": "帳號只能包含英文字母和阿拉伯數字",
    "auth.register.failed": "註冊失敗，請稍後再試",
    "profile.title": "我的",
    "profile.userFallback": "使用者",
    "profile.usernameUnset": "尚未設定帳號",
    "profile.myData": "我的資料",
    "profile.profile": "資料",
    "profile.theme": "主題",
    "profile.diarySettings": "日記設定",
    "profile.security": "安全",
    "profile.feedback": "意見回饋",
    "profile.about": "關於",
    "profile.logout": "登出",
    "profile.logoutTitle": "登出",
    "profile.logoutMessage": "確定要登出嗎？",
    "common.confirm": "確定",
    "common.cancel": "取消",
  },
  en: {
    "auth.login.title": "MyMe",
    "auth.login.subtitle": "AI-powered digital persona app",
    "auth.login.identifier": "Email or account",
    "auth.login.password": "Password",
    "auth.login.submit": "Log in",
    "auth.login.forgotPassword": "Forgot password?",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.registerNow": "Sign up now",
    "auth.login.required": "Enter your email or account and password",
    "auth.login.failed": "Login failed. Please try again.",
    "auth.register.title": "Create account",
    "auth.register.subtitle": "Start your digital persona journey",
    "auth.register.username": "Account",
    "auth.register.usernamePlaceholder": "Use letters and numbers only",
    "auth.register.email": "Email",
    "auth.register.nickname": "Nickname",
    "auth.register.password": "Password (min 6 chars)",
    "auth.register.confirmPassword": "Confirm password",
    "auth.register.submit": "Sign up",
    "auth.register.hasAccount": "Already have an account?",
    "auth.register.loginNow": "Log in now",
    "auth.register.required": "Please fill in all required fields",
    "auth.register.passwordMismatch": "Passwords do not match",
    "auth.register.passwordShort": "Password must be at least 6 characters",
    "auth.register.usernameInvalid": "Account can only contain letters and numbers",
    "auth.register.failed": "Registration failed. Please try again.",
    "profile.title": "Me",
    "profile.userFallback": "User",
    "profile.usernameUnset": "No account set",
    "profile.myData": "My data",
    "profile.profile": "Profile",
    "profile.theme": "Theme",
    "profile.diarySettings": "Diary settings",
    "profile.security": "Security",
    "profile.feedback": "Feedback",
    "profile.about": "About",
    "profile.logout": "Log out",
    "profile.logoutTitle": "Log out",
    "profile.logoutMessage": "Are you sure you want to log out?",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
  },
};

const normalizeLanguageCode = (input?: string | null): AppLanguage => {
  const value = (input || "").toLowerCase();
  if (value.startsWith("zh-tw") || value.startsWith("zh-hk") || value.startsWith("zh-mo") || value.includes("hant")) {
    return "zh-TW";
  }
  if (value.startsWith("en")) {
    return "en";
  }
  return "zh-CN";
};

export const getSystemLanguage = (): AppLanguage => {
  try {
    return normalizeLanguageCode(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return "zh-CN";
  }
};

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(getSystemLanguage());

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key] || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export { normalizeLanguageCode };
