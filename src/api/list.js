import { db } from '../plugins/firebase'
const tasksRef = db.collection('tasks')

export function createTask(data) {
  const { id } = data 
  return new Promise((resolve, reject) => {
    tasksRef.doc(`${id}`).set(data, { merge: true }).then(() => {
      resolve()
    }).catch((err) => reject(err))
  })
}

export function getTasks() {
  return new Promise((resolve, reject) => {
    db.collection('tasks').orderBy('created_time', 'asc').get().then((querySnapshot) => {
      let tasks = []
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data())
      })
      resolve(tasks)
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

export function updateTask(data) {
  const { id , title } = data 
  return new Promise((resolve, reject) => {
    tasksRef.doc(`${id}`).set({title}, { merge: true }).then(() => {
      resolve()
    }).catch((err) => reject(err))
  })
}

export default {
  createTask,
  getTasks,
  removeTask,
  updateTask,
}
