<template>
  <div>
    <el-table
      ref='multipleTable'
      :data='articleList'
      tooltip-effect='dark'
      :default-sort="{prop: 'date', createTime: 'descending'}"
      @selection-change='handleSelectionChange'
      style='width: 100%'>
      <el-table-column align='center' label='标题' width='620' class="jump">
        <template slot-scope='scope'>
          <div v-if="scope.row.top === 'true'" class="hot top" @click="jump(scope.row._id)">
            <img src="../../assets/hot.jpg" lazyloaded="true">
            {{scope.row.title}}
          </div>
          <div v-if="scope.row.top === 'false'" class="hot top" @click="jump(scope.row._id)">
            {{scope.row.title}}
          </div>
          <!-- <div  class="top"></div> -->
        </template>
      </el-table-column>
      <el-table-column
        prop='createTime'
        sortable
        label='日期'
        :formatter='timeFormatter'
        align='center'>
      </el-table-column>
      <el-table-column align='center' prop='userName' label='发帖人' show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop='updateTime' align='center' label='最后发表' :formatter='timeFormatter' show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class='pagination-wrapper'>
      <el-pagination
        @current-change='handlePageChange'
        background
        :current-page='page'
        layout='prev, pager, next, jumper'
        :total='sumList'
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { Loading } from 'element-ui'
export default {
  data () {
    return {
      time: '',
      type: '',
      articleList: [],
      selectedList: [],
      keyword: '',
      page: 1,
      block: '',
      status: 1,
      sumList: 0
    }
  },
  mounted () {
    this.getArticleList()
  },
  methods: {
    getArticleList () {
      this.loading = Loading.service({ fullscreen: true })
      this.$axios.post('/getArticleList', {
        page: this.page,
        block: this.$route.params.name
      }).then(res => {
        this.loading.close()
        this.articleList = res.data.list
        console.log(this.articleList)
        this.sumList = res.data.count
      })
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
    handleDel (id) {
      this.$confirm('此操作将把选中的收藏删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 点击确定发送删除请求
          this._toDel(id)
        })
        .catch(() => {
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
      })
        .then(() => {
          // 点击确定发送删除请求
          this._toDel(null, this.selectedList)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    jump (id) {
      this.$router.push(`articleDetail/${id}`)
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
      this.$axios.post(url, params).then(res => {
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
.top {
  width: 100%;
  display: inline-block
}
.hot > img{
  float: left;
  height: 15px;
  /* width: 20px; */
  background-size: contain;
}
</style>
<style>
.el-table__row {
    cursor: pointer;
}
.pagination-wrapper {
  margin-top: 10px;
}
</style>
