<template>
  <div>
    <el-card shadow="hover" class="topic" :body-style="bodyStyle">
      {{topic}}
    </el-card>
    <div class="form-item">
      <!-- markdown插件 -->
      <!-- @change="markdownChange" -->
      <mavon-editor
      id="mark"
      ref="md"
      v-model="comment.content"
      codeStyle="atom-one-dark"
      @imgAdd="imgAdd"
      @change="markdownChange"
      class="mark-editor"/>
    </div>
    <el-button type="primary" @click="submit">发表评论</el-button>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import * as qiniu from 'qiniu-js'
export default {
  data () {
    return {
      aaa: false,
      // 现有的所有分类
      categories: [],
      // 现有的所有标签
      article: {
        id: null,
        title: '',
        category: '',
        content: '',
        status: 0
      },
      comment: {
        cid: '',
        content: '',
        html: '',
        status: 0
      },
      bodyStyle: {
        padding: '10px'
      }
    }
  },
  props: {
    topic: {
      type: String,
      default: '新建文章'
    },
    detail: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
  },
  mounted () {
    this._initData()
    // 去服务端生成七牛token
    this.fetchUploadToken()
  },
  methods: {
    // 获取选项数据
    _initData () {
      this.comment.cid = this.$route.params.id
      this.article.category = this.detail.categoryId ? this.detail.categoryId._id : ''
      this.comment.content = this.detail.content || ''
      this.article.title = this.detail.title || ''
      this.comment.userName = this.$store.state.currentUser
      this.article.id = this.detail._id || ''
    },
    submit () {
      this.comment.status = 0
      this.postComment()
    },
    postComment () {
      this.loading = Loading.service({ fullscreen: true })
      this.article.content = this.comment.content
      // this.comment.articleId = res.data.id
      this.$axios.post('/postComment', this.comment)
        .then(res => {
          this.loading.close()
          if (res.errcode === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    markdownChange (markdown, html) {
      this.comment.html = html
    },
    fetchUploadToken () {
      this.$axios.get('/getQiniuToken')
        .then(res => {
          if (res.errcode === 0) {
            this.token = res.data.token
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    imgAdd (pos, file) {
      this.file = file
      this.pos = pos
      let key = this.file.name
      // 调用七牛的接口将图片上传至七牛
      let observable = qiniu.upload(this.file, key, this.token)
      observable.subscribe(this.uploadNext, this.uploadError, this.uploadComplete)
      return false
    },
    uploadNext (res) {
      // ...
    },
    uploadError (err) {
      alert(err)
    },
    uploadComplete (res) {
      // 取得七牛返回的url
      let url = 'http://pkqrw6esw.bkt.clouddn.com/' + res.key
      // 将url插入markdown
      this.$refs.md.$img2Url(this.pos, url)
    }
  }
}
</script>
<style scoped>
.align {
    text-align: left;
}
</style>
<style lang='stylus' scoped>
.topic
  font-size 22px
  font-weight bold
  color #79a1fb
.form-item
  margin 10px 0
  .selector
    width 500px
.flex-wrapper
  display flex
  flex-wrap nowrap
  span
    line-height 38px
    margin-right 4px
  .title
    flex 1
.mark-editor
  height 500px
</style>
