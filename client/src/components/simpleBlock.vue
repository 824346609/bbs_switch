<template>
    <table class="forum-info-box">
      <tbody>
        <tr>
          <td class="forum-icon-box">
            <div class="fl_icn_g forum_index">
              <a href target="_blank">
                <img src="../assets/NS.jpg" align="left" style="margin: 0 10px;">
              </a>
            </div>
          </td>
          <td>
            <dt>
              <div
                style="text-align:left;margin: 0 0 10px 0"
                width="100%"
                @click="area"
                class="area"
              >
                <a>{{detail.abbreviation}}</a>
              </div>
            </dt>
            <dd>
              <div style="text-align:left;" width="100%">
                <a href target="_blank">
                  <font color="red">分区1</font>
                </a>
                |
                <a href target="_blank">
                  <font color="red">分区1</font>
                </a>
                |
                <a href target="_blank">
                  <font color="red">分区1</font>
                </a>
                |
                <a href target="_blank">
                  <font color="red">分区1</font>
                </a>
              </div>
            </dd>
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  methods: {
    area () {
      this.$router.push({name: 'articleList', params: { name: this.detail.name }})
    }
  }
}
</script>
<style scoped>
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
