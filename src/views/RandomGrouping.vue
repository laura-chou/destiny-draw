<template lang="pug">
v-container.pa-4
  v-row
    v-col(cols="12")
      v-card.pa-4.grouping-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between.mb-4
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-group
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 隨機分組
              div.text-caption.text-orange-darken-2 目前有 {{ namesCount }} 位成員
          v-btn(
            color="amber-darken-3"
            size="large"
            prepend-icon="mdi-shuffle-variant"
            @click="handleGrouping"
              :disabled="isStartDisabled"
          ) 開始隨機分組

  v-expand-transition
    v-row(v-if="groupingStore.isTaskAssignmentEnabled && groupingStore.tasks.length === 0")
      v-col(cols="12")
        v-alert(
          type="warning"
          variant="tonal"
          color="orange-lighten-4"
          prepend-icon="mdi-alert"
          class="mb-0"
        ) 尚未設定任何任務。請至「設定」頁面新增任務。

  v-expand-transition
    v-row(v-if="groupingStore.isTaskAssignmentEnabled && groupingStore.tasks.length > 0 && totalTaskCapacity > namesCount")
      v-col(cols="12")
        v-alert(
          type="warning"
          variant="tonal"
          color="red-lighten-4"
          prepend-icon="mdi-account-alert"
          class="mb-0"
        ) 注意：任務總名額 ({{ totalTaskCapacity }}) 超過目前人數 ({{ namesCount }})。

  v-expand-transition
    v-row(v-if="groups.length > 0 || taskResults.length > 0")
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
          // Standard Grouping Results
          v-col(
            v-if="!groupingStore.isTaskAssignmentEnabled"
            v-for="(group, index) in groups"
            :key="\`group-\${index}\`"
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

          // Task Assignment Results
          v-col(
            v-if="groupingStore.isTaskAssignmentEnabled"
            v-for="(taskGroup, index) in taskResults"
            :key="\`task-\${index}\`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat")
              v-card-title.bg-orange-darken-3.text-white.py-2
                span.text-subtitle-1.font-weight-bold {{ taskGroup.name }}
                span.ml-2.text-caption ({{ taskGroup.members.length }}/{{ taskGroup.targetCount }})
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
            v-if="unassigned.length > 0"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          )
            v-card.result-card.h-100(variant="flat" border)
              v-card-title.bg-grey-darken-2.text-white.py-2
                span.text-subtitle-1.font-weight-bold 未分配人員
              v-card-text.pa-4
                v-list(density="compact" bg-color="transparent")
                  v-list-item(
                    v-for="(name, nIdx) in unassigned"
                    :key="nIdx"
                    :title="name"
                    prepend-icon="mdi-account-off"
                  )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupingStore } from '@/store/grouping'

interface TaskResult {
  name: string
  members: string[]
  targetCount: number
}

const groupingStore = useGroupingStore()
const groups = ref<string[][]>([])
const taskResults = ref<TaskResult[]>([])
const unassigned = ref<string[]>([])

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

  if (groupingStore.isTaskAssignmentEnabled) {
    // Task Assignment mode
    const taskResultList: TaskResult[] = []
    let currentIdx = 0

    groupingStore.tasks.forEach(task => {
      const members = shuffled.slice(currentIdx, currentIdx + task.count)
      taskResultList.push({
        name: task.name || '未命名任務',
        members,
        targetCount: task.count
      })
      currentIdx += task.count
    })

    taskResults.value = taskResultList
    unassigned.value = shuffled.slice(currentIdx)
    groups.value = []
  } else {
    // Standard Grouping mode
    const size = Math.max(1, groupingStore.groupSize)
    const result: string[][] = []

    // Calculate how many full groups we can form
    const fullGroupsCount = Math.floor(shuffled.length / size)

    for (let i = 0; i < fullGroupsCount; i++) {
      result.push(shuffled.slice(i * size, (i + 1) * size))
    }

    groups.value = result
    taskResults.value = []
    unassigned.value = shuffled.slice(fullGroupsCount * size)
  }
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
