<template lang="pug">
  v-card.mx-auto.mt-5(max-width="475")
    v-toolbar(color="teal" dark)
      v-toolbar-title To-Do-List
    v-list(subheader min-height="150")
      v-col.mb-2(col=8)
        v-text-field(
          v-model="task"
          placeholder="Add new tasks"
          hide-details
          @keyup.enter="createTask()"
        )
          template(v-slot:append-outer)
            v-icon(
              @click="createTask()"
              v-show="task !== ''"
            ) mdi-plus-circle
      v-divider
      div(v-if="tasks && tasks.length > 0")
        v-subheader Tasks
          span.pl-2(v-show="tasks.length > 0") ( {{ `${completed.length} of ${tasks.length}` }} )
        v-list-item(v-for="(item, index) in tasks")
          template
            v-list-item-action
              v-checkbox(
                v-model="item.active"
                color="primary" 
                @click.native="handleCompletedTask(item.id)"
              )
            v-list-item-content(max-width="300")
              v-list-item-title(
                v-show="item.id !== editTaskId || !item.selected"
                @click="selectTask(item.id, index)"
              ) {{ item.title }}
              v-text-field.pt-0(
                v-show="item.id === editTaskId"
                v-model="newTitle"
                :placeholder="item.title"
                hide-details
                @blur="editTaskTitle(item.id, index)"
                @keyup.enter="editTaskTitle(item.id, index)"
              )
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
      task: '',
      newTitle: '',
      editTaskId: ''
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
    clearEdit() {
      this.newTitle = ''
      this.editTaskId = ''
    },
    editTaskTitle(taskId, taskIndex,) {
      if (this.newTitle !== '') {
        this.tasks[taskIndex].title = this.newTitle
        const data = {
          id: taskId,
          title: this.newTitle
        }
        api.List.updateTask(data)
      }
      this.tasks[taskIndex].selected = false
      this.clearEdit()
    },
    selectTask(taskId, taskIndex) {
      this.editTaskId = taskId
      this.tasks[taskIndex].selected = true
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
            active: status === 'completed' 
          }
        }
        return task
      })
      const data = this.tasks.filter((task) => task.id === taskId)[0]
      api.List.createTask(data)
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
      if (this.task !== '') {
        const data = {
          title: this.task,
          id: this.setTaskId(),
          status: type,
          active: false,
          created_time: new Date()
        }

        api.List.createTask(data)
        this.tasks.push(data)
        this.clearInput()
      }
    },
    removeTask(taskId) {
      const completedIndex = this.completed.indexOf(taskId) < 0 ? null : this.completed.indexOf(taskId)
      let taskIndex = 0
      this.tasks.forEach((item, index) => {
        if (item.id === taskId) taskIndex = index
      })
      if (completedIndex !== null) this.completed.splice(completedIndex, 1)
      if (taskIndex !== null) this.tasks.splice(taskIndex, 1)

      api.List.removeTask(taskId)
    },
  },
}
</script>

<style>
.mdi-trash-can {
  cursor: pointer;
}
.mdi-trash-can:hover {
  color: #000;
}
</style>
