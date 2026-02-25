<template lang="pug">
div.text-center
  h2.mb-4 老虎機
  v-sheet.mx-auto.pa-4(elevation="2" rounded="lg" max-width="350" color="#f8f9fa")
    div.lucky-slot-container
      SlotMachine(
        ref="myLucky"
        width="300px"
        height="300px"
        :prizes="prizes"
        :blocks="blocks"
        :slots="slots"
        :buttons="buttons"
        @end="endCallback"
      )
    v-btn.mt-6(color="primary" size="large" @click="startCallback" block rounded="pill") 開始抽獎

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
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const myLucky = ref()
const showResult = ref(false)
const resultPrizeName = ref('')

const blocks = [
  { padding: '10px', background: '#869cfa' },
  { padding: '10px', background: '#e9e8fe' },
]

const prizes = computed(() => {
  const storePrizes = prizeStore.prizes
  const luckyPrizes = []

  // Fill with at least some prizes
  const count = Math.max(storePrizes.length, 5)
  for (let i = 0; i < count; i++) {
    const p = storePrizes[i % storePrizes.length]
    luckyPrizes.push({
      fonts: [{ text: p?.name || '空', top: '30%' }],
      background: i % 2 === 0 ? '#f9e3bb' : '#f8d384',
      id: p?.id
    })
  }
  return luckyPrizes
})

const slots = [
  { speed: 10 },
  { speed: 15 },
  { speed: 20 },
]

const buttons = [
  /* Optional buttons inside the canvas, but we use an external v-btn */
]

const startCallback = () => {
  myLucky.value.play()
  setTimeout(() => {
    // For slot machine, usually you stop at an index, and all reels stop there for a win,
    // or different indices. Here we'll make them all stop at the same for simplicity or random.
    const index = Math.floor(Math.random() * prizes.value.length)
    myLucky.value.stop([index, index, index])
  }, 2000)
}

const endCallback = (prize: any) => {
  // prize is an array if multi-reel
  const firstPrize = Array.isArray(prize) ? prize[0] : prize
  resultPrizeName.value = firstPrize.fonts[0].text
  showResult.value = true
  prizeStore.recordWin(resultPrizeName.value, firstPrize.id)
}
</script>

<style lang="stylus" scoped>
.lucky-slot-container
  display flex
  justify-content center
  margin-top 20px
</style>
