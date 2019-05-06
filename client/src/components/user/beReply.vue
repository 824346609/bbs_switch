<template>
    <div class="content">
        <div class="art">
            <div class="address" @click="detail()">[帖子]{{art.title}}</div>
        </div>
        <div class="user">
            <div class="name">[用户]{{reply.userName}}</div>
            <div class="date">{{formatDate(reply.createTime)}}</div>
        </div>
        <!-- 回复内容 -->
        <div class="reply">
            <!-- 被回复内容 -->
            <div class="comment">
                <div class="cComment" v-if="cComment.status !==1">{{cComment.content}}</div>
                <div class="cComment delete" v-if="cComment.status ===1">评论已被删除</div>
            </div>
           <div class="rComment">{{reply.content}}</div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      cComment: {},
      art: {}
    }
  },
  props: {
    reply: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.fetchComment(this.reply.parentId)
    this.fetchArticle(this.reply.articleId)
  },
  methods: {
    fetchComment (id) {
      if (id) {
        this.$axios.post('/getCommentById', {id: id}).then(res => {
          this.cComment = res.data
          console.log(this.cComment)
        // this._fetchUser(this.userId)
        })
      }
    },
    fetchArticle (id) {
      this.$axios.post('/p/getArticleDetail', {id: id}).then(res => {
        if (res.errcode === 0) {
          this.art = res.data
        //   console.log(this.art)
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
    detail () {
      this.$router.push({name: 'articleDetail', params: { id: this.reply.articleId, name: 'masterHunter' }})
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
    display: inline-block;
    width: 100%;
}
.name {
    padding-top: .5em;
    padding-left: 3.5em;
    text-align: left;
    display: inline-block;
    width: 50%
}
.date {
   padding-top: .5em;
   text-align: right;
   display: inline-block;
   width: 40%;
}
.content {
    background-color: white;
    border-bottom: 1px solid black;
}
.comment {
    padding: 1em 4em;
    line-height: 23px;
}
.cComment {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 1em 0;
    background-color: #f5f5f5;
}
.rComment {
    padding-bottom: 1em;
    padding-left: 4em;
    text-align: left;
}
.address {
    padding-left: .2em;
    padding-top: .5em;
    text-align: left;
    cursor: pointer;
    color: #2686c0;
}
.delete {
  font-weight: 900;
}
</style>
<style>

</style>
