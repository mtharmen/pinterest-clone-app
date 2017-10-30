/* global localStorage */
import axios from 'axios'
import userStore from '@/userStore'

// TODO: Add global error handler
// https://github.com/axios/axios/issues/367

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

instance.interceptors.response.use(null, err => {
  if (err.response.status === 500) {
    window.location.href = 'http://localhost:8080/error?code=500'
    // return Promise.reject(err)
  }
  if (err.response.message === 'No User Found') {
    userStore.logout()
    window.location.href('/')
  }
  return Promise.reject(err.response.data)
})

function setHeaders () {
  return { headers: { 'authorization': 'Bearer ' + (localStorage.getItem('token') || '') } }
}

// Auth stuff
export function login$ (userInfo) {
  return instance.get('/auth/get-user', { withCredentials: true })
}

// Board Stuff
export function allBoards$ (username = '') {
  return instance.get('/api/allBoards/' + username, setHeaders())
}
export function likedBoards$ () {
  return instance.get('/api/likedBoards', setHeaders())
}
export function addBoard$ (image, description) {
  return instance.post('/api/addBoard', { image, description }, setHeaders())
}
export function removeBoard$ (_id) {
  return instance.delete('/api/removeBoard/' + _id, setHeaders())
}
export function updateLikes$ (_id) {
  return instance.put('/api/updateLikes/' + _id, {}, setHeaders())
}
