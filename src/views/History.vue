<template lang="pug">
v-container
  h2.mb-4 中獎紀錄
  v-card(flat class="prize-table-card")
    v-table.prize-table
      thead
        tr
          th.text-center 次數
          th.text-center 獎項
          th.text-center 時間
      tbody
        tr(v-for="(record, index) in history" :key="record.id")
          td.text-center 第 {{ history.length - index }} 次
          td.text-center {{ record.prizeName }}
          td.text-center {{ record.time }}
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
.prize-table-card
  background-color #d1d5db

.prize-table
  background-color #d1d5db !important

  thead
    background-color #e2e8f0

    th
      font-weight bold !important
      font-size 1.1rem !important
      color #4b5563 !important

  tbody tr
    background-color transparent !important

    td
      border-bottom 1px solid #9ca3af !important
      color #374151 !important
</style>
