<template>
    <articleForm v-if="detail.userId" :topic="topic" :detail="detail">
      <!-- v-if="detail._id"  :detail="detail" -->
    </articleForm>
</template>

<script>
import articleForm from '../editC'
// import { Loading } from 'element-ui'
export default {
  components: {
    articleForm
  },
  data () {
    return {
      topic: '编辑评论',
      detail: {},
      isDraft: true
    }
  },
  computed: {
  },
  mounted () {
    this.id = this.$route.params.id
    this.fetchComment(this.id)
  },
  methods: {
    fetchComment (id) {
      // this.loading = true
      if (id) {
        this.$axios.post('/getCommentById', {id: id}).then(res => {
          if (res.errcode === 0) {
            this.detail = res.data
            console.log(this.detail)
          }
        // console.log(res.data)
        // this._fetchUser(this.userId)
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
