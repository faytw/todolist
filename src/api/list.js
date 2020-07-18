import { db } from '../plugins/firebase'
const tasksRef = db.collection('tasks')

export function createTask(data) {
  const { id } = data 
  return new Promise((resolve, reject) => {
    tasksRef.doc(`${id}`).set({ data }, { merge: true }).then(() => {
      resolve()
    }).catch((err) => reject(err))
  })
}

export function getTasks() {
  return new Promise((resolve, reject) => {
    tasksRef.get().then((docSnapshot) => {
      if (!docSnapshot.empty) {
        const docs = docSnapshot.docs
        let tasks = []
        docs.forEach((doc) => {
          tasks.push(doc.data().data)
        })
        resolve(tasks)
      } else {
        resolve([])
      }
    }).catch((err) => reject(err))
  })
}

export function removeTask(taskId) {
  return new Promise((resolve, reject) => {
    tasksRef.doc(`${taskId}`).delete().then(() => {
      resolve()
    }).catch((err) => reject(err))
  })
}

export default {
  createTask,
  getTasks,
  removeTask,
}
