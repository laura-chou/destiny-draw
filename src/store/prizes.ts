import { defineStore } from 'pinia'

export interface Prize {
  id: string
  name: string
  removeIfWon: boolean
}

export interface WinRecord {
  id: number
  prizeName: string
  time: string
}

export const usePrizeStore = defineStore('prizes', {
  state: () => ({
    prizes: JSON.parse(sessionStorage.getItem('prizes') || '[]') as Prize[],
    history: JSON.parse(sessionStorage.getItem('winHistory') || '[]') as WinRecord[]
  }),
  actions: {
    addPrize(name: string, removeIfWon: boolean) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        name,
        removeIfWon
      }
      this.prizes.push(newPrize)
      this.saveToSession()
    },
    deletePrize(id: string) {
      this.prizes = this.prizes.filter(p => p.id !== id)
      this.saveToSession()
    },
    recordWin(prizeName: string, prizeId?: string) {
      const record: WinRecord = {
        id: this.history.length + 1,
        prizeName,
        time: new Date().toLocaleString()
      }
      this.history.unshift(record)

      if (prizeId) {
        const prize = this.prizes.find(p => p.id === prizeId)
        if (prize && prize.removeIfWon) {
          this.deletePrize(prizeId)
        }
      } else {
          // Find by name if ID not provided (though ID is better)
          const prizeIndex = this.prizes.findIndex(p => p.name === prizeName && p.removeIfWon)
          if (prizeIndex !== -1) {
              this.prizes.splice(prizeIndex, 1)
          }
      }

      this.saveToSession()
    },
    saveToSession() {
      sessionStorage.setItem('prizes', JSON.stringify(this.prizes))
      sessionStorage.setItem('winHistory', JSON.stringify(this.history))
    }
  }
})
