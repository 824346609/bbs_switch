<template>
    <div>
        <Header></Header>
        <div class="container">
            <div class="Cont_L">
                <el-button round @click="baseInfo">基础资料</el-button>
                <el-button round @click="modify">修改密码</el-button>
                <el-button round @click="myTopic">我的帖子</el-button>
                <el-button round @click="myComment">我的评论</el-button>
                <el-badge :value="this.$store.state.collectionBadge" class="item">
                    <el-button round @click="collection">我的收藏</el-button>
                 </el-badge>
                <el-badge :value="this.$store.state.badge" class="item">
                    <el-button round :type='type' @click="reply">回复我的</el-button>
                </el-badge>
            </div>
            <div class="Cont_R">
              <div v-for='item in replyList' :key="item._id">
                <Com
                :reply="item">
                </Com>
              </div>
              <div class="pagination-wrapper">
              <el-pagination
                @current-change="handlePageChange"
                background
                :page-size="7"
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
import Header from './personal'
import Com from './beReply'
import '../../assets/css/userInfo.css'
import moment from 'moment'
import { Loading } from 'element-ui'
export default {
  data () {
    return {
      type: '',
      articleList: [],
      selectedList: [],
      keyword: '',
      page: 1,
      status: 1,
      sumList: 0,
      replyList: {}
    }
  },
  mounted () {
    this.higtlight()
    this.getReplyList()
    this.update()
  },
  components: {
    Header,
    Com
  },
  methods: {
    higtlight () {
      if (this.$route.name === 'reply') {
        this.type = 'primary'
      }
    },
    getReplyList () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getReplyList', {
        page: this.page,
        nickName: this.$store.state.currentUser
      }).then(res => {
        this.loading.close()
        this.replyList = res.data.list
        console.log(this.replyList)
        // this.articleList = res.data.list
        this.sumList = res.data.count
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update () {
      this.$axios.post('/updateUser', {
        badge: false
      }).then(res => {
        sessionStorage.setItem('badge', '')
        sessionStorage.setItem('updateTime', Date())
        this.$store.dispatch('setBadge', '')
        this.$store.dispatch('setUpdate', Date())
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    baseInfo () {
      this.$router.push({name: 'personal', params: { id: this.$route.params.id }})
    },
    modify () {
      this.$router.push({name: 'modify', params: { id: this.$route.params.id }})
    },
    myTopic () {
      this.$router.push({name: 'myTopic', params: { id: this.$route.params.id }})
    },
    myComment () {
      this.$router.push({name: 'myComment', params: { id: this.$route.params.id }})
    },
    reply () {
      this.$router.push({name: 'reply', params: { id: this.$route.params.id }})
    },
    collection () {
      this.$router.push({name: 'collection', params: { id: this.$route.params.id }})
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.getReplyList()
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style scoped>
.del-batch {
  margin-top: 1em;
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
</style>
