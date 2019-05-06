<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <div class="logo-group">
        <img class="avatar" src="../..//assets/logo.png" alt="logo">
      </div>
      <div class="form-group" @keydown.enter="submit">
        <el-card>
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin">
            <el-form-item  prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <i slot="prepend" class="fa fa-user-circle-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <i slot="prepend" class="fa fa-keyboard-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input type="text" v-model="formLogin.code" placeholder="- - - -">
                <template slot="prepend">验证码</template>
                <template slot="append">
                  <div  v-loading="captchaLoading" @click="updateCaptcha" class="captcha" v-html="captcha"></div>
                </template>
              </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
      <el-button type="info" class="button-help">
        需要帮助
        <i class="fa fa-question-circle"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
import config from './config/default.js'
// 配置地址
// https://vincentgarreau.com/particles.js/#default
require('particles.js')

export default {
  data () {
    return {
      formLogin: {
        username: 'admin',
        password: 'admin',
        code: 'adsd'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      captcha: null,
      captchaLoading: false
    }
  },
  mounted () {
    // 初始化例子插件, 背景
    // particlesJS('login', config)
    this.getCaptcha()
    // this.addAdmin()
  },
  methods: {
    ...mapMutations([
      'd2adminUsernameSet'
    ]),
    // 获取验证码
    getCaptcha () {
      this.captchaLoading = true
      this.$axios.get('/getCaptcha')
        .then(res => {
          this.captcha = res
          this.captchaLoading = false
        })
    },
    addAdmin () {
      this.$axios.get('/addAdmin')
        .then(res => {
          console.log(res)
        })
    },
    // 更新验证码
    updateCaptcha () {
      this.getCaptcha()
    },
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/admin/login',
            data: {
              username: this.formLogin.username,
              password: this.formLogin.password,
              code: this.formLogin.code
            }
          })
            .then(res => {
              if (res.errcode === 0) {
                localStorage['token'] = res.token
                this.$axios.defaults.headers.Authorization = localStorage['token']
                // 设置 cookie 一定要存 uuid整个系统依赖这个数据进行校验和存储
                // 且必须先设置uuid的cookie再进行vuex的存储，因为vuex存储依赖cookie的uuid
                Cookies.set('uuid', res.data.uid, {
                  expires: 1
                })
                // 设置用户名
                sessionStorage.setItem('username', res.data.userName)
                sessionStorage.setItem('userId', res.data.uid)
                sessionStorage.setItem('userToken', res.token)
                this.$store.dispatch('setUser', res.data.userName)
                this.$store.dispatch('setUserId', res.data.uid)
                this.$store.dispatch('setToken', res.token)
                this.$message({
                  message: '登录成功！',
                  type: 'success',
                  duration: 1500
                })
                this.getCaptcha()
                // 给提示留出时间，延迟跳转
                setTimeout(() => {
                  this.$router.push('/')
                }, 1500)
              } else {
                this.getCaptcha()
                this.$message.error(`登录失败,${res.msg}`)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './style.scss';
.captcha {
  height: 38px;
}
.el-input-group__append {
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.login-page .logo-group .avatar{
border-radius: 50%;
height: 100px;
}
.login-page .logo-group {
  top: 60px;
}
</style>
