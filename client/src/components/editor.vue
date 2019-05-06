<template>
  <div>
    <el-card shadow="hover" class="topic" :body-style="bodyStyle">
      {{topic}}
    </el-card>
    <div class="form-item flex-wrapper">
      <span>帖子标题：</span>
      <el-input class="title" v-model="article.title" placeholder="请输入内容"></el-input>
    </div>
    <!-- <div class="form-item align">
      <span>文章分类：</span>
      <el-select
      class="selector"
      v-if="categories.length > 0"
      v-model="article.category"
      placeholder="请选择分类">
        <el-option
          v-for="item in categories"
          :key="item.value"
          :label="item.categoryName"
          :value="item._id">
        </el-option>
      </el-select>
    </div> -->
    <div class="form-item">
      <mavon-editor
      id="mark"
      ref="md"
      v-model="comment.content"
      codeStyle="atom-one-dark"
      @imgAdd="imgAdd"
      @change="markdownChange"
      class="mark-editor"/>
    </div>
    <el-button type="primary" @click="submit">发布</el-button>
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
        block: '',
        userName: '',
        category: '',
        content: '',
        status: 0
      },
      comment: {
        cid: '',
        first: false,
        articleId: null,
        parentId: null,
        userId: null,
        replyName: null,
        userName: '',
        content: '',
        html: '',
        block: '',
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
      default: '新建帖子'
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
    this._fetchComment()
    this._fetchOptions()
    this._initData()
    // 去服务端生成七牛token
    this.fetchUploadToken()
  },
  methods: {
    _fetchComment () {
      this.comment.articleId = this.$route.params.id
      this.comment.parentId = null
      // 用来判断是不是第一条评论
      this.comment.first = true
      if (this.comment.articleId) {
        this.$axios.post('/getCommentById', this.comment).then(res => {
          this.comment = res.data
        })
      }
    },
    // 获取选项数据
    _fetchOptions () {
      this.$axios('/getArticleOptions').then(res => {
        this.categories = res.data.categoryList
      })
    },
    _initData () {
      this.article.category = this.detail.categoryId ? this.detail.categoryId._id : ''
      this.article.block = this.$route.params.name
      this.comment.block = this.$route.params.name ? this.$route.params.name : this.comment.block
      this.comment.content = this.detail.content || ''
      this.article.title = this.detail.title || ''
      this.comment.userName = this.$store.state.currentUser
      this.article.id = this.detail._id || ''
      this.article.userName = this.$store.state.currentUser
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
    submit () {
      this.article.status = 0
      this.comment.status = 0
      this.postArticle()
    },
    postArticle () {
      this.loading = Loading.service({ fullscreen: true })
      this.article.content = this.comment.content
      this.$axios.post('/postArticle', this.article)
        .then(res => {
          this.loading.close()
          if (res.errcode === 0) {
            console.log(res.data.id)
            this.comment.articleId = res.data.id
            // console.log()
            this.$axios.post('/postComment', this.comment)
              .then(resC => {
                if (resC.errcode === 0) {
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  })
                  console.log(this.comment)
                  setTimeout(() => {
                    this.$router.push({name: 'articleDetail', params: {id: this.comment.articleId, name: this.comment.block}})
                  }, 1000)
                }
              })
            // if (res.data.id) {
            //   // 清空文章内容
            //   this.article = {
            //     id: null,
            //     title: '',
            //     category: '',
            //     status: 0
            //   }
            //   this.$router.push(`editArticle/${res.data.id}`)
            // }
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
