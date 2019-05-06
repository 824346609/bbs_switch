<template>
  <div class="total">
    <Nav></Nav>
     <div v-if="article._id" class="main">
      <div class="content">
        <div class="main_left">
          <!-- <div class="left_bor">
            <div class="left_header">
            回复: 1123123123123
            </div>
            <div class="left_content">
              <div class="left_id">张鹏宇</div>
              <div class="left_port"></div>
              <div class="left_info">
                <div class="topc">
                  <div class="tnum">111</div>
                  <div class="title">帖子</div>
                </div>
                <div class="date">注册时间:2012-1-18</div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="main_right">
          <!-- <div class="right_bor">
            <div class="right_header">
            {{article.title}}
            </div>
            <div class="right_content">
                <div class="right_date">发表于{{formatDate(article.createTime)}}</div>
                <div class="article">
                  <div class="article_detail">
                    123123123123123333333333333333333333333333333333333
                  </div>
                  <div class="article_info">本主题由{{this.$store.state.currentUser}}最后编辑于{{formatDate(article.createTime)}}</div>
                  <div class="article_collection">
                    <div class="collection">收藏</div>
                  </div>
                </div>
            </div>
            <div class="reply">回复</div>
          </div> -->
          </div>
       </div>
       </div>
        <!-- <p>{{article.title}}<span class="date">{{formatDate(article.createTime)}}</span></p>
        <div class="bar">
          分类：<Tag @click.native="searchByCategory(article.categoryId._id)" type="border" color="primary">{{article.categoryId.categoryName}}</Tag>
          标签：<Tag @click.native="searchByTag(tag._id)" v-for="tag in article.tagId" :key="tag.id" color="primary">{{tag.tagName}}</Tag>
        </div>
        <div class="container">
          <mavonEditor class="markdown" codeStyle="dark" :value="article.content" :toolbarsFlag="toolbarsFlag" :subfield="toolbarsFlag" defaultOpen="preview"></mavonEditor>
          <div class="toc">
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin> -->
     </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import { Card, Tag, Spin } from 'iview'
import Nav from '../components/navigation/navigation'
import moment from 'moment'
import { genToc } from '@/assets/js/utils.js'
import { getArticleDetail } from '@/assets/js/api.js'
export default {
  components: {
    mavonEditor,
    Card,
    Tag,
    Spin,
    Nav
  },
  data () {
    return {
      id: '',
      toolbarsFlag: false,
      article: {},
      loading: false,
      tocShow: true
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.fetchArticle(this.id)
  },
  methods: {
    fetchArticle (id) {
      this.loading = true
      getArticleDetail({ id }).then(res => {
        this.loading = false
        if (res.errcode === 0) {
          this.article = res.data
          // 生成目录
          // this.$nextTick(() => {
          //   genToc('.v-show-content', '.toc')
          // })
        }
      })
    },
    searchByCategory (id) {
      // 去搜索结果页
      this.$router.push(`/SearchList/1/${id}`)
    },
    searchByTag (id) {
      // 去搜索结果页
      this.$router.push(`/SearchList/2/${id}`)
    }
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  text-decoration: none;
}
.total {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
/* .main {
  height: 100%;
  width: 100%;
}
.content {
  width: 100%;
  height: 100%;
} */
.main_left {
  background-color: #fff;
  /* position: absolute;
  right: 70%;
  left: 0;
  width: 15%;
  height: 1em;
  background-color: aqua;
  float: left; */
}
.main_right {
  /* position: absolute;
  left: 15%;
  right: 0;
  float: left;
  height: 6em;
  width: 85%;
  background-color: yellow; */
}
.left_bor {
  width: 100%;
  box-sizing: border-box;
  padding: 0 1em;
}
.left_header {
  height: 10%;
  padding: .5em 0;
  color: grey;
  border-bottom: 3px solid #ced5e2;
}
.left_content {
  box-sizing: border-box;
  padding: .5em;
}
.left_id {
  box-sizing: border-box;
  padding-bottom: .5em;
  border-bottom: 1px dashed #cdcfd4;
}
.left_port {
  height: 125px;
  width: 125px;
  background-color: black;
  margin: .5em auto;
}
.title, .tnum {
    padding: .25em 0;
    font-size: 12px;
}
.date {
  padding-top: .25em;
  font-size: 12px;
  padding-bottom: .5em;
}
.right_bor {
  width: 100%;
  box-sizing: border-box;
  padding: 0 1em;
}
.right_header {
  height: 10%;
  padding: .5em 0;
  color: grey;
  border-bottom: 3px solid #ced5e2;
  text-align: left;
}
.right_date {
  font-size: 12px;
  box-sizing: border-box;
  padding-bottom: .5em;
  border-bottom: 1px dashed #cdcfd4;
  text-align: left;
}
.right_content {
  box-sizing: border-box;
  padding: .5em 0;
}
.article {
  width: 100%;
  border-bottom: 1px dashed #cdcfd4;
}
.article_detail {
  text-align: left;
  padding-top: .5em;
  word-wrap:break-word;
}
.article_info {
  padding: 3rem 0 5em 0;
  font-size: 12px;
}
.article_collection {
  width: 100%;
  padding-bottom: .5em;
}
.collection {
  text-align: center;
  width: 60px;
  height: 30px;
}
.reply {
  padding: .2em 0 .5em 0;
  font-size: 12px;
  text-align: left;
  height: 10em;
}
</style>
