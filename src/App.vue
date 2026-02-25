<template lang="pug">
v-app
  v-navigation-drawer(v-model="drawer" app permanent class="nav-drawer")
    v-list(nav)
      v-list-item(prepend-icon="mdi-ferris-wheel" title="轉盤" to="/wheel" active-class="active-item")
      v-list-item(prepend-icon="mdi-grid" title="九宮格" to="/grid" active-class="active-item")
      v-list-item(prepend-icon="mdi-slot-machine" title="老虎機" to="/slot" active-class="active-item")
      v-list-item(prepend-icon="mdi-format-paint" title="刮刮樂" to="/scratch" active-class="active-item")
      v-list-item(prepend-icon="mdi-star-circle-outline" title="中獎紀錄" to="/history" active-class="active-item")
      v-list-item(prepend-icon="mdi-cog" title="設定" to="/settings" active-class="active-item")

  v-app-bar(app color="primary" density="compact" flat)
    v-app-bar-nav-icon(@click="drawer = !drawer")
    v-toolbar-title 抽獎

  v-main.main-content
    v-container(fluid)
      router-view
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)
</script>

<style lang="stylus">
body
  font-family "Microsoft JhengHei", "Heiti TC", sans-serif
  background-color #f5f5f5

.nav-drawer
  background linear-gradient(180deg, #1e88e5 0%, #1565c0 100%) !important
  color white !important

  .v-list-item
    color white !important
    margin-bottom 8px

    &--active
      background rgba(255, 255, 255, 0.2) !important

  .v-icon
    color white !important

.main-content
  background-color #e0e0e0
  min-height 100vh

.active-item
  background-color rgba(255, 255, 255, 0.2) !important
</style>
