<template>
  <view class="activity-card" @click="emit('select', activity.id)">
    <image class="activity-card__cover" :src="activity.cover" mode="aspectFill" />
    <view class="activity-card__body">
      <view class="activity-card__row">
        <view class="activity-card__category">{{ activity.category }}</view>
        <view class="activity-card__status">{{ statusText }}</view>
      </view>
      <view class="activity-card__title">{{ activity.title }}</view>
      <view class="activity-card__summary">{{ activity.summary }}</view>
      <view class="activity-card__meta">
        <text>{{ formattedTime }}</text>
        <text>{{ participantText }}</text>
      </view>
      <view class="activity-card__tags">
        <text v-for="tag in activity.tags.slice(0, 3)" :key="tag" class="activity-card__tag">
          {{ tag }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatActivityTime, formatParticipantText, getStatusText } from '../../utils/format'
import type { ActivityItem } from '../../types/activity'

const props = defineProps<{
  activity: ActivityItem
}>()

const emit = defineEmits<{
  (event: 'select', id: string): void
}>()

const formattedTime = computed(() => formatActivityTime(props.activity.activityTime))
const participantText = computed(() => formatParticipantText(props.activity))
const statusText = computed(() => getStatusText(props.activity.status))
</script>

<style lang="scss">
.activity-card {
  overflow: hidden;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);

  &__cover {
    width: 100%;
    height: 260px;
    display: block;
  }

  &__body {
    padding: 24px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__category,
  &__status,
  &__tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-size: 20px;
    white-space: nowrap;
  }

  &__category {
    padding: 10px 16px;
    background: rgba(14, 165, 233, 0.14);
    color: #0369a1;
  }

  &__status {
    padding: 10px 16px;
    background: rgba(249, 115, 22, 0.14);
    color: #c2410c;
  }

  &__title {
    margin-top: 18px;
    color: #0f172a;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.35;
  }

  &__summary {
    margin-top: 12px;
    color: #475569;
    font-size: 24px;
    line-height: 1.6;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 18px;
    color: #64748b;
    font-size: 22px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 18px;
  }

  &__tag {
    padding: 8px 14px;
    background: #f8fafc;
    color: #475569;
  }
}
</style>
