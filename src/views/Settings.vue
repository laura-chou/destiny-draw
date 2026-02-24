<template lang="pug">
div
  h2.mb-4 獎項設定
  v-card.mb-6
    v-card-text
      v-form(@submit.prevent="handleAddPrize")
        v-text-field(v-model="newPrizeName" label="獎項名稱" required)
        v-switch(v-model="newPrizeRemove" label="中獎後移除" color="primary")
        v-btn(type="submit" color="primary" :disabled="!newPrizeName") 新增獎項

  v-card
    v-table
      thead
        tr
          th 名稱
          th 中獎後移除
          th 操作
      tbody
        tr(v-for="prize in prizes" :key="prize.id")
          td {{ prize.name }}
          td
            v-icon(v-if="prize.removeIfWon" color="success") mdi-check
            v-icon(v-else color="error") mdi-close
          td
            v-btn(icon="mdi-delete" variant="text" color="error" @click="deletePrize(prize.id)")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const newPrizeName = ref('')
const newPrizeRemove = ref(false)

const prizes = computed(() => prizeStore.prizes)

const handleAddPrize = () => {
  if (newPrizeName.value) {
    prizeStore.addPrize(newPrizeName.value, newPrizeRemove.value)
    newPrizeName.value = ''
    newPrizeRemove.value = false
  }
}

const deletePrize = (id: string) => {
  prizeStore.deletePrize(id)
}
</script>

<style lang="stylus" scoped>
h2
  color #333
</style>
