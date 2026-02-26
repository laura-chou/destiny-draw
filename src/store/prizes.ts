import { defineStore } from 'pinia'

export interface Prize {
  id: string
  name: string
  isWon?: boolean
}

export interface WinRecord {
  id: number
  prizeName: string
  time: string
}

export const usePrizeStore = defineStore('prizes', {
  state: () => ({
    prizes: JSON.parse(sessionStorage.getItem('prizes') || '[]') as Prize[],
    history: JSON.parse(sessionStorage.getItem('winHistory') || '[]') as WinRecord[],
    excludeWinners: JSON.parse(sessionStorage.getItem('excludeWinners') || 'false') as boolean
  }),
  getters: {
    availablePrizes: (state) => {
      if (state.excludeWinners) {
        return state.prizes.filter(p => !p.isWon)
      }
      return state.prizes
    }
  },
  actions: {
    addPrize(name: string) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        name,
        isWon: false
      }
      this.prizes.push(newPrize)
      this.saveToSession()
    },
    updatePrize(id: string, name: string) {
      const prize = this.prizes.find(p => p.id === id)
      if (prize) {
        prize.name = name
        this.saveToSession()
      }
    },
    deletePrize(id: string) {
      this.prizes = this.prizes.filter(p => p.id !== id)
      this.saveToSession()
    },
    setExcludeWinners(value: boolean) {
      this.excludeWinners = value
      this.saveToSession()
    },
    recordWin(prizeName: string, prizeId?: string) {
      const now = new Date()
      const timeStr = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

      const record: WinRecord = {
        id: Date.now(),
        prizeName,
        time: timeStr
      }
      this.history.unshift(record)

      if (prizeId) {
        const prize = this.prizes.find(p => p.id === prizeId)
        if (prize) {
          prize.isWon = true
        }
      } else {
        const prize = this.prizes.find(p => p.name === prizeName && !p.isWon)
        if (prize) {
          prize.isWon = true
        }
      }

      this.saveToSession()
    },
    resetWinners() {
      this.prizes.forEach(p => {
        p.isWon = false
      })
      this.saveToSession()
    },
    clearHistory() {
      this.history = []
      this.saveToSession()
    },
    deleteMultiplePrizes(ids: string[]) {
      this.prizes = this.prizes.filter(p => !ids.includes(p.id))
      this.saveToSession()
    },
    saveToSession() {
      sessionStorage.setItem('prizes', JSON.stringify(this.prizes))
      sessionStorage.setItem('winHistory', JSON.stringify(this.history))
      sessionStorage.setItem('excludeWinners', JSON.stringify(this.excludeWinners))
    }
  }
})
