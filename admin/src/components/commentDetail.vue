<template>
    <div>
      <el-card shadow="hover" class="topic" :body-style="bodyStyle">
      {{topic}}
      </el-card>
        <mavonEditor class="markdown" :value="comments.content" :toolbarsFlag="toolbarsFlag" :subfield="toolbarsFlag" codeStyle="dark" defaultOpen="preview"></mavonEditor>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// import { Loading } from 'element-ui'
export default {
  data () {
    return {
      comments: [],
      toolbarsFlag: false,
      topic: '评论内容'
    }
  },
  components: {
    mavonEditor
  },
  mounted () {
    this.fetchComment(this.$route.params.id)
  },
  methods: {
    fetchComment (id, name) {
      this.$axios.post('/admin/comment', {
        id: id
      }).then(res => {
        this.comments = res.data
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
