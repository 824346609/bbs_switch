<template>
<div class="">
  <table>
    <tbody>
      <td class="pls"></td>
      <td>
        <div class="form-item">
          <mavon-editor
            id="mark"
            ref="md"
            v-model="comment.content"
            @imgAdd="imgAdd"
            @change="markdownChange"
            defaultOpen="edit"
            codeStyle="atom-one-dark"
            class="mark-editor"/>
          <el-button type="primary" @click="submit">发表评论</el-button>
        </div>
      </td>
    </tbody>
  </table>
</div>
</template>
<script>
import * as qiniu from 'qiniu-js'
export default {
  data () {
    return {
      comment: {
        articleId: '',
        parentId: null,
        userId: null,
        replyName: '',
        userName: '',
        html: '',
        content: '',
        block: '',
        status: 0
      }
    }
  },
  props: {
    art: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this._initData()
    this.fetchUploadToken()
  },
  methods: {
    _initData () {
      this.comment.articleId = this.$route.params.id
      this.comment.block = this.$route.params.name
      this.comment.userName = this.$store.state.currentUser
      this.comment.replyName = this.art.userName
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
    postComment () {
      // console.log(this.comment)
      this.$axios.post('/postComment', this.comment)
        .then(res => {
          if (res.errcode === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(0)
            }, 1000)
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
    submit () {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: 'error',
          message: '请先登录!'
        })
        return
      }
      this.comment.status = 0
      this.postComment()
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
<style>
* {
  padding: 0;
  margin: 0;
  text-decoration: none;
  word-wrap: break-word;
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
.el-pagination {
    margin-bottom: 9px;
}
</style>
<style lang='stylus' scoped>
.topic
  font-size 22px
  font-weight bold
  color #79a1fb
.form-item
  margin 1px 0 10px
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
  height 200px
  margin-bottom 1em
</style>
