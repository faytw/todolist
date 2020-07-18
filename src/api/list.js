// import { db } from '../plugins/firebase'

export function createTask(data) {
  console.log('create', data)
}

export function getTasks() {
  console.log('getList')
}

export function removeTask(taskId) {
  console.log('remove', taskId)
}

export default {
  createTask,
  getTasks,
  removeTask,
}
