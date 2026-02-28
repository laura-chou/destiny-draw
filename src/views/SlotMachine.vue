<template lang="pug">
v-container.d-flex.flex-column.align-center.justify-center.pa-0
  v-card.mx-auto.pa-4.pa-sm-6.slot-outer-card(elevation="20" rounded="xl" :max-width="cardWidth")
    div.lucky-slot-wrapper
      SlotMachine(
        ref="myLucky"
        :width="gridSize"
        :height="gridSize"
        :prizes="prizes"
        :blocks="blocks"
        :slots="slots"
        :defaultStyle="defaultStyle"
        @end="endCallback"
      )

    v-btn.mt-4.mt-sm-8(
      color="purple-accent-4"
      size="x-large"
      @click="startCallback"
      :disabled="spinning"
      block
      rounded="pill"
      class="play-btn text-white font-weight-black"
    ) {{ spinning ? '請稍後...' : '拉霸' }}

  v-dialog(v-model="showResult" max-width="320" persistent)
    v-card.rounded-xl.pa-4.result-card
      v-card-title.text-center.text-h5.font-weight-bold.text-purple-accent-1 恭喜
      v-card-text.text-center.py-6
        div.text-h4.font-weight-black.text-white {{ resultPrizeName }}
      v-card-actions.justify-center
        v-btn(
          color="purple-accent-4"
          variant="elevated"
          size="large"
          rounded="pill"
          width="160"
          @click="confirmResult"
        ) 確定
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePrizeStore } from '@/store/prizes'

const router = useRouter()
const prizeStore = usePrizeStore()
const myLucky = ref()
const showResult = ref(false)
const resultPrizeName = ref('')
const spinning = ref(false)

const cardWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth - 65, 400)
  }
  return 400
})

const gridSize = computed(() => {
  if (typeof window !== 'undefined') {
    const side = Math.min(window.innerWidth - 120, 300)
    return side + 'px'
  }
  return '270px'
})

const blocks = [
  { padding: '10px', background: '#9c27b0' },
  { padding: '5px', background: '#4a148c' },
]

const defaultStyle = {
  background: '#f3e5f5',
  fonts: [{ fontSize: '18px', fontColor: '#4a148c', fontWeight: 'bold' }]
}

const prizes = computed(() => {
  const storePrizes = prizeStore.availablePrizes
  const luckyPrizes = []

  const count = Math.max(storePrizes.length, 6)
  for (let i = 0; i < count; i++) {
    const p = storePrizes[i % storePrizes.length]
    luckyPrizes.push({
      fonts: [{ text: p?.name || '?', top: '35%' }],
      background: i % 2 === 0 ? '#fff' : '#f3e5f5',
      id: p?.id
    })
  }
  return luckyPrizes
})

const slots = [
  { speed: 10 },
  { speed: 12 },
  { speed: 14 },
]

const startCallback = () => {
  if (spinning.value) return
  spinning.value = true
  myLucky.value.play()
  setTimeout(() => {
    const index = Math.floor(Math.random() * prizes.value.length)
    myLucky.value.stop([index, index, index])
  }, 2500)
}

const endCallback = (prize: any) => {
  spinning.value = false
  const firstPrize = Array.isArray(prize) ? prize[0] : prize
  resultPrizeName.value = firstPrize.fonts[0].text
  showResult.value = true
  prizeStore.recordWin(resultPrizeName.value, firstPrize.id)
}

const confirmResult = () => {
  showResult.value = false
  if (prizeStore.availablePrizes.length < 2) {
    router.push('/settings')
  }
}
</script>

<style lang="stylus" scoped>
.slot-outer-card
  background radial-gradient(circle, #311b92 0%, #1a237e 100%)
  border 4px solid #e040fb
  box-shadow 0 0 30px rgba(224, 64, 251, 0.3)

.lucky-slot-wrapper
  display flex
  justify-content center
  padding 10px
  background-color #1a237e
  border-radius 12px

.play-btn
  border 2px solid #fff
  transition all 0.3s ease
  &:hover:not(:disabled)
    transform translateY(-3px)
    box-shadow 0 0 20px #e040fb

.result-card
  background #311b92
  border 3px solid #e040fb
</style>
