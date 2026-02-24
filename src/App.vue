<template lang="pug">
v-app
  v-navigation-drawer(v-model="drawer" app)
    v-list
      v-list-item(prepend-icon="mdi-cog" title="獎項設定" to="/settings")
      v-list-item(prepend-icon="mdi-history" title="中獎紀錄" to="/history")
      v-divider
      v-list-item(:disabled="noPrizes" prepend-icon="mdi-grid" title="九宮格" to="/grid")
      v-list-item(:disabled="noPrizes" prepend-icon="mdi-slot-machine" title="老虎機" to="/slot")
      v-list-item(:disabled="noPrizes" prepend-icon="mdi-format-paint" title="刮刮樂" to="/scratch")
      v-list-item(:disabled="noPrizes" prepend-icon="mdi-ferris-wheel" title="幸運輪盤" to="/wheel")

  v-app-bar(app)
    v-app-bar-nav-icon(@click="drawer = !drawer")
    v-toolbar-title 抽獎小遊戲

  v-main
    v-container
      router-view
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrizeStore } from '@/store/prizes'

const drawer = ref(true)
const prizeStore = usePrizeStore()

const noPrizes = computed(() => prizeStore.prizes.length === 0)
</script>

<style lang="stylus">
body
  font-family 'Roboto', sans-serif
</style>
