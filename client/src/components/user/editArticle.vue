<template>
    <articleForm v-if="detail._id" :topic="topic" :detail="detail">
    </articleForm>
</template>

<script>
import articleForm from '../editor'
// import { Loading } from 'element-ui'
import { getArticleDetail } from '@/assets/js/api.js'
export default {
  components: {
    articleForm
  },
  data () {
    return {
      topic: '编辑文章',
      detail: {},
      isDraft: true
    }
  },
  computed: {
  },
  mounted () {
    this.id = this.$route.params.id
    // console.log(this.$route.params)
    this.fetchArticle(this.id)
  },
  methods: {
    fetchArticle (id) {
      // this.loading = true
      getArticleDetail({ id }).then(res => {
        // this.loading = false
        if (res.errcode === 0) {
          this.detail = res.data
          console.log(this.detail)
          // 生成目录
          // this.$nextTick(() => {
          //   genToc('.v-show-content', '.toc')
          // })
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
