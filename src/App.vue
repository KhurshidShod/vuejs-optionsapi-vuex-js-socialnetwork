<template>
  <router-view></router-view>
  <Teleport v-if="isCreateModalOpen" to="body">
    <CreatePost></CreatePost>
  </Teleport>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import Header from './components/Sidebar.vue'
import CreatePost from './components/CreatePost.vue';
export default {
  data() {
    return {
      isCreateModalOpen: false,
    }
  },
  components: {
    Header,
    CreatePost
  },
  created() {
    this.getUsers()
    this.getPosts()
    this.getMessages()
    this.$eventBus.$on('createModalOpened', (data) => this.isCreateModalOpen = data);
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