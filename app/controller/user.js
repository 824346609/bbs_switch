'use strict';

const Controller = require('egg').Controller;
const tc = require('text-censor');
class UserController extends Controller {
  // 获取验证码
  async getCaptcha() {
    const { ctx } = this;
    const captcha = ctx.service.user.getCaptcha();
    ctx.session.code = captcha.text;
    ctx.body = captcha.data;
  }
  // 注册接口
  async register() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    console.log(ctx.request.body);
    const { username, password, nickName, code } = ctx.request.body;
    const isCaptchaVali = ctx.service.user.checkCaptcha(code);
    if (!isCaptchaVali) {
      resMsg.errcode = 1;
      resMsg.msg = '验证码错误';
      ctx.body = resMsg;
      return;
    }
    const userData = await ctx.service.user.register({ username, password, nickName });
    if (userData.code === -1) {
      resMsg.errcode = 2;
      resMsg.msg = '用户名已存在';
      ctx.body = resMsg;
      return;
    } else if (userData.code === 1) {
      resMsg.errcode = 3;
      resMsg.msg = '注册成功';
      ctx.body = resMsg;
      return;
    }
  }
  // 登录接口
  async getUser() {
    let resMsg = [];
    const { ctx } = this;
    const { username, password, code } = ctx.request.body;
    resMsg = {
      errcode: 0,
      data: {},
      msg: '登录成功',
    };
    const isCaptchaVali = ctx.service.user.checkCaptcha(code);
    if (!isCaptchaVali) {
      resMsg.errcode = 1;
      resMsg.msg = '验证码错误';
      ctx.body = resMsg;
      return;
    }
    const userData = await ctx.service.user.getUser({ username, password });
    if (!userData) {
      resMsg.errcode = 2;
      resMsg.msg = '用户名或密码错误';
      ctx.body = resMsg;
      return;
    }
    resMsg.token = userData.token;
    resMsg.data = {
      nickName: userData.user.nickName,
      uid: userData.user._id,
      authority: userData.user.authority,
    };
    ctx.body = resMsg;
  }
  // 查询用户信息
  async findUser() {
    const { ctx } = this;
    const userMsg = {
      _id: ctx.params._id,
    };
    // const userMsg = ctx.request.body;
    // if (!userMsg.userId) {
    //   const res = {};
    //   res.code = 0;
    //   res.msg = '用户查询信息不能为空';
    // }
    const result = await ctx.service.user.findUser(userMsg);
    ctx.response.body = result;
  }
  // 分类列表页获取分类列表
  async getCategoryList() {
    const { ctx } = this;
    const id = 'admin';
    const page = ctx.query.page;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.user.getCategoryList(id, page);
    resMsg.data = res;
    ctx.body = resMsg;
  }
  // 创建分类
  async createCategory() {
    const { ctx } = this;
    const { categoryName, userId } = ctx.request.body;
    let res;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '分类新增成功',
    };
    const isNew = await ctx.service.user.checkDuplicateCategory(categoryName, userId);
    if (!isNew) {
      resMsg.msg = '该分类已存在';
      resMsg.errcode = 1;
    } else {
      res = await ctx.service.user.createCategory(categoryName, userId);
      if (!res._id) {
        resMsg.msg = '分类新增失败';
      }
    }
    ctx.body = resMsg;
  }
  // 删除分类信息
  async delCategory() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '分类删除成功',
    };
    let res;
    if (id instanceof Array) {
      res = await ctx.service.user.delCategoryBatch(id);
    } else if (typeof id === 'string') {
      res = await ctx.service.user.delCategory(id);
    } else {
      resMsg.msg = '参数类型应为数组或字符串';
      resMsg.errcode = 1;
      ctx.body = resMsg;
      return;
    }
    if (res.n === 0) {
      resMsg.msg = '分类不存在';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 修改分类信息
  async modifyCategory() {
    const { ctx } = this;
    const { category } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '分类修改成功',
    };
    const res = await ctx.service.user.modifyCategory(category);
    if (res.n === 0) {
      resMsg.msg = '该分类id不存在';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 编辑文章页获取用户的标签和分类数据
  async getArticleOptions() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const categoryListPromise = ctx.service.user.getCategoryListById('admin');
    const categoryList = await categoryListPromise;
    resMsg.data = {
      categoryList,
    };
    ctx.body = resMsg;
  }
  // 创建或更新文章，如果有文章id就更新文章，否则新建文章
  async postArticle() {
    const { ctx } = this;
    const { title, content } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    let vContent = '';
    tc.filter(ctx.request.body.content, function(err, censored) {
      vContent = censored;
    });
    if (!title || !content) {
      resMsg.errcode = 1;
      resMsg.msg = '请完整填写文章信息';
      ctx.body = resMsg;
      return;
    }
    let valid = '';
    tc.filter(ctx.request.body.title, function(err, censored) {
      valid = censored;
    });
    if ((title.split('*').length - 1 !== valid.split('*').length - 1) || (content.split('*').length - 1 !== vContent.split('*').length - 1)) {
      resMsg.errcode = 1;
      resMsg.msg = '请注意标题用词规范';
      ctx.body = resMsg;
      return;
    }
    // 如果有文章id就更新文章，否则新建文章
    // console.log('文章id = ' + ctx.request.body.id);
    if (ctx.request.body.id) {
      const res = await ctx.service.user.updateArticle(ctx.request.body.id);
      // resMsg.data = res.oldStatus;
      resMsg.data.id = res.oldStatus._id;
      // resMsg.data._id = ;
      resMsg.msg = '文章修改成功';
      if (res.oldStatus.status !== ctx.request.body.status) {
        resMsg.msg = '文章发布成功';
      }
    } else {
      const res = await ctx.service.user.createArticle();
      // console.log(res);
      resMsg.data.id = res._id;
      resMsg.msg = '文章发布成功';
      if (res.status === 1) {
        resMsg.msg = '文章已存入草稿箱';
      }
    }
    ctx.body = resMsg;
  }
  /**
   * 根据文章id查询文章内容
   */
  async getArticleDetail() {
    const { ctx } = this;
    const articleId = ctx.request.body.id;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const articleDetail = await ctx.service.user.getArticleDetailById(articleId);
    resMsg.data = articleDetail[0];
    if (articleDetail[0].status === 1) {
      resMsg.msg = '帖子已被删除';
    }
    ctx.body = resMsg;
  }
  // 获取所有文章列表
  async getArticleList() {
    const { ctx } = this;
    const { status = 0 } = ctx.query;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const articleList = await ctx.service.user.getArticleList(ctx.request.body.page, ctx.request.body.block, status);
    // console.log(' 帖子: ' + articleList);
    resMsg.data = {
      list: articleList.list,
      count: articleList.count,
    };
    ctx.body = resMsg;
  }
  // 删除文章
  async delArticle() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.user.delArticleById(id);
    if (res.n > 0) {
      resMsg.msg = '文章删除成功';
    } else {
      resMsg.msg = '文章删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量删除文章
  async delArticleBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.user.delArticleBatch(list);
    if (res.n > 0) {
      resMsg.msg = '文章删除成功';
    } else {
      resMsg.msg = '文章删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 创建或更新评论，如果有评论id就更新评论，否则新建评论
  async postComment() {
    const { ctx } = this;
    let resMsg = {};
    const { content } = ctx.request.body;
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    let vContent = '';
    tc.filter(ctx.request.body.content, function(err, censored) {
      vContent = censored;
    });
    if (ctx.request.body.content.split('*').length - 1 !== vContent.split('*').length - 1) {
      resMsg.errcode = 1;
      resMsg.msg = '请注意标题用词规范';
      ctx.body = resMsg;
      return;
    }
    if (!content) {
      resMsg.errcode = 1;
      resMsg.msg = '请完整填写评论信息';
      ctx.body = resMsg;
      return;
    }
    // console.log(ctx.request.body);
    // 如果有评论id就更新评论，否则新建评论
    if (ctx.request.body.cid) {
      const res = await ctx.service.user.updateComment(ctx.request.body.cid);
      // console.log(123123);
      // console.log(res.oldStatus.status);
      resMsg.data.id = res.data._id;
      resMsg.data = res.oldStatus;
      resMsg.msg = '评论修改成功';
      if (res.oldStatus.status !== ctx.request.body.status) {
        resMsg.msg = '评论回复成功';
      }
    } else {
      const res = await ctx.service.user.createComment();
      resMsg.data.id = res._id;
      resMsg.msg = '评论回复成功';
      if (res.status === 1) {
        resMsg.msg = '评论已存入草稿箱';
      }
    }
    ctx.body = resMsg;
  }
  // 根据用户id获取用户所有评论
  async getUserComment() {
    const { ctx } = this;
    const { keyword = '', status = 0 } = ctx.query;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    console.log(ctx.request.body);
    const commentList = await ctx.service.user.getUserComment(ctx.request.body.id, ctx.request.body.page, keyword, status);
    console.log(commentList);
    resMsg.data = {
      list: commentList.list,
      count: commentList.count,
    };
    ctx.body = resMsg;
  }
  // 根据帖子id获取所有评论
  async getCommentList() {
    const { ctx } = this;
    // console.log('userid:' + ctx.userId);
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const commentList = await ctx.service.user.getCommentList(ctx.request.body.page);
    // console.log(commentList);
    resMsg.data = {
      list: commentList.list,
      count: commentList.count,
    };
    ctx.body = resMsg;
  }
  /*
    通过评论id获取评论
  */
  async getCommentById() {
    const { ctx } = this;
    // console.log(ctx.request.body.id);
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    // console.log(ctx.request.body);
    const comment = await ctx.service.user.getCommentById(ctx.request.body.id);
    // console.log(comment);
    resMsg.data = {
      // list: comment.list,
      // count: comment.count,content:
      cid: comment[0]._id,
      userName: comment[0].userName,
      content: comment[0].content,
      userId: comment[0].userId,
      articleId: comment[0].articleId,
      createTime: comment[0].createTime,
      status: comment[0].status,
      html: comment[0].html,
      block: comment[0].block,
    };
    ctx.body = resMsg;
  }
  /*
    通过Id获取用户
  */
  async getUserById() {
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const {
      ctx,
    } = this;
    console.log(ctx.request.body.id);
    const userData = await ctx.model.User.find({ _id: ctx.request.body.id });
    resMsg.data = userData[0];
    ctx.body = resMsg;
  }
  /*
    保存用户个人信息
  */
  async saveInfo() {
    const { ctx } = this;
    // console.log(ctx.request.body);
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '保存成功',
    };
    // console.log(ctx.request.body);
    const user = await ctx.service.user.saveInfo(ctx.userId);
    console.log(user);
    ctx.body = resMsg;
  }
  /*
    搜索功能
  */
  async search() {
    const { ctx } = this;
    console.log(ctx.request.body);
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    console.log(ctx.request.body);
    const result = await ctx.service.user.search(ctx.request.body.keyword, ctx.request.body.page);
    console.log(result);
    resMsg.data = {
      list: result.list,
      count: result.count,
    };
    ctx.body = resMsg;
  }
  /*
    回复提示
  */
  async getBadge() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.getBadge();
    resMsg.data = {
      badge: result[0].badge,
      updateTime: result[0].updateTime,
    };
    ctx.body = resMsg;
  }
  /*
    获取回复列表
  */
  async getReplyList() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    console.log(ctx.request.body.nickName, ctx.request.body.page);
    const result = await ctx.service.user.getReplyList(ctx.request.body.nickName, ctx.request.body.page);
    // console.log(result);
    resMsg.data = {
      list: result.list,
      count: result.count,
    };
    ctx.body = resMsg;
  }
  /*
    获取回复列表
  */
  async updateUser() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.updateUser(ctx.userId);
    console.log(result);
    resMsg.data = {
      data: result,
    };
    ctx.body = resMsg;
  }
  /*
    获取回复列表
  */
  async addCol() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.addCol(ctx.request.body.id);
    if (result.code === -1) {
      resMsg.errcode = 2;
      resMsg.msg = '帖子已存在';
      ctx.body = resMsg;
      return;
    } else if (result.code === 1) {
      resMsg.errcode = 3;
      resMsg.msg = '收藏成功';
      ctx.body = resMsg;
      return;
    }
    ctx.body = resMsg;
  }
  /*
    获取收藏列表
  */
  async getColList() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.getColList(ctx.request.body.page, ctx.userId);
    // console.log(result);
    resMsg.data = {
      list: result.list,
      count: result.count,
    };
    ctx.body = resMsg;
  }
  /*
    删除收藏
  */
  async delCollection() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.delCollection(ctx.request.body.id);
    resMsg.data = result;
    ctx.body = resMsg;
  }
  /*
    批量删除收藏
  */
  async delCollectionBatch() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.delCollectionBatch(ctx.request.body.list);
    resMsg.data = result;
    ctx.body = resMsg;
  }
  /*
    获取收藏贴的最后浏览日期
  */
  async collectionDate() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.collectionDate();
    for (let i = 0; i < result.length; i++) {
      // Tue Jan 15 2019 16:18:50 GMT+0800 (CST) 大
      // Tue Jan 15 2019 15:53:05 GMT+0800 (CST) 小
      console.log(i);
      console.log(result[i].updateTime);
      if (Date.parse(ctx.request.body.time) < Date.parse(result[i].updateTime)) {
        resMsg.data = true;
        ctx.body = resMsg;
        return;
      }
    }
    resMsg.data = false;
    ctx.body = resMsg;
  }
  /*
    更新收藏帖子最后查看时间时间
  */
  async updateCollection() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.updateCollection();
    resMsg.data = result;
    ctx.body = resMsg;
  }
  /*
    查询用户发的帖子
  */
  async getArticleListByUserName() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    console.log(ctx.request.body);
    const result = await ctx.service.user.getArticleListByUserName(ctx.request.body.page, ctx.request.body.id);
    resMsg.data = {
      list: result.list,
      count: result.count,
    };
    ctx.body = resMsg;
  }
  /*
    只看该作者
  */
  async simple() {
    const { ctx } = this;
    const { uId, aId, page } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.service.user.simple(uId, aId, page);
    console.log(result);
    resMsg.data = {
      list: result.list,
      count: result.count,
    };
    ctx.body = resMsg;
  }
  /*
    git接口
  */
  async getInfo() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '操作成功',
    };
    const result = await ctx.curl('https://github.com/login/oauth/access_token', {
      // method is required
      method: 'POST',
      contentType: 'json',
      data: {
        client_id: 'c000ae43a68b793930b3',
        client_secret: '1547a8d2f569705111d8e66f14b521760deadc60',
        code: ctx.request.body.code,
      },
      dataType: 'json',
      // telling HttpClient to process the return body as JSON format explicitly
    });
    const getInfo = await ctx.curl('https://api.github.com/user?access_token=' + result.data.access_token, {
      method: 'GET',
      contentType: 'json',
      dataType: 'json',
    }
    );
    resMsg.data = getInfo.data;
    ctx.body = resMsg;
  }
  /*
    更新收藏帖子最后查看时间时间
  */
  async getGitUser() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const userData = await ctx.service.user.getGitUser(ctx.request.body.id);
    if (!userData) {
      resMsg.data = {
        errcode: 0,
        data: {},
        msg: '操作成功',
      };
      ctx.body = resMsg;
      return;
    }
    resMsg.data = userData;
    resMsg.token = userData.token;
    resMsg.data = {
      nickName: userData.user.nickName,
      uid: userData.user._id,
    };
    ctx.body = resMsg;
  }
  async getBlockList() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const blockData = await ctx.service.user.getBlockList(ctx.request.body.id);
    resMsg.data = blockData;
    ctx.body = resMsg;
  }
  async resetPass() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const userData = await ctx.service.user.resetPass(ctx.userId);
    resMsg.data = userData;
    ctx.body = resMsg;
  }
  async getModerator() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const userData = await ctx.service.user.getModerator(ctx.request.body.block);
    resMsg.data = userData;
    ctx.body = resMsg;
  }
  async topHandle() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const articleData = await ctx.service.user.topHandle(ctx.request.body.id);
    resMsg.data = articleData;
    ctx.body = resMsg;
  }
  async canHandle() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const articleData = await ctx.service.user.canHandle(ctx.request.body.id);
    resMsg.data = articleData;
    ctx.body = resMsg;
  }
}
module.exports = UserController;

