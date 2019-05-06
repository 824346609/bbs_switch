<template>
    <div>
        <Header></Header>
        <div class="container">
            <div class="Cont_L">
               <el-button round @click="baseInfo">基础资料</el-button>
                 <el-button round @click="modify">修改密码</el-button>
                 <el-button round @click="myTopic">我的帖子</el-button>
                 <el-button round @click="myComment" :type='type'>我的评论</el-button>
                 <el-badge :value="this.$store.state.collectionBadge" class="item">
                    <el-button round @click="collection">我的收藏</el-button>
                 </el-badge>
                 <el-badge :value="this.$store.state.badge" class="item">
                    <el-button round @click="reply">回复我的</el-button>
                </el-badge>
            </div>
            <div class="Cont_R">
              <el-table
                ref="multipleTable"
                :data="commentList"
                tooltip-effect="dark"
                :default-sort = "{prop: 'date', createTime: 'descending'}"
                @selection-change="handleSelectionChange"
                style="width: 100%"
              >
              <el-table-column
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
                align="center"
                label="评论内容"
              >
              <template slot-scope="scope">
                <div class="myComment" v-html="scope.row.html"></div>
              </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button type="success" icon="el-icon-delete" @click="detail(scope.row.articleId,scope.row.block)">查看</el-button>
                  <el-button type="primary" icon="el-icon-edit" @click="toEdit(scope.row._id)" data-id="">编辑</el-button>
                  <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.row._id)">删除</el-button> -->
                </template>
              </el-table-column>
          </el-table>
          <!-- <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delCommentBatch">批量删除</el-button> -->
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
      type: '',
      commentList: [],
      selectedList: [],
      keyword: '',
      page: 1,
      status: 1,
      sumList: 0
    }
  },
  mounted () {
    this.higtlight()
    this.getCommentListList()
  },
  components: {
    Header
  },
  methods: {
    higtlight () {
      if (this.$route.name === 'myComment') {
        this.type = 'primary'
      }
    },
    getCommentListList () {
      console.log(this.$route.params.id)
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getUserComment', {
        id: this.$route.params.id,
        keyword: this.keyword,
        page: this.page
      }).then(res => {
        console.log(res)
        this.loading.close()
        this.commentList = res.data.list
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
    detail (id, block) {
      this.$router.push({name: 'articleDetail', params: { id, name: block }})
    },
    collection () {
      this.$router.push({name: 'collection', params: { id: this.$route.params.id }})
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.getCommentList()
    },
    handleSelectionChange (val) {
      this.selectedList = val.map(item => {
        return item._id
      })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
    },
    toEdit (id) {
      this.$router.push(`editComment/${id}`)
    },
    handleDel (id) {
      this.$confirm('此操作将把文章加入垃圾箱,可在垃圾箱中恢复, 是否继续?', '提示', {
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
    delCommentBatch () {
      this.$confirm('此操作将把文章加入垃圾箱,可在垃圾箱中恢复, 是否继续?', '提示', {
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
      let url = '/delComment'
      if (list) {
        params.list = list
        url = '/delCommentBatch'
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
            this.getCommentList()
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
.el-table .cell {
    /* -webkit-box-sizing: border-box; */
    box-sizing: border-box;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
}
.el-badge__content.is-fixed {
    top: 10px;
    right: 20px;
}
.el-table__row {
  cursor: pointer;
}
.cell {
  max-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
