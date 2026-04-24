# CampusGo 前端项目说明

## 1. 项目简介

本项目是“校园活动组队平台”的前端部分，项目名称为 `CampusGo`。  
前端基于 `Taro 4 + Vue 3 + TypeScript + Sass` 开发，当前主要以 `H5` 形态进行本地开发和演示，同时保留了 Taro 多端构建能力，后续也可以扩展到微信小程序等平台。

这个项目的定位是课程作业型项目，目标是快速完成一个“能展示完整业务流程”的前端系统。  
目前已经实现的核心流程包括：

- 首页浏览推荐活动
- 活动广场搜索与筛选
- 活动详情查看
- 登录
- 收藏活动
- 报名活动
- 发布活动
- 消息中心
- 个人中心
- 与 Python 后端真实接口联调

当前前端默认连接本机后端接口：

- 前端开发地址：`http://127.0.0.1:3000`
- 后端接口地址：`http://127.0.0.1:8000`

## 1.1 关联仓库

本项目与后端仓库配套使用：

- 当前前端仓库（CampusGo）：`https://github.com/EugeneXXXie/CampusGo`
- 对应后端仓库（CampusGoPY / CampusGo-Backend）：`https://github.com/EugeneXXXie/CampusGo-Backend`

如果你需要本地完整联调，请同时拉取前后端两个仓库。

---

## 2. 技术栈

本项目前端使用的主要技术如下：

- `Taro 4.2.0`
- `Vue 3`
- `TypeScript`
- `Sass`
- `NutUI Taro`

项目使用 Taro 的页面式组织方式，配合 Vue 3 的组合式写法实现页面逻辑。  
状态管理没有引入 Pinia/Vuex，而是使用了轻量的 `reactive store`，便于作业项目快速开发和理解。

---

## 3. 项目目录结构

前端项目根目录位于：

`C:\Users\33151\Desktop\CampusGo`

核心目录说明如下：

```text
CampusGo
├─ config                 Taro 构建配置
├─ docs                   文档目录
├─ src
│  ├─ assets              静态资源，如 TabBar 图标
│  ├─ components          通用组件
│  ├─ mock                历史 mock 数据与资源兜底
│  ├─ pages               页面目录
│  ├─ services            接口请求与数据映射
│  ├─ stores              轻量状态管理
│  ├─ types               TypeScript 类型定义
│  ├─ utils               常量与格式化工具
│  ├─ app.config.ts       全局页面与 TabBar 配置
│  ├─ app.scss            全局样式
│  └─ app.ts              应用入口
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 4. 主要页面说明

本项目当前包含以下主要页面：

### 4.1 首页 `pages/home`

功能：

- 展示推荐活动
- 展示热门分类入口
- 跳转到活动广场
- 点击活动进入详情页

### 4.2 活动广场 `pages/square`

功能：

- 搜索活动
- 按活动分类筛选
- 按活动状态筛选
- 查看活动列表
- 点击活动进入详情页

### 4.3 发布活动 `pages/publish`

功能：

- 输入活动标题、分类、时间、地点、人数、联系方式、描述
- 支持是否审核开关
- 登录后可发起活动
- 发布成功后跳转到广场页

### 4.4 消息中心 `pages/message`

功能：

- 查看消息列表
- 区分全部消息和未读消息
- 点击消息自动标记已读
- 若消息关联活动，则可跳转活动详情

### 4.5 个人中心 `pages/profile`

功能：

- 查看当前登录用户信息
- 展示我的发布、已报名、已收藏等统计
- 登录/退出登录

### 4.6 登录页 `pages/auth/login`

功能：

- 使用手机号密码登录
- 登录后保存 token
- 登录成功后返回上一页或进入个人中心

### 4.7 活动详情页 `pages/activity/detail`

功能：

- 查看活动详情
- 查看发起人信息
- 查看评论
- 收藏活动
- 报名活动

---

## 5. 当前前端已接入的后端能力

目前前端已经从原来的本地 mock 切换为真实后端接口调用。

### 5.1 已对接接口

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/activities`
- `GET /api/activities/{id}`
- `POST /api/activities`
- `POST /api/activities/{id}/signup`
- `POST /api/activities/{id}/favorite`
- `DELETE /api/activities/{id}/favorite`
- `GET /api/messages`
- `POST /api/messages/read/{id}`

### 5.2 前端请求相关文件

- [src/services/request.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/request.ts)
- [src/services/auth.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/auth.ts)
- [src/services/activity.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/activity.ts)
- [src/services/message.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/message.ts)
- [src/services/mappers.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/mappers.ts)

### 5.3 登录态处理方式

当前登录成功后，后端会返回 `access_token`。  
前端会将 token 存入本地存储，并在后续请求中自动通过 `Authorization: Bearer <token>` 发送给后端。

相关逻辑位置：

- token 读写：`src/services/request.ts`
- 用户状态：`src/stores/user.ts`

---

## 6. 开发环境要求

建议环境如下：

- `Node.js 20+`
- `npm 9+`

说明：

1. `Taro 4` 已明确提示不再支持低于 `Node.js 20` 的版本。
2. 如果使用 `Node.js 18`，有时仍然能运行，但不推荐继续作为正式开发环境。

可以通过以下命令确认版本：

```powershell
node -v
npm -v
```

---

## 7. 安装依赖

在项目根目录执行：

```powershell
cd C:\Users\33151\Desktop\CampusGo
npm install
```

如果你已经安装过依赖，通常不需要重复执行。

---

## 8. 启动项目

### 8.1 启动前端开发服务

```powershell
cd C:\Users\33151\Desktop\CampusGo
npm run dev:h5
```

正常情况下，前端会运行在：

`http://127.0.0.1:3000`

### 8.2 启动前要确保后端已运行

因为当前前端已经接入真实后端，所以在访问登录、活动列表、活动详情、收藏、报名、消息等功能前，必须保证后端服务已启动。

后端启动方式见后端项目中的 README。

默认要求后端运行在：

`http://127.0.0.1:8000`

---

## 9. 本地联调流程

推荐按照下面顺序进行联调：

### 第一步：启动后端

在后端项目目录执行：

```powershell
cd C:\Users\33151\Desktop\CampusGoPY
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 第二步：启动前端

```powershell
cd C:\Users\33151\Desktop\CampusGo
npm run dev:h5
```

### 第三步：打开浏览器

访问：

`http://127.0.0.1:3000`

### 第四步：使用演示账号登录

当前演示账号为：

- 手机号：`18800001111`
- 密码：`123456`

---

## 10. 前端可演示的完整业务流程

在当前版本中，建议按下面顺序演示：

1. 进入首页查看推荐活动
2. 切换到活动广场进行搜索和筛选
3. 点击进入活动详情
4. 未登录状态下尝试收藏或报名，跳转到登录页
5. 使用演示账号登录
6. 返回活动详情并再次点击收藏/报名
7. 切换到消息中心查看消息
8. 切换到发布页创建新活动
9. 切换到个人中心查看个人信息和统计

这样可以覆盖老师最容易关注的几个点：

- 是否有完整页面
- 是否有真实交互
- 是否有登录鉴权
- 是否与后端联通
- 是否形成业务闭环

---

## 11. 核心代码说明

### 11.1 页面配置

全局页面注册与 TabBar 配置在：

- [src/app.config.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/app.config.ts)

### 11.2 请求层

统一请求封装在：

- [src/services/request.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/request.ts)

主要负责：

- 统一接口地址
- 统一请求方式
- 自动附带 token
- 统一处理后端返回格式
- 统一处理登录失效

### 11.3 数据映射层

由于后端返回的是下划线字段风格，例如：

- `activity_time`
- `contact_info`
- `is_favorite`

而前端页面使用的是驼峰字段风格，例如：

- `activityTime`
- `contactInfo`
- `isFavorite`

因此专门增加了映射文件：

- [src/services/mappers.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/services/mappers.ts)

### 11.4 轻量状态管理

当前项目使用 `reactive` 实现简单状态管理，主要包括：

- [src/stores/user.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/stores/user.ts)
- [src/stores/activity.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/stores/activity.ts)
- [src/stores/message.ts](/abs/path/c:/Users/33151/Desktop/CampusGo/src/stores/message.ts)

这样做的好处是：

- 对作业项目足够轻量
- 学习成本低
- 结构清晰
- 不必引入额外状态管理框架

---

## 12. mock 数据的现状说明

项目中仍然保留了 `src/mock` 目录，但它现在不是主数据来源。

保留它的原因主要有两个：

1. 某些封面图和头像资源可以继续复用
2. 方便后续演示或断网情况下快速改回静态版本

当前真正的数据来源已经是后端接口。

---

## 13. 常用命令

### 安装依赖

```powershell
npm install
```

### 启动 H5 开发模式

```powershell
npm run dev:h5
```

### 构建 H5

```powershell
npm run build:h5
```

### TypeScript 类型检查

```powershell
npx tsc -p tsconfig.json --noEmit
```

---

## 14. 已知问题说明

### 14.1 ESLint 当前未完全可用

项目目前的 `eslint` 配置没有正确处理 `TypeScript + Vue + Taro` 的解析组合，因此执行全项目检查时会出现解析报错。  
这不是页面功能错误，而是工具链配置问题。

当前实际验证方式以以下内容为准：

- 前端页面实际运行结果
- 与后端的真实联调结果
- `TypeScript` 类型检查结果

### 14.2 Node 版本警告

如果本机 Node 版本低于 20，Taro 启动时会有警告。  
建议升级到 `Node.js 20+`。

### 14.3 H5 端口问题

如果 `10086` 端口无法监听，当前开发配置已经改为本地地址和较稳定端口：

- `127.0.0.1:3000`

若 `3000` 仍被占用，可在 `config/dev.ts` 中调整端口。

---

## 15. 提交作业时建议说明

答辩或演示时，可以这样概括前端部分：

1. 前端基于 Taro + Vue3 + TypeScript 开发
2. 实现了首页、广场、发布、消息、个人中心五大主页面
3. 实现了登录、活动详情、收藏、报名、发布等核心流程
4. 已经完成与 Python 后端和 MySQL 的联调
5. 项目重点突出“校园活动组队平台”的业务闭环，而不是复杂工程化

这个表达方式会比较适合作业场景，重点清楚，也比较稳。

---

## 16. 后续可扩展方向

如果还想继续完善，可以考虑以下方向：

- 增加评论发布功能
- 增加“我的发布”“我的报名”“我的收藏”详情页面
- 增加注册功能
- 增加管理员端
- 增加图片上传
- 优化表单校验
- 优化 eslint 配置
- 增加接口错误提示与加载状态

---

## 17. 维护说明

本项目以课程作业为主要目标，因此开发策略更偏向“结构清晰、功能完整、能稳定演示”。  
代码没有按商业项目的高复杂度标准做长期维护设计，但对于课程展示、功能说明、前后端联调和毕业作业答辩来说已经足够。

