import { defineStore } from 'pinia'

export const useGroupingStore = defineStore('grouping', {
  state: () => {
    return {
      names: sessionStorage.getItem('groupingNames') || '',
      groupSize: parseInt(sessionStorage.getItem('groupingSize') || '2')
    }
  },
  actions: {
    setNames(names: string) {
      this.names = names
      this.saveToSession()
    },
    setGroupSize(size: number) {
      this.groupSize = size
      this.saveToSession()
    },
    saveToSession() {
      sessionStorage.setItem('groupingNames', this.names)
      sessionStorage.setItem('groupingSize', this.groupSize.toString())
    }
  }
})
