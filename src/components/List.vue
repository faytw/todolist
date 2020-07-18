<template lang="pug">
  v-card.mx-auto.mt-5(max-width="475")
    v-toolbar(color="teal" dark)
      v-toolbar-title To-Do-List
    v-list(subheader min-height="200")
      v-col.mb-2(col=8)
        v-text-field(
          v-model="task"
          placeholder="Add new tasks"
          hide-details
        )
          template(v-slot:append-outer)
            v-icon(
              @click="createTask()"
              v-show="task !== ''"
            ) mdi-plus-circle
      v-divider
      v-subheader Doing 
        span.pl-2(v-show="tasks.length > 0") ( {{ `${completed.length} of ${tasks.length}` }} )
      v-list-item(v-for="item in tasks")
        template
          v-list-item-action
            v-checkbox(
              v-model="item.status==='completed'"
              color="primary" 
              @click.native="handleCompletedTask(item.id)"
            )
          v-list-item-content(max-width="300")
            v-list-item-title {{ item.title }}
          v-list-item-icon(@click="removeTask(item.id)")
            v-icon mdi-trash-can
</template>

<script>
import { setUuId } from '@/plugins/uuid.js'
import api from '@/api'

export default {
  name: 'ToDoList',
  data() {
    return {
      init: false,
      completed: [],
      tasks: [],
      task: ''
    }
  },
  mounted() {
    this.getTasks()
  },
  beforeDestroy() {
    this.clearData()
  },
  watch: {
    tasks(val) {
      if (val && val.length > 0) this.init = true
    },
    completed(val) {
      if(val && val.length > 0) {

      }
    },
  },
  methods: {
    clearData() {
      this.tasks = []
      this.completed = []
    },
    clearInput() {
      this.task = ''
    },
    setTaskId() {
      return setUuId()
    },
    handleCompletedTask(taskId) {
      if (this.completed.indexOf(taskId) < 0) {
        this.completed.push(taskId)
        this.handleTaskStatus(taskId, 'completed')
      } else {
        const taskIndex = this.completed.indexOf(taskId)
        this.completed.splice(taskIndex, 1)
        this.handleTaskStatus(taskId, 'doing')
      }
    },
    handleTaskStatus(taskId, status) {
      this.tasks = this.tasks.map((task, index) => {
        if (task.id === taskId) {
          task = {
            ...task,
            status,
          }
        }
        return task
      })
    },
    getTasks() {
      if (this.init) this.clearData()

      const tasks = api.List.getTasks()
      if (tasks && tasks.length > 0) {
        this.tasks = tasks
        tasks.forEach((task) => {
        const type = task.status
        const taskId = task.id
        switch(type) {
          case 'completed':
            this.completed.push(taskId)
            break
          }
        })
      }
    },
    createTask(type = 'doing') {
      const data = {
        title: this.task,
        id: this.setTaskId(),
        status: type,
        created_time: new Date()
      }
      api.List.createTask(data)

      this.clearInput()
      this.getTasks()
    },
    removeTask(taskId) {
      const completedIndex = this.completed.indexOf(taskId) < 0 ? null : this.completed.indexOf(taskId)
      let taskIndex = 0
      this.tasks.forEach((item, index) => {
        if (item.id === taskId) taskIndex = index
      })
      if (completedIndex) this.completed.splice(completedIndex, 1)
      if (taskIndex) this.tasks.splice(taskIndex, 1)

      api.List.removeTask(taskId)
      this.getTasks()
    },
  },
}
</script>
