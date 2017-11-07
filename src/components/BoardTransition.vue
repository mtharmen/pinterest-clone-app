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
  .fade-enter-active {
    animation: grow .5s;
    animation-timing-function: ease-out;
  }
  .fade-leave-active {
    animation: grow .5s;
    animation-timing-function: ease-out;
    animation-direction: reverse;
  }
  /* .fade-enter, .fade-leave-to {
    opacity: 0
  } */

  @keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
