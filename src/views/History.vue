<template lang="pug">
div
  h2.mb-4 中獎紀錄
  v-card
    v-table
      thead
        tr
          th 次數
          th 獎項
          th 時間
      tbody
        tr(v-for="(record, index) in history" :key="record.id")
          td 第 {{ history.length - index }} 次
          td {{ record.prizeName }}
          td {{ record.time }}
        tr(v-if="history.length === 0")
          td.text-center(colspan="3") 尚無紀錄
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const history = computed(() => prizeStore.history)
</script>

<style lang="stylus" scoped>
</style>
