<template>
  <div class="nav">
    <el-row>
      <el-col :span="24">
        <el-menu
          :default-active="index"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="base()">
            <i class="el-icon-menu"></i>
            <span slot="title">{{this.$store.state.currentUser}}</span>
          </el-menu-item>
          <el-menu-item index="2" @click="user()">
            <i class="el-icon-setting"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="3" @click="aritcle()">
            <i class="el-icon-setting" ></i>
            <span slot="title">帖子管理</span>
          </el-menu-item>
          <el-menu-item index="4" @click="comment()">
            <i class="el-icon-setting"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="5" @click="block()">
            <i class="el-icon-setting"></i>
            <span slot="title">板块管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: String,
      default: -1
    }
  },
  mounted () {
    // this.fetchTest()
  },
  methods: {
    base () {
      alert('注销')
    },
    aritcle () {
      this.$router.push({ name: 'articleList' })
    },
    user () {
      this.$router.push({ name: 'userList' })
    },
    comment () {
      this.$router.push({ name: 'commentList' })
    },
    block () {
      this.$router.push({ name: 'blockList' })
    }
  }
}
</script>
<style>
.el-col {
  height: 100%;
  background-color: rgb(84, 92, 100);
}
.nav {
  width: 100%;
  height: 100%;
}
.el-menu {
  border: none;
  height: 100%;
}
</style>
