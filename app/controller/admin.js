'use strict';

const jwt = require('jsonwebtoken');
const Controller = require('egg').Controller;

class AdminController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.allUser();
  }
  async addAdmin() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const adminData = ctx.service.admin.addAdmin();
    console.log(adminData);
    resMsg.errcode = 3;
    resMsg.msg = '注册成功';
    ctx.body = resMsg;
    return;

  }
  async login() {
    const { ctx, app } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const adminData = await ctx.model.Admin.findOne({ userName: ctx.request.body.username, password: ctx.request.body.password }, { __v: 0 });
    if (adminData === null) {
      resMsg.errcode = 3;
      resMsg.msg = '账号密码错误';
      ctx.body = resMsg;
      return;
    }
    const token = jwt.sign({
      id: adminData._id,
    }, app.config.jwt.cert, {
      expiresIn: '10h', // token过期时间
    });
    resMsg.token = token;
    resMsg.data = {
      userName: adminData.userName,
      uid: adminData._id,
    };
    ctx.body = resMsg;
  }
  async articleList() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const articleData = await ctx.service.admin.articleList();
    resMsg.data = {
      list: articleData.list,
      count: articleData.count,
    };
    ctx.body = resMsg;
  }
  async userList() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const articleData = await ctx.service.admin.userList();
    resMsg.data = {
      list: articleData.list,
      count: articleData.count,
    };
    ctx.body = resMsg;
  }
  async commentList() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const articleData = await ctx.service.admin.commentList();
    resMsg.data = {
      list: articleData.list,
      count: articleData.count,
    };
    ctx.body = resMsg;
  }
  async blockList() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const articleData = await ctx.service.admin.blockList();
    resMsg.data = {
      list: articleData.list,
      count: articleData.count,
    };
    ctx.body = resMsg;
  }
  async comment() {
    const { ctx } = this;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const comment = await ctx.service.admin.comment(ctx.request.body.id);
    resMsg.data = comment[0];
    ctx.body = resMsg;
  }
  // 恢复文章
  async reArticle() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reArticleById(id);
    if (res.n > 0) {
      resMsg.msg = '文章恢复成功';
    } else {
      resMsg.msg = '文章恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量恢复文章
  async reArticleBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reArticleBatch(list);
    if (res.n > 0) {
      resMsg.msg = '文章恢复成功';
    } else {
      resMsg.msg = '文章恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 删除用户
  async delUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.delUserById(id);
    if (res.n > 0) {
      resMsg.msg = '用户删除成功';
    } else {
      resMsg.msg = '用户删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量删除用户
  async delUserBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.delUserBatch(list);
    if (res.n > 0) {
      resMsg.msg = '用户删除成功';
    } else {
      resMsg.msg = '用户删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 恢复用户
  async reUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reUserById(id);
    if (res.n > 0) {
      resMsg.msg = '用户恢复成功';
    } else {
      resMsg.msg = '用户恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量恢复用户
  async reUserBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reUserBatch(list);
    if (res.n > 0) {
      resMsg.msg = '用户恢复成功';
    } else {
      resMsg.msg = '用户恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 删除评论
  async delComment() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.delCommentById(id);
    if (res.n > 0) {
      resMsg.msg = '评论删除成功';
    } else {
      resMsg.msg = '评论删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量删除评论
  async delCommentBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.delCommentBatch(list);
    if (res.n > 0) {
      resMsg.msg = '评论删除成功';
    } else {
      resMsg.msg = '评论删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 恢复评论
  async reComment() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reCommentById(id);
    if (res.n > 0) {
      resMsg.msg = '评论恢复成功';
    } else {
      resMsg.msg = '评论恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量恢复评论
  async reCommentBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reCommentBatch(list);
    if (res.n > 0) {
      resMsg.msg = '评论恢复成功';
    } else {
      resMsg.msg = '评论恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 删除板块
  async delBlock() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    console.log(123);
    const res = await ctx.service.admin.delBlockById(id);
    if (res.n > 0) {
      resMsg.msg = '板块删除成功';
    } else {
      resMsg.msg = '板块删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量删除板块
  async delBlockBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.delBlockBatch(list);
    if (res.n > 0) {
      resMsg.msg = '板块删除成功';
    } else {
      resMsg.msg = '板块删除失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 恢复板块
  async reBlock() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reBlockById(id);
    if (res.n > 0) {
      resMsg.msg = '板块恢复成功';
    } else {
      resMsg.msg = '板块恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 批量恢复板块
  async reBlockBatch() {
    const { ctx } = this;
    const { list } = ctx.request.body;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    const res = await ctx.service.admin.reBlockBatch(list);
    if (res.n > 0) {
      resMsg.msg = '板块恢复成功';
    } else {
      resMsg.msg = '板块恢复失败';
      resMsg.errcode = 1;
    }
    ctx.body = resMsg;
  }
  // 搜索
  async search() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: 'success',
    };
    let result = {};
    const keyword = ctx.request.body.keyword;
    const reg = new RegExp(keyword, 'i');
    if (ctx.request.body.model === 'user') {
      // ({ status, $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] }, { content: 0 }))
      // return await ctx.model.Article.find({ title: { $regex: reg } });
      result = await ctx.model.User.find({ $or: [{ nickName: { $regex: reg } }, { userName: { $regex: reg } }] });
    } else if (ctx.request.body.model === 'article') {
      // ctx.model.Article.find({ $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] }).count()
      result = await ctx.model.Article.find({ $or: [{ title: { $regex: reg } }, { userName: { $regex: reg } }] });
    } else if (ctx.request.body.model === 'comment') {
      result = await ctx.model.Comment.find({ $or: [{ userName: { $regex: reg } }, { content: { $regex: reg } }] });
    } else if (ctx.request.body.model === 'block') {
      result = await ctx.model.Block.find({ $or: [{ name: { $regex: reg } }, { abbreviation: { $regex: reg } }] });
    }
    resMsg.data = result;
    ctx.body = resMsg;
  }
  // 新建板块
  async createBlock() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const blockData = await ctx.service.admin.createBlock(ctx.request.body.name, ctx.request.body.abbreviation);
    if (blockData.code === -1) {
      resMsg.errcode = 2;
      resMsg.msg = '板块或中文名已存在';
      ctx.body = resMsg;
      return;
    } else if (blockData.code === 1) {
      resMsg.errcode = 3;
      resMsg.msg = '操作成功成功';
      ctx.body = resMsg;
      return;
    }
    resMsg.data = blockData;
    ctx.body = resMsg;
  }
  // 版主设定
  async moderator() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 1,
      data: {},
      msg: '操作成功',
    };
    const userData = await ctx.service.admin.moderator(ctx.request.body.id, ctx.request.body.authority);
    resMsg.data = userData;
    ctx.body = resMsg;
  }
}

module.exports = AdminController;
