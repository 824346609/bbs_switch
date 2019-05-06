<template>
  <div class="content">
    <div class="left">
      <Nav
      :index="index"></Nav>
      <div class="right">
        <div class="search">
        <el-input  placeholder="请输入想要搜索内容" id="search" v-model="input" prefix-icon="el-icon-search"></el-input>
        <div class="button"><el-button type="warning" id="searchBtn" @click="search">搜索</el-button></div>
        </div>
        <el-table
          ref="multipleTable"
          :data="commentList"
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
          <el-table-column align="center" label="评论人" prop="userName" width="150">
          </el-table-column>
          <el-table-column align="center" label="内容" width="220">
            <template slot-scope="scope">
                <div class="comment" v-html="scope.row.html"></div>
              </template>
          </el-table-column>
          <el-table-column align="center" label="板块" prop="block" width="150">
          </el-table-column>
          <el-table-column align="center" label="删除" width="100">
            <template slot-scope="scope">
                <p v-if="scope.row.status === 0">N</p>
              <p v-if="scope.row.status !== 0">Y</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-delete"
                @click="detail(scope.row)"
                size="small"
              >查看</el-button>
              <el-button
                type="success"
                icon="el-icon-edit"
                @click="handleRe(scope.row._id)"
                data-id
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
          <el-button class="del-batch" type="success" icon="el-icon-delete" @click="reCommentBatch">批量恢复</el-button>
          <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delCommentBatch">批量删除</el-button>
          </div>
        <!-- <el-button class="del-batch" type="danger" icon="el-icon-delete" @click="delCommentBatch">批量删除</el-button> -->
        <!-- <div class="pagination-wrapper">
          <el-pagination
            @current-change="handlePageChange"
            background
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
      commentList: [],
      selectedList: [],
      page: 1,
      sumList: 0,
      index: '4',
      input: ''
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.fetchComment()
  },
  methods: {
    fetchComment () {
      this.$axios.post('/admin/commentList')
        .then(res => {
          this.commentList = res.data.list
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
        model: 'comment',
        keyword: this.input
      }).then(res => {
        this.loading.close()
        this.commentList = res.data
      })
    },
    detail (info) {
      // console.log(this.info.block)
      this.$router.push({name: 'comment', params: { id: info._id }})
    },
    handleRe (id) {
      this.$confirm('此操作将恢复该帖子, 是否继续?', '提示', {
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
      this.$confirm('此操作将删除该帖子, 是否继续?', '提示', {
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
    reCommentBatch () {
      this.$confirm('此操作将把评论恢复, 是否继续, 是否继续?', '提示', {
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
    delCommentBatch () {
      this.$confirm('此操作将把评论删除, 是否继续, 是否继续?', '提示', {
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
      let url = '/admin/reComment'
      if (list) {
        params.list = list
        url = '/admin/reCommentBatch'
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
            this.fetchComment()
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
      let url = '/admin/delComment'
      if (list) {
        params.list = list
        url = '/admin/delCommentBatch'
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
            this.fetchComment()
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
.comment {
  max-height: 76px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.batch {
  float: right;
  margin-right: 2em;
}
</style>
