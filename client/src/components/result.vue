<template>
  <div>
    <Nav></Nav>
    <div class="main">
      <div class="articleInfo">
        <div class="th">
          <div class="art_detail">
            <div class="detail">
              <el-table
                ref="multipleTable"
                :data="resultList"
                tooltip-effect="dark"
                :default-sort="{prop: 'date', createTime: 'descending'}"
                @selection-change="handleSelectionChange"
                style="width: 100%"
              >
                <el-table-column align="center" label="标题" width="620" class="jump">
                  <template slot-scope="scope">
                    <div @click="jump(scope.row._id, scope.row.block)">{{scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  sortable
                  label="发帖日期"
                  :formatter="timeFormatter"
                  align="center"
                ></el-table-column>
                <el-table-column align="center" prop="userName" label="发帖人" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="block" label="板块" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="updateTime"
                  align="center"
                  label="最后回复"
                  :formatter="timeFormatter"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
              <div class="pagination-wrapper">
                <el-pagination
                  @current-change="handlePageChange"
                  background
                  :current-page="page"
                  layout="prev, pager, next, jumper"
                  :total="sumList"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Nav from '../components/navigation/navigation'
import moment from 'moment'
export default {
  data () {
    return {
      resultList: [],
      page: 1,
      sumList: 0
    }
  },
  mounted () {
    this.fetchKeyword(this.$route.params.key)
  },
  methods: {
    fetchKeyword (keyword) {
      this.$axios.post('/search', {
        keyword,
        page: this.page
      }).then(res => {
        this.resultList = res.data.list
        this.sumList = res.data.count
        //   resultList = res.data
      })
    },
    jump (id, block) {
      this.$router.push({name: 'articleDetail', params: {name: block, id}})
    },
    handlePageChange (currPage) {
      this.page = currPage
      this.getArticleList()
    },
    handleSelectionChange (val) {
      this.selectedList = val.map(item => {
        return item._id
      })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {
    Nav
  }
}
</script>
<style scoped>
.main {
  position: absolute;
  top: 4em;
  left: 0;
  right: 0;
  width: 100%;
  min-height: 40em;
  padding: 0.5em 1em 0;
  box-sizing: border-box;
  background-color: #9bcdfc;
  overflow: hidden;
}
.articleInfo {
  height: 100%;
  background-color: white;
  padding: 0.5em 1.5em 0;
}
.th {
  height: auto;
  /* min-height: */
  width: 100%;
  border: 1px solid #cdcdcd;
}
.art_header {
  height: 1.8em;
  width: 100%;
  background-color: #f2f2f2;
}
.art_detail {
  box-sizing: border-box;
  padding: 0 1.5em;
  height: 100%;
  width: 100%;
  /* background-color: black; */
}
.detail {
  height: 100%;
  /* background-color: red; */
}
.pagination-wrapper {
  margin-top: 10px;
}
</style>
