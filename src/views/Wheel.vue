<template lang="pug">
v-container.d-flex.flex-column.align-center.justify-center.pa-0
  div.wheel-wrapper
    FortuneWheel(
      :key="wheelData.length"
      ref="wheel"
      v-model="winningId"
      :data="wheelData"
      @done="onDone"
    )

  div.text-center
    v-btn.mt-4.mt-sm-8(
      color="amber-accent-4"
      size="x-large"
      @click="launchWheel"
      :disabled="spinning"
      rounded="pill"
      class="play-btn text-black font-weight-black"
    ) {{ spinning ? '請稍後...' : '開始' }}

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
          @click="confirmResult"
        ) 確定
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FortuneWheel } from 'vue3-fortune-wheel'
import { usePrizeStore } from '@/store/prizes'

const router = useRouter()
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
  { bgColor: '#e65100', color: '#ffffff' }, // Orange
  { bgColor: '#00838f', color: '#ffffff' }, // Teal
  { bgColor: '#5d4037', color: '#ffffff' }, // Brown
  { bgColor: '#455a64', color: '#ffffff' }, // Blue Grey
  { bgColor: '#c2185b', color: '#ffffff' }, // Pink
  { bgColor: '#303f9f', color: '#ffffff' }, // Indigo
  { bgColor: '#afb42b', color: '#000000' }  // Lime
]

const wheelData = computed(() => {
  const storePrizes = prizeStore.availablePrizes
  if (storePrizes.length === 0) return []

  const data = []
  for (let i = 0; i < storePrizes.length; i++) {
    const p = storePrizes[i % storePrizes.length]
    const offset = i >= colors.length ? 1 : 0
    const colorSet = colors[(i + offset) % colors.length]
    data.push({
      id: i + 1,
      value: p.name,
      ...colorSet,
      prizeId: p.id
    })
  }
  return data
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

const confirmResult = () => {
  showResult.value = false
  if (prizeStore.availablePrizes.length < 2) {
    router.push('/settings')
  }
}
</script>

<style lang="stylus" scoped>
.wheel-wrapper
  :deep(#wheel)
    height 500px !important

  :deep(circle:first-of-type)
    r 50

  :deep(textPath)
    font-size 24px

.play-btn
  border 2px solid #fff
  width 300px
  transition all 0.3s ease
  &:hover:not(:disabled)
    transform scale(1.05)
    box-shadow 0 0 20px #ffc107

.result-card
  background #1a237e
  border 3px solid #ffc107

@media screen and (max-width: 400px)
  .wheel-wrapper
    :deep(#wheel)
      width 380px !important
</style>
