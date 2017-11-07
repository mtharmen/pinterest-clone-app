<template>
  <div>
    <slot></slot>
    <!-- Modal -->
    <b-modal size="lg" id="boardModal" hide-header noCloseOnBackdrop noCloseOnEsc ref="boardModal" @shown="clear">
      <div class="card">
        <img class="card-image-top image" :src="board.image" @error="brokenImage">
        <hr />
        <div class="card-body">
          <div class="card-text text-center">{{ board.description }}</div>
        </div>
        <div class="card-footer">
          <div class="text-center">
            <router-link :to="'/user/' + board.owner" @click.native="close">@{{ board.owner }}</router-link>
          </div>
          <button class="btn btn-sm pull-right" :class="likeClass" :disabled="!username" @click="like">
            <i class="fa" :class="board.liked ? 'fa-thumbs-down' : 'fa-thumbs-up'" aria-hidden="true"></i>
          </button>
          <i class="fa fa-thumbs-up" aria-hidden="true"></i> × {{ board.likes }}
        </div>
      </div>
      <div class="alert alert-danger text-center" v-if="error"><strong>Error: </strong> {{ error }}</div> 
      <div class="input-group mt-2" v-if="username === board.owner">
        <input type="text" class="form-control" placeholder="Enter the description to delete your board" v-model="confirm" />
        <div class="input-group-btn">
          <button class="btn btn-danger" @click="remove" :disabled="submitting || confirm !== board.description">
            <span v-if="!submitting">Remove</span>
            <span v-if="submitting">Removing</span>
            <loading v-if="submitting"/>
          </button>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-warning pull-right" @click="close" v-if="!submitting">Close</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import boardStore from '@/boardStore'
import brokenImg from '@/assets/broken.png'
import { removeBoard$ } from '@/http-request'

export default {
  name: 'add-board-modal',
  props: ['username'],
  components: {
    'loading': Loading
  },
  data () {
    return {
      board: {},
      confirm: '',
      submitting: false,
      error: ''
    }
  },
  computed: {
    likeClass () {
      return this.board.liked && this.username ? 'btn-danger' : 'btn-primary'
    }
  },
  methods: {
    showModal (board) {
      this.board = board
      this.$refs.boardModal.show()
    },
    clear () {
      // TODO: find a better way to clear data
      this.submitting = false
      this.error = ''
      this.confirm = ''
      // this.$validator.reset()
    },
    like () {
      this.$emit('like', this.board._id)
    },
    brokenImage (e) {
      e.target.src = brokenImg
      // this.board.image = errorImg
    },
    submit () {
      setTimeout(() => {
        this.submitting = false
        console.log('removed')
      }, 1000)
    },
    remove () {
      // TODO: Fix, failing on OPTIONS request
      this.submitting = true
      removeBoard$(this.board._id)
        .then(res => {
          this.submitting = false
          boardStore.removeBoard(this.board._id)
          this.close()
        })
        .catch(err => {
          this.submitting = false
          this.error = err.message
          console.error(err)
        })
    },
    close () {
      if (!this.submitting) {
        this.$refs.boardModal.hide()
      }
    }
  }
}
</script>

<style scoped>
  .image {
    display: block;
    width: 100%;
    max-height: 1000px;
    height: auto;
  }
</style>
