<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  mounted () {
    console.log(sessionStorage.getItem('token'))
    console.log(sessionStorage.getItem('username'))
  }
}
</script>

<style lang="scss">
@import './assets/style/public-class.scss';
</style>
