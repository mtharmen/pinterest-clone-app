<template>
  <div id="app">
    <div id="wrapper">
      <app-header>
        <b-nav is-nav-bar slot="nav-items" class="ml-auto">
          <b-nav-item v-if="user.username" :to="'/' + user.username"><i class="fa fa-th" aria-hidden="true"></i> My Boards</b-nav-item>
          <b-nav-item v-if="!user.username" @click="login">
            <i class="fa fa-sign-in" aria-hidden="true"></i> Login
          </b-nav-item>
          <b-nav-item v-if="user.username" @click="logout">
            <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
          </b-nav-item>
        </b-nav>
      </app-header>
      <div id="content" class="container">
        <router-view></router-view>
      </div>
    </div>
    <app-footer>
      <small>
        <a href="https://www.freecodecamp.com/challenges/build-a-pinterest-clone" target="_blank">FCC Pinterest Clone App</a> | 
        <a href="https://github.com/mtharmen/pinterest-clone-app" target="_blank"> GitHub Repo <i className="fa fa-github" aria-hidden="true"></i></a> | 
        <a href="http://fontawesome.io/" target="_blank"> Icons from Font Awesome <i className="fa fa-font-awesome" aria-hidden="true"></i></a> | 
        <a href="https://bootswatch.com/darkly/" target="_blank"> Darkly Theme from Bootswatch</a>
      </small>
    </app-footer>
  </div>
</template>

<script>
// import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import userStore from '@/userStore'
import router from '@/router/index'
import { login$ } from '@/http-request'

export default {
  name: 'app',
  components: {
    'app-header': Header,
    'app-footer': Footer
  },
  data () {
    return {
      user: userStore.user
    }
  },
  created () {
    const redirectTo = localStorage.getItem('redirectTo')
    if (redirectTo) {
      localStorage.removeItem('redirectTo')
      login$()
        .then(res => {
          userStore.login(res.data)
          router.push(redirectTo)
        })
        .catch(err => {
          console.error(err)
          router.push(redirectTo)
        })
    }
    if (userStore.checkToken()) {
      userStore.setUserInfo()
    } else {
      userStore.removeLocalStorage()
    }
  },
  methods: {
    login () {
      localStorage.setItem('redirectTo', this.$route.fullPath)
      window.location.href = 'http://localhost:8080/auth/twitter'
    },
    logout () {
      userStore.logout()
      router.push('/')
    }
  }
}
</script>

<style>
  #wrapper {
      min-height: 100vh;
  }

  .navbar {
      margin-bottom: 20px;
  }

  #content {
      overflow: auto;
      padding-bottom: 50px;
  }

  .footer {
      text-align: center;
      position: relative;
      margin-top: -50px;
      height: 50px;
      clear: both;
      padding-top: 10px;
  }
  /* Fix for vue-bootstrap modals */
  .modal.show {
    display:block;
  }
</style>
