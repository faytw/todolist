<template lang="pug">
  v-card.mx-auto.mt-5(max-width="475")
    v-toolbar(color="teal" dark)
      v-toolbar-title To-Do-List
    v-list(subheader min-height="400")
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
              v-model="item.active"
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
      val.forEach((task) => {
        const type = task.status
        const taskId = task.id
        switch(type) {
          case 'completed':
            if (this.completed.indexOf(taskId) < 0) this.completed.push(taskId)
            break
        }
      })
    }
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
        console.log('completed' , taskId)
        this.completed.push(taskId)
        this.handleTaskStatus(taskId, 'completed')
      } else {
                console.log('doing' , taskId)

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
            active: status === 'completed' 
          }
        }
        return task
      })
      const data = this.tasks.filter((task) => task.id === taskId)[0]
      api.List.createTask(data).then(() => {
        this.getTasks()
      })
    },
    getTasks() {
      this.clearData()
      api.List.getTasks().then((tasks) => {
        if (tasks && tasks.length > 0) {
          this.tasks = tasks
        }
      }) 
    },
    createTask(type = 'doing') {
      const data = {
        title: this.task,
        id: this.setTaskId(),
        status: type,
        active: false,
        created_time: new Date()
      }
      api.List.createTask(data)

      this.clearInput()
      this.getTasks()
    },
    removeTask(taskId) {
      api.List.removeTask(taskId).then(() => {
        this.getTasks()
      })
    },
  },
}
</script>
