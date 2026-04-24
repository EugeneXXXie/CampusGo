<template>
  <view class="empty-state">
    <view class="empty-state__badge">CampusGo</view>
    <view class="empty-state__title">{{ title }}</view>
    <view class="empty-state__description">{{ description }}</view>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '换个关键词试试，或者先去发布一个新活动。'
})
</script>

<style lang="scss">
.empty-state {
  padding: 48px 32px;
  border-radius: 32px;
  background: linear-gradient(145deg, #fff7ed, #ffffff);
  text-align: center;

  &__badge {
    display: inline-flex;
    padding: 10px 18px;
    border-radius: 999px;
    background: rgba(249, 115, 22, 0.12);
    color: #c2410c;
    font-size: 22px;
  }

  &__title {
    margin-top: 20px;
    color: #0f172a;
    font-size: 32px;
    font-weight: 700;
  }

  &__description {
    margin-top: 12px;
    color: #64748b;
    font-size: 24px;
    line-height: 1.6;
  }
}
</style>
