<template>
  <el-dropdown class="d2-mr">
    <span class="btn-text">你好 {{username}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff"><d2-icon name="power-off"/> 注销</el-dropdown-item>
      <el-dropdown-item  class="ucenter"><d2-icon name="user-circle-o"/> <router-link to="/core/create/articleList">管理首页</router-link></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// 插件
import Cookies from 'js-cookie'
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      username: this.$store.state.currenUser
    })
  },
  methods: {
    ...mapMutations([
      'd2adminDbRemoveByUuid'
    ]),
    logOff () {
      this.$confirm('注销此账户吗?', '注销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除用户名
        this.d2adminDbRemoveByUuid({
          key: 'username',
          emptyValue: ''
        })
        // 删除cookie
        Cookies.remove('token')
        Cookies.remove('uuid')
        // 跳转路由
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        // 取消了注销
      })
    }
  }
}
</script>
<style  lang='stylus' scoped>
.ucenter
  a
    color inherit
    text-decoration none
</style>
