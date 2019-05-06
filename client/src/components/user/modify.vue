<template>
  <div>
      <Header></Header>
      <div class="container">
            <div class="Cont_L">
               <el-button round @click="baseInfo">基础资料</el-button>
                 <el-button round @click="modify" :type='type'>修改密码</el-button>
                 <el-button round @click="myTopic">我的帖子</el-button>
                 <el-button round @click="myComment">我的评论</el-button>
                 <el-badge :value="this.$store.state.collectionBadge" class="item">
                    <el-button round @click="collection">我的收藏</el-button>
                 </el-badge>
                 <el-badge :value="this.$store.state.badge" class="item">
                    <el-button round @click="reply">回复我的</el-button>
                </el-badge>
            </div>
            <div class="Cont_R">
                <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="pass" class="place">
                    <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"  @focus="p()" @blur="rp()"></el-input><span :class="this.picon">{{ptip}}</span>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="btn">
                        <el-button type="primary" @click="submitForm('ruleForm2')" id="btn">提交</el-button>
                    </div>
                </el-form-item>
                </el-form>
            </div>
          </div>
    </div>
</template>
<script>
import Header from './personal'
import '../../assets/css/userInfo.css'
export default {
  data () {
    // var checkAge = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('年龄不能为空'))
    //   }
    //   setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //       callback(new Error('请输入数字值'))
    //     } else {
    //       if (value < 18) {
    //         callback(new Error('必须年满18岁'))
    //       } else {
    //         callback()
    //       }
    //     }
    //   }, 1000)
    // }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      type: '',
      ptip: '',
      picon: ''
    }
  },
  mounted () {
    this.higtlight()
  },
  methods: {
    higtlight () {
      if (this.$route.name === 'modify') {
        this.type = 'primary'
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/resetPass', {
            password: this.ruleForm2.checkPass
          }).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    isPasswd (s) {
      var patrn = /^(\w){6,20}$/
      if (!patrn.exec(s)) return false
      return true
      // 只能输入6-20个字母、数字、下划线
    },
    p () {
      this.ptip = '只能输入6-20个字母、数字、下划线'
      this.picon = 'tipMsg'
    },
    rp () {
      let password = this.ruleForm2.pass.trim()
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    baseInfo () {
      this.$router.push({name: 'personal', params: { id: this.$route.params.id }})
    },
    modify () {
      this.$router.push({name: 'modify', params: { id: this.$route.params.id }})
    },
    myTopic () {
      this.$router.push({name: 'myTopic', params: { id: this.$route.params.id }})
    },
    myComment () {
      this.$router.push({name: 'myComment', params: { id: this.$route.params.id }})
    },
    reply () {
      this.$router.push({name: 'reply', params: { id: this.$route.params.id }})
    },
    collection () {
      this.$router.push({name: 'collection', params: { id: this.$route.params.id }})
    }
  },
  components: {
    Header
  }
}
</script>
<style scoped>
.place {
    margin-top: 2%;
}
.tipMsg {
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
.el-input {
    float: left;
    width: 40%;
}
.btn {
    width:100%;
}
#btn {
    float: left;
    width: 40%;
}
.el-button.is-round {
    margin: .5em 0;
    border-radius: 20px;
    padding: 12px 23px;
}
.el-button+.el-button {
    margin:.5em 0;
}
.el-badge__content.is-fixed {
    top: 10px;
    right: 20px;
}
</style>
