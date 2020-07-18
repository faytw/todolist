<template lang="pug">
  v-app
    v-main
      list/
</template>

<script>
import List from './components/List'

export default {
  name: 'App',
  components: {
    List,
  },
}
</script>
