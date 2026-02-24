<template lang="pug">
div.text-center
  h2.mb-4 九宮格抽獎
  div.lucky-grid-container
    LuckyGrid(
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    )
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
  const positions = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 },
    { x: 0, y: 2 }, { x: 0, y: 1 }
  ]

  for (let i = 0; i < 8; i++) {
    const p = storePrizes[i % storePrizes.length]
    luckyPrizes.push({
      ...positions[i],
      fonts: [{ text: p?.name || '再接再厲', top: '30%' }],
      background: i % 2 === 0 ? '#f9e3bb' : '#f8d384',
      // Store original ID to handle removal
      id: p?.id
    })
  }
  return luckyPrizes
})

const buttons = [
  {
    x: 1, y: 1,
    background: '#9c9ddf',
    fonts: [{ text: '開始', top: '25%' }]
  }
]

const startCallback = () => {
  myLucky.value.play()
  setTimeout(() => {
    const index = Math.floor(Math.random() * 8)
    myLucky.value.stop(index)
  }, 2000)
}

const endCallback = (prize: any) => {
  resultPrizeName.value = prize.fonts[0].text
  showResult.value = true
  // Record win and handle removal if necessary
  // If prize has an id, use it, otherwise use name
  prizeStore.recordWin(resultPrizeName.value, prize.id)
}
</script>

<style lang="stylus" scoped>
.lucky-grid-container
  display flex
  justify-content center
  margin-top 20px
</style>
