<template lang="pug">
div.scratch-card-wrapper(:style="{ width: width + 'px', height: height + 'px' }")
  // The content revealed under the scratch layer
  div.scratch-content
    slot

  // The scratchable canvas layer
  canvas.scratch-canvas(
    ref="canvasRef"
    :width="width"
    :height="height"
    @mousedown="handleStart"
    @mousemove="handleMove"
    @mouseup="handleEnd"
    @touchstart="handleStart"
    @touchmove="handleMove"
    @touchend="handleEnd"
  )
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  width: number
  height: number
  coverColor?: string
  finishPercent?: number
}>()

const emit = defineEmits(['complete'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDrawing = ref(false)
const finished = ref(false)

const initCanvas = () => {
  if (!canvasRef.value) return
  ctx.value = canvasRef.value.getContext('2d', { willReadFrequently: true })
  if (!ctx.value) return

  // Fill the canvas with cover color
  ctx.value.fillStyle = props.coverColor || '#C0C0C0'
  ctx.value.fillRect(0, 0, props.width, props.height)

  // Add some texture/text to the cover
  ctx.value.fillStyle = '#999'
  ctx.value.font = '20px Arial'
  ctx.value.textAlign = 'center'
  ctx.value.fillText('刮開有獎', props.width / 2, props.height / 2 + 7)

  // Set composite operation for scratching
  ctx.value.globalCompositeOperation = 'destination-out'
  ctx.value.lineWidth = 25
  ctx.value.lineCap = 'round'
}

const getPos = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const handleStart = (e: MouseEvent | TouchEvent) => {
  if (finished.value) return
  isDrawing.value = true
  const { x, y } = getPos(e)
  ctx.value?.beginPath()
  ctx.value?.moveTo(x, y)
}

let lastCheckTime = 0
const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || finished.value) return
  e.preventDefault()
  const { x, y } = getPos(e)
  ctx.value?.lineTo(x, y)
  ctx.value?.stroke()

  const now = Date.now()
  if (now - lastCheckTime > 200) {
    lastCheckTime = now
    checkPercent()
  }
}

const handleEnd = () => {
  isDrawing.value = false
  checkPercent()
}

const checkPercent = () => {
  if (!ctx.value || finished.value) return
  const imageData = ctx.value.getImageData(0, 0, props.width, props.height)
  const pixels = imageData.data
  let transparentCount = 0
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparentCount++
  }
  const percent = (transparentCount / (props.width * props.height)) * 100
  if (percent >= (props.finishPercent || 50)) {
    revealAll()
  }
}

const revealAll = () => {
  if (!ctx.value || finished.value) return
  finished.value = true
  // Quickly clear the whole canvas
  ctx.value.globalCompositeOperation = 'destination-out'
  ctx.value.fillRect(0, 0, props.width, props.height)
  emit('complete')
}

onMounted(() => {
  initCanvas()
})

// Allow external reset
defineExpose({
  reset: () => {
    finished.value = false
    initCanvas()
  }
})
</script>

<style lang="stylus" scoped>
.scratch-card-wrapper
  position relative
  user-select none
  overflow hidden
  border-radius 8px
  border 2px solid #ccc

.scratch-content
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  background #fff

.scratch-canvas
  position absolute
  top 0
  left 0
  cursor crosshair
  touch-action none
</style>
