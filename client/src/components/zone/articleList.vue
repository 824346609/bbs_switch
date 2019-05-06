<template>
    <div class="main_content">
        <Nav></Nav>
        <div class="main">
            <div class="partInfo">
                    <div class="nav_content">
                         <i class="el-icon-my-shouye"> > <a href="http://www.baidu.com">怪物猎人</a></i>
                    </div>
                    <div class="nav_info">
                        <div class="nav_bor">
                            <div class="nav_title"><p>{{this.$route.params.name}}</p></div>
                            <div class="nav_auth">
                                版主:
                            <span class="moderator" v-for="item in userList" :key="item._id" @click="userInfo(item._id)">{{item.nickName}}</span>
                            </div>
                            <div class="publish" @click="publish">发帖</div>
                        </div>
                    </div>
            </div>
             <div class="articleInfo">
                <div class="th">
                     <div class="art_detail">
                         <div class="detail">
                             <Top></Top>
                         </div>
                    </div>
                </div>
            </div>
            <div class="pushArt">
            </div>
        </div>
    </div>
</template>
<script>
import Nav from '../../components/navigation/navigation'
import Top from './topic'
export default {
  data () {
    return {
      userList: []
    }
  },
  components: {
    Nav,
    Top
  },
  mounted () {
    this.fetchModerator()
  },
  methods: {
    publish () {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: 'error',
          message: '请先登录!'
        })
        return
      }
      this.$router.push({name: 'editor', params: { name: this.$route.params.name }})
    },
    fetchModerator () {
      this.$axios.post('/getModerator', {
        block: this.$route.params.name
      }).then(res => {
        this.userList = res.data
      })
    },
    userInfo (id) {
      this.$router.push({name: 'userDetail', params: { id }})
    }
  }
}
</script>
<style scoped>
.main {
    position: absolute;
    top:4em;
    left: 0;
    right: 0;
    width: 100%;
    min-height: 40em;
    padding: .5em 1em 0;
    box-sizing: border-box;
    background-color: #9bcdfc;
    overflow: hidden;
}
.partInfo {
    width: 100%;
    height: 15%;
}
.nav_content {
    height: 18%;
    background-color: white;
    width: 100%;
}
.el-icon-my-shouye {
    margin: .3em 0 0 1.5em;
    width: 100%;
    text-align: left;
}
.nav_info {
    padding: .5em 1.5em;
    background-color: white;
    max-height: 82%;
    height: auto;
    border-bottom: 2px solid #cdcdcd;
}
.nav_bor {
    border: 1px solid black;
    min-height: 6em;
    height: auto;
    width: 100%;
}
.nav_title {
    margin: .5em 0 0 1.5em;
    width: 100%;
    text-align: left;
}
.nav_title > p {
    font-weight: 700;
    font-size: 16px;
}
.nav_auth {
    width: 100%;
    text-align: left;
    margin: .3em 0 0 1.5em;
}
.articleInfo {
    height: 100%;
    background-color: white;
    padding: .5em 1.5em 0;
}
.th {
    height: auto;
    /* min-height: */
    width: 100%;
    border: 1px solid #cdcdcd;
}
.art_header {
    height: 1.8em;
    width: 100%;
    background-color: #f2f2f2;
}
.dis {
     display: inline-block;
     text-align: left;
}
.topic {
    width: 65%;
}
.by {
    width: 9%;
}
.num {
    width: 9%;
}
.art_detail {
    box-sizing: border-box;
    padding: 0 1.5em;
    height: 100%;
    width: 100%;
    /* background-color: black; */
}
.detail {
    height: 100%;
    /* background-color: red; */
}
table {
    width: 100%;
    border-spacing: 0;
}
.icon {
    width: 2%;
    /* background-color: black; */
}
.art_title {
    width: 68%;
    /* background-color: yellow; */
}
.art_by {
    width: 10%;
    /* background-color: green; */
}
.art_num {
    width: 10%;
    /* background-color: blue; */
}
.art {
    text-align: left;
}
td,th {
    padding: 5px 0;
    border-bottom: 1px solid #C2D5E3;
}
.page {
    width: 100%;
}
.pushArt {
    /* height: 15em; */
    width: 100%;
}
.publish {
    float: left;
    margin: .3em 0 0 1.5em;
    padding: .75em;
    border-radius: 10px;
    cursor: pointer;
    background-color: aqua
}
.moderator {
    padding: 0 .5em;
}
.moderator:hover {
    cursor: pointer;
}
.valid > input:first-child{
  height:3.2em;
}
</style>
