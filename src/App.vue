<template lang="pug">
v-app
  v-navigation-drawer(v-model="drawer" app class="nav-drawer" temporary)
    v-list(nav)
      v-list-item(prepend-icon="mdi-ferris-wheel" title="轉盤" to="/wheel" active-class="active-item")
      v-list-item(prepend-icon="mdi-grid" title="九宮格" to="/grid" active-class="active-item")
      v-list-item(prepend-icon="mdi-slot-machine" title="老虎機" to="/slot" active-class="active-item")
      v-list-item(prepend-icon="mdi-format-paint" title="刮刮樂" to="/scratch" active-class="active-item")
      v-list-item(prepend-icon="mdi-star-circle-outline" title="中獎紀錄" to="/history" active-class="active-item")
      v-list-item(prepend-icon="mdi-cog" title="設定" to="/settings" active-class="active-item")

  v-app-bar(app color="#1a237e" density="compact" flat class="app-bar")
    v-app-bar-nav-icon(color="amber-accent-4" @click="drawer = !drawer")
    v-toolbar-title.text-amber-accent-4.font-weight-black 命運之抽

  v-main.main-content
    v-container(fluid)
      router-view
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>

<style lang="stylus">
body
  font-family "Microsoft JhengHei", "Heiti TC", sans-serif
  margin 0
  padding 0

.nav-drawer
  background linear-gradient(180deg, #263238 0%, #102027 100%) !important
  border-right 2px solid #ffc107 !important

  .v-list-item
    color white !important
    margin-bottom 8px

    &--active
      background rgba(255, 193, 7, 0.2) !important
      border-left 4px solid #ffc107

  .v-icon
    color #ffc107 !important

.app-bar
  border-bottom 2px solid #ffc107 !important

.main-content
  background radial-gradient(circle at center, #424242 0%, #212121 100%)
  min-height 100vh

.active-item
  color #ffc107 !important

.v-container
  height 100%
</style>
