import fs from "fs";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const profileScreen = read("src/screens/settings/ProfileScreen.tsx");
const profileEdit = read("src/screens/settings/ProfileEditScreen.tsx");
const avatarScreen = read("src/screens/settings/UserAvatarScreen.tsx");
const a2aAdd = read("src/screens/a2a/A2AAddScreen.tsx");
const a2aList = read("src/screens/a2a/A2ARelationListScreen.tsx");
const avatarUtils = fs.existsSync("src/utils/avatar.ts")
  ? read("src/utils/avatar.ts")
  : "";

assert(
  /个人信息|资料概览|账号信息/.test(profileScreen),
  "资料页还没有新增资料展示卡片",
);
assert(
  /gender|birthday|locale|updatedAt/.test(profileScreen),
  "资料页缺少性别、生日、地区或更新时间展示",
);
assert(/resolveAvatarUrl/.test(profileScreen), "资料页头像未接入统一 URL 解析");
assert(
  /暖色系|冷色系|暗色系/.test(profileScreen),
  "资料页主题文案还不是友好中文",
);
assert(
  /resolveAvatarUrl/.test(profileEdit),
  "资料编辑页头像未接入统一 URL 解析",
);
assert(/resolveAvatarUrl/.test(avatarScreen), "头像页预览未接入统一 URL 解析");
assert(/resolveAvatarUrl/.test(a2aAdd), "A2A 添加页未接入统一 URL 解析");
assert(/resolveAvatarUrl/.test(a2aList), "A2A 列表页未接入统一 URL 解析");

assert(
  /export function resolveAvatarUrl/.test(avatarUtils),
  "缺少统一头像 URL 解析工具",
);
assert(
  /avatar\.startsWith\("\/"\)/.test(avatarUtils),
  "统一头像 URL 解析未处理相对路径",
);

console.log("verify-profile-display-and-avatar-url: ok");
