<template>
    <div>
        <Nav></Nav>
        <div class="main">
          <div class="header">
            <div class="bg_img">
              <img />
            </div>
            <div class="portrait" id="portrait" v-bind:style="{backgroundImage:'url(' + userInfo.imgUrl + ')'}">
              <img />
            </div>
            <div class="personInfo">
              <div class="name">
                <p>您好,{{this.$store.state.currentUser}}</p>
              </div>
            </div>
            <!-- <div class="slide">
            </div> -->
          </div>
        </div>
    </div>
</template>
<script>
import Nav from '../navigation/navigation'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.fetchUserInfo(this.$store.state.userId)
    this._initUrl()
  },
  methods: {
    fetchUserInfo (id) {
      this.$axios.post('/getUserById', {
        id: id
      }).then(res => {
        this.userInfo = res.data
        console.log(this.userInfo)
      })
    },
    _initUrl () {
      console.log(this.userInfo.imgUrl)
      if (!this.userInfo.imgUrl) {
        this.userInfo.imgUrl = 'http://user.3dmgame.com/data/avatar/007/71/09/06_avatar_middle.jpg'
      }
    }
  }
}
</script>
<style scoped>
* {
  text-decoration: none;
}
.main {
  position: absolute;
  text-align: center;
  top: 6.8em;
  bottom: 0;
  left: 10%;
  right: 10%;
  max-width: 100%;
  width: 79.2%;
}
.header {
  height: 38%;
  width: 98.6%;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, .2);
}
.bg_img {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  width: 1000px;
  height: 130px;
  overflow: hidden;
}
.bg_img > img {
  width: 1000px;
  min-height: 130px;
  background-image: url('../../assets/blue.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}
.portrait {
  position: relative;
  width: 150px;
  height: 150px;
  top: 34px;
  left: 32px;
  border-radius: 50%;
  z-index: 1;
  overflow: hidden;
  /* background-image: url(http://pkqrw6esw.bkt.clouddn.com/QQ20181121-0.jpg); */
  background-size: cover;
  /* background: #FFF url(http://bbs.3dmgame.com/static/image/common/midavt_shadow.gif) 0 100% repeat-x; */
}
.personInfo {
  width: 760px;
  height: 100px;
  position: absolute;
  z-index: 2;
  left: 220px;
  top: 30px;
  line-height: 50px;
  text-align: left;
}
.container {
  position: absolute;
  top: 50%;
  height: 100%;
  width: 79.2%;
  left: 10%;
  right: 10%;
  max-width: 100%;
  background-color: greenyellow
}
.name {
  font-size: 24px;
  color: white;
  width: 100%;
  height: 50px;
}
.interest {
  line-height: 40px;
  color: white;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
}
.slide {
  width: 820px;
  height: 40px;
  line-height: 40px;
  margin-left: 180px;
  background-color: black;
}
.Cont_L {
  width: 182px;
  height: auto;
  min-height: 200px;
  background: white;
  float: left;
}
.link > p {
  cursor: pointer;
  margin: 20px auto 0;
  width: 155px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  text-align: center;
  font-size: 16px;
  background-color: #f3f3f3;
}
.link > p:hover {
  background-color: #1997fc;
}
.link > p:active {
  background-color: #1997fc;
}
.router-link-active {
    color: black;
}
</style>
