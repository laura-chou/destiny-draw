<template lang="pug">
div.text-center
  h2.mb-4 幸運輪盤
  div.wheel-container
    FortuneWheel(
      ref="wheel"
      v-model="winningId"
      :data="wheelData"
      @done="onDone"
    )
  v-btn.mt-6(color="primary" @click="launchWheel" :disabled="spinning") 開始旋轉

  v-dialog(v-model="showResult" max-width="300")
    v-card
      v-card-title.text-center 中獎了！
      v-card-text.text-center.text-h5 {{ resultPrizeName }}
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="showResult = false") 確定
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FortuneWheel } from 'vue3-fortune-wheel'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const wheel = ref<any>(null)
const winningId = ref(0)
const spinning = ref(false)
const showResult = ref(false)
const resultPrizeName = ref('')

const colors = [
  { bgColor: '#7d7db3', color: '#ffffff' },
  { bgColor: '#ffffff', color: '#000000' },
  { bgColor: '#c92729', color: '#ffffff' },
  { bgColor: '#333333', color: '#ffffff' }
]

const wheelData = computed(() => {
  const storePrizes = prizeStore.prizes
  if (storePrizes.length === 0) return []

  // Need at least a few segments for a wheel to look good
  const data = []
  const displayCount = Math.max(storePrizes.length, 4)

  for (let i = 0; i < displayCount; i++) {
    const p = storePrizes[i % storePrizes.length]
    const colorSet = colors[i % colors.length]
    data.push({
      id: i + 1,
      value: p.name,
      ...colorSet,
      // Keep track of original prize info
      prizeId: p.id
    })
  }
  return data
})

const launchWheel = () => {
  if (wheelData.value.length === 0) return

  spinning.value = true
  // Randomly pick the winning ID from the data array
  const randomIndex = Math.floor(Math.random() * wheelData.value.length)
  winningId.value = wheelData.value[randomIndex].id

  wheel.value?.spin()
}

const onDone = (result: any) => {
  spinning.value = false
  resultPrizeName.value = result.value
  showResult.value = true

  // Use the stored prizeId if available
  const prizeId = result.prizeId
  prizeStore.recordWin(result.value, prizeId)
}
</script>

<style lang="stylus" scoped>
.wheel-container
  display flex
  justify-content center
  margin-top 20px
</style>
