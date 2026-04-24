<template>
  <view class="page-shell">
    <PageHeader title="活动详情" fallback-url="/pages/square/index" />
    <view v-if="activity" class="stack-lg">
      <image class="detail-cover" :src="activity.cover" mode="aspectFill" />

      <view class="section-card stack-md">
        <view class="detail-header">
          <view class="activity-card__category">{{ activity.category }}</view>
          <view class="activity-card__status">{{ statusText }}</view>
        </view>
        <view class="page-title detail-title">{{ activity.title }}</view>
        <view class="page-subtitle detail-subtitle">{{ activity.summary }}</view>
        <view class="detail-meta">
          <view class="detail-meta__item">时间：{{ activity.activityTime }}</view>
          <view class="detail-meta__item">地点：{{ activity.location }}</view>
          <view class="detail-meta__item">联系：{{ activity.contactInfo }}</view>
        </view>
        <view class="detail-progress">
          <view class="detail-progress__bar">
            <view class="detail-progress__fill" :style="{ width: `${progress}%` }" />
          </view>
          <view class="cg-muted">{{ participantText }}</view>
        </view>
        <view class="detail-actions">
          <view class="cg-button cg-button--ghost" @click="handleFavorite">
            {{ activity.isFavorite ? '取消收藏' : '收藏活动' }}
          </view>
          <view class="cg-button" @click="handleSignup">
            {{ signupLabel }}
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-title">发起人</view>
        <view class="detail-organizer">
          <image class="detail-organizer__avatar" :src="activity.organizer.avatar" mode="aspectFill" />
          <view>
            <view class="detail-organizer__name">{{ activity.organizer.nickname }}</view>
            <view class="detail-organizer__bio">{{ activity.organizer.bio }}</view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-title">活动说明</view>
        <view class="detail-content">{{ activity.description }}</view>
        <view class="chip-row detail-tags">
          <view v-for="tag in activity.tags" :key="tag" class="chip chip--active">{{ tag }}</view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-title">评论区</view>
        <view v-if="activity.comments.length" class="stack-md detail-comments">
          <view v-for="comment in activity.comments" :key="comment.id" class="detail-comment">
            <view class="detail-comment__header">
              <text class="detail-comment__name">{{ comment.userName }}</text>
              <text class="detail-comment__time">{{ comment.createdAt }}</text>
            </view>
            <view class="detail-comment__body">
              {{ comment.replyTo ? `回复 ${comment.replyTo}：` : '' }}{{ comment.content }}
            </view>
          </view>
        </view>
        <EmptyState
          v-else
          title="还没有评论"
          description="这版先展示静态评论，后续可以继续接上评论发布和回复。"
        />
      </view>
    </view>

    <view v-else class="section-card">
      <EmptyState title="活动不存在或已下线" description="返回广场看看其他新活动吧。" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import { computed, ref } from 'vue'
import EmptyState from '../../../components/EmptyState/index.vue'
import PageHeader from '../../../components/PageHeader/index.vue'
import { activityStore } from '../../../stores/activity'
import { userStore } from '../../../stores/user'
import { formatParticipantText, getActivityProgress, getStatusText } from '../../../utils/format'

const activityId = ref('')
const activity = computed(() => activityStore.currentActivity)
const progress = computed(() => activity.value ? getActivityProgress(activity.value) : 0)
const participantText = computed(() => activity.value ? formatParticipantText(activity.value) : '')
const statusText = computed(() => activity.value ? getStatusText(activity.value.status) : '')
const signupLabel = computed(() => {
  if (!activity.value) {
    return '立即报名'
  }

  if (activity.value.signupStatus === 'approved') {
    return '你已报名'
  }

  if (activity.value.signupStatus === 'pending') {
    return '审核中'
  }

  return activity.value.auditRequired ? '申请报名' : '立即报名'
})

useLoad((options) => {
  activityId.value = options?.id ?? ''
  if (activityId.value) {
    void activityStore.loadDetail(activityId.value)
  }
})

useDidShow(() => {
  if (activityId.value) {
    void activityStore.loadDetail(activityId.value)
  }
})

async function handleFavorite() {
  if (!activity.value) {
    return
  }

  const nextFavorite = !activity.value.isFavorite
  await activityStore.toggleFavorite(activity.value.id)
  Taro.showToast({ title: nextFavorite ? '已加入收藏' : '已取消收藏', icon: 'none' })
}

async function handleSignup() {
  if (!activity.value) {
    return
  }

  if (!userStore.loggedIn) {
    Taro.navigateTo({ url: '/pages/auth/login/index' })
    return
  }

  const result = await activityStore.signupCurrentActivity()

  if (!result) {
    return
  }

  Taro.showToast({ title: result.message, icon: 'none' })
}
</script>

<style lang="scss">
.detail-cover {
  width: 100%;
  height: 380px;
  border-radius: 36px;
  box-shadow: var(--cg-shadow);
}

.activity-card__category,
.activity-card__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 20px;
  white-space: nowrap;
}

.activity-card__category {
  background: rgba(14, 165, 233, 0.14);
  color: #0369a1;
}

.activity-card__status {
  background: rgba(249, 115, 22, 0.14);
  color: #c2410c;
}

.detail-header,
.detail-actions,
.detail-progress,
.detail-comment__header,
.detail-organizer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.detail-title {
  margin-top: 0;
  font-size: 40px;
}

.detail-subtitle {
  margin-top: 0;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__item {
    color: #475569;
    font-size: 24px;
  }
}

.detail-progress {
  flex-direction: column;
  align-items: stretch;

  &__bar {
    overflow: hidden;
    width: 100%;
    height: 16px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.2);
  }

  &__fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #0ea5e9, #f97316);
  }
}

.detail-actions {
  flex-wrap: wrap;

  .cg-button {
    flex: 1;
  }
}

.detail-organizer {
  margin-top: 20px;
  justify-content: flex-start;

  &__avatar {
    width: 108px;
    height: 108px;
    border-radius: 30px;
  }

  &__name {
    color: #0f172a;
    font-size: 30px;
    font-weight: 700;
  }

  &__bio {
    margin-top: 10px;
    color: #64748b;
    font-size: 22px;
    line-height: 1.6;
  }
}

.detail-content {
  margin-top: 20px;
  color: #334155;
  font-size: 25px;
  line-height: 1.75;
}

.detail-tags {
  margin-top: 20px;
}

.detail-comments {
  margin-top: 20px;
}

.detail-comment {
  padding: 20px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  &__name {
    color: #0f172a;
    font-size: 24px;
    font-weight: 700;
  }

  &__time {
    color: #94a3b8;
    font-size: 20px;
  }

  &__body {
    margin-top: 12px;
    color: #475569;
    font-size: 23px;
    line-height: 1.65;
  }
}
</style>
