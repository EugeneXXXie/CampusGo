<template>
  <view class="page-shell">
    <view class="page-hero">
      <view class="page-kicker">校园活动组队平台</view>
      <view class="page-title">今天想约什么搭子？</view>
      <view class="page-subtitle">
        从自习、球局到摄影扫街，先挑个你愿意出门的理由。
      </view>
    </view>

    <view class="section-card stack-md">
      <SearchBar
        :model-value="''"
        placeholder="搜索活动、搭子、社团局"
        :disabled="true"
        @focus-proxy="goSquare"
      />
      <view class="chip-row">
        <view
          v-for="category in categories"
          :key="category"
          class="chip"
          @click="pickCategory(category)"
        >
          {{ category }}
        </view>
      </view>
    </view>

    <view class="section-card">
      <view class="section-title">本周校内热度</view>
      <view class="home-stats">
        <view class="home-stats__item">
          <text class="home-stats__value">{{ recommended.length }}</text>
          <text class="home-stats__label">推荐活动</text>
        </view>
        <view class="home-stats__item">
          <text class="home-stats__value">{{ openCount }}</text>
          <text class="home-stats__label">正在招募</text>
        </view>
        <view class="home-stats__item">
          <text class="home-stats__value">87%</text>
          <text class="home-stats__label">成局率</text>
        </view>
      </view>
    </view>

    <view class="stack-lg">
      <ActivityCard
        v-for="item in recommended"
        :key="item.id"
        :activity="item"
        @select="goDetail"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed } from 'vue'
import ActivityCard from '../../components/ActivityCard/index.vue'
import SearchBar from '../../components/SearchBar/index.vue'
import { activityStore } from '../../stores/activity'
import { ACTIVITY_CATEGORIES } from '../../utils/constants'

const categories = ACTIVITY_CATEGORIES.slice(0, 6)
const recommended = computed(() => activityStore.recommended)
const openCount = computed(() => recommended.value.filter((item) => item.status === 'open').length)

useDidShow(() => {
  void activityStore.loadRecommended()
})

function goSquare() {
  void activityStore.loadSquareActivities({ keyword: '', category: '', status: 'all' })
  Taro.switchTab({ url: '/pages/square/index' })
}

function pickCategory(category: string) {
  void activityStore.loadSquareActivities({ keyword: '', category, status: 'all' })
  Taro.switchTab({ url: '/pages/square/index' })
}

function goDetail(id: string) {
  Taro.navigateTo({ url: `/pages/activity/detail/index?id=${id}` })
}
</script>

<style lang="scss">
.home-stats {
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
