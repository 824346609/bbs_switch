<template>
  <div class="content">
    <div class="left">
      <Nav
      :index="index"></Nav>
      <div class="right">
        <div class="add" @click="show = true"><i class="el-icon-plus"></i></div>
        <el-dialog title="新建板块" :visible.sync="show" width="30%">
          <el-form ref="blockForm" :model="blockForm" label-width="80px">
              <el-form-item label="板块名" prop="name">
              <el-input type="text" v-model="blockForm.name" prefix-icon="el-icon-my-yonghu"></el-input>
            </el-form-item>
            <el-form-item label="中文名" prop="abbreviation">
              <el-input type="text" v-model="blockForm.abbreviation"  prefix-icon="el-icon-my-suo" ></el-input>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add" icon="el-icon-my-yonghu" id="login">提交</el-button>
          </el-form-item>
          </el-form>
        </el-dialog>
        <div class="search">
        <el-input  placeholder="请输入想要搜索内容" v-model="input" id="search"  prefix-icon="el-icon-search"></el-input>
        <div class="button"><el-button type="warning" id="searchBtn" @click="search">搜索</el-button></div>
        </div>
        <el-table
          ref="multipleTable"
          :data="blockList"
          tooltip-effect="dark"
          :default-sort="{prop: 'date', createTime: 'descending'}"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="600"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="板块名" prop="name">
          </el-table-column>
          <el-table-column align="center" label="中文名" prop="abbreviation">
          </el-table-column>
          <el-table-column align="center" label="删除" prop="userName">
            <template slot-scope="scope">
              <p v-if="scope.row.status !== 0">Y</p>
              <p v-if="scope.row.status === 0">N</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-edit"
                @click="handleDel(scope.row._id)"
                data-id
                size="small"
              >删除</el-button>
              <el-button
                type="success"
                icon="el-icon-edit"
                @click="handleRe(scope.row._id)"
                data-id
                size="small"
              >恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batch">
          <el-button class="del-batch" type="success" icon="el-icon-delete" @click="reBlockBatch">批量恢复</el-button>
          <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delBlockBatch">批量删除</el-button>
        </div>
        <!-- <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delCommentBatch">批量删除</el-button> -->
        <!-- <div class="pagination-wrapper">
          <el-pagination
            @current-change="handlePageChange"
            background
            :page-size="5"
            :current-page="page"
            layout="prev, pager, next, jumper"
            :total="sumList"
          ></el-pagination>
        </div> -->
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
      articleList: [],
      blockList: [],
      selectedList: [],
      page: 1,
      sumList: 0,
      index: '5',
      input: '',
      blockForm: {
        name: '',
        abbreviation: ''
      },
      show: false
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.fetchBlock()
  },
  methods: {
    fetchBlock () {
      this.$axios.post('/admin/blockList')
        .then(res => {
          console.log(res.data.list)
          this.blockList = res.data.list
          this.sumList = res.data.count
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
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD')
    },
    search () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/admin/search', {
        model: 'block',
        keyword: this.input
      }).then(res => {
        this.loading.close()
        this.blockList = res.data
      })
    },
    add () {
      this.$axios.post('/admin/createBlock', {
        name: this.blockForm.name,
        abbreviation: this.blockForm.abbreviation
      }).then(res => {
        if (res.errcode === 3) {
          this.$message({
            message: '操作成功！',
            type: 'success',
            duration: 1500
          })
          this.fetchBlock()
        } else {
          this.$message.error(`操作失败,${res.msg}`)
        }
      })
    },
    handleRe (id) {
      this.$confirm('此操作将恢复该板块, 是否继续?', '提示', {
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
      this.$confirm('此操作将删除该板块, 是否继续?', '提示', {
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
    reBlockBatch () {
      this.$confirm('此操作将把帖子板块, 是否继续, 是否继续?', '提示', {
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
    delBlockBatch () {
      this.$confirm('此操作将把帖子板块, 是否继续, 是否继续?', '提示', {
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
      let url = '/admin/reBlock'
      if (list) {
        params.list = list
        url = '/admin/reBlockBatch'
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
            this.fetchBlock()
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
      let url = '/admin/delBlock'
      if (list) {
        params.list = list
        url = '/admin/delBlockBatch'
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
            this.fetchBlock()
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
/* #search {
    width:40%;
    margin-left: 60%;
} */
/* .el-input__inner:focus {
    outline: none;
    border:1px solid rgba(255,255,255,.5);
} */
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
.el-icon-plus {
  margin: 1.1em;
}
.add {
  position: absolute;
  bottom: 2em;
  right: 5%;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: rgba(101, 204, 255, .5);
  z-index: 9999;
}
.batch {
  float: right;
  margin-right: 2em;
}
</style>
