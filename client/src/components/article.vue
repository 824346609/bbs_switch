<template>
    <div>
        <table>
            <tbody>
                <tr>
                    <td class="pls" rowspan="2">
                        <div class="pls favatar" id="hear123">
                            <div class="pi">
                                <div class="authi" @click="checkUser">
                                    <a>{{comments.userName}}</a>
                                </div>
                            </div>
                            <div>
                                <div class="avatar">
                                    <a>
                                        <img v-if="userInfo.imgUrl" class="fav" v-bind:style="{backgroundImage:'url(' + userInfo.imgUrl + ')'}" lazyloaded="true" width="130" height="133">
                                        <img v-if="userInfo.imgUrl === ''" class="fav" src="http://user.3dmgame.com/data/avatar/007/71/09/06_avatar_middle.jpg" lazyloaded="true" width="130" height="133">
                                    </a>
                                </div>
                            </div>
                            <p class="level"><em><font color="#000000">新手玩家</font></em></p>
                            <dl class="pil cl">
                                <dt>性别</dt>
                                <dd v-if="userInfo.sex === 'male'">男</dd>
                                <dd v-if="userInfo.sex !== 'male'">女</dd>
                                <dt v-if="userInfo.birthday!==''">生日</dt>
                                <dd v-if="userInfo.birthday!==''">{{createDate(userInfo.birthday)}}</dd>
                                <dt v-if="userInfo.authority!==''">权限</dt>
                                <dd v-if="userInfo.authority !== ''&&userInfo.authority!==''">{{userInfo.authority}}</dd>
                                <dd v-if="userInfo.authority === ''&&userInfo.authority!==''">无</dd>
                                <dt>注册时间</dt>
                                <dd>{{createDate(userInfo.createTime)}}</dd>
                            </dl>
                        </div>
                    </td>
                    <td class="plc">
                        <div class="pi">
                            <div class="pti">
                                <div class="authi operate">
                                    <img class="authicn vm" id="authicon221731768" src="../assets/online_member.gif">
                                    <em id="authorposton221731768">发表于 {{formatDate(comments.createTime)}}</em>
                                    <span class="pipe">|</span>
                                    <div class="simple" @click="simple(comments.userId,comments.articleId)"><a rel="nofollow">只看该作者</a></div>
                                    <!-- <span class="none"><img src="../assets/arw_r.gif" class="vm" alt="回帖奖励"></span>
                                    <span class="pipe show">|</span><a href="forum.php?mod=viewthread&amp;tid=5825808&amp;extra=page%3D1&amp;ordertype=1" class="show">倒序浏览</a>
                                    <span class="pipe show">|</span><a href="javascript:;" onclick="readmode($('thread_subject').innerHTML, 221731768);" class="show">阅读模式</a> -->
                                </div>
                            </div>
                        </div>
                        <div class="pct">
                            <div class="pcb">
                                <div class="t_fsz">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <div class="quote" v-if="comments.parentId&&pComment.status!==1">
                                                    <blockquote>
                                                        <font size="2">
                                                          <a href="http://bbs.3dmgame.com/forum.php?mod=redirect&amp;goto=findpost&amp;pid=221025795&amp;ptid=5819639" target="_blank">
                                                          <font color="#999999">{{pComment.userName}} 发表于 {{formatDate(pComment.createTime)}}</font>
                                                          </a>
                                                        </font><br>
                                                        <div v-html="pComment.html"></div>
                                                    </blockquote>
                                                </div>
                                                <div class="quote delete" v-if="pComment.status === 1">
                                                     <blockquote>
                                                        该评论已被删除
                                                    </blockquote>
                                                </div>
                                                <td class="t_f" ><mavonEditor class="markdown" :value="comments.content" :toolbarsFlag="toolbarsFlag" :subfield="toolbarsFlag" codeStyle="dark" defaultOpen="preview"></mavonEditor><br></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="modact" v-if="!this.comments.replyName">
                                        本主题由 {{comments.userName}} 于 {{formatDate(comments.createTime)}} 最终修改
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="plc plm">
                        <div id="p_btn" class="mtw mbm hm cl">
                           <div @click="addCol" class="subscribe"><a id="k_favorite" v-if="!this.comments.replyName"><i><img src="../assets/fav.gif" alt="收藏" >收藏<span id="favoritenumber" style="display:none">0</span></i></a></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="pls"></td>
                    <td class="plc" style="overflow:visible;">
                        <div class="po hin">
                            <div class="pob cl">
                                <em>
                                    <a class="fastre" @click="comment(comments._id)">回复</a>
                                </em>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="ad">
                    <td class="pls"></td>
                    <td class="plc"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
export default {
  data () {
    return {
      pComment: {},
      toolbarsFlag: false,
      userInfo: {}
    }
  },
  components: {
    mavonEditor
  },
  props: {
    comments: {
      type: Object,
      default: () => {
        return []
      }
    },
    art: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.fetchComment(this.comments.parentId)
    this.fetchUserInfo(this.comments.userId)
  },
  methods: {
    fetchUserInfo (id) {
      this.$axios.post('/getUserById', { id: id })
        .then(res => {
          this.userInfo = res.data
          console.log(this.userInfo.birthday==='')
        })
    },
    fetchComment (id) {
      if (id) {
        this.$axios.post('/getCommentById', {id: id}).then(res => {
          this.pComment = res.data
        //   console.log(this.pComment)
        // this._fetchUser(this.userId)
        })
      }
    },
    formatDate (date) {
      return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
    },
    createDate (date) {
      return moment(new Date(date)).format('YYYY-MM-DD')
    },
    comment (id) {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: 'error',
          message: '请先登录!'
        })
        return
      }
      this.$router.push({name: 'comment', params: { id, name: this.$route.params.name, aid: this.$route.params.id }})
    },
    addCol () {
      if (!this.$store.state.isLogin) {
        this.$message({
          type: 'error',
          message: '请先登录!'
        })
        return
      }
      let vaild = confirm('是否加入收藏?')
      if (vaild) {
        this.$axios.post('/addCol', {title: this.art.title, id: this.comments.articleId}).then(res => {
          if (res.errcode === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    simple (uId, aId) {
      this.$router.push({name: 'simple', params: { id: uId, aId }})
    },
    checkUser () {
      this.$router.push({name: 'userDetail', params: {id: this.comments.userId}})
    }
  }
}
</script>
<style scoped>
*{
  padding: 0;
  margin: 0;
  text-decoration: none;
  word-wrap: break-word;
}
.fav {
    background-size: cover !important;
}
.simple {
    cursor: pointer;
    display: inline-block;
}
table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}
.pls {
    width: 160px;
    background: #E5EDF2;
    overflow: hidden;
    border-right: 1px solid #C2D5E3;
}
.pls .favatar {
    background: transparent;
    height: auto;
    border-width: 0px;
    overflow: visible;
}
.pls .pi {
    padding-left: 15px;
}
.pi {
    overflow: hidden;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px dashed #CDCDCD;
}
.pls .avatar {
    margin: 10px 15px;
}
.pls .avatar img {
    /* padding: 5px 5px 8px; */
    background: #FFF url('../assets/midavt_shadow.gif') 0 100% repeat-x;
    width: 120px;
}
.operate {
    text-align: left;
    font-size: 16px;
    padding-left: 1.3rem;
}
dt {
    float: left;
}
dt,dd {
    padding: .1em 0;
    display: block;
    font-weight: 500;
}

.level {
    text-align: left;
    font-size: 12px;
    padding: .5em 0 .5em 2em;
}
.pil {
    padding: .5em 0 .5em 2em;
    font-size: 12px;
}
#p_btn {
    margin-top: -1em;
}
#p_btn a {
    display: inline-block;
    margin-right: 3px;
    padding-right: 4px;
    padding-left: 8px;
    background: url('../assets/share_btn.png') no-repeat 0 0;
    vertical-align: top;
    white-space: nowrap;
}
#p_btn i {
    display: block;
    padding: 8px 8px 8px 0;
    background: url('../assets/share_btn.png') no-repeat 100% 100%;
    font-style: normal;
    cursor: pointer;
}
#p_btn img {
    float: left;
}
#p_btn span {
    padding-left: 2px;
    color: #999;
}
.t_fsz {
    min-height: 100px;
    padding: .5em 1.2em;
}
.pl table {
    width: 100%;
}
.t_f {
    display: block;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
}
.modact {
    display: block;
    height: 32px;
    text-align: center;
    padding: 30px 0 0;
    font-size: 12px;
}
.hin {
    opacity: 0.2;
}
.po {
    border-top: 1px dashed #CDCDCD;
}
.pob {
    line-height: 36px;
}
.pob em {
    float: left;
}
em {
    font-style: normal;
}
.pob em a {
    padding: 5px 10px 5px 25px;
}
.fastre {
    background: url('../assets/fastreply.gif') no-repeat 0 50%;
}
.hin:hover {
    cursor: pointer;
    opacity: 1;
}
.ad .pls {
    background: #C2D5E3;
    padding: 0;
    height: 4px;
}
.ad .plc {
    background: #E5EDF2;
    padding: 0;
    overflow: hidden;
}
.quote {
    padding-bottom: 5px;
    background: #F9F9F9 url('../assets/icon_quote_s.gif') no-repeat 20px 6px;
}
.quote, .blockcode {
    margin: 10px 0;
    padding: 10px 10px 10px 65px;
    zoom: 1;
}
.quote blockquote {
    display: inline-block;
    margin: 0;
    padding: 0 65px 5px 0;
    background: url('../assets/icon_quote_e.gif') no-repeat 100% 100%;
    line-height: 1.6;
    zoom: 1;
    white-space: nowrap;
    overflow: hidden;
    width: 300px;
    text-overflow: ellipsis;
}
.subscribe {
    text-align: center;
}
.delete > blockquote{
    font-weight: 900;
}
.authi {
    cursor: pointer;
}
</style>
