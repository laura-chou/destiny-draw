import { defineStore } from 'pinia'

export interface Task {
  id: string
  name: string
  count: number
}

export interface TaskResult {
  name: string
  members: string[]
  targetCount: number
}

export const useGroupingStore = defineStore('grouping', {
  state: () => {
    const savedTasks = sessionStorage.getItem('groupingTasks')
    const savedGroups = sessionStorage.getItem('lastGroups')
    const savedTaskResults = sessionStorage.getItem('lastTaskResults')
    const savedUnassigned = sessionStorage.getItem('lastUnassigned')

    return {
      names: sessionStorage.getItem('groupingNames') || '',
      groupSize: parseInt(sessionStorage.getItem('groupingSize') || '2'),
      isTaskAssignmentEnabled: sessionStorage.getItem('isTaskAssignmentEnabled') === 'true',
      tasks: savedTasks ? JSON.parse(savedTasks) as Task[] : [] as Task[],
      lastGroups: savedGroups ? JSON.parse(savedGroups) as string[][] : [] as string[][],
      lastTaskResults: savedTaskResults ? JSON.parse(savedTaskResults) as TaskResult[] : [] as TaskResult[],
      lastUnassigned: savedUnassigned ? JSON.parse(savedUnassigned) as string[] : [] as string[]
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
    removeMultipleTasks(ids: string[]) {
      this.tasks = this.tasks.filter(t => !ids.includes(t.id))
      this.saveToSession()
    },
    addTaskWithName(name: string) {
      const newTask: Task = {
        id: Date.now().toString(),
        name,
        count: 1
      }
      this.tasks.push(newTask)
      this.saveToSession()
    },
    setResults(groups: string[][], taskResults: TaskResult[], unassigned: string[]) {
      this.lastGroups = groups
      this.lastTaskResults = taskResults
      this.lastUnassigned = unassigned
      this.saveToSession()
    },
    saveToSession() {
      sessionStorage.setItem('groupingNames', this.names)
      sessionStorage.setItem('groupingSize', this.groupSize.toString())
      sessionStorage.setItem('isTaskAssignmentEnabled', this.isTaskAssignmentEnabled.toString())
      sessionStorage.setItem('groupingTasks', JSON.stringify(this.tasks))
      sessionStorage.setItem('lastGroups', JSON.stringify(this.lastGroups))
      sessionStorage.setItem('lastTaskResults', JSON.stringify(this.lastTaskResults))
      sessionStorage.setItem('lastUnassigned', JSON.stringify(this.lastUnassigned))
    }
  }
})
