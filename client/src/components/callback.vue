<template>
    <div class="content" v-if="show">
      <div class="header">
        <h1>Switch欢迎新人加入</h1>
      </div>
      <div class="body">
        用户昵称：<el-input type="text" v-model="registerForm.nickName" @focus="f()" @blur="rm()"></el-input><span :class="this.icon">{{tip}}</span>
        用户名：<el-input type="text" v-model="registerForm.username" prefix-icon="el-icon-my-shouye" @focus="u()" @blur="ru()"></el-input>
        密码：<el-input type="password" v-model="registerForm.password"  prefix-icon="el-icon-my-suo" @focus="p()" @blur="rp()"></el-input>
        验证码：<el-input type="text" v-model="registerForm.code" class="valid">
           <template slot="append">
            <div  v-loading="captchaLoading" @click="updateCaptcha()" class="captcha" v-html="captcha"></div>
          </template>
        </el-input>
        <div class="register" @click="registerBtn()"><el-button type="primary" round size="medium">注册</el-button></div>
      </div>
      <div class="footer"></div>
    </div>
</template>
<script>
import { Loading } from 'element-ui'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      registerForm: {
        nickName: '',
        username: '',
        password: '',
        code: '',
        gitId: '',
        icon: '',
        tip: '',
        ptip: '',
        picon: '',
        utip: '',
        uicon: ''
      },
      show: false,
      captcha: null,
      captchaLoading: false,
      icon: '',
      tip: ''
    }
  },
  mounted () {
    this.getCaptcha()
    this.getInfo(this.$route.query.code)
    // this.getGitUser('23398492')
  },
  methods: {
    getInfo (code) {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getInfo', {
        code
      }).then(res => {
        this.loading.close()
        if (res.data.message) {
          this.$message({
            message: '授权失败',
            type: 'error'
          })
        } else {
          this.registerForm.gitId = res.data.id
          console.log(this.registerForm.gitId)
          this.getGitUser(res.data.id)
        }
      })
    },
    registerBtn () {
      this.$axios.post('/register', {
        username: this.registerForm.username,
        password: this.registerForm.password,
        nickName: this.registerForm.nickName,
        code: this.registerForm.code,
        gitId: this.registerForm.gitId
      }).then((res) => {
        if (res.errcode === 3) {
          this.$message({
            message: '注册成功！',
            type: 'success',
            duration: 1500
          })
          this.getCaptcha()
        } else {
          this.$message.error(`注册失败,${res.msg}`)
          this.getCaptcha()
        }
      })
    },
    getGitUser (id) {
      this.$axios.post('/getGitUser', {
        id
      }).then(res => {
        if (res.data.errcode === 0) {
          this.show = true
        } else {
          localStorage['token'] = res.token
          this.$axios.defaults.headers.Authorization = localStorage['token']
          Cookies.set('uuid', res.data.uid, {
            expires: 1
          })
          this.$message({
            message: '登录成功！',
            type: 'success',
            duration: 1500
          })
          sessionStorage.setItem('username', res.data.nickName)
          sessionStorage.setItem('userId', res.data.uid)
          sessionStorage.setItem('userToken', res.token)
          this.$store.dispatch('setUser', res.data.nickName)
          this.$store.dispatch('setUserId', res.data.uid)
          this.$store.dispatch('setToken', res.token)
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        }
      })
    },
    f () {
      this.tip = '中英文均可，最长14个英文或7个汉字'
      this.icon = 'tipMsg'
    },
    p () {
      this.ptip = '只能输入6-20个字母、数字、下划线'
      this.picon = 'tipMsg'
    },
    u () {
      this.utip = '只能输入只能输入5-12个以字母开头、可带数字、“_”、“.”的字串'
      this.uicon = 'tipMsg'
    },
    isRegisterUserName (s) {
      var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,11}$/
      if (!patrn.exec(s)) return false
      return true
    },
    isPasswd (s) {
      var patrn = /^(\w){6,20}$/
      if (!patrn.exec(s)) return false
      return true
      // 只能输入6-20个字母、数字、下划线
    },
    ru () {
      let username = this.registerForm.username.trim()
      if (username === '') {
        this.utip = '✘用户名不允许为空'
        this.uicon = 'error'
        // 设置用户名标记为false
        return
      }
      if (!this.isRegisterUserName(username)) {
        this.utip = '✘用户名仅5-12个以字母开头、可带数字、“_”、“.”的字串'
        this.uicon = 'error'
        this.isUserIdOk = false
      } else {
        this.uicon = 'success'
        this.utip = '√'
        // 设置成功的标志
        this.isUserIdOk = true
      }
    },
    rp () {
      let password = this.registerForm.password.trim()
      if (password === '') {
        this.ctip = '✘密码不允许为空'
        this.cicon = 'error'
        // 设置用户名标记为false
        return
      }
      if (!this.isPasswd(password)) {
        this.ptip = '✘密码仅支持6-20个字母、数字、下划线'
        this.picon = 'error'
        this.isPasswordOk = false
      } else {
        this.picon = 'success'
        this.ptip = '√'
        // 设置成功的标志
        this.isPasswordOk = true
      }
    },
    rm () {
      // 去除多余的空白字符
      let name = this.registerForm.nickName.trim()
      // 判断是否为空
      if (name === '') {
        this.tip = '✘昵称不允许为空'
        this.icon = 'error'
        // 设置用户名标记为false
        this.isUsernameOk = false
        return
      }
      // 判断是否有非法字符(除了中英文、数字、下划线以外的字符)
      let charReg = /[^\u4E00-\u9FA5\w]/
      let res = charReg.test(name)
      if (res) {
        this.tip = '✘昵称仅支持中英文、数字和下划线,且不能为纯数字'
        this.icon = 'error'
        // 设置用户名标记为false
        this.isUsernameOk = false
        return
      }
      // 经过上述判断后，说明都是合法的字符(中英文、下划线、数字)，接下来判断是否为纯数字
      let numReg = /\D/
      res = numReg.test(name)
      // 如果res为false，则表示出了数字以外无其他字符
      if (!res) {
        // 设置错误信息
        this.icon = 'error'
        this.tip = '✘昵称仅支持中英文、数字和下划线,且不能为纯数字'
        // 设置用户名标记为false
        this.isUsernameOk = false
        // 终止程序
        return
      }
      // 满足以上条件后，判断用户名字符串的长度
      // 表示用户名的长度
      let len = 0
      let lenReg = /[\u4E00-\u9FA5]/
      for (let i = 0; i < name.length; i++) {
        // 如果是中文，就+2；否则+1
        if (lenReg.test(name[i])) {
          len += 2
        } else {
          len += 1
        }
        // 尽量避免执行过多的次数，一旦len超过14就不满足条件了
        if (len > 14) {
          break
        }
      }
      if (len > 14) {
        // 设置错误信息
        this.icon = 'error'
        this.tip = '✘昵称不能超过7个汉字或14个字符'
        // 设置用户名标记为false
        this.isUsernameOk = false
      } else {
        // 设置成功信息
        this.icon = 'success'
        this.tip = '√'
        // 设置成功的标志
        this.isUsernameOk = true
      }
    },
    getCaptcha () {
      this.captchaLoading = true
      this.$axios.get('/getCaptcha')
        .then(res => {
          this.captcha = res
          this.captchaLoading = false
        })
    },
    updateCaptcha () {
      this.getCaptcha()
    }
  }
}
</script>
<style scoped>
.content {
  position: absolute;
  top: 5em;
  left: 30%;
  width: 40%;
  letter-spacing: 5px;
}
.body {
  width: 100%;
}
.tipMsg {
  font-size: 4px;
  float: left;
}
.error {
  font-size: 4px;
  float: left;
  color: red;
}
.success {
  font-size: 4px;
  float: left;
  color: #6ac044;
}
.register {
  margin-top: 2em;
}
.register > button {
  width: 60%;
}
</style>
<style>
.valid > input:first-child{
  height:3.2em;
}
</style>
