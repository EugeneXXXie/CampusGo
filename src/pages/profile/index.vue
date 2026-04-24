<template>
  <view class="page-shell">
    <view class="page-hero">
      <view class="page-kicker">个人中心</view>
      <view class="page-title">{{ userStore.loggedIn ? profileName : '先登录，再把活动生活拼起来' }}</view>
      <view class="page-subtitle">
        {{ userStore.loggedIn ? profileBio : '登录后可以同步报名状态、收藏活动和你的个人信息。' }}
      </view>
    </view>

    <view class="section-card profile-card">
      <image class="profile-card__avatar" :src="avatar" mode="aspectFill" />
      <view class="profile-card__meta">
        <view class="profile-card__name">{{ profileName }}</view>
        <view class="profile-card__sub">{{ profileCollege }}</view>
      </view>
      <view
        class="cg-button"
        :class="{ 'cg-button--ghost': userStore.loggedIn }"
        @click="handlePrimaryAction"
      >
        {{ userStore.loggedIn ? '退出登录' : '去登录' }}
      </view>
    </view>

    <view class="section-card">
      <view class="section-title">我的概览</view>
      <view class="profile-stats">
        <view class="profile-stats__item">
          <text class="profile-stats__value">{{ publishedCount }}</text>
          <text class="profile-stats__label">我的发布</text>
        </view>
        <view class="profile-stats__item">
          <text class="profile-stats__value">{{ approvedCount }}</text>
          <text class="profile-stats__label">已报名</text>
        </view>
        <view class="profile-stats__item">
          <text class="profile-stats__value">{{ favoriteCount }}</text>
          <text class="profile-stats__label">已收藏</text>
        </view>
      </view>
    </view>

    <view class="cg-grid">
      <view
        v-for="item in shortcuts"
        :key="item.key"
        class="section-card profile-shortcut"
        @click="showComingSoon(item.title)"
      >
        <view class="profile-shortcut__title">{{ item.title }}</view>
        <view class="profile-shortcut__hint">{{ item.hint }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed } from 'vue'
import { activityStore } from '../../stores/activity'
import { userStore } from '../../stores/user'
import { PROFILE_SHORTCUTS } from '../../utils/constants'

const shortcuts = PROFILE_SHORTCUTS
const avatar = computed(() => userStore.profile?.avatar ?? 'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" rx="30" fill="%23cbd5e1"/%3E%3Ctext x="60" y="72" text-anchor="middle" font-size="44" fill="white"%3ECG%3C/text%3E%3C/svg%3E')
const profileName = computed(() => userStore.profile?.nickname ?? '未登录用户')
const profileCollege = computed(() => userStore.profile ? `${userStore.profile.college} · ${userStore.profile.grade}` : '登录后同步你的校园身份')
const profileBio = computed(() => userStore.profile?.bio ?? '还没有留下你的个人简介。')
const activityList = computed(() => activityStore.squareList)
const favoriteCount = computed(() => activityList.value.filter((item) => item.isFavorite).length)
const approvedCount = computed(() => activityList.value.filter((item) => item.signupStatus === 'approved').length)
const publishedCount = computed(() => activityList.value.filter((item) => item.organizer.id === userStore.profile?.id).length)

useDidShow(() => {
  void userStore.hydrate()
  void activityStore.loadSquareActivities({ keyword: '', category: '', status: 'all' })
})

function handlePrimaryAction() {
  if (userStore.loggedIn) {
    userStore.logout()
    Taro.showToast({ title: '已退出登录', icon: 'success' })
    return
  }

  Taro.navigateTo({ url: '/pages/auth/login/index' })
}

function showComingSoon(title: string) {
  Taro.showToast({ title: `${title} 下一轮再细做`, icon: 'none' })
}
</script>

<style lang="scss">
.profile-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  align-items: center;

  &__avatar {
    width: 120px;
    height: 120px;
    border-radius: 32px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__name {
    color: #0f172a;
    font-size: 34px;
    font-weight: 800;
  }

  &__sub {
    color: #64748b;
    font-size: 22px;
  }
}

.profile-shortcut {
  min-height: 190px;

  &__title {
    color: #0f172a;
    font-size: 28px;
    font-weight: 700;
  }

  &__hint {
    margin-top: 12px;
    color: #64748b;
    font-size: 22px;
    line-height: 1.5;
  }
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;

  &__item {
    padding: 22px 18px;
    border-radius: 24px;
    background: linear-gradient(145deg, #fff7ed, #ffffff);
  }

  &__value,
  &__label {
    display: block;
  }

  &__value {
    color: #0f172a;
    font-size: 34px;
    font-weight: 800;
  }

  &__label {
    margin-top: 8px;
    color: #64748b;
    font-size: 22px;
  }
}
</style>
