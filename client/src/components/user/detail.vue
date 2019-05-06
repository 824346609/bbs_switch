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
                <p>{{userInfo.nickName}}</p>
              </div>
              <!-- <div class="interest">
                爱好游戏:
              </div> -->
            </div>
            <!-- <div class="slide">
            </div> -->
          </div>
        </div>
            <div class="container">
            <div class="Cont_L">
              <el-button round @click="topic" :type='type'>TA的帖子</el-button>
              <el-button round @click="reply">TA的回复</el-button>
            </div>
            <div class="Cont_R">
                            <el-table
                ref="multipleTable"
                :data="articleList"
                tooltip-effect="dark"
                :default-sort = "{prop: 'date', createTime: 'descending'}"
                @selection-change="handleSelectionChange"
                style="width: 100%"
              >
              <el-table-column
                ref="test"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="createTime"
                sortable
                label="日期"
                :formatter="timeFormatter"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="title"
                align="center"
                label="文章标题"
                width="250"
              >
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button type="success" icon="el-icon-delete" @click="detail(scope.row._id,scope.row.block)">查看</el-button>
                </template>
              </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              @current-change="handlePageChange"
              background
              :current-page="page"
              layout="prev, pager, next, jumper"
              :total="sumList">
            </el-pagination>
          </div>
            </div>
          </div>
    </div>
</template>
<script>
import Nav from '../navigation/navigation'
import '../../assets/css/userInfo.css'
import { Loading } from 'element-ui'
import moment from 'moment'
export default {
  data () {
    return {
      userInfo: {},
      type: '',
      articleList: [],
      selectedList: [],
      keyword: '',
      page: 1,
      status: 1,
      sumList: 0
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.highlight()
    this.fetchUserInfo(this.$route.params.id)
  },
  methods: {
    fetchUserInfo (id) {
      this.$axios.post('/getUserById', {
        id
      }).then(res => {
        this.userInfo = res.data
        this.getArticleList()
      })
    },
    highlight () {
      if (this.$route.name === 'userDetail') {
        this.type = 'primary'
      }
    },
    topic () {
      this.$router.push({name: 'userTopic', params: { id: this.$route.params.id }})
    },
    reply () {
      this.$router.push({name: 'userComment', params: { id: this.$route.params.id }})
    },
    getArticleList () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getArticleListByUserName', {
        page: this.page,
        id: this.userInfo.nickName
      }).then(res => {
        this.loading.close()
        this.articleList = res.data.list
        this.sumList = res.data.count
      })
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.getArticleList()
    },
    handleSelectionChange (val) {
      this.selectedList = val.map(item => {
        return item._id
      })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
    },
    detail (id, block) {
      this.$router.push({name: 'articleDetail', params: { id, name: block }})
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
<style>
.el-button.is-round {
    margin: .5em 0;
    border-radius: 20px;
    padding: 12px 23px;
}
.el-button+.el-button {
    margin:.5em 0;
}
.el-pagination {
    margin-top: 1em;
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
}
.el-badge__content.is-fixed {
    top: 10px;
    right: 20px;
}
.el-table__row {
  cursor: pointer;
}
.cell {
  max-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
