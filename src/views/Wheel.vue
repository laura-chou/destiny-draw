<template lang="pug">
v-container.py-4.d-flex.flex-column.align-center.justify-center(style="min-height: calc(100vh - 64px)")
  h2.mb-4.text-h5.text-sm-h4.font-weight-bold.text-amber-accent-4.game-title 幸運大轉盤

  v-card.mx-auto.pa-4.pa-sm-6.wheel-outer-card(elevation="20" rounded="xl" :max-width="cardWidth")
    div.wheel-wrapper
      FortuneWheel(
        :key="wheelData.length"
        ref="wheel"
        v-model="winningId"
        :data="wheelData"
        :canvas="canvasOptions"
        @done="onDone"
      )

    v-btn.mt-4.mt-sm-8(
      color="amber-accent-4"
      size="x-large"
      @click="launchWheel"
      :disabled="spinning"
      block
      rounded="pill"
      class="play-btn text-black font-weight-black"
    ) {{ spinning ? '旋轉中...' : '開始旋轉' }}

  v-dialog(v-model="showResult" max-width="320" persistent)
    v-card.rounded-xl.pa-4.result-card
      v-card-title.text-center.text-h5.font-weight-bold.text-amber 中獎了！
      v-card-text.text-center.py-6
        div.text-h4.font-weight-black.text-white {{ resultPrizeName }}
      v-card-actions.justify-center
        v-btn(
          color="amber-accent-4"
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
import { FortuneWheel } from 'vue3-fortune-wheel'
import { usePrizeStore } from '@/store/prizes'

const prizeStore = usePrizeStore()
const wheel = ref<any>(null)
const winningId = ref(0)
const spinning = ref(false)
const showResult = ref(false)
const resultPrizeName = ref('')

const colors = [
  { bgColor: '#d32f2f', color: '#ffffff' }, // Red
  { bgColor: '#1976d2', color: '#ffffff' }, // Blue
  { bgColor: '#fbc02d', color: '#000000' }, // Gold
  { bgColor: '#388e3c', color: '#ffffff' }, // Green
  { bgColor: '#7b1fa2', color: '#ffffff' }, // Purple
  { bgColor: '#e65100', color: '#ffffff' }  // Orange
]

const wheelData = computed(() => {
  const storePrizes = prizeStore.prizes
  if (storePrizes.length === 0) return []

  const data = []
  const displayCount = storePrizes.length < 6 ? storePrizes.length * 2 : storePrizes.length

  for (let i = 0; i < displayCount; i++) {
    const p = storePrizes[i % storePrizes.length]
    const colorSet = colors[i % colors.length]
    data.push({
      id: i + 1,
      value: p.name,
      ...colorSet,
      prizeId: p.id
    })
  }
  return data
})

const cardWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth - 32, 500)
  }
  return 500
})

const canvasOptions = computed(() => {
  const count = wheelData.value.length
  let fontSize = 22
  if (count > 15) fontSize = 12
  else if (count > 10) fontSize = 16
  else if (count > 8) fontSize = 18

  return {
    radius: 170,
    textDirection: 'horizontal',
    fontSize: fontSize,
    borderWidth: 6,
    borderColor: '#ffc107'
  }
})

const launchWheel = () => {
  if (wheelData.value.length === 0) return

  spinning.value = true
  const randomIndex = Math.floor(Math.random() * wheelData.value.length)
  winningId.value = wheelData.value[randomIndex].id

  wheel.value?.spin()
}

const onDone = (result: any) => {
  spinning.value = false
  resultPrizeName.value = result.value
  showResult.value = true

  const prizeId = result.prizeId
  prizeStore.recordWin(result.value, prizeId)
}
</script>

<style lang="stylus" scoped>
.game-title
  text-shadow 2px 2px 4px rgba(0,0,0,0.5), 0 0 20px #ffc107
  letter-spacing 4px

.wheel-outer-card
  background radial-gradient(circle, #263238 0%, #102027 100%)
  border 4px solid #ffc107
  box-shadow 0 0 30px rgba(255, 193, 7, 0.3)

.wheel-wrapper
  display flex
  justify-content center
  padding 10px
  background-color #102027
  border-radius 50%
  border 2px solid #37474f

.play-btn
  border 2px solid #fff
  transition all 0.3s ease
  &:hover:not(:disabled)
    transform scale(1.05)
    box-shadow 0 0 20px #ffc107

.result-card
  background #1a237e
  border 3px solid #ffc107

  .v-card-title
    text-shadow 0 0 10px #ffeb3b
</style>
