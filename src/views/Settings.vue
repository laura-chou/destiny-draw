<template lang="pug">
v-container
  v-row(align="center" no-gutters class="mb-4")
    v-col
      v-text-field(v-model="newPrizeName" label="輸入獎項名稱" hide-details variant="solo" @keyup.enter="handleAddPrize")
    v-col(cols="auto" class="ml-4")
      div.d-flex.align-center
        v-switch(v-model="excludeWinners" color="orange" hide-details)
        span.ml-2.text-orange-darken-3.font-weight-bold 排除中獎

  v-card(flat class="mb-4")
    div.red-banner

  v-card(flat class="prize-table-card")
    v-table.prize-table
      thead
        tr
          th.text-center 名稱
          th.text-center 編輯
      tbody
        tr(v-for="prize in prizes" :key="prize.id")
          td.text-center {{ prize.name }}
          td.text-center
            v-btn(icon="mdi-pencil" variant="text" color="blue" @click="openEditDialog(prize)")
            v-btn(icon="mdi-delete" variant="text" color="red" @click="deletePrize(prize.id)")

  v-dialog(v-model="editDialog" max-width="400px")
    v-card
      v-card-title 編輯獎項
      v-card-text
        v-text-field(v-model="editingPrizeName" label="獎項名稱")
      v-card-actions
        v-spacer
        v-btn(color="grey" variant="text" @click="editDialog = false") 取消
        v-btn(color="primary" variant="text" @click="handleUpdatePrize") 儲存
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const newPrizeName = ref('')

const excludeWinners = computed({
  get: () => prizeStore.excludeWinners,
  set: (val) => prizeStore.setExcludeWinners(val)
})

const prizes = computed(() => prizeStore.prizes)

const handleAddPrize = () => {
  if (newPrizeName.value.trim()) {
    prizeStore.addPrize(newPrizeName.value.trim())
    newPrizeName.value = ''
  }
}

const deletePrize = (id: string) => {
  prizeStore.deletePrize(id)
}

// Edit logic
const editDialog = ref(false)
const editingPrizeId = ref('')
const editingPrizeName = ref('')

const openEditDialog = (prize: { id: string, name: string }) => {
  editingPrizeId.value = prize.id
  editingPrizeName.value = prize.name
  editDialog.value = true
}

const handleUpdatePrize = () => {
  if (editingPrizeName.value.trim()) {
    prizeStore.updatePrize(editingPrizeId.value, editingPrizeName.value.trim())
    editDialog.value = false
  }
}
</script>

<style lang="stylus" scoped>
.red-banner
  height 40px
  background-color #e53935
  width 100%

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
