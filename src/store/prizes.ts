import { defineStore } from 'pinia'

export interface Prize {
  id: string
  name: string
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
  actions: {
    addPrize(name: string) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        name
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

      if (this.excludeWinners) {
        if (prizeId) {
          this.deletePrize(prizeId)
        } else {
          const prizeIndex = this.prizes.findIndex(p => p.name === prizeName)
          if (prizeIndex !== -1) {
            this.prizes.splice(prizeIndex, 1)
          }
        }
      }

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
