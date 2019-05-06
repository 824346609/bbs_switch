<template>
   <div>
        <Nav></Nav>
        <div class="main">
            <div class="searchBtn">
                <div class="searchSpace">
                    <el-button type="success" id="loginBtn">主要按钮</el-button>
                    <el-button type="success" id="forgetPass">忘记密码</el-button>
                    <el-button type="success" id="quickRegis">快速注册</el-button>
                </div>
                <el-button type="warning" round id="searchBtn" @click="search">搜索</el-button>
                <el-input v-model="input" placeholder="请输入想要搜索内容" id="search"  prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="nav_content">
                <div class="homeIcon">
                    <i class="el-icon-my-shouye"> > <a href="http://www.baidu.com">123123</a></i>
                </div>
            </div>
            <div class="total_content">
                <div class="totalIcon">
                    <i class="el-icon-my-tongji"></i>
                    <i class="hot">今日:</i><i>1</i>
                    <i class="hot">昨日:</i><i>2</i>
                </div>
            </div>
            <div class="category">
                <div class="hot_cate"><i class="el-icon-my-qingdan"></i>热门板块</div>
                <!-- <div v-for="(item, index) in blockList" :key='index'>
                  <Block
                  :block="item"
                  :index="index">
                  </Block>
                </div> -->
                <div class="table_cate">
                    <table class="fl_tb">
                    <tbody>
                        <tr>
                            <Block
                            v-if="flag"
                            :block="blockList"></Block>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div class="foot_content">
                <div>
                    <p class="foot_info">
                        <a href="plugin.php?id=msgboard:post">联系总编</a><span class="pipe">|</span><a href="mailto:dwkf@yy.com">举报邮箱：dwkf@yy.com</a>
                        <span class="pipe">|</span><a href="archiver/">Archiver</a><span class="pipe">|</span><a href="forum.php?mobile=yes">游戏论坛</a>
                        <span class="pipe">|</span><a href="http://www.duowan.com/" target="_blank">游戏论坛</a><span class="pipe">|</span>
                        <a href="http://video.duowan.com/" target="_blank">游戏论坛</a><span class="pipe">|</span><strong><a href="http://bbs.duowan.com/" target="_blank">多玩游戏论坛</a>
                        </strong>( <a href="http://www.miitbeian.gov.cn/" target="_blank">粤B2-*******   粤ICP备*******号 粤通管BBS【2008】第006号</a> )
                    </p>
                </div>
                <div>
                    <p class="foot_info">
                        <span id="debuginfo">
                         GMT+8, 2018-11-15 13:49
                        , Processed in 0.020637 second(s), Total 0, Slave 0 queries
                        , Memcache On.
                        </span>
                    </p>
                </div>
                <div>
                    <img src="../assets/report.png">
                </div>
                </div>
            </div>
        </div>
   </div>
</template>
<script>
import Nav from '../components/navigation/navigation'
import Block from '../components/block'
export default {
  data () {
    return {
      input: '',
      blockList: [],
      flag: false
    }
  },
  components: {
    Nav,
    Block
  },
  mounted () {
    this.fetchBlockList()
  },
  methods: {
    search () {
      this.$router.push({name: 'search', params: { key: this.input }})
    },
    fetchBlockList () {
      this.$axios.get('/getBlockList')
        .then(res => {
          this.blockList = res.data
          this.flag = true
        })
    }
  }
}
</script>
<style scoped>
* {
    text-decoration: none;
    font: 12px/1.5 Tahoma,Helvetica,'SimSun',sans-serif;
}
.main {
    background-image: url("../assets/MHW.jpg");
    position: absolute;
    height: 100%;
    background-repeat:no-repeat;
    background-size: cover;
    top: 4.8em;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    /* overflow: hidden; */
}
.searchBtn {
    width: 100%;
    height: 10%;
}
.searchSpace {
    height: 100%;
    float: left;
}
.nav_content {
    box-sizing: content-box;
    height: 5%;
    width: 100%;
    color: white;
}
.homeIcon {
    float: left;
    padding-left: 2em;
}
.total_content {
    box-sizing: content-box;
    height: 5%;
    width: 100%;
    color: white;
}
.totalIcon {
    float: left;
    padding-left: 2em;
    box-sizing: content-box;
}
.category {
    height: 40%;
    width: 100%;
    float: left;
    padding: 0 1em;
    box-sizing: border-box;
}
.hot_cate {
    height: 10%;
    width: 100%;
    background-color: #535353;
    color: white;
    font-weight: 900;
    font-size: 1.5em;
}
.hot_cate i {
    font-size: 1em;
}
.table_cate {
    /* width: 100%; */
    height: 100%;
    background-color: white;
}
table {
    border-collapse: collapse;
}
.fl_tb {
    width: 100%;
}
.forum-info-box {
    width: 100%;
}
.fl_g dt a {
    font-weight: 700;
    font-size: 14px;
    /* float: left; */
    margin-right: 5px;
}
table.forum-info-box td.forum-icon-box {
    width: 1%;
}
.fl_tb td {
    padding: 10px 0;
    background: #FFF url(http://att.bbs.duowan.com/static/image/common/dwbg_td.png) repeat-x 0 100%;
    border: 0 none!important;
}
table.forum-info-box td {
    padding: 0!important;
    background: none!important;
    vertical-align: top;
}
table.forum-info-box td.forum-icon-box {
    padding: 0!important;
    background: none!important;
    vertical-align: top;
}
.foot_content {
    width: 100%;
    height: 70%;
    background-color: rgba(0, 0, 0, .7);
}
.foot_content > div {
    padding: 1em 0;
}
.foot_info a,span{
    color: white;
}
</style>
<style>
.searchBtn > div:nth-child(3) {
    width: 30%;
    float: right;
}
#search {
    width:100%;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    border:1px solid rgba(255,255,255,.5);
    outline: none;
}
/* .el-input__inner:focus {
    outline: none;
    border:1px solid rgba(255,255,255,.5);
} */
#searchBtn {
    float: right;
}
#loginBtn {
    margin-left: 2em;
    background-color: rgba(103,194,58,.6);
}
#forgetPass {
    background-color: rgba(103,194,58,.1);
    border:1px solid rgba(255,255,255,0);
}
#quickRegis {
    background-color: rgba(103,194,58,.1);
    border:1px solid rgba(255,255,255,0);
}
.area {
    cursor: pointer;
}
.el-button.is-round {
    /* margin: .5em 0; */
    border-radius: 20px;
    padding: 12px 23px;
}
</style>
