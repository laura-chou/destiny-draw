<template lang="pug">
v-container.pa-4
  v-row
    v-col(cols="12")
      v-card.pa-4.grouping-settings-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between.mb-4
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-cog
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 分組設定
              div.text-caption.text-orange-darken-2 設定人員名單及分組規則
          v-btn(
            v-if="groupingStore.names"
            variant="text"
            color="red-darken-2"
            prepend-icon="mdi-delete-sweep"
            @click="handleClearNames"
          ) 清除名單

        v-textarea(
          :model-value="groupingStore.names"
          :label="\`人員名單 (目前 \${namesCount} 人，請以逗號分隔)\`"
          placeholder="例如: A, B, C, D, E"
          variant="solo"
          rows="4"
          bg-color="white"
          class="mb-6"
          persistent-placeholder
          @update:model-value="groupingStore.setNames"
        )

        v-divider.mb-6.border-opacity-25

        div.d-flex.align-center.mb-4
          v-switch(
            v-model="isTaskAssignmentEnabled"
            color="orange-darken-3"
            label="啟用任務分配"
            hide-details
            class="mr-4"
          )
          v-icon(
            v-if="isTaskAssignmentEnabled"
            color="orange-darken-3"
            title="任務分配模式：依照指定任務的人數進行分配，多餘的人將進入未分配組"
          ) mdi-information-outline

        // Standard Grouping
        v-expand-transition
          div(v-if="!isTaskAssignmentEnabled")
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
                )

        // Task Assignment
        v-expand-transition
          div(v-if="isTaskAssignmentEnabled")
            v-alert(
              v-if="groupingStore.tasks.length === 0"
              type="warning"
              variant="tonal"
              color="orange-darken-4"
              class="mb-4"
              prepend-icon="mdi-alert"
            ) 目前尚未新增任何任務，請點擊「新增任務」。

            v-alert(
              v-if="totalTaskCapacity > namesCount"
              type="warning"
              variant="tonal"
              color="red-darken-4"
              class="mb-4"
              prepend-icon="mdi-account-alert"
            ) 任務總名額 ({{ totalTaskCapacity }}) 超過人員總數 ({{ namesCount }})，部分任務將無人分配。

            div.d-flex.align-center.justify-space-between.mb-2
              div.text-subtitle-1.font-weight-bold.text-orange-darken-4 任務清單 (總名額: {{ totalTaskCapacity }})
              v-btn(
                color="orange-darken-3"
                variant="flat"
                prepend-icon="mdi-plus"
                size="small"
                @click="groupingStore.addTask"
              ) 新增任務

            v-table.task-table.mb-4(v-if="groupingStore.tasks.length > 0")
              thead
                tr
                  th.text-left 任務名稱
                  th.text-left 名額
                  th.text-center 操作
              tbody
                tr(v-for="task in groupingStore.tasks" :key="task.id")
                  td
                    v-text-field(
                      :model-value="task.name"
                      placeholder="例如: 打掃"
                      variant="underlined"
                      density="compact"
                      hide-details
                      @update:model-value="(v) => groupingStore.updateTask(task.id, { name: v })"
                    )
                  td(style="width: 120px")
                    v-text-field(
                      :model-value="task.count"
                      type="number"
                      min="1"
                      variant="underlined"
                      density="compact"
                      hide-details
                      @update:model-value="(v) => groupingStore.updateTask(task.id, { count: parseInt(v) || 1 })"
                    )
                  td.text-center
                    v-btn(
                      icon="mdi-delete"
                      variant="text"
                      color="red-darken-2"
                      size="small"
                      @click="groupingStore.removeTask(task.id)"
                    )

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGroupingStore } from '@/store/grouping'

const groupingStore = useGroupingStore()

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
</script>

<style lang="stylus" scoped>
.grouping-settings-card
  border-left 8px solid #ff6f00 !important

.task-table
  background-color rgba(255, 255, 255, 0.3) !important
  border-radius 8px
  overflow hidden

  :deep(th)
    background-color rgba(255, 111, 0, 0.1) !important
    color #ff6f00 !important
    font-weight bold !important

  :deep(td)
    border-bottom 1px solid rgba(255, 111, 0, 0.1) !important
</style>
