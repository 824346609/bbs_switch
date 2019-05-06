<template>
    <div>
        <Header></Header>
        <div class="container">
            <div class="Cont_L">
               <el-button round @click="baseInfo">基础资料</el-button>
                 <el-button round @click="modify">修改密码</el-button>
                 <el-button round @click="myTopic">我的帖子</el-button>
                 <el-button round @click="myComment">我的评论</el-button>
                 <el-badge :value="this.$store.state.collectionBadge" class="item">
                    <el-button round @click="collection" :type='type'>我的收藏</el-button>
                 </el-badge>
                 <el-badge :value="this.$store.state.badge" class="item">
                    <el-button round @click="reply">回复我的</el-button>
                </el-badge>
            </div>
            <div class="Cont_R">
              <el-table
                ref="multipleTable"
                :data="collectionList"
                tooltip-effect="dark"
                :default-sort = "{prop: 'date', createTime: 'descending'}"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                  <el-table-column
                    ref="test"
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    sortable
                    label="日期"
                    :formatter="timeFormatter"
                    align="center"
                    width="220">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    align="center"
                    label="文章标题">
                  </el-table-column>
                  <el-table-column
                  label="更新"
                  align="center">
                  <template slot-scope="scope">
                    <p v-if="time > scope.row.updateTime">✘</p>
                    <p v-if="time <= scope.row.updateTime">√</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.row._id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delArticleBatch">批量删除</el-button>
                <div class="pagination-wrapper">
                  <el-pagination
                    @current-change="handlePageChange"
                    background
                    :current-page="page"
                    layout="prev, pager, next, jumper"
                    :total="sumList">
                  </el-pagination>
                </div>
                <!-- <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="pass" class="place">
                    <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="btn">
                        <el-button type="primary" @click="submitForm('ruleForm2')" id="btn">提交</el-button>
                    </div>
                </el-form-item>
                </el-form> -->
            </div>
          </div>
    </div>
</template>
<script>
import Header from './personal'
import '../../assets/css/userInfo.css'
import moment from 'moment'
import { Loading } from 'element-ui'
export default {
  data () {
    return {
      time: '',
      type: '',
      collectionList: [],
      selectedList: [],
      keyword: '',
      page: 1,
      status: 1,
      sumList: 0
    }
  },
  mounted () {
    this.higtlight()
    this.getColList()
    this.updateCollection()
  },
  components: {
    Header
  },
  methods: {
    higtlight () {
      if (this.$route.name === 'collection') {
        this.type = 'primary'
      }
    },
    updateCollection () {
      this.$axios.get('/updateCollection')
        .then(res => {
          sessionStorage.setItem('collection', res.data)
          this.$store.dispatch('setCollection', res.data)
        })
    },
    getColList () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getColList', {
        params: {
          page: this.page,
          userId: this.$store.state.userId
        }
      }).then(res => {
        this.loading.close()
        this.collectionList = res.data.list
        this.time = this.$store.state.collection
        this.sumList = res.data.count
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.getColList()
    },
    handleSelectionChange (val) {
      this.selectedList = val.map(item => {
        return item._id
      })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDate (date) {
      return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
    },
    handleDel (id) {
      this.$confirm('此操作将把选中的收藏删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定发送删除请求
        this._toDel(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delArticleBatch () {
      this.$confirm('此操作将把选中的收藏删除, 是否继续?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定发送删除请求
        this._toDel(null, this.selectedList)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    _toDel (id, list) {
      let params = {
        id
      }
      let url = '/delCollection'
      if (list) {
        params.list = list
        url = '/delCollectionBatch'
      }
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post(url, params)
        .then(res => {
          this.loading.close()
          if (res.errcode === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getColList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
<style scoped>
.del-batch {
  margin-top: 1em;
}
</style>
<style>
.el-button.is-round {
    margin: .5em 0;
    border-radius: 20px;
    padding: 12px 23px;
}
.el-button+.el-button {
    margin:.5em 0;
}
.el-pagination {
    margin-top: 1em;
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
}
.el-badge__content.is-fixed {
    top: 10px;
    right: 20px;
}
</style>
