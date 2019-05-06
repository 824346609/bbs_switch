<template>
  <div class="total">
    <Nav></Nav>
    <div class="content" v-if="article.status===0">
      <div class="article_header">
        <table>
          <tbody>
            <tr>
              <td class="pls">
                <div><span>回复:{{this.sumList}}</span></div>
              </td>
              <td class="plc">
                <h1>{{article.title}}
                  <span class="top" v-if="(this.$store.state.auth===this.$route.params.name)&&article.top==='false'" @click="topHandle(article._id)">加精</span>
                  <span class="top" v-if="(this.$store.state.auth===this.$route.params.name)&&article.top==='true'" @click="canHandle(article._id)">取消加精</span>
                </h1>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td class="bor_pls">
              </td>
              <td class="bor_plc">
              </td>
            </tr>
          </tbody>
        </table>
        <div v-for='item in comment' :key="item._id">
          <Art
            :comments='item'
            :art='article'
            >
          </Art>
        </div>
        <el-pagination
                @current-change="handlePageChange"
                background
                :page-size="10"
                :current-page="page"
                layout="prev, pager, next, jumper"
                :total="sumList">
        </el-pagination>
          <Rep
          :art='article'>
          </Rep>
      </div>
    </div>
  </div>
</template>
<script>
import Nav from '../components/navigation/navigation'
import Art from '../components/article'
import Rep from '../components/reply'
import moment from 'moment'
import {
  getCommentList,
  getArticleDetail
}
  from '@/assets/js/api.js'
export default {
  components: {
    Nav,
    Art,
    Rep
  },
  data () {
    return {
      id: '',
      toolbarsFlag: false,
      comment: {},
      article: {},
      loading: false,
      tocShow: true,
      page: 1,
      sumList: 0
    }
  },
  mounted () {
    console.log(this.$route.params)
    this.id = this.$route.params.id
    this.fetchArticle(this.id)
    this.fetchComment(this.id)
  },
  methods: {
    fetchArticle (id) {
      this.loading = true
      getArticleDetail({ id }).then(res => {
        this.loading = false
        if (res.errcode === 0) {
          this.article = res.data
          if (res.data.status === 1) {
            this.$message({
              duration: 2000,
              message: res.msg,
              type: 'error'
            })
          }
        }
      })
    },
    fetchComment (id) {
      this.loading = true
      getCommentList({ id, page: this.page }).then(res => {
        this.loading = false
        if (res.errcode === 0) {
          this.comment = res.data.list
          this.sumList = res.data.count
          // 生成目录
          // this.$nextTick(() => {
          //   genToc('.v-show-content', '.toc')
          // })
        }
      })
    },
    formatDate (date) {
      return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.fetchComment(this.id)
    },
    topHandle (id) {
      this.$confirm('此操作将把文章加精, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定发送删除请求
        this.$axios.post('/topHandle', {
          id
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          setTimeout(() => {
            this.$router.go(0)
          }, 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    canHandle (id) {
      this.$confirm('此操作将取消文章加精, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定发送删除请求
        this.$axios.post('/canHandle', {
          id
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          setTimeout(() => {
            this.$router.go(0)
          }, 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  text-decoration: none;
  word-wrap: break-word;
}
.content {
  width: 100%;
  height: 100%;
  padding: .5em 1em;
  box-sizing: border-box;
}
.article_header {
  border: 1px solid #CDCDCD;
  background: #FFF;
}
.article_header table {
  width: 100%;
  border-collapse: collapse;
}
.pls {
  width: 160px;
  font-size: 12px;
  padding: .5em 0;
  background-color: #E5EDF2;
  overflow: hidden;
  border-right: 1px solid #C2D5E3;
}
.plc {
  padding: 0 20px;
  text-align: left;
  box-sizing: content-box;
}
.plc h1 {
  padding: .5em 0;
  font-weight: 900;
}
.bor_pls {
  background: #C2D5E3;
  padding: 0;
  height: 4px;
  width: 160px;
  overflow: hidden;
  border-right: 1px solid #C2D5E3;
}
.bor_plc {
  background: #E5EDF2;
}
.top {
  float: right;
  cursor: pointer;
}
</style>
<style>
.el-pagination {
    margin-top: 1em;
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
}
.form-item {
  /* padding: 2em 0; */
}
</style>
