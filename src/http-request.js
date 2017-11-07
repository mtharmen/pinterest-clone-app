/* global localStorage */
import axios from 'axios'
import userStore from '@/userStore'
import router from '@/router/index'

// TODO: Add global error handler
// https://github.com/axios/axios/issues/367

const baseURL = window.location.hostname !== 'localhost' ? window.location.origin : 'http://localhost:8080'
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000
})

// Error intercept
instance.interceptors.response.use(null, err => {
  if (err.response.status === 500) {
    window.location.href = baseURL + '/error?code=500'
    // return Promise.reject(err)
  }
  if (err.response.data.message === 'No User Found') {
    userStore.logout()
    router.push('/')
  }
  return Promise.reject(err.response.data)
})

function setHeaders () {
  return { headers: { 'authorization': 'Bearer ' + (localStorage.getItem('token') || '') } }
}

export function twitterLogin$ () {
  window.location.href = baseURL + '/auth/twitter'
}

// Auth stuff
export function getUser$ (userInfo) {
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
