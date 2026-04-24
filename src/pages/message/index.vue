<template>
  <view class="page-shell">
    <view class="page-hero">
      <view class="page-kicker">消息中心</view>
      <view class="page-title">别错过别人给你的回应</view>
      <view class="page-subtitle">报名提醒、审核结果、评论回复都会先到这里。</view>
    </view>

    <view class="section-card stack-md">
      <view class="chip-row">
        <view
          class="chip"
          :class="{ 'chip--active': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          全部消息
        </view>
        <view
          class="chip"
          :class="{ 'chip--active': activeTab === 'unread' }"
          @click="activeTab = 'unread'"
        >
          未读 {{ unreadCount }}
        </view>
      </view>
    </view>

    <view v-if="filteredMessages.length" class="stack-lg">
      <view
        v-for="item in filteredMessages"
        :key="item.id"
        class="section-card message-card"
        @click="openMessage(item.id, item.relatedActivityId)"
      >
        <view class="message-card__header">
          <view class="message-card__type">{{ messageTypeText[item.type] }}</view>
          <view class="message-card__time">{{ item.createdAt }}</view>
        </view>
        <view class="message-card__title">{{ item.title }}</view>
        <view class="message-card__content">{{ item.content }}</view>
        <view class="message-card__footer">
          <text :class="item.isRead ? 'cg-muted' : 'message-card__status'">
            {{ item.isRead ? '已读' : '点击查看并标记已读' }}
          </text>
        </view>
      </view>
    </view>
    <view v-else class="section-card">
      <EmptyState title="这里暂时很安静" description="等你发起活动、参与报名后，新的提醒会出现在这里。" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref } from 'vue'
import EmptyState from '../../components/EmptyState/index.vue'
import { messageStore } from '../../stores/message'
import { MESSAGE_TYPE_TEXT } from '../../utils/constants'

const activeTab = ref<'all' | 'unread'>('all')
const unreadCount = computed(() => messageStore.unreadCount.value)
const filteredMessages = computed(() =>
  activeTab.value === 'all'
    ? messageStore.state.list
    : messageStore.state.list.filter((item) => !item.isRead)
)
const messageTypeText = MESSAGE_TYPE_TEXT

useDidShow(() => {
  void messageStore.state.loadMessages()
})

async function openMessage(id: string, relatedActivityId?: string) {
  await messageStore.state.readMessage(id)

  if (relatedActivityId) {
    Taro.navigateTo({ url: `/pages/activity/detail/index?id=${relatedActivityId}` })
  }
}
</script>

<style lang="scss">
.message-card {
  &__header,
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  &__type {
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.14);
    color: #0369a1;
    font-size: 20px;
  }

  &__time {
    color: #94a3b8;
    font-size: 22px;
  }

  &__title {
    margin-top: 18px;
    color: #0f172a;
    font-size: 30px;
    font-weight: 700;
  }

  &__content {
    margin-top: 12px;
    color: #475569;
    font-size: 24px;
    line-height: 1.6;
  }

  &__footer {
    margin-top: 18px;
  }

  &__status {
    color: #ea580c;
    font-size: 22px;
  }
}
</style>
