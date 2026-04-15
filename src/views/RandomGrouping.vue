<template lang="pug">
v-container.pa-4
  v-row
    v-col(cols="12")
      v-card.pa-4.grouping-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.mb-4
          v-icon(color="orange-darken-4" size="large") mdi-account-group
          div.ml-4
            div.text-h6.font-weight-bold.text-orange-darken-4 隨機分組設定
            div.text-caption.text-orange-darken-2 輸入名單並設定每組人數，系統將自動隨機分配

        v-textarea(
          v-model="inputNames"
          label="人員名單 (請以逗號分隔)"
          placeholder="例如: A, B, C, D, E"
          variant="solo"
          rows="4"
          bg-color="white"
          class="mb-4"
          @update:model-value="groupingStore.setNames"
        )

        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(
              v-model.number="groupSize"
              type="number"
              label="每組人數"
              min="1"
              variant="solo"
              bg-color="white"
              prepend-inner-icon="mdi-account-multiple"
              @update:model-value="groupingStore.setGroupSize"
            )
          v-col(cols="12" sm="6")
            v-btn(
              block
              color="amber-darken-3"
              size="large"
              prepend-icon="mdi-shuffle-variant"
              @click="handleGrouping"
              :disabled="!hasEnoughNames"
            ) 開始隨機分組

  v-expand-transition
    v-row(v-if="groups.length > 0")
      v-col(cols="12")
        div.d-flex.align-center.justify-space-between.my-4
          div.text-h6.text-amber-lighten-3 分組結果
          v-btn(
            variant="text"
            color="amber-lighten-3"
            prepend-icon="mdi-refresh"
            @click="handleGrouping"
          ) 重新分組

        v-row
          v-col(
            v-for="(group, index) in groups"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat")
              v-card-title.bg-amber-darken-2.text-white.py-2
                span.text-subtitle-1.font-weight-bold 第 {{ index + 1 }} 組
              v-card-text.pa-4
                v-list(density="compact" bg-color="transparent")
                  v-list-item(
                    v-for="(name, nIdx) in group"
                    :key="nIdx"
                    :title="name"
                    prepend-icon="mdi-account"
                  )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupingStore } from '@/store/grouping'

const groupingStore = useGroupingStore()
const inputNames = ref(groupingStore.names)
const groupSize = ref(groupingStore.groupSize)
const groups = ref<string[][]>([])

const hasEnoughNames = computed(() => {
  return inputNames.value.split(/[,,，]/).filter(n => n.trim()).length >= 1
})

const handleGrouping = () => {
  const allNames = inputNames.value
    .split(/[,,，]/)
    .map(n => n.trim())
    .filter(n => n !== '')

  if (allNames.length === 0) return

  // Shuffle (Fisher-Yates)
  const shuffled = [...allNames]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Split into groups
  const size = Math.max(1, groupSize.value)
  const result: string[][] = []
  for (let i = 0; i < shuffled.length; i += size) {
    result.push(shuffled.slice(i, i + size))
  }

  groups.value = result
}
</script>

<style lang="stylus" scoped>
.grouping-card
  border-left 8px solid #ff6f00 !important

.result-card
  background-color #fef3c7 !important
  border 2px solid #fbbf24 !important
  transition transform 0.2s

  &:hover
    transform translateY(-4px)

.v-list-item
  color #92400e !important
  :deep(.v-icon)
    color #f59e0b !important
</style>
