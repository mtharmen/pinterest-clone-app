<template>
  <div>
    <loading v-if="loading" />
    <div v-if="!loading && !error">
      <app-board-wall />
    </div>
    <div class="alert alert-danger text-center" v-if="error"><strong>Error:</strong> {{ error }}</div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import BoardWall from '@/components/BoardWall'
import boardStore from '@/boardStore'
import { allBoards$ } from '@/http-request'

export default {
  name: 'home',
  components: {
    'loading': Loading,
    'app-board-wall': BoardWall
  },
  data () {
    return {
      loading: true,
      error: ''
    }
  },
  created () {
    this.getBoards()
  },
  watch: {
    '$route': function () {
      this.getBoards()
    }
  },
  methods: {
    getBoards () {
      this.loading = true
      this.error = ''
      allBoards$()
        .then(res => {
          this.loading = false
          boardStore.addBoard(res.data, 'intialize')
        })
        .catch(err => {
          this.loading = false
          console.error(err)
          this.error = 'Could not connect to server, try again later'
        })
    }
  }
}
</script>

<style scoped>
</style>
