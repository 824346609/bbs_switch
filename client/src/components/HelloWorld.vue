<template>
<div>
   <Nav></Nav>
   <p>12123123123123123{{msg}}</p>
</div>
</template>
<script>
import Nav from './navigation/navigation'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: this.$store.state.currentUser
    }
  },
  components: {
    Nav
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  margin: 0px;
  padding: 0px;
  border-width: 0px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
