<template>
  <div>
    <el-card shadow="hover" class="topic" :body-style="bodyStyle">
      {{topic}}
    </el-card>
    <div class="form-item flex-wrapper">
      <span>回复内容</span>
      <el-input class="content" :disabled="true" v-model="pComment"></el-input>
    </div>
    <div class="form-item align">
      <span>回复人:</span>
      <el-input
      class="user"
     v-model="pName"
      :disabled="true">
      </el-input>
    </div>
    <div class="form-item">
      <!-- markdown插件 -->
      <mavon-editor
      id="mark"
      ref="md"
      v-model="remark"
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
      userId: '',
      userName: '',
      pName: '',
      pComment: '',
      remark: '',
      // 现有的所有标签
      comment: {
        articleId: null,
        parentId: null,
        userId: null,
        userName: '',
        replyName: '',
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
      default: '回复评论'
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
    // this._fetchOptions()
    // this._
    console.log(this.detail)
    this._initData()
    this._fetchComment()
    // 去服务端生成七牛token
    this.fetchUploadToken()
  },
  methods: {
    // 获取选项数据
    _fetchOptions () {
      this.$axios('/getArticleOptions').then(res => {
        this.categories = res.data.categoryList
      })
    },
    _initData () {
    //   this.comment.category = this.detail.categoryId ? this.detail.categoryId._id : ''
      this.comment.content = this.detail.content || ''
      this.comment.content = this.detail.block
      //   this.comment.title = this.detail.title || ''
      this.comment.id = this.detail._id || ''
    },
    _fetchComment () {
      this.$axios.post('/getCommentById', {id: this.$route.params.id}).then(res => {
        // console.log(res.data)
        this.pComment = res.data.content
        this.comment.articleId = res.data.articleId
        this.comment.block = this.$route.params.name
        this.comment.parentId = this.$route.params.id
        this.comment.userName = this.$store.state.currentUser
        this.comment.replyName = res.data.userName
        this.pName = res.data.userName
        // this._fetchUser(this.userId)
      })
    },
    submit () {
      this.comment.status = 0
      this.postComment()
    },
    postComment () {
      this.loading = Loading.service({ fullscreen: true })
      this.comment.content = this.remark
      console.log(this.comment)
      this.$axios.post('/postComment', this.comment)
        .then(res => {
          this.loading.close()
          if (res.errcode === 0) {
            // if (res.data.id) {
            //   // 清空文章内容
            //   this.comment = {
            //     id: null,
            //     content: '',
            //     html: '',
            //     status: 0
            //   }
            //   this.$router.push(`editComment/${res.data.id}`)
            // }
            this.$message({
              message: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push({name: 'articleDetail', params: { id: this.$route.params.aid, name: this.$route.params.name }})
            }, 1500)
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
  .user
    width 500px
.flex-wrapper
  display flex
  flex-wrap nowrap
  span
    line-height 38px
    margin-right 4px
  .content
    flex 1
.mark-editor
  height 400px
</style>
