import { call } from './call'

interface BatchProcessingOptions {
  batchSize?: number
}

type Function = (() => void) | (() => Promise<void>)

export async function executeInBatches(tasks: Function[], { batchSize = 25 }: BatchProcessingOptions = {}) {
  try {
    const totalTasks = tasks.length

    for (let i = 0; i < totalTasks; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize).map(task => call(task))
      await Promise.all(batch)
    }
  }
  catch (error) {
    console.error('executeInBatches:', error)
    throw error
  }
}
