<template>
  <Header />
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import Header from './components/Sidebar.vue'
export default {
  created() {
    this.getUsers()
    this.getPosts()
    console.log(this.posts)
  },
  methods: {
    ...mapActions([
      'getUsers',
      'getPosts'
    ])
  }
}
</script>

<style lang="scss" scoped></style>