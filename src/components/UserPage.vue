<template>
  <div>
    <h1 v-if="!userPage">
      {{ $route.params.username }}'s Boards
    </h1>
    <div v-if="userPage">
      <ul class="nav nav-pills nav-fill mb-2">
        <li class="nav-item fake-pointer" @click="tabSwitch('mine')">
          <a class="nav-link" :class="tab === 'mine' ? 'active' : ''">My Boards</a>
        </li>
        <li class="nav-item fake-pointer" @click="tabSwitch('likes')">
          <a class="nav-link" :class="tab === 'likes' ? 'active' : ''">Boards I Liked</a>
        </li>
      </ul>
    </div>
    <!-- <loading v-if="loading" /> -->
    <div v-if="!loading && !error">
      <button class="btn btn-primary mb-2" @click="showModal" v-if="tab === 'mine' && userPage">Add Board</button>
      <app-board-wall :userPage="userPage"/>
    </div>
    <div class="alert alert-danger text-center" v-if="error"><strong>Error:</strong> {{ error }}</div>
    <add-board-modal ref="addBoardModal"/>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import BoardWall from '@/components/BoardWall'
import AddBoardModal from '@/components/AddBoardModal'
import userStore from '@/userStore'
import boardStore from '@/boardStore'
import { allBoards$, likedBoards$ } from '@/http-request'

export default {
  name: 'user-page',
  components: {
    'loading': Loading,
    'app-board-wall': BoardWall,
    'add-board-modal': AddBoardModal
  },
  data () {
    return {
      loading: true,
      tab: 'mine',
      error: ''
    }
  },
  created () {
    this.getBoards()
  },
  watch: {
    '$route': function () {
      console.log(this.$route)
      this.getBoards()
    }
  },
  computed: {
    userPage () {
      return this.$route.params.username === userStore.user.username
    }
  },
  methods: {
    getBoards () {
      this.loading = true
      this.error = ''
      allBoards$(this.$route.params.username)
        .then(res => {
          this.loading = false
          boardStore.addBoard(res.data, 'intialize')
        })
        .catch(err => {
          this.loading = false
          console.error(err)
          this.error = err.message
        })
    },
    getLikedBoards () {
      this.loading = true
      this.error = ''
      likedBoards$()
        .then(res => {
          this.loading = false
          boardStore.addBoard(res.data, 'intialize')
        })
        .catch(err => {
          this.loading = false
          console.error(err)
          this.error = err.message
        })
    },
    showModal () {
      this.$refs.addBoardModal.showModal()
    },
    tabSwitch (type) {
      if (this.tab === type) { return }
      this.tab = type
      if (type === 'likes') {
        this.getLikedBoards()
      } else {
        this.getBoards()
      }
    }
  }
}
</script>

<style scoped>
  .fake-pointer {
    cursor: pointer;
    user-select: none;
  }
</style>
