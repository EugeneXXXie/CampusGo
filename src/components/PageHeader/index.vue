<template>
  <view class="page-header">
    <view class="page-header__back" @click="goBack">← 返回</view>
    <view class="page-header__title">{{ title }}</view>
    <view class="page-header__placeholder" />
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

const props = withDefaults(defineProps<{
  title: string
  fallbackUrl?: string
}>(), {
  fallbackUrl: '/pages/home/index'
})

function goBack() {
  if (Taro.getCurrentPages().length > 1) {
    Taro.navigateBack()
    return
  }

  Taro.switchTab({ url: props.fallbackUrl })
}
</script>

<style lang="scss">
.page-header {
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  min-height: 80px;
  margin-bottom: 20px;

  &__back,
  &__placeholder {
    min-width: 0;
  }

  &__back {
    color: #0f172a;
    font-size: 26px;
    font-weight: 700;
  }

  &__title {
    text-align: center;
    color: #0f172a;
    font-size: 28px;
    font-weight: 800;
  }
}
</style>
