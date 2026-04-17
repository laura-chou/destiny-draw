import { defineStore } from 'pinia'

export interface Task {
  id: string
  name: string
  count: number
}

export const useGroupingStore = defineStore('grouping', {
  state: () => {
    const savedTasks = sessionStorage.getItem('groupingTasks')
    return {
      names: sessionStorage.getItem('groupingNames') || '',
      groupSize: parseInt(sessionStorage.getItem('groupingSize') || '2'),
      isTaskAssignmentEnabled: sessionStorage.getItem('isTaskAssignmentEnabled') === 'true',
      tasks: savedTasks ? JSON.parse(savedTasks) as Task[] : [] as Task[]
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
    setTaskAssignmentEnabled(enabled: boolean) {
      this.isTaskAssignmentEnabled = enabled
      this.saveToSession()
    },
    addTask() {
      const newTask: Task = {
        id: Date.now().toString(),
        name: '',
        count: 1
      }
      this.tasks.push(newTask)
      this.saveToSession()
    },
    updateTask(id: string, updates: Partial<Task>) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updates }
        this.saveToSession()
      }
    },
    removeTask(id: string) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.saveToSession()
    },
    saveToSession() {
      sessionStorage.setItem('groupingNames', this.names)
      sessionStorage.setItem('groupingSize', this.groupSize.toString())
      sessionStorage.setItem('isTaskAssignmentEnabled', this.isTaskAssignmentEnabled.toString())
      sessionStorage.setItem('groupingTasks', JSON.stringify(this.tasks))
    }
  }
})
