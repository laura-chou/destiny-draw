<template lang="pug">
v-container.pa-0
  v-row
    v-col(cols="12")
      v-card.pa-4.grouping-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between.mb-4
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-cog
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 人員名單
              div.text-caption.text-orange-darken-2 設定分組人員（目前 {{ namesCount }} 人）
          v-btn(
            v-if="groupingStore.names"
            variant="text"
            color="red-darken-2"
            prepend-icon="mdi-delete-sweep"
            @click="handleClearNames"
          ) 清除名單

        v-textarea(
          :model-value="groupingStore.names"
          placeholder="例如: A, B, C, D, E"
          variant="solo"
          rows="4"
          bg-color="white"
          hide-details
          persistent-placeholder
          @update:model-value="groupingStore.setNames"
        )

  v-row.mt-4
    v-col(cols="12")
      v-card.pa-4.grouping-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-multiple-plus
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 任務分配模式
              div.text-caption.text-orange-darken-2 開啟後將依照任務人數分配
          v-switch(
            v-model="isTaskAssignmentEnabled"
            color="orange-darken-3"
            hide-details
            inset
          )

  // Standard Grouping Rule
  v-expand-transition
    v-row(v-if="!isTaskAssignmentEnabled" class="mt-4")
      v-col(cols="12")
        v-card.pa-4(variant="elevated" color="amber-lighten-4")
          div.text-subtitle-1.font-weight-bold.text-orange-darken-4.mb-2 一般分組規則
          v-text-field(
            v-model.number="groupSize"
            type="number"
            label="每組人數"
            min="1"
            variant="solo"
            bg-color="white"
            hide-details
            prepend-inner-icon="mdi-account-multiple"
          )

  // Task Assignment UI
  v-expand-transition
    div(v-if="isTaskAssignmentEnabled")
      v-row(class="mt-4" align="center")
        v-col(cols="9" sm="10" md="11")
          v-text-field(
            v-model="newTaskName"
            label="輸入任務名稱"
            hide-details
            variant="solo"
            bg-color="white"
            @keyup.enter="handleAddTask"
            prepend-inner-icon="mdi-clipboard-text-outline"
          )
        v-col(cols="3" sm="2" md="1")
          v-btn(color="amber-darken-2" @click="handleAddTask" icon="mdi-plus")

      v-alert(
        v-if="groupingStore.tasks.length === 0"
        type="warning"
        variant="elevated"
        color="red-darken-2"
        class="my-4"
      ) 目前尚未新增任何任務，請在上方輸入名稱。

      v-alert(
        v-if="totalTaskCapacity > namesCount"
        type="warning"
        variant="elevated"
        color="red-darken-2"
        class="my-4"
      ) 任務總名額 ({{ totalTaskCapacity }}) 超過人員總數 ({{ namesCount }})，部分任務將無人分配。

      div.d-flex.flex-column.flex-sm-row.align-sm-center.justify-space-between.my-4(v-if="groupingStore.tasks.length > 0")
        div.text-h6.text-amber-lighten-3 任務清單 (總名額: {{ totalTaskCapacity }})
        v-btn(
          v-if="selectedTasks.length > 0"
          color="red-darken-2"
          prepend-icon="mdi-delete"
          @click="handleDeleteSelected"
        ) 刪除 ({{ selectedTasks.length }})

      v-card(v-if="groupingStore.tasks.length > 0" flat class="task-table-card rounded-lg overflow-hidden mb-8")
        v-table.task-table
          thead
            tr
              th.text-center(style="width: 40px")
                v-checkbox-btn(v-model="selectAll" @change="toggleSelectAll" color="amber-darken-4")
              th.text-center 名稱
              th.text-center(style="width: 100px") 名額
              th.text-center(style="width: 100px") 操作
          tbody
            tr(v-for="task in groupingStore.tasks" :key="task.id")
              td.text-center
                v-checkbox-btn(v-model="selectedTasks" :value="task.id" color="amber-darken-4")
              td
                v-text-field(
                  :model-value="task.name"
                  variant="underlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => groupingStore.updateTask(task.id, { name: v })"
                )
              td.text-center
                v-text-field(
                  :model-value="task.count"
                  type="number"
                  min="1"
                  variant="underlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => groupingStore.updateTask(task.id, { count: parseInt(v) || 1 })"
                  class="centered-input"
                )
              td.text-center
                v-btn(
                  icon="mdi-delete"
                  variant="text"
                  color="red-darken-2"
                  size="small"
                  @click="handleDeleteTask(task.id)"
                )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGroupingStore } from '@/store/grouping'

const groupingStore = useGroupingStore()
const newTaskName = ref('')
const selectedTasks = ref<string[]>([])
const selectAll = ref(false)

const isTaskAssignmentEnabled = computed({
  get: () => groupingStore.isTaskAssignmentEnabled,
  set: (v) => groupingStore.setTaskAssignmentEnabled(v)
})

const groupSize = computed({
  get: () => groupingStore.groupSize,
  set: (v) => groupingStore.setGroupSize(v)
})

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

const handleClearNames = () => {
  if (confirm('確定要清除所有人員名單嗎？')) {
    groupingStore.setNames('')
  }
}

const handleAddTask = () => {
  if (newTaskName.value.trim()) {
    groupingStore.addTaskWithName(newTaskName.value.trim())
    newTaskName.value = ''
  }
}

const handleDeleteTask = (id: string) => {
  if (confirm('確定要刪除此任務嗎？')) {
    groupingStore.removeTask(id)
    selectedTasks.value = selectedTasks.value.filter(tid => tid !== id)
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTasks.value = groupingStore.tasks.map(t => t.id)
  } else {
    selectedTasks.value = []
  }
}

watch(selectedTasks, (newVal) => {
  if (newVal.length === groupingStore.tasks.length && groupingStore.tasks.length > 0) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
})

const handleDeleteSelected = () => {
  if (confirm(`確定要刪除這 ${selectedTasks.value.length} 個任務嗎？`)) {
    groupingStore.removeMultipleTasks(selectedTasks.value)
    selectedTasks.value = []
  }
}
</script>

<style lang="stylus" scoped>
.grouping-card
  border-left 8px solid #ff6f00 !important

.task-table-card
  background-color #fef3c7

.task-table
  background-color #fef3c7 !important

  :deep(table)
    table-layout fixed

  thead
    background-color #fbbf24

    th
      font-weight bold !important
      font-size 1.1rem !important
      color #78350f !important

      :deep(.v-selection-control__wrapper)
        width 100%

  tbody
    tr
      td
        border-bottom 1px solid #fcd34d !important
        color #92400e !important

      :deep(.v-selection-control)
        display flex
        justify-content center

.centered-input
  :deep(input)
    text-align center
</style>
