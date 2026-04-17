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
            div.d-flex.align-center.justify-space-between.mb-2
              div.text-subtitle-1.font-weight-bold.text-orange-darken-4 任務清單 (總名額: {{ totalTaskCapacity }})
              v-btn(
                color="orange-darken-3"
                variant="flat"
                prepend-icon="mdi-plus"
                size="small"
                @click="groupingStore.addTask"
              ) 新增任務

            v-list(bg-color="transparent" class="pa-0")
              v-list-item(
                v-for="task in groupingStore.tasks"
                :key="task.id"
                class="px-0 mb-2"
              )
                v-row(dense align="center")
                  v-col(cols="6")
                    v-text-field(
                      :model-value="task.name"
                      label="任務名稱"
                      placeholder="例如: 打掃"
                      variant="solo"
                      bg-color="white"
                      hide-details
                      @update:model-value="(v) => groupingStore.updateTask(task.id, { name: v })"
                    )
                  v-col(cols="4")
                    v-text-field(
                      :model-value="task.count"
                      type="number"
                      label="名額"
                      min="1"
                      variant="solo"
                      bg-color="white"
                      hide-details
                      @update:model-value="(v) => groupingStore.updateTask(task.id, { count: parseInt(v) || 1 })"
                    )
                  v-col(cols="2")
                    v-btn(
                      icon="mdi-delete"
                      variant="text"
                      color="red-darken-2"
                      @click="groupingStore.removeTask(task.id)"
                    )

            v-alert(
              v-if="groupingStore.tasks.length === 0"
              type="info"
              variant="tonal"
              color="orange-darken-4"
              class="mt-2"
            ) 請點擊右上角「新增任務」開始設定。
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

.v-list-item
  background-color rgba(255, 255, 255, 0.4)
  border-radius 8px
  border 1px dashed #fbbf24
  margin-bottom 8px
</style>
