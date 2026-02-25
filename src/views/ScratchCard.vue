<template lang="pug">
v-container.py-4.d-flex.flex-column.align-center.justify-center(style="min-height: calc(100vh - 64px)")
  h2.mb-4.text-h5.text-sm-h4.font-weight-bold.text-deep-orange-darken-3.scratch-title 刮刮樂

  v-card.mx-auto.pa-4.pa-sm-6.scratch-outer-card(elevation="10" rounded="xl" :max-width="cardWidth")
    div.scratch-container.mb-4.mb-sm-6
      CustomScratchCard(
        v-if="!restarting"
        ref="scratchCardRef"
        :width="scratchWidth"
        :height="180"
        :finishPercent="30"
        @complete="onComplete"
      )
        div.prize-reveal-area
          div.prize-text {{ currentPrize?.name }}

    v-btn(
      color="deep-orange-darken-4"
      size="x-large"
      @click="resetGame"
      :disabled="!isFinished"
      block
      rounded="pill"
      class="elevation-4"
    ) 再玩一次

  v-dialog(v-model="showResult" max-width="320" persistent)
    v-card.rounded-xl.pa-4
      v-card-title.text-center.text-h5.font-weight-bold.text-deep-orange 恭喜中獎！
      v-card-text.text-center.py-6
        div.text-h4.font-weight-black.text-grey-darken-3 {{ currentPrize?.name }}
      v-card-actions.justify-center
        v-btn(
          color="deep-orange-darken-2"
          variant="elevated"
          size="large"
          rounded="pill"
          width="160"
          @click="showResult = false"
        ) 確定
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePrizeStore } from '@/store/prizes'
import CustomScratchCard from '@/components/CustomScratchCard.vue'

const prizeStore = usePrizeStore()
const currentPrize = ref<any>(null)
const isFinished = ref(false)
const showResult = ref(false)
const restarting = ref(false)
const scratchCardRef = ref(null)

const cardWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth - 16, 400)
  }
  return 400
})

const scratchWidth = computed(() => {
  return cardWidth.value - (window.innerWidth < 600 ? 32 : 48)
})

const pickRandomPrize = () => {
  const prizes = prizeStore.prizes
  if (prizes.length > 0) {
    currentPrize.value = prizes[Math.floor(Math.random() * prizes.length)]
  }
}

const onComplete = () => {
  isFinished.value = true
  showResult.value = true
  if (currentPrize.value) {
    prizeStore.recordWin(currentPrize.value.name, currentPrize.value.id)
  }
}

const resetGame = async () => {
  restarting.value = true
  isFinished.value = false
  pickRandomPrize()
  await nextTick()
  restarting.value = false
}

onMounted(() => {
  pickRandomPrize()
})
</script>

<style lang="stylus" scoped>
.scratch-title
  text-shadow 0 0 10px rgba(255, 87, 34, 0.5)

.scratch-outer-card
  background linear-gradient(135deg, #ff9800 0%, #ff5722 100%)
  border 4px solid #fff3e0

.scratch-container
  display flex
  justify-content center
  position relative
  filter drop-shadow(0 4px 8px rgba(0,0,0,0.2))

.prize-reveal-area
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  background radial-gradient(circle, #fff 0%, #f5f5f5 100%)

  .prize-text
    font-size 2rem
    font-weight 900
    color #d84315
    text-shadow 1px 1px 2px rgba(0,0,0,0.1)
    text-align center
    padding 10px
</style>
