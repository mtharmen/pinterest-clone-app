/* global localStorage */

export default {
  user: {
    username: '',
    twitter: '',
    role: ''
  },

  login (userInfo) {
    this.setLocalStorage(userInfo)
    this.setUserInfo(userInfo)
  },
  logout () {
    this.removeLocalStorage()
  },
  setLocalStorage (userInfo) {
    localStorage.setItem('token', userInfo.token)
    localStorage.setItem('exp', userInfo.exp)
    localStorage.setItem('username', userInfo.username)
    localStorage.setItem('twitter', userInfo.twitter)
    localStorage.setItem('role', userInfo.role)
  },
  setUserInfo (userInfo = false) {
    userInfo = userInfo || {
      username: localStorage.getItem('username'),
      email: localStorage.getItem('twitter'),
      role: localStorage.getItem('role')
    }
    this.user.username = userInfo.username
    this.user.twitter = userInfo.twitter
    this.user.role = userInfo.role
  },
  removeLocalStorage () {
    localStorage.removeItem('token')
    localStorage.removeItem('exp')
    localStorage.removeItem('username')
    localStorage.removeItem('twitter')
    localStorage.removeItem('role')
    Object.keys(this.user).forEach(field => {
      this.user[field] = ''
    })
  },
  checkToken () {
    const exp = localStorage.getItem('exp') ? JSON.parse(localStorage.getItem('exp') * 1000) : 0
    return Date.now() < exp
  },
  checkAdmin () {
    return localStorage.getItem('role') === 'admin'
  }
}
