<template>
  <div>
    <div class="alert alert-danger text-center" v-if="error"><strong>Error: </strong> {{ error }}</div> 
    <div class="card-columns" v-if="store.boards.length">
      <template v-for="(board, i) in store.boards">
        <board-transition :key="i">
          <app-board :board="board" :username="user.username" :userPage="userPage" @like="like" @detail="detail" />
        </board-transition>
      </template>
    </div>
    <div class="alert alert-warning text-center" v-if="!store.boards.length">
      No Boards Found
      <!-- {{ $route.params.username === user.username ? 'You have no boards' : $route.params.username + ' has no boards' }} -->
    </div>
    <board-modal :username="user.username" @like="like" ref="boardModal" />
  </div>
</template>

<script>
import Board from '@/components/Board'
import BoardTransition from '@/components/BoardTransition'
import BoardModal from '@/components/BoardModal'
import userStore from '@/userStore' // TODO: redundant?
import boardStore from '@/boardStore'
import { updateLikes$ } from '@/http-request'

export default {
  name: 'board-wall',
  props: ['userPage'],
  components: {
    'app-board': Board,
    'board-transition': BoardTransition,
    'board-modal': BoardModal
  },
  data () {
    return {
      user: userStore.user,
      store: boardStore.store,
      error: ''
    }
  },
  methods: {
    like (_id) {
      //  TODO: Remove board from likes page if unliked
      this.error = ''
      updateLikes$(_id)
        .then(res => {
          boardStore.likeBoard(_id, res.data)
        })
        .catch(err => {
          console.error(err)
          this.error = 'Cannot update likes at this time'
        })
    },
    detail (_id) {
      const board = this.store.boards.filter(board => board._id === _id)[0]
      this.$refs.boardModal.showModal(board)
    }
  }
}
</script>

<style scoped>
</style>