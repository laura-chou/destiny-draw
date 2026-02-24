/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@lucky-canvas/vue';
declare module 'vue-scratchcard';
declare module 'vue-scratchcard/dist/vue-scratchcard.es.js';
declare module 'vue3-fortune-wheel';
