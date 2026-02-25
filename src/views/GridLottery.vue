<template lang="pug">
v-container.py-4.d-flex.flex-column.align-center.justify-center(style="min-height: calc(100vh - 64px)")
  h2.mb-4.text-h5.text-sm-h4.font-weight-bold.text-cyan-accent-3.game-title 幸運九宮格

  v-card.mx-auto.pa-4.pa-sm-6.grid-outer-card(elevation="20" rounded="xl" :max-width="cardWidth")
    div.lucky-grid-wrapper
      LuckyGrid(
        ref="myLucky"
        :width="gridSize"
        :height="gridSize"
        :prizes="prizes"
        :blocks="blocks"
        :buttons="buttons"
        :defaultStyle="defaultStyle"
        @start="startCallback"
        @end="endCallback"
      )

  v-dialog(v-model="showResult" max-width="320" persistent)
    v-card.rounded-xl.pa-4.result-card
      v-card-title.text-center.text-h5.font-weight-bold.text-cyan-accent-2 中獎了！
      v-card-text.text-center.py-6
        div.text-h4.font-weight-black.text-white {{ resultPrizeName }}
      v-card-actions.justify-center
        v-btn(
          color="cyan-accent-4"
          variant="elevated"
          size="large"
          rounded="pill"
          width="160"
          class="text-black"
          @click="showResult = false"
        ) 確定
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const myLucky = ref()
const showResult = ref(false)
const resultPrizeName = ref('')

const cardWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth - 32, 400)
  }
  return 400
})

const gridSize = computed(() => {
  if (typeof window !== 'undefined') {
    const side = Math.min(window.innerWidth - 64, 300)
    return side + 'px'
  }
  return '300px'
})

const blocks = [
  { padding: '10px', background: '#00bcd4' },
  { padding: '5px', background: '#006064' },
]

const defaultStyle = {
  background: '#e0f7fa',
  fonts: [{ fontSize: '14px', fontColor: '#006064' }]
}

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
      fonts: [{ text: p?.name || '再接再厲', top: '35%', fontWeight: '700', fontSize: '16px' }],
      background: i % 2 === 0 ? '#fffde7' : '#fff9c4',
      borderRadius: '8px',
      shadow: '0 4px 0 #fbc02d',
      id: p?.id
    })
  }
  return luckyPrizes
})

const buttons = [
  {
    x: 1, y: 1,
    background: '#ff5722',
    shadow: '0 4px 0 #e64a19',
    fonts: [{ text: 'GO!', top: '25%', fontColor: '#fff', fontSize: '24px', fontWeight: '900' }]
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
  prizeStore.recordWin(resultPrizeName.value, prize.id)
}
</script>

<style lang="stylus" scoped>
.game-title
  text-shadow 2px 2px 4px rgba(0,0,0,0.5), 0 0 20px #00e5ff
  letter-spacing 4px

.grid-outer-card
  background radial-gradient(circle, #004d40 0%, #00241a 100%)
  border 4px solid #00e5ff
  box-shadow 0 0 30px rgba(0, 229, 255, 0.3)

.lucky-grid-wrapper
  display flex
  justify-content center
  padding 10px
  background-color #00241a
  border-radius 12px

.result-card
  background #004d40
  border 3px solid #00e5ff

  .v-card-title
    text-shadow 0 0 10px #00e5ff
</style>
