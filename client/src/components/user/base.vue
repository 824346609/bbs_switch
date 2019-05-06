<template>
    <div>
        <Header>
        </Header>
        <div class="container">
            <div class="Cont_L">
                 <el-button round @click="baseInfo" :type='type'>基础资料</el-button>
                 <el-button round @click="modify">修改密码</el-button>
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
               <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="名称" id="id">
                        <el-input v-model="formLabelAlign.userName" disabled class="dis">
                     </el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="formLabelAlign.nickName" disabled class="dis"></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-input v-model="formLabelAlign.authority" disabled class="dis"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <div class="fl">
                        <el-radio v-model="formLabelAlign.sex" label="male">男</el-radio>
                        <el-radio v-model="formLabelAlign.sex" label="female">女</el-radio>
                        </div>
                    </el-form-item>
                    <el-form-item label="出身年月">
                        <div class="fl">
                            <el-date-picker
                            v-model="formLabelAlign.birthday"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="所在地">
                       <div class="fl">
                        <el-cascader
                        :options="options"
                        v-model="locality"
                        expand-trigger="hover">
                        </el-cascader>
                       </div>
                    </el-form-item>
                    <el-form-item>
                      <div class="tip">只能上传jpg/png文件，且不超过1MB</div>
                      <el-upload
                        class="avatar-uploader"
                        action="http://upload.qiniup.com"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-error="handleError"
                        :before-upload="beforeAvatarUpload"
                        :data='qiniuData'>
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" id="btn">立即保存</el-button>
                    </el-form-item>
                    </el-form>
            </div>
          </div>
    </div>
</template>
<script>
import { Loading } from 'element-ui'
import Header from './personal'
import '../../assets/css/userInfo.css'
import areajson from '../../assets/js/area.js'
export default {
  data () {
    return {
      type: '',
      options: areajson,
      labelPosition: 'right',
      locality: [],
      formLabelAlign: {
        id: '',
        name: '',
        authority: '',
        sex: '',
        birthday: '',
        region: [],
        imgUrl: ''
      },
      imageUrl: '',
      // upload_qiniu_url: 'http://up.qiniup.com',
      upload_qiniu_addr: 'http://pkqrw6esw.bkt.clouddn.com/',
      qiniuData: {
        key: '',
        token: ''
      }
    }
  },
  components: {
    Header
  },
  mounted () {
    this.higtlight()
    // this.id = '5c20a9e6c0d20e176f04ba37'
    this.fetchUserInfo(this.$route.params.id)
    this.fetchUploadToken()
    // this.createBlock()
    // this.fetchBadge()
  },
  methods: {
    higtlight () {
      if (this.$route.name === 'personal') {
        this.type = 'primary'
      }
    },
    fetchBadge () {
      this.$axios.get('/getBadge')
        .then(res => {
          let notice = ''
          if (res.data.badge === true) {
            notice = 'new'
            sessionStorage.setItem('badge', notice)
            sessionStorage.setItem('updateTime', res.updateTime)
            this.$store.dispatch('setBadge', notice)
            this.$store.dispatch('setUpdate', res.data.updateTime)
          }
        })
    },
    fetchUserInfo (id) {
      this.$axios.post('/getUserById', {
        id: id
      }).then(res => {
        this.formLabelAlign = res.data
        console.log(this.formLabelAlign)
        res.data.region = res.data.region.match(/[^,]*/g)
        for (let i = 0; i < res.data.region.length; i++) {
          if (res.data.region[i].length > 2) {
            this.locality.push(res.data.region[i])
          }
        }
      })
    },
    onSubmit () {
      this.loading = Loading.service({ fullscreen: true })
      this.formLabelAlign.region = this.locality
      this.$axios.post('/saveInfo', this.formLabelAlign)
        .then(res => {
          this.loading.close()
          if (res.errcode === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(0)
            }, 1000)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    createBlock () {
      this.$axios.get('/createBlock')
        .then(res => {
          console.log(res)
        })
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
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = this.upload_qiniu_addr + res.key
      this.formLabelAlign.imgUrl = this.imageUrl
    },
    beforeAvatarUpload (file) {
      this.qiniuData.key = file.name
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    fetchUploadToken () {
      this.$axios.get('/getQiniuToken')
        .then(res => {
          if (res.errcode === 0) {
            console.log(res.data.token)
            this.token = res.data.token
            this.qiniuData.token = res.data.token
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    handleError: function (res) {
      this.$message({
        message: '上传失败',
        duration: 2000,
        type: 'warning'
      })
    }
  }
}
</script>
<style>
.el-button.is-round {
    margin: .5em 0;
    border-radius: 20px;
    padding: 12px 23px;
}
.el-button+.el-button {
    margin:.5em 0;
}
#id {
    margin-top: 2%;
}
.el-input {
    float: left;
    width: 40%;
}
.el-input__inner {
    background-color: #f5f5f5;
}
.fl {
    float: left;
}
#btn {
    float: left;
    width: 50%;
}
.fl > span > .el-input{
    width:100%;
}
.el-badge__content.is-fixed {
    top: 10px;
    right: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  float: left;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  /* width: 178px; */
  height: 178px;
  display: block;
}
.tip {
  width: 100%;
  text-align: left;
}
</style>
