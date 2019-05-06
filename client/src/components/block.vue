<template>
  <div class="table_cate">
    <table class="fl_tb">
      <tbody>
        <tr>
          <td class="fl_g" width="24.9%"  v-for="(item, index) in first" :key="index">
            <simple
            :detail='item'></simple>
          </td>
        </tr>
        <tr>
          <td class="fl_g" width="24.9%"  v-for="(item, index) in second" :key="index">
            <simple
            :detail='item'></simple>
          </td>
        </tr>
        <tr>
          <td class="fl_g" width="24.9%"  v-for="(item, index) in third" :key="index">
            <simple
            :detail='item'></simple>
          </td>
        </tr>
        <tr>
          <td class="fl_g" width="24.9%"  v-for="(item, index) in fourth" :key="index">
            <simple
            :detail='item'></simple>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Simple from '../components/simpleBlock'
export default {
  data () {
    return {
      first: {},
      second: {},
      third: {},
      fourth: {}
    }
  },
  components: {
    Simple
  },
  mounted () {
    this.initData(this.block)
  },
  props: {
    block: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    initData (blockList) {
      if (blockList.length <= 3) {
        this.first = blockList
      } else if (blockList.length <= 7) {
        this.first = blockList.slice(0, 4)
        this.second = blockList.slice(4, blockList.length)
      } else if (blockList.length <= 11) {
        this.first = blockList.slice(0, 4)
        this.second = blockList.slice(4, 8)
        this.third = blockList.slice(8, blockList.length)
      } else if (blockList.length <= 15) {
        this.first = blockList.slice(0, 4)
        this.second = blockList.slice(4, 8)
        this.third = blockList.slice(8, 12)
        this.fourth = blockList.slice(12, blockList.length)
      }
    }
  }
}
</script>
<style scoped>
.table_cate {
  /* width: 100%; */
  height: 100%;
  background-color: white;
}
table {
  border-collapse: collapse;
}
.fl_tb {
  width: 100%;
}
.forum-info-box {
  width: 100%;
}
.fl_g dt a {
  font-weight: 700;
  font-size: 14px;
  /* float: left; */
  margin-right: 5px;
}
table.forum-info-box td.forum-icon-box {
  width: 1%;
}
.fl_tb td {
  padding: 10px 0;
  background: #fff
    url(http://att.bbs.duowan.com/static/image/common/dwbg_td.png) repeat-x 0
    100%;
  border: 0 none !important;
}
table.forum-info-box td {
  padding: 0 !important;
  background: none !important;
  vertical-align: top;
}
table.forum-info-box td.forum-icon-box {
  padding: 0 !important;
  background: none !important;
  vertical-align: top;
}
</style>
