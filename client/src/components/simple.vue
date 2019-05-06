<template>
  <div class="total">
    <Nav></Nav>
    <div class="content">
      <div class="article_header">
        <table>
          <tbody>
            <tr>
              <td class="pls">
                <div><span>回复:{{sumList}}</span></div>
              </td>
              <td class="plc">
                <h1>{{article.title}}</h1>
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
            :art='article'>
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
      </div>
    </div>
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import { Card, Tag, Spin } from 'iview'
import Nav from '../components/navigation/navigation'
import Art from '../components/article'
import moment from 'moment'
export default {
  components: {
    mavonEditor,
    Card,
    Tag,
    Spin,
    Nav,
    Art
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
    // this.id = this.$route.params.id
    this.fetchArticle(this.$route.params.aId)
    this.fetchSimple(this.$route.params.id, this.$route.params.aId)
  },
  methods: {
    fetchArticle (id) {
      this.$axios.post('/p/getArticleDetail', {
        id
      }).then(res => {
        this.article = res.data
      })
    },
    fetchSimple (id, aId) {
      this.$axios.post('/simple', {
        aId,
        uId: id,
        page: this.page
      }).then(res => {
        this.comment = res.data.list
        this.sumList = res.data.count
      })
    },
    formatDate (date) {
      return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.fetchComment(this.id)
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
  background-color: yellow;
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
</style>
<style>
.el-pagination {
    margin-top: 1em;
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
}
</style>
