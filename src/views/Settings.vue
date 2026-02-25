<template lang="pug">
v-container
  v-row
    v-col(cols="12")
      v-card.mb-6.pa-4.exclude-card(variant="elevated" color="amber-lighten-4")
        div.d-flex.align-center.justify-space-between
          div.d-flex.align-center
            v-icon(color="orange-darken-4" size="large") mdi-account-remove
            div.ml-4
              div.text-h6.font-weight-bold.text-orange-darken-4 排除中獎模式
              div.text-caption.text-orange-darken-2 開啟後，已中獎的獎項將自動從獎池中移除
          v-switch(v-model="excludeWinners" color="orange-darken-3" hide-details inset)

  v-row(align="center")
    v-col(cols="12" md="8")
      v-text-field(v-model="newPrizeName" label="輸入獎項名稱" hide-details variant="solo" @keyup.enter="handleAddPrize" prepend-inner-icon="mdi-gift")
    v-col(cols="12" md="4")
      v-btn(color="amber-darken-2" block size="large" @click="handleAddPrize" prepend-icon="mdi-plus") 新增獎項

  v-card(v-if="prizes.length < 2" flat class="my-6 rounded-lg overflow-hidden")
    div.red-banner.d-flex.align-center.justify-center.pa-4
      v-icon(color="white" class="mr-2") mdi-alert-circle
      span.text-white.font-weight-bold 請先輸入至少兩個獎項以開啟抽獎功能

  div.d-flex.flex-column.flex-sm-row.align-sm-center.justify-space-between.my-4(v-if="prizes.length > 0")
    div.text-h6.text-amber-lighten-3.mb-2.mb-sm-0 獎項列表 ({{ prizes.length }})
    v-btn(v-if="selectedPrizes.length > 0" color="red-darken-2" prepend-icon="mdi-delete" @click="handleDeleteSelected") 刪除所選 ({{ selectedPrizes.length }})

  v-card(v-if="prizes.length > 0" flat class="prize-table-card rounded-lg overflow-hidden mb-8")
    v-table.prize-table
      thead
        tr
          th.text-center(style="width: 50px")
            v-checkbox-btn(v-model="selectAll" @change="toggleSelectAll" color="amber-darken-4")
          th.text-left 名稱
          th.text-center(style="width: 120px") 操作
      tbody
        tr(v-for="prize in prizes" :key="prize.id")
          td.text-center
            v-checkbox-btn(v-model="selectedPrizes" :value="prize.id" color="amber-darken-4")
          td.text-left {{ prize.name }}
          td.text-center
            div.d-flex.justify-center
              v-btn(icon="mdi-pencil" variant="text" color="blue-darken-2" size="small" @click="openEditDialog(prize)")
              v-btn(icon="mdi-delete" variant="text" color="red-darken-2" size="small" @click="deletePrize(prize.id)")

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
import { ref, computed, watch } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const newPrizeName = ref('')
const selectedPrizes = ref<string[]>([])
const selectAll = ref(false)

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
  if (confirm('確定要刪除此獎項嗎？')) {
    prizeStore.deletePrize(id)
    selectedPrizes.value = selectedPrizes.value.filter(sid => sid !== id)
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedPrizes.value = prizes.value.map(p => p.id)
  } else {
    selectedPrizes.value = []
  }
}

watch(selectedPrizes, (newVal) => {
  if (newVal.length === prizes.value.length && prizes.value.length > 0) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
})

const handleDeleteSelected = () => {
  if (confirm(`確定要刪除這 ${selectedPrizes.value.length} 個獎項嗎？`)) {
    prizeStore.deleteMultiplePrizes(selectedPrizes.value)
    selectedPrizes.value = []
  }
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

.exclude-card
  border-left 8px solid #ff6f00 !important

.prize-table-card
  background-color #fef3c7

.prize-table
  background-color #fef3c7 !important

  thead
    background-color #fbbf24

    th
      font-weight bold !important
      font-size 1.1rem !important
      color #78350f !important

  tbody tr
    background-color transparent !important

    td
      border-bottom 1px solid #fcd34d !important
      color #92400e !important
</style>
