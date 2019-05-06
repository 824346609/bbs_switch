<template>
    <div class="main_nav">
        <div class="nav_content">
            <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#000"
        text-color="#fff"
        active-text-color="#ffd04b">
        <router-link to='/'><img src="../../assets/Logo.jpg"></router-link>
        <el-menu-item index="2" class="space"><router-link to='/'>Switch游戏论坛</router-link></el-menu-item>
           <el-menu-item index="3" v-show="!this.$store.state.isLogin"><el-button type="text" @click="login = true">登录</el-button></el-menu-item>
        <el-dialog title="会员登录" :visible.sync="login" width="30%">
          <el-form ref="loginForm" :model="loginForm" label-width="80px" :rules="rules">
              <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="loginForm.username" prefix-icon="el-icon-my-yonghu"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password"  prefix-icon="el-icon-my-suo" ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
             <el-input type="text" v-model="loginForm.code" class="valid">
              <template slot="append">
                  <div  v-loading="captchaLoading" @click="updateCaptcha()" class="captcha" v-html="captcha"></div>
              </template>
             </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginBtn()" icon="el-icon-my-yonghu" id="login">登录</el-button>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <div class="oAuth" @click="githubClick"><img class="oAuth" src="../../assets/github.png" /></div>
          </span>
          <!--  -->
            <!-- v-on:click="githubClick" -->
        </el-dialog>
        <el-menu-item index="4" v-show="!this.$store.state.isLogin"><el-button type="text" @click="register = true">注册</el-button></el-menu-item>
         <el-dialog title="Switch欢迎新人加入" :visible.sync="register" width="30%">
          <el-form ref="registerForm" :model="registerForm" label-width="80px" :rules="rules">
             <el-form-item label="用户昵称" prop="userid">
              <el-input type="text" v-model="registerForm.nickName" prefix-icon="el-icon-my-gasolinegauge" @focus="f()" @blur="rm()"></el-input><span :class="this.icon">{{tip}}</span>
            </el-form-item>
              <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="registerForm.username" prefix-icon="el-icon-my-shouye" @focus="u()" @blur="ru()"></el-input><span :class="this.uicon">{{utip}}</span>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="registerForm.password"  prefix-icon="el-icon-my-suo"  @focus="p()" @blur="rp()"></el-input><span :class="this.picon">{{ptip}}</span>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
             <el-input type="text" v-model="registerForm.code" class="valid">
              <template slot="append">
                  <div v-loading="captchaLoading" @click="updateCaptcha()" class="captcha" v-html="captcha" id=""></div>
              </template>
             </el-input>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="registerBtn()" icon="el-icon-my-yonghu" id="register" :disabled='!(this.isUsernameOk&&this.isPasswordOk&&this.isUserIdOk)'>注册</el-button>
            <!-- <el-button  @click="dialogVisible = false">取 消</el-button> -->
          </span>
        </el-dialog>
        <el-submenu index="5" v-if="this.$store.state.isLogin">
        <template slot="title">
          <span>您好,{{this.$store.state.currentUser}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="5-1" @click="userInfo">个人主页</el-menu-item>
          <el-menu-item index="5-2" @click="logout">注销</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
          <!-- <el-menu-item index="5" v-show="this.$store.state.isLogin" >您好,{{this.$store.state.currentUser}}</el-menu-item> -->

          <!-- <el-menu-item index="5" v-show="this.$store.state.isLogin" >您好,{{this.$store.state.currentUser}}</el-menu-item> -->
        </el-menu>
        </div>
        <!-- <div v-show="this.$store.state.isLogin">{{this.$store.getters.currentUser}}</div> -->
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      login: false,
      register: false,
      isUsernameOk: false,
      isPasswordOk: false,
      isUserIdOk: false,
      icon: '',
      tip: '',
      ptip: '',
      picon: '',
      utip: '',
      uicon: '',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      registerForm: {
        nickName: '',
        username: '',
        password: '',
        code: ''
      },
      rules: {
        nickName: [
          {require: true, message: '请输入用户昵称', trigger: 'blur'}
        ],
        username: [
          {require: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {require: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {require: true, message: '请输入验证码', trigger: 'blur'}
        ]
      },
      captcha: null,
      captchaLoading: false
    }
  },
  mounted () {
    this.getCaptcha()
  },
  methods: {
    loginBtn () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            code: this.loginForm.code
          }).then((res) => {
            if (res.errcode === 0) {
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
              sessionStorage.setItem('auth', res.data.authority)
              this.$store.dispatch('setUser', res.data.nickName)
              this.$store.dispatch('setUserId', res.data.uid)
              this.$store.dispatch('setToken', res.token)
              this.$store.dispatch('setAuth', res.data.authority)
              this.getCaptcha()
              setTimeout(() => {
                this.$router.push({name: 'personal', params: {id: res.data.uid}})
              }, 1500)
            } else {
              this.$message.error(`登录失败,${res.msg}`)
              this.getCaptcha()
            }
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          return false
        }
      })
    },
    registerBtn () {
      this.$axios.post('/register', {
        username: this.registerForm.username,
        password: this.registerForm.password,
        nickName: this.registerForm.nickName,
        code: this.registerForm.code
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
    },
    logout () {
      this.$store.dispatch('delToken', this.$store.state)
      this.$router.push({name: 'Home'})
      this.$router.go(0)
    },
    userInfo () {
      this.$router.push({name: 'personal', params: { id: this.$store.state.userId }})
    },
    githubClick: function () {
      window.location.href = 'https://github.com/login/oauth/authorize?client_id=c000ae43a68b793930b3'
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  text-decoration: none;
}
.oAuth {
  cursor: pointer;
  height: 50px;
}
.oAuth > img{
  margin-left: 13em;
}
.main_nav img {
  float: left;
  /* height: 90%; */
  width: 4em;
}
.space {
  width: 84%;
}
#login, #register {
  width: 66%;
  margin-right: 3em;
}
#login {
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
</style>
<style>
.valid > input:first-child{
  height:3.2em;
}
.el-form-item__content {
  line-height: 20px;
  position: relative;
  font-size: 14px;
}
.el-dialog__body {
  padding: 20px 20px;
  color: #606266;
  font-size: 14px;
}
</style>
