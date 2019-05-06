<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"/>
    <img :src="back_img"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    if (this.$store.state.currentUser) {
      this.fetchBadge()
      this.fetchCollection()
    }
  },
  methods: {
    fetchBadge () {
      this.$axios.get('/getBadge')
        .then(res => {
          let notice = ''
          if (res.data.badge === true) {
            notice = 'new'
            sessionStorage.setItem('badge', notice)
            sessionStorage.setItem('updateTime', res.updateTime)
            this.$store.dispatch('setBadge', notice)
            this.$store.dispatch('setUpdate', res.data.updateTime)
          }
        })
    },
    fetchCollection () {
      console.log(this.$store.state.auth)
      this.$axios.post('/collectionDate', { time: this.$store.state.collection })
        .then(res => {
          let notice = ''
          if (res.data === true) {
            notice = 'new'
            sessionStorage.setItem('collectionBadge', notice)
            this.$store.dispatch('setCollectionBadge', notice)
          }
        })
    }
  }
}
</script>

<style>
*{
  margin: 0px;
  padding: 0px;
  border-width: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
