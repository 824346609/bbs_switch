<template>
  <div class="content">
    <div class="left">
      <Nav
      :index="this.index"></Nav>
      <div class="right">
        <div class="search">
        <el-input  placeholder="请输入想要搜索内容" v-model="input" id="search"  prefix-icon="el-icon-search"></el-input>
        <div class="button"><el-button type="warning" id="searchBtn" @click="search">搜索</el-button></div>
        </div>
        <el-table
          ref="multipleTable"
          :data="articleList"
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
          <el-table-column align="center" label="标题" prop="title" width="150">
          </el-table-column>
          <el-table-column align="center" label="发帖人" prop="userName" width="150">
          </el-table-column>
          <el-table-column align="center" label="板块" prop="block" width="150">
          </el-table-column>
          <el-table-column align="center" label="删除" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.status === 0">N</p>
              <p v-if="scope.row.status !== 0">Y</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="加精" width="100">
             <template slot-scope="scope">
              <p v-if="scope.row.top !== 'true'">N</p>
              <p v-if="scope.row.top === 'true'">Y</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <el-button
                type="success"
                icon="el-icon-edit"
                @click="detail(scope.row.articleId,block)"
                size="small"
              >加精</el-button> -->
              <el-button
                type="success"
                icon="el-icon-edit"
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
        <!-- <div class="pagination-wrapper">
          <el-pagination
            @current-change="handlePageChange"
            background
            :page-size="10"
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
      selectedList: [],
      page: 1,
      sumList: 0,
      input: '',
      index: '3'
    }
  },
  components: {
    Nav
  },
  mounted () {
    this.fetchArticle()
  },
  methods: {
    fetchArticle () {
      this.$axios.post('/admin/articleList')
        .then(res => {
          this.articleList = res.data.list
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
        model: 'article',
        keyword: this.input
      }).then(res => {
        this.loading.close()
        this.articleList = res.data
      })
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
    reArticleBatch () {
      this.$confirm('此操作将把帖子恢复, 是否继续, 是否继续?', '提示', {
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
      this.$confirm('此操作将把帖子删除, 是否继续, 是否继续?', '提示', {
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
      let url = '/admin/reArticle'
      if (list) {
        params.list = list
        url = '/admin/reArticleBatch'
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
            this.fetchArticle()
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
      let url = '/delArticle'
      if (list) {
        params.list = list
        url = '/delArticleBatch'
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
            this.fetchArticle()
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
.batch {
  float: right;
  margin-right: 2em;
}
</style>
