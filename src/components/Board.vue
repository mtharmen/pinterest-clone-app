<template>
  <div class="card">
    <img class="card-img-top" :src="board.image" @error="brokenImage" @click="detail">
    <div class="card-body">
      <div class="card-text description">{{ board.description }}</div>
    </div>
    <div class="card-footer">
      <div class="text-center">
        <router-link :to="'/' + board.owner">@{{ board.owner }}</router-link>
      </div>
      <button class="btn btn-sm pull-right" :class="likeClass" :disabled="!username" @click="like">
        <i class="fa" :class="board.liked ? 'fa-thumbs-down' : 'fa-thumbs-up'" aria-hidden="true"></i>
      </button>
      <i class="fa fa-thumbs-up" aria-hidden="true"></i> × {{ board.likes }}
    </div>
  </div>
</template>

<script>
import brokenImg from '@/assets/broken.png'

export default {
  name: 'board',
  props: ['board', 'username'],
  computed: {
    likeClass () {
      return this.board.liked && this.username ? 'btn-danger' : 'btn-primary'
    }
  },
  methods: {
    like () {
      this.$emit('like', this.board._id)
    },
    detail () {
      this.$emit('detail', this.board._id)
    },
    brokenImage () {
      this.board.image = brokenImg
    },
    remove () {
      console.log('removing ' + this.board._id)
    }
  }
}
</script>

<style scoped>
  .description {
    font-style: italic;
  }
</style>