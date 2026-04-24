# CampusGo Frontend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable CampusGo frontend MVP with five TabBar pages, login and activity detail flows, mock-backed services, and shared UI components on top of the current Taro Vue starter.

**Architecture:** Replace the single starter page with a mobile-first app shell. Use typed mock data plus thin async services, lightweight local stores, and reusable components so the app behaves like a real product without depending on a backend or new infrastructure.

**Tech Stack:** Taro 4, Vue 3, TypeScript, NutUI, Sass

---

### Task 1: Define shared types, constants, formatters, and mock data

**Files:**
- Create: `src/types/activity.ts`
- Create: `src/types/message.ts`
- Create: `src/types/user.ts`
- Create: `src/utils/constants.ts`
- Create: `src/utils/format.ts`
- Create: `src/mock/activities.ts`
- Create: `src/mock/messages.ts`
- Create: `src/mock/user.ts`

- [ ] **Step 1: Write the failing test**

Since this repo does not include a test runner and the user explicitly asked for a runnable course project over full rigor, use TypeScript compilation as the initial guardrail for this task. The red state is “imports fail because these modules do not exist yet.”

```ts
import type { ActivityItem } from '@/types/activity'
import { ACTIVITY_CATEGORIES } from '@/utils/constants'
import { mockActivities } from '@/mock/activities'

const firstActivity: ActivityItem = mockActivities[0]
console.log(firstActivity.title, ACTIVITY_CATEGORIES.length)
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL with module-not-found errors for the new shared files.

- [ ] **Step 3: Write minimal implementation**

Create typed models for activity, message, and user; define activity categories and status labels; add small format helpers for time and participant text; seed mock activity, message, and user data matching the page needs from the spec.

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for the new shared modules, though later tasks may still fail overall until their files exist.

- [ ] **Step 5: Commit**

```bash
git add src/types src/utils src/mock
git commit -m "feat: add campusgo shared mock models"
```

### Task 2: Add mock-backed service layer and lightweight stores

**Files:**
- Create: `src/services/activity.ts`
- Create: `src/services/auth.ts`
- Create: `src/services/message.ts`
- Create: `src/stores/activity.ts`
- Create: `src/stores/message.ts`
- Create: `src/stores/user.ts`

- [ ] **Step 1: Write the failing test**

Use TypeScript compilation as the red step again. The stores and services should not resolve before implementation.

```ts
import { activityStore } from '@/stores/activity'
import { login } from '@/services/auth'

void login('18800001111', '123456')
console.log(activityStore.filters.keyword)
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL with module-not-found errors for the service and store files.

- [ ] **Step 3: Write minimal implementation**

Create async service functions that wrap the mock data and expose:

```ts
export async function getRecommendedActivities(): Promise<ActivityItem[]>
export async function getSquareActivities(params?: ActivityQuery): Promise<ActivityItem[]>
export async function getActivityDetail(id: string): Promise<ActivityItem | undefined>
export async function toggleActivityFavorite(id: string): Promise<ActivityItem | undefined>
export async function signupActivity(id: string): Promise<SignupResult>
export async function publishActivity(payload: PublishPayload): Promise<ActivityItem>
export async function login(phone: string, password: string): Promise<UserProfile>
export async function getMessages(): Promise<MessageItem[]>
export async function markMessageRead(id: string): Promise<MessageItem | undefined>
```

Implement lightweight stores with exported reactive state and action methods:

```ts
export const userStore = reactive({
  profile: null as UserProfile | null,
  loggedIn: false,
  async login(phone: string, password: string) { /* ... */ },
  logout() { /* ... */ }
})
```

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for service/store modules in isolation.

- [ ] **Step 5: Commit**

```bash
git add src/services src/stores
git commit -m "feat: add campusgo mock services and stores"
```

### Task 3: Build shared UI components for search, cards, and empty states

**Files:**
- Create: `src/components/ActivityCard/index.vue`
- Create: `src/components/EmptyState/index.vue`
- Create: `src/components/SearchBar/index.vue`

- [ ] **Step 1: Write the failing test**

Red state is missing component imports from pages.

```vue
<template>
  <SearchBar v-model="keyword" />
  <ActivityCard :activity="activity" />
  <EmptyState title="No data" />
</template>
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Write minimal implementation**

Create focused Vue components:

```vue
<!-- SearchBar -->
<nut-searchbar :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
```

```vue
<!-- ActivityCard -->
<view class="activity-card" @click="emit('select', activity.id)">
  <image :src="activity.cover" mode="aspectFill" />
  <view>{{ activity.title }}</view>
</view>
```

```vue
<!-- EmptyState -->
<view class="empty-state">
  <view class="empty-state__title">{{ title }}</view>
  <view class="empty-state__description">{{ description }}</view>
</view>
```

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for shared component imports and props.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add campusgo shared ui components"
```

### Task 4: Replace app configuration and global styling with the MVP shell

**Files:**
- Modify: `src/app.config.ts`
- Modify: `src/app.ts`
- Modify: `src/app.scss`
- Delete or stop using: `src/pages/index/index.vue`
- Delete or stop using: `src/pages/index/index.config.ts`

- [ ] **Step 1: Write the failing test**

Red state is missing page registrations and theme tokens.

```ts
export default {
  pages: [
    'pages/home/index',
    'pages/square/index',
    'pages/publish/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/auth/login/index',
    'pages/activity/detail/index'
  ]
}
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL because the new page files do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Update `app.config.ts` with the full page list and a five-item TabBar. Keep `app.ts` simple. In `app.scss`, add shared color tokens, layout helpers, and mobile-safe page spacing used by all screens.

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for config syntax, while page-file failures remain until Task 5 and Task 6 complete.

- [ ] **Step 5: Commit**

```bash
git add src/app.config.ts src/app.ts src/app.scss src/pages/index
git commit -m "feat: configure campusgo app shell"
```

### Task 5: Implement the five TabBar pages

**Files:**
- Create: `src/pages/home/index.vue`
- Create: `src/pages/home/index.config.ts`
- Create: `src/pages/square/index.vue`
- Create: `src/pages/square/index.config.ts`
- Create: `src/pages/publish/index.vue`
- Create: `src/pages/publish/index.config.ts`
- Create: `src/pages/message/index.vue`
- Create: `src/pages/message/index.config.ts`
- Create: `src/pages/profile/index.vue`
- Create: `src/pages/profile/index.config.ts`

- [ ] **Step 1: Write the failing test**

Red state is unresolved page modules and missing exports used by the app shell.

```ts
// app.config.ts pages entries require these files to exist
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL because the new page files are not present.

- [ ] **Step 3: Write minimal implementation**

Implement each page with the approved MVP behavior:

```vue
<!-- home -->
<SearchBar :model-value="keyword" disabled placeholder="搜索活动、球搭子、社团局" />
<ActivityCard v-for="item in recommendedActivities" :key="item.id" :activity="item" @select="goDetail" />
```

```vue
<!-- square -->
<SearchBar v-model="keyword" />
<nut-tabs v-model="activeStatus">...</nut-tabs>
<ActivityCard v-for="item in filteredActivities" :key="item.id" :activity="item" @select="goDetail" />
```

```vue
<!-- publish -->
<nut-form>
  <!-- title, category, time, location, participants, audit, contact, description -->
</nut-form>
```

```vue
<!-- message -->
<nut-tabs v-model="activeTab">...</nut-tabs>
```

```vue
<!-- profile -->
<view>{{ userStore.loggedIn ? userStore.profile?.nickname : '立即登录' }}</view>
```

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for page modules and imports.

- [ ] **Step 5: Commit**

```bash
git add src/pages/home src/pages/square src/pages/publish src/pages/message src/pages/profile
git commit -m "feat: add campusgo tab pages"
```

### Task 6: Implement login and activity detail pages

**Files:**
- Create: `src/pages/auth/login/index.vue`
- Create: `src/pages/auth/login/index.config.ts`
- Create: `src/pages/activity/detail/index.vue`
- Create: `src/pages/activity/detail/index.config.ts`

- [ ] **Step 1: Write the failing test**

Red state is unresolved routes and missing page modules.

```ts
// routes referenced by navigateTo must resolve
```

- [ ] **Step 2: Run check to verify it fails**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: FAIL because these route files do not exist.

- [ ] **Step 3: Write minimal implementation**

Implement login with demo credentials and detail with favorite/signup behavior:

```vue
<!-- login -->
<nut-input v-model="phone" placeholder="请输入手机号" />
<nut-input v-model="password" type="password" placeholder="请输入密码" />
<nut-button block type="primary" @click="handleLogin">登录</nut-button>
```

```vue
<!-- detail -->
<nut-button plain @click="handleFavorite">{{ activity?.isFavorite ? '已收藏' : '收藏' }}</nut-button>
<nut-button type="primary" @click="handleSignup">立即报名</nut-button>
```

- [ ] **Step 4: Run check to verify it passes**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS for all configured pages and route imports.

- [ ] **Step 5: Commit**

```bash
git add src/pages/auth src/pages/activity
git commit -m "feat: add campusgo login and detail flows"
```

### Task 7: Verify the app boots and the core flows work

**Files:**
- Modify if needed: `package.json`

- [ ] **Step 1: Run the TypeScript check**

Run: `npx tsc -p tsconfig.json --noEmit`
Expected: PASS

- [ ] **Step 2: Run the H5 build**

Run: `npm run build:h5`
Expected: PASS and emit the Taro H5 bundle without page registration errors.

- [ ] **Step 3: Smoke-check the intended flows**

Validate manually in the built or dev app:

- Home and square navigate to detail
- Detail redirects to login when signing up while logged out
- Login succeeds with the demo credential
- Favorite and signup update page state
- Publish shows validation and success feedback
- Messages can be marked read

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: finish campusgo frontend mvp"
```
