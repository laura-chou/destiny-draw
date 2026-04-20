<template lang="pug">
v-container.pa-4
  v-row
    v-col(cols="12")
      v-card.pa-4.grouping-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-group
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 隨機分組
              div.text-caption.text-orange-darken-2 目前有 {{ namesCount }} 位成員
          v-btn.font-weight-bold.text-white(
            color="bg-orange-darken-3"
            size="large"
            class=""
            @click="handleGrouping"
            :disabled="isStartDisabled"
          ) 開始分組

  v-expand-transition
    v-row(v-if="!hasEnoughNames")
      v-col(cols="12")
        v-alert(
          type="warning"
          variant="elevated"
          color="red-darken-2"
          class="mb-0"
        ) 尚未設定分組人員。請至「設定」頁面設定。

  v-expand-transition
    v-row(v-if="groupingStore.isTaskAssignmentEnabled && groupingStore.tasks.length === 0")
      v-col(cols="12")
        v-alert(
          type="warning"
          variant="elevated"
          color="red-darken-2"
          class="mb-0"
        ) 尚未設定任何任務。請至「設定」頁面新增任務。

  v-expand-transition
    v-row(v-if="groupingStore.isTaskAssignmentEnabled && groupingStore.tasks.length > 0 && totalTaskCapacity > namesCount")
      v-col(cols="12")
        v-alert(
          type="warning"
          variant="elevated"
          color="red-darken-2"
          class="mb-0"
        ) 任務總名額 ({{ totalTaskCapacity }}) 超過目前人數 ({{ namesCount }})。

  v-expand-transition
    v-row(v-if="groupingStore.lastGroups.length > 0 || groupingStore.lastTaskResults.length > 0")
      v-col(cols="12")
        div.d-flex.align-center.justify-space-between.mb-4
          div.text-h6.text-amber-lighten-3 分組結果
          v-btn(
            variant="text"
            color="amber-lighten-3"
            prepend-icon="mdi-refresh"
            @click="handleGrouping"
          ) 重新分組

        v-row
          // Standard Grouping Results
          v-col(
            v-if="!groupingStore.isTaskAssignmentEnabled"
            v-for="(group, index) in groupingStore.lastGroups"
            :key="\`group-\${index}\`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat")
              v-card-title.bg-orange-darken-3.text-white.text-center.py-2
                span.text-subtitle-1.font-weight-bold 第 {{ index + 1 }} 組
              v-card-text.pa-4
                v-list(density="compact" bg-color="transparent")
                  v-list-item(
                    v-for="(name, nIdx) in group"
                    :key="nIdx"
                    :title="name"
                    prepend-icon="mdi-account"
                  )

          // Task Assignment Results
          v-col(
            v-if="groupingStore.isTaskAssignmentEnabled"
            v-for="(taskGroup, index) in groupingStore.lastTaskResults"
            :key="\`task-\${index}\`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat")
              v-card-title.bg-orange-darken-3.text-white.text-center.py-2
                span.text-subtitle-1.font-weight-bold {{ taskGroup.name }}
              v-card-text.pa-4
                v-list(density="compact" bg-color="transparent")
                  v-list-item(
                    v-for="(name, nIdx) in taskGroup.members"
                    :key="nIdx"
                    :title="name"
                    prepend-icon="mdi-account-star"
                  )
                  v-list-item(v-if="taskGroup.members.length === 0" title="無分配人選" class="font-italic text-grey")

          // Unassigned Group Results
          v-col(
            v-if="groupingStore.lastUnassigned.length > 0"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat" border)
              v-card-title.bg-grey-darken-2.text-white.text-center.py-2
                span.text-subtitle-1.font-weight-bold 未分配人員
              v-card-text.pa-4
                v-list(density="compact" bg-color="transparent")
                  v-list-item(
                    v-for="(name, nIdx) in groupingStore.lastUnassigned"
                    :key="nIdx"
                    :title="name"
                    prepend-icon="mdi-account-off"
                  )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGroupingStore, type TaskResult } from '@/store/grouping'

const groupingStore = useGroupingStore()

const namesCount = computed(() => {
  return groupingStore.names
    .split(/[,,，]/)
    .map(n => n.trim())
    .filter(n => n !== '')
    .length
})

const totalTaskCapacity = computed(() => {
  return groupingStore.tasks.reduce((sum, task) => sum + task.count, 0)
})

const hasEnoughNames = computed(() => {
  return namesCount.value >= 1
})

const isStartDisabled = computed(() => {
  if (!hasEnoughNames.value) return true
  if (groupingStore.isTaskAssignmentEnabled && groupingStore.tasks.length === 0) return true
  return false
})

const handleGrouping = () => {
  const allNames = groupingStore.names
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

  let resultGroups: string[][] = []
  let resultTaskResults: TaskResult[] = []
  let resultUnassigned: string[] = []

  if (groupingStore.isTaskAssignmentEnabled) {
    // Task Assignment mode
    let currentIdx = 0

    groupingStore.tasks.forEach(task => {
      const members = shuffled.slice(currentIdx, currentIdx + task.count)
      resultTaskResults.push({
        name: task.name || '未命名任務',
        members,
        targetCount: task.count
      })
      currentIdx += task.count
    })

    resultUnassigned = shuffled.slice(currentIdx)
  } else {
    // Standard Grouping mode
    const size = Math.max(1, groupingStore.groupSize)

    // Calculate how many full groups we can form
    const fullGroupsCount = Math.floor(shuffled.length / size)

    for (let i = 0; i < fullGroupsCount; i++) {
      resultGroups.push(shuffled.slice(i * size, (i + 1) * size))
    }

    resultUnassigned = shuffled.slice(fullGroupsCount * size)
  }

  groupingStore.setResults(resultGroups, resultTaskResults, resultUnassigned)
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
