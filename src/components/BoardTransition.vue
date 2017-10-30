<template>
  <transition appear name="fade">
    <slot></slot>
  </transition>
</template>

<script>
// TODO: Better animation
// taken from https://vuejs.org/v2/guide/transitions.html
export default {
  name: 'board-transition'
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
