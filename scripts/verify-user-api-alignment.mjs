import fs from "fs";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const authTypes = read("src/types/auth.ts");
const authService = read("src/services/authService.ts");
const userService = read("src/services/userService.ts");
const profileEdit = read("src/screens/settings/ProfileEditScreen.tsx");
const loginScreen = read("src/screens/auth/LoginScreen.tsx");
const registerScreen = read("src/screens/auth/RegisterScreen.tsx");

assert(/avatar: string \| null;/.test(authTypes), "User 类型缺少 avatar 字段");
assert(
  /gender: "male" \| "female" \| "other" \| null;/.test(authTypes),
  "User 类型缺少 gender 字段",
);
assert(
  /birthday: string \| null;/.test(authTypes),
  "User 类型缺少 birthday 字段",
);
assert(/updatedAt: string;/.test(authTypes), "User 类型缺少 updatedAt 字段");

assert(
  /normalizeUser\(user: User\): User/.test(authService),
  "authService 缺少用户归一化逻辑",
);
assert(
  /username\?: string;\s+password: string;/.test(authTypes),
  "登录请求未支持用户名登录",
);
assert(
  /confirmPassword: string;/.test(authTypes),
  "注册请求缺少 confirmPassword",
);

assert(
  /\$\{USER_ENDPOINTS\.avatar\}\/upload/.test(userService),
  "头像上传接口仍不是 /user/avatar/upload",
);
assert(
  /apiService\.put\(`?\$\{USER_ENDPOINTS\.base\}\/password/.test(userService),
  "修改密码接口未切换到 /user/password",
);
assert(/avatarId\?: string;/.test(userService), "预设头像更新未支持 avatarId");

assert(/label="用户名"/.test(profileEdit), "资料页未补充用户名字段");
assert(/label="姓名"/.test(profileEdit), "资料页未补充姓名字段");
assert(/label="语言地区"/.test(profileEdit), "资料页未补充 locale 字段");
assert(/DatePickerInput/.test(profileEdit), "资料页未补充生日控件");
assert(/SegmentedButtons/.test(profileEdit), "资料页未补充性别控件");

assert(
  /label="邮箱或用户名"/.test(loginScreen),
  "登录页未支持邮箱或用户名文案",
);
assert(/label="昵称"/.test(registerScreen), "注册页未补充昵称字段");

console.log("verify-user-api-alignment: ok");
