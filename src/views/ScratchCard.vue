<template lang="pug">
div.text-center
  h2.mb-4 刮刮樂
  div.scratch-container.mb-4
    ScratchCard(
      v-if="!restarting"
      :imageUrl="coverImage"
      :cardWidth="300"
      :cardHeight="150"
      :finishPercent="60"
      @complete="onComplete"
    )
      div.result-container
        h3 {{ currentPrize?.name }}

  v-btn(color="secondary" @click="resetGame" :disabled="!isFinished") 再玩一次

  v-dialog(v-model="showResult" max-width="300")
    v-card
      v-card-title.text-center 中獎了！
      v-card-text.text-center.text-h5 {{ currentPrize?.name }}
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="showResult = false") 確定
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { usePrizeStore } from '@/store/prizes'
import ScratchCard from 'vue-scratchcard/dist/vue-scratchcard.es.js'

const prizeStore = usePrizeStore()
const currentPrize = ref<any>(null)
const isFinished = ref(false)
const showResult = ref(false)
const restarting = ref(false)

// A grey rectangle data URL for the cover
const coverImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAAB6S89VAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAABpJREFUOMtjGAWjYBSMglEwCkbBKBgFowAFAAgAAAHv9K9XAAAAAElFTkSuQmCC'

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
.scratch-container
  display flex
  justify-content center
  position relative

.result-container
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  background #eee
  border 2px dashed #ccc
</style>
