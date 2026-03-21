# A2A (Agent-to-Agent) 双向分身聊天 - 前端技术方案

## 1. 架构目标

前端需要与新版后端 A2A 设计保持一致：A2A 关系不再是“用户加用户”，而是“当前用户使用自己的某个 Avatar，与对方公开分享的某个 Avatar 建立关系”。

因此，前端改造的目标有三条：

1. **分身创建体验升级**：支持从角色预设中快速创建 Avatar，并允许用户补充自定义设定。
2. **关系绑定流程升级**：绑定 A2A 前必须先确认对方分享的是哪个分身，再选择“我方使用哪个分身”发起关系。
3. **聊天认知边界可视化**：在关系列表和聊天页中，始终明确展示双方分身身份，以及对方分身已授权的知识范围。

本方案以现有前端页面为基础，补齐页面交互、状态管理、DTO 适配和接口调用顺序，确保可以直接进入实施。

---

## 2. 设计原则

### 2.1 前端不再基于 `owner/peer` 做方向判断

新版后端响应应以“当前登录用户视角”输出：

- `selfAvatar`
- `counterpartAvatar`
- `counterpartUser`

前端页面、store、组件都应直接消费该结构，不再在 UI 层判断“我当前是 owner 还是 peer”。

### 2.2 `description` 与 `customPrompt` 分离

创建分身时：

- `description` 仅用于普通介绍或备注
- `presetId` 表示所选角色模板
- `customPrompt` 表示用户补充的人设/说话方式/身份约束

不能再将预设 `systemPrompt` 自动写入 `description` 字段，否则会导致业务语义混乱。

### 2.3 聊天页只展示对方分身的授权边界

聊天页顶部的权限标签只展示：

- `counterpartAvatar.permissions`

不再在前端通过 `ownerAvatar.permissions` / `peerAvatar.permissions` 自行判断。

---

## 3. 页面设计方案

### 3.1 创建分身页 (`AvatarCreateScreen`)

页面：agent-我的agent-+添加

目标：降低非专业用户创建高质量分身的门槛，同时让“角色模板”和“自定义设定”在交互上清晰分离。

#### 页面字段

- `name`: 分身名称
- `description`: 分身描述，可选
- `presetId`: 预设角色，可选
- `customPrompt`: 自定义角色设定，可选
- `permissions`: M1-M10 勾选

#### 交互流程

1. 页面进入时调用 `GET /api/v1/avatars/presets`
2. 以“两级分类 + 二级角色列表”展示角色模板
3. 用户选择某个角色后：
   - 表单保存 `presetId`
   - 页面展示该预设的默认说明文案
   - `customPrompt` 输入框保留为空，等待用户补充
4. 若选择“自定义身份”：
   - `presetId` 置空或设为后端约定值
   - 用户直接填写 `customPrompt`
5. 提交时调用 `POST /api/v1/avatars`

#### 交互细节建议

- 角色预设区域建议使用两段式结构：
  - 上半区：分类与角色选择
  - 下半区：当前角色说明预览
- `customPrompt` 文案建议明确：`补充这个分身的说话方式、性格和身份设定`
- `description` 输入框文案建议明确：`给自己看的备注，不参与 AI 身份设定`

### 3.2 编辑分身页 (`AvatarEditScreen`)

编辑页需要与创建页保持同构，支持用户修改：

- `name`
- `description`
- `presetId`
- `customPrompt`
- `permissions`

若用户更换 `presetId`，页面应：

- 保留已有 `customPrompt`，不自动清空
- 仅更新预设预览内容
- 提醒用户确认新的角色设定是否仍适配当前自定义补充

### 3.3 添加 A2A 关系页 (`A2ARelationAddScreen`)

页面：agent-agent关系-+添加

这是新版 A2A 体验的核心页面。

#### 目标

让用户明确知道：

1. 对方分享的是哪个分身
2. 我将使用哪个自己的分身去和对方交流

#### 交互流程

1. 用户输入 `shareCode`
2. 点击“下一步”或输入完成后触发校验，调用 `GET /api/v1/avatars/validate-share-code?shareCode=xxx`
3. 若有效，页面展示分享码预览卡片：
   - 对方用户头像/昵称
   - 对方分身名称
   - 对方分身开放的 `permissions`
4. 页面拉取我方 active `avatars`
5. 用户选择“我使用哪个分身去建立关系”
6. 点击确认，调用 `POST /api/v1/a2a`

#### 提交参数

```typescript
{
  shareCode: string;
  peerAvatarId: string;
}
```

#### 异常场景

- `shareCode` 无效：提示“分享码无效或已过期”
- 当前用户没有 active Avatar：提示先去创建分身，并提供跳转
- 已存在 active 关系：提示“你已经用这个分身和对方建立过关系”
- 扫自己分享码：提示“不能与自己的分身建立 A2A 关系”

### 3.4 A2A 关系列表页 (`A2ARelationListScreen`)

页面：agent-agent关系列表页

列表页要从“联系人列表”升级为“分身会话列表”。

#### 每个列表项展示内容

- `counterpartUser.avatarUrl`
- `counterpartUser.nickname` 或兜底用户名
- `counterpartAvatar.name`
- `selfAvatar.name`
- `latestMessagePreview`
- `latestMessageAt`

#### 推荐文案结构

- 主标题：对方用户昵称
- 副标题：`对方分身：{counterpartAvatar.name} · 我方分身：{selfAvatar.name}`
- 辅助信息：最后一条消息预览

#### 状态处理

- `status = active`：可进入聊天
- `status = blocked`：列表项展示已屏蔽状态，并限制发送入口

### 3.5 A2A 聊天页 (`A2AChatScreen`)

页面-对话

聊天页需要追加承载：

- 聊天消息
- 当前关系上下文
- 对方分身认知边界说明

#### 顶部信息区 (`Header / Info Banner`)

展示内容：

- 对方用户昵称
- 对方分身名称
- 我方分身名称
- 对方分身授权模块标签，即 `counterpartAvatar.permissions`

推荐文案：

- 标题：`正在和 {counterpartAvatar.name} 对话`
- 说明：`该分身已授权的认知范围`

Tag 展示规则：

- 默认显示 M 编号，如 `M1`、`M3`、`M8`
- 点击或悬浮时展开模块中文说明
- 若无授权模块，展示 `未开放知识模块`

#### 输入区

保留现有 `senderType` 切换能力，但文案必须明确：

- `本人发送`
- `由我的分身代发`

并补充轻提示：

- 当用户切到 `agent` 时，提示“将由你的当前分身身份代你表达”

---

## 4. 状态管理设计

### 4.1 Store 结构

建议在 `a2aStore` 或等价的 Redux/Zustand store 中维护以下状态：

```typescript
interface AvatarPresetRole {
  id: string;
  name: string;
  systemPrompt: string;
  fullId: string;
}

interface AvatarPresetCategory {
  id: string;
  name: string;
  roles: AvatarPresetRole[];
}

interface A2ARelation {
  id: string;
  status: 'active' | 'blocked';
  selfAvatar: {
    id: string;
    name: string;
    permissions: string[];
    presetId: string | null;
  };
  counterpartAvatar: {
    id: string;
    name: string;
    permissions: string[];
    presetId: string | null;
  };
  counterpartUser: {
    id: string;
    nickname: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  latestMessagePreview: string | null;
  latestMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ShareCodePreview {
  valid: boolean;
  ownerUser: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  } | null;
  ownerAvatar: {
    id: string;
    name: string;
    permissions: string[];
    presetId: string | null;
  } | null;
}
```

### 4.2 推荐状态切分

- `relations`: 关系列表
- `currentRelation`: 当前聊天关系详情
- `messagesByRelationId`: 消息缓存
- `presets`: 角色模板树
- `shareCodePreview`: 分享码校验结果
- `myAvatars`: 当前用户可选分身列表

### 4.3 重要原则

- 不在 store 中长期保存基于 `owner/peer` 的旧结构
- API 返回后立即转成视角化模型，避免页面散落转换逻辑
- `shareCodePreview` 与 `currentRelation` 分离，避免添加页状态污染聊天页

---

## 5. 接口对接设计

### 5.1 角色预设接口

- **接口**: `GET /api/v1/avatars/presets`
- **用途**: 创建/编辑分身页渲染角色选择器

前端处理建议：

- 首次进入创建页时拉取
- 成功后缓存到 `presets`
- 若已有缓存且未过期，可直接复用

### 5.2 创建分身接口

- **接口**: `POST /api/v1/avatars`

请求体：

```typescript
{
  name: string;
  description?: string;
  permissions?: string[];
  presetId?: string;
  customPrompt?: string;
}
```

表单提交逻辑：

- 允许只选预设不填 `customPrompt`
- 允许不选预设只填 `customPrompt`
- `description` 与 `customPrompt` 独立提交

### 5.3 更新分身接口

- **接口**: `PUT /api/v1/avatars/:id`
- **用途**: 编辑分身
- **字段**: 与创建接口一致

### 5.4 分享码校验接口

- **接口**: `GET /api/v1/avatars/validate-share-code?shareCode=xxx`

推荐使用方式：

1. 用户点击“校验”按钮后请求
2. 成功后展示 `ownerUser` + `ownerAvatar` 卡片
3. 失败时清空旧预览数据

### 5.5 创建 A2A 关系接口

- **接口**: `POST /api/v1/a2a`

请求体：

```typescript
{
  shareCode: string;
  peerAvatarId: string;
}
```

成功后建议：

- 直接跳转至新建关系的聊天页，或返回列表页并刷新

### 5.6 获取关系列表接口

- **接口**: `GET /api/v1/a2a`

前端渲染时只消费：

- `selfAvatar`
- `counterpartAvatar`
- `counterpartUser`

不再在前端保留后端原始 owner/peer 判定逻辑。

### 5.7 获取关系详情接口

- **接口**: `GET /api/v1/a2a/:relationId`

进入聊天页时，优先用该接口拿到：

- `currentRelation`
- 顶部 Banner 所需上下文

### 5.8 消息接口

- **发送消息**: `POST /api/v1/a2a/:relationId/messages`
- **获取消息**: `GET /api/v1/a2a/:relationId/messages`

发送消息时继续传：

- `content`
- `senderType`

---

## 6. 页面数据流

### 6.1 创建分身数据流

1. 进入页面
2. 拉取 `presets`
3. 用户选择角色并填写 `customPrompt`
4. 用户选择授权模块
5. 提交创建
6. 成功后返回分身列表或上一页

### 6.2 添加关系数据流

1. 输入 `shareCode`
2. 调用分享码校验接口
3. 展示对方分身预览
4. 拉取并展示我方 active Avatars
5. 选择 `peerAvatarId`
6. 提交创建关系
7. 成功后刷新关系列表并跳转

### 6.3 聊天页数据流

进入页面时建议按以下顺序加载：

1. 获取关系详情 `GET /api/v1/a2a/:relationId`
2. 渲染顶部关系信息与权限 Banner
3. 获取消息列表 `GET /api/v1/a2a/:relationId/messages`
4. 用户发送消息 `POST /api/v1/a2a/:relationId/messages`
5. 本地追加消息并等待后端返回 AI 回复

说明：

- 不建议只依赖列表页透传的 relation 简版对象渲染聊天头部
- 聊天页必须以关系详情接口为准，避免顶部权限标签闪烁或使用旧数据

---

## 7. 组件拆分建议

### 7.1 创建分身相关

- `AvatarPresetSelector`
- `AvatarPresetPreview`
- `AvatarPromptEditor`
- `AvatarPermissionSelector`

### 7.2 添加关系相关

- `ShareCodeInput`
- `ShareCodePreviewCard`
- `SelfAvatarPicker`

### 7.3 聊天相关

- `A2AChatHeader`
- `A2APermissionBanner`
- `SenderTypeToggle`
- `A2AMessageList`
- `A2AComposer`

目标是将“关系上下文展示”和“消息流展示”拆开，减少聊天页容器组件复杂度。

---

## 8. 异常与边界处理

### 8.1 创建分身页

- 预设加载失败：允许用户继续纯手动创建
- `presetId` 失效：提交时报错并提示刷新模板列表

### 8.2 添加关系页

- 分享码无效或过期：清空预览卡片
- 对方分身已停用：展示不可绑定提示
- 我方无可用分身：展示空状态和跳转按钮
- 重复绑定：展示后端错误文案

### 8.3 聊天页

- 关系不存在：跳转列表页并提示
- 关系已 blocked：保留历史消息，只禁用发送框
- 对方无授权模块：Banner 显示“未开放知识模块”

---

## 9. 类型定义与兼容策略

### 9.1 旧类型替换策略

如果当前前端仍使用旧的 A2A 类型：

```typescript
{
  ownerAvatar: ...,
  peerAvatar: ...
}
```

应统一迁移为：

```typescript
{
  selfAvatar: ...,
  counterpartAvatar: ...,
  counterpartUser: ...
}
```

### 9.2 兼容期建议

若前后端不能同日发布，可在前端适配层保留一次性转换函数：

```typescript
function normalizeA2ARelation(raw: any, currentUserId: string): A2ARelation
```

但该函数只应作为过渡方案，待后端正式切换后尽快删除，避免长期维护双模型。

---

## 10. 测试建议

### 10.1 页面联调测试

- 创建分身：验证预设选择、自定义 Prompt、权限提交是否正确
- 添加关系：验证分享码预览、分身选择、重复绑定提示
- 聊天页：验证顶部 Banner、权限标签、身份切换文案

### 10.2 关键场景测试

1. 只选预设，不填 `customPrompt`
2. 不选预设，只填 `customPrompt`
3. 分享码有效，但我方没有 active Avatar
4. 同一对 Avatar 重复绑定
5. 关系被 blocked 后进入聊天页
6. 对方分身没有任何授权模块

### 10.3 回归测试

- 普通 Avatar 创建/编辑流程不受影响
- 分享码生成和验证流程不受影响
- 原有 A2A 消息列表和发送逻辑在新 DTO 下继续可用

---

## 11. 与后端方案的对齐点

前端必须与 `docs/plans/2024-03-21-a2a-backend-design.md` 保持一致，特别是以下几点：

1. A2A 关系主语是 Avatar Pair，而不是 User Pair
2. 关系表不再承载 `permissions`
3. Avatar 侧新增 `presetId` 和 `customPrompt`
4. 聊天页权限展示来源于 `counterpartAvatar.permissions`
5. 关系 DTO 统一为 `selfAvatar / counterpartAvatar / counterpartUser`

---

## 12. 设计评审结论

- [x] 前端页面已与 Avatar Pair 模型对齐
- [x] 角色预设接入方式已与 `presetId + customPrompt` 模型对齐
- [x] 添加关系流程已补足“分享码预览 -> 选择我方分身 -> 创建关系”闭环
- [x] 聊天页权限展示来源已收敛到 `counterpartAvatar.permissions`
- [x] Store、组件、数据流、异常处理和测试点已补齐

---

## 附录 A. 日记分析设置（前端拆分归档）


### A.1 页面形态

页面：新建 我的-日记设置页面

日记分析设置页建议采用类似 iOS 设置页的列表展开式结构，而不是一整页平铺表单。

页面应按四个周期分别展示：

- 日报
- 周报
- 月报
- 年报

每个设置项默认展示一行摘要信息：

- 左侧：报告类型名称与图标
- 右侧：`Switch` 开关

当某项被开启时，再在当前列表项下方平滑展开详细设置面板。

### A.2 核心组件建议

建议拆分为以下组件：

- `SettingList`：四类分析设置的容器
- `SettingItem`：单项设置行，负责标题、图标和开关
- `SettingDetailPanel`：展开后的详细设置面板
- `TimePicker`：时间选择组件
- `DayPicker`：周报 / 月报适用的日期规则选择
- `DatePicker`：年报适用的月日选择

对应交互：

- 日报：仅需 `enabled + time`
- 周报：需 `enabled + day + time`
- 月报：需 `enabled + day + time`
- 年报：需 `enabled + month + day + time`

### A.3 数据流与保存策略

建议数据流如下：

1. 页面加载时调用 `GET /api/v1/diary/analyze/settings`
2. 将 daily / weekly / monthly / yearly 配置填充到本地状态
3. 用户修改任一字段时，先立即更新本地状态
4. 通过防抖自动保存（Debounce Auto Save）调用 `PUT /api/v1/diary/analyze/settings`

设计说明：

- 自动保存可以减少显式“保存按钮”带来的负担
- 防抖可以避免时间选择器拖动时连续触发多次请求
- 页面需要提供“保存中 / 保存成功 / 保存失败”的轻量状态反馈

### A.4 前端注意点

- 各周期设置应相互独立，不能共用一个 `periodType` 状态变量
- 月报的 `day = 'last'` 需要前端在选择器中作为明确可选项展示
- 若某个周期未开启，其详细配置区可以收起，但本地状态不应被清空
- 页面刷新后应以服务端返回值为准，避免本地草稿与服务端配置漂移
