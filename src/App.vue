<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import Header from './components/Sidebar.vue'
export default {
  components: {
    Header
  },
  created() {
    this.getUsers()
    this.getPosts()
    this.getMessages()
  },
  methods: {
    ...mapActions([
      'getUsers',
      'getPosts',
      'getMessages'
    ])
  }
}
</script>

<style lang="scss" scoped></style>