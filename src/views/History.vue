<template lang="pug">
v-container.pa-0
  div.d-flex.align-center.justify-end.mb-4
    v-btn(
      v-if="history.length > 0"
      color="red-darken-2"
      prepend-icon="mdi-delete-sweep"
      @click="handleClearHistory"
      rounded="pill"
    ) 清除所有紀錄

  v-card(flat class="prize-table-card rounded-lg overflow-hidden mb-8")
    v-table.prize-table
      thead
        tr
          th.text-center(style="width: 90px") 次數
          th.text-center 獎項
          th.text-center 時間
      tbody
        tr(v-for="(record, index) in history" :key="record.id")
          td.text-center.text-body-2 {{ history.length - index }}
          td.text-center.font-weight-bold {{ record.prizeName }}
          td.text-center.text-caption {{ record.time }}
        tr(v-if="history.length === 0")
          td.text-center.pa-12(colspan="3")
            v-icon(size="64" color="grey-darken-1") mdi-history
            div.text-grey-darken-1.mt-2 尚無紀錄
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const history = computed(() => prizeStore.history)

const handleClearHistory = () => {
  if (confirm('確定要清除所有中獎紀錄嗎？')) {
    prizeStore.clearHistory()
  }
}
</script>

<style lang="stylus" scoped>
.prize-table-card
  background-color #334155

.prize-table
  background-color #334155 !important

  :deep(table)
    table-layout fixed
  
  thead
    background-color #1e293b

    th
      font-weight bold !important
      font-size 1.1rem !important
      color #cbd5e1 !important

  tbody tr
    background-color transparent !important
    &:hover
      background-color #475569 !important

    td
      border-bottom 1px solid #475569 !important
      color #f1f5f9 !important
</style>
