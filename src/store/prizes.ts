import { defineStore } from 'pinia'

export interface Prize {
  id: string
  name: string
  isActive: boolean
}

export interface WinRecord {
  id: number
  prizeName: string
  time: string
}

export const usePrizeStore = defineStore('prizes', {
  state: () => {
    const rawPrizes = JSON.parse(sessionStorage.getItem('prizes') || '[]') as any[]
    const prizes = rawPrizes.map(p => ({
      id: p.id,
      name: p.name,
      isActive: p.isActive !== undefined ? p.isActive : (p.isWon !== undefined ? !p.isWon : true)
    })) as Prize[]

    return {
      prizes,
      history: JSON.parse(sessionStorage.getItem('winHistory') || '[]') as WinRecord[],
      excludeWinners: JSON.parse(sessionStorage.getItem('excludeWinners') || 'false') as boolean
    }
  },
  getters: {
    availablePrizes: (state) => {
      return state.prizes.filter(p => p.isActive)
    }
  },
  actions: {
    addPrize(name: string) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        name,
        isActive: true
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
    setAllPrizesActive(value: boolean) {
      this.prizes.forEach(p => {
        p.isActive = value
      })
      this.saveToSession()
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
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

      const record: WinRecord = {
        id: Date.now(),
        prizeName,
        time: timeStr
      }
      this.history.unshift(record)

      if (this.excludeWinners) {
        if (prizeId) {
          const prize = this.prizes.find(p => p.id === prizeId)
          if (prize) {
            prize.isActive = false
          }
        } else {
          const prize = this.prizes.find(p => p.name === prizeName && p.isActive)
          if (prize) {
            prize.isActive = false
          }
        }
      }

      this.saveToSession()
    },
    togglePrizeActive(id: string, value: boolean) {
      const prize = this.prizes.find(p => p.id === id)
      if (prize) {
        prize.isActive = value
        this.saveToSession()
      }
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
