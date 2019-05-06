<template>
  <div class="content">
    <div class="left">
      <Nav
      :index="index"></Nav>
      <div class="right">
        <div class="search">
        <el-input  placeholder="请输入想要搜索内容" v-model="input" id="search"  prefix-icon="el-icon-search"></el-input>
        <div class="button"><el-button type="warning" id="searchBtn" @click="search">搜索</el-button></div>
        </div>
        <el-table
          ref="multipleTable"
          :data="userList"
          tooltip-effect="dark"
          :default-sort="{prop: 'date', createTime: 'descending'}"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="600"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="createTime"
            sortable
            label="创建日期"
            :formatter="timeFormatter"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column align="center" label="用户昵称" prop="nickName" width="180">
          </el-table-column>
          <el-table-column align="center" label="用户名" prop="userName" width="180">
          </el-table-column>
          <el-table-column align="center" label="删除" prop="userName" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.status !== 0">Y</p>
              <p v-if="scope.row.status === 0">N</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="版主" prop="block" width="150">
            <template slot-scope="scope">
              <p v-if="scope.row.authority !== null">{{scope.row.authority}}</p>
              <p v-if="scope.row.authority === ''">N</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-delete"
                @click="moderator(scope.row._id)"
                size="small"
              >版主设定</el-button>
              <el-button
                type="success"
                icon="el-icon-delete"
                @click="handleRe(scope.row._id)"
                size="small"
              >恢复</el-button>
              <el-button
                type="danger"
                icon="el-icon-edit"
                @click="handleDel(scope.row._id)"
                data-id
                size="small"
              >删除</el-button>
              <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.row._id)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="batch">
          <el-button class="del-batch" type="success" icon="el-icon-delete" @click="reArticleBatch">批量恢复</el-button>
          <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delArticleBatch">批量删除</el-button>
        </div>
       <el-dialog title="版主设定" :visible.sync="author" width="30%">
          <el-form label-width="80px" >
            <el-form-item label="板块名" prop="name">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in blockList"
                  :key="item.abbreviation"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-my-yonghu" @click="submit">提交</el-button>
          </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import Nav from './index'
import moment from 'moment'
import { Loading } from 'element-ui'
export default {
  data () {
    return {
      userList: [],
      selectedList: [],
      page: 1,
      sumList: 0,
      index: '2',
      input: '',
      author: false,
      blockList: [],
      value: '',
      uid: ''
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.fetchUser()
    this.fetchBlock()
  },
  methods: {
    fetchUser () {
      this.$axios.post('/admin/userList')
        .then(res => {
          this.userList = res.data.list
          console.log(this.userList)
        })
    },
    fetchBlock () {
      this.$axios.post('/admin/blockList')
        .then(res => {
          // for (let i = 0; i < res.data.list.length; i++) {
          //   let option = []
          //   option.value = res.data.list[i].abbreviation
          //   option.label = res.data.list[i].name
          //   this.blockList.push(option)
          // }
          // console.log(res.data.list)
          // console.log(this.options)
          this.blockList = res.data.list
        })
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
    moderator (id) {
      this.author = true
      this.uid = id
    },
    submit () {
      // if (this.value === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '不能为空'
      //   })
      //   return
      // }
      this.$axios.post('/admin/moderator', {
        id: this.uid,
        authority: this.value
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.fetchUser()
      })
    },
    handleRe (id) {
      this.$confirm('此操作将恢复用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this._toRestore(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDel (id) {
      this.$confirm('此操作将删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this._toDel(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    reArticleBatch () {
      this.$confirm('此操作将把用户恢复, 是否继续, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定发送删除请求
        this._toRestore(null, this.selectedList)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delArticleBatch () {
      this.$confirm('此操作将把用户删除, 是否继续, 是否继续?', '提示', {
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
    _toRestore (id, list) {
      let params = {
        id
      }
      let url = '/admin/reUser'
      if (list) {
        params.list = list
        url = '/admin/reUserBatch'
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
            this.fetchUser()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    _toDel (id, list) {
      let params = {
        id
      }
      let url = '/admin/delUser'
      if (list) {
        params.list = list
        url = '/admin/delUserBatch'
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
            this.fetchUser()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD')
    },
    search () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/admin/search', {
        model: 'user',
        keyword: this.input
      }).then(res => {
        this.loading.close()
        this.userList = res.data
      })
    }
  }
}
</script>
<style>
.content {
  height: 100%;
  width: 100%;
}
.el-row {
  height: 100%;
  width: auto;
}
.right {
  position: absolute;
  left: 12%;
  width: 88%;
  top: 0;
}
.left {
  width: 12%;
  height: 100%;
}
.pagination-wrapper {
    text-align: center;
}
.el-input {
  width: 80%;
}
.button {
  width: 18%;
  display: inline-block;
}
.el-button.el-button--warning {
  width: 100%;
}
.batch {
  float: right;
  margin-right: 2em;
}
</style>
