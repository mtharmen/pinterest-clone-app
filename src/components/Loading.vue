<template>
  <span>
    <slot></slot>
    <img class="mx-auto" src="../assets/loading.svg">
  </span>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped>
  img {
    margin: -20px auto;
    width: 50px;
  }
</style>
