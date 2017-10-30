export default {
  store: {
    boards: []
  },
  likeBoard (_id, like) {
    // TODO: find a better way?
    this.store.boards.forEach(board => {
      if (board._id === _id) {
        board.likes += like ? 1 : -1
        board.liked = like
      }
    })
  },
  addBoard (board, intialize = false) {
    const base = intialize ? [] : this.store.boards
    const add = intialize ? board : [board]
    this.store.boards = [...base, ...add]
  },
  removeBoard (_id) {
    this.store.boards = this.store.boards.filter(board => board._id !== _id)
  },
  userBoardsOnly (username) {
    this.store.boards = this.store.boards.filter(board => board.owner === username)
  }
}
