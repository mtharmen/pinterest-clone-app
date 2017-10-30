<template>
  <div>
    <slot></slot>
    <!-- Modal -->
    <b-modal size="lg" id="addBoardModal" hide-header noCloseOnBackdrop noCloseOnEsc ref="addBoardModal" @shown="clear">
      <div class="card">
        <img class="card-image-top image" :src="board.image" @error="brokenImage">
        <hr />
        <div class="card-body">
          <div class="form-group">
            <!-- Image -->
            <!-- TODO: Add ability to upload images -->
            <div class="input-group">
              <input type="text" name="image" class="form-control" placeholder="Image Link" v-model="tempImage" v-validate="'size:1000'"/>
              <span class="input-group-btn">
                <button class="btn btn-success" @click="imageSubmit">Add Image</button>
              </span>
            </div>
            <span v-show="errors.has('image')" class="text-danger">{{ errors.first('image') }}</span>
            <br>
            <!-- Description -->
            <input type="text" name="description" class="form-control" placeholder="Give A Short Description" v-model="board.description" v-validate="'required|max:50'"/>
            <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
          </div>
        </div>
      </div>
      <div class="alert alert-danger text-center" v-if="error"><strong>Error: </strong> {{ error }}</div>
      <div slot="modal-footer">
        <button class="btn btn-warning" @click="close" v-if="!submitting">Cancel</button>
        <loading v-if="submitting"/>
        <button class="btn btn-success" @click="add" :disabled="invalid">
          <span v-if="!submitting">Submit</span>
          <span v-if="submitting">Submitting</span>
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import boardStore from '@/boardStore'
import errorImg from '@/assets/error.png'
import { addBoard$ } from '@/http-request'

export default {
  name: 'add-board-modal',
  props: ['type'],
  components: {
    'loading': Loading
  },
  data () {
    return {
      board: {
        image: undefined,
        description: ''
      },
      tempImage: undefined,
      submitting: false,
      error: ''
    }
  },
  computed: {
    invalid () {
      return !this.board.image || this.board.image === errorImg || this.errors.any()
    }
  },
  methods: {
    showModal () {
      this.$refs.addBoardModal.show()
    },
    clear () {
      // TODO: find a better way to clear data
      this.board.image = undefined
      this.board.description = ''
      this.tempImage = undefined
      this.submitting = false
      this.error = ''
      this.$validator.reset()
    },
    brokenImage (e) {
      this.board.image = errorImg
    },
    imageSubmit () {
      // TODO: Find how to do check the image size
      this.board.image = this.tempImage
    },
    add () {
      this.submitting = true
      addBoard$(this.board.image, this.board.description)
        .then(res => {
          this.submitting = false
          boardStore.addBoard(res.data)
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
        this.$refs.addBoardModal.hide()
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
