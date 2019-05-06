'use strict';
const Service = require('egg').Service;

class AdminService extends Service {
  async addAdmin() {
    const { ctx } = this;
    return await ctx.model.Admin.create({ userName: 'admin', password: 'admin', createTime: Date() });
  }
  async articleList() {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Article.find().sort({ updateTime: -1 }),
      ctx.model.Article.find().count(),
    ]);
    return {
      list,
      count,
    };
  }
  async userList() {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.User.find().sort({ updateTime: -1 }),
      ctx.model.User.find().count(),
    ]);
    return {
      list,
      count,
    };
  }
  async commentList() {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find().sort({ updateTime: -1 }),
      ctx.model.Comment.find().count(),
    ]);
    return {
      list,
      count,
    };
  }
  async blockList() {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Block.find().sort({ updateTime: -1 }),
      ctx.model.Block.find().count(),
    ]);
    return {
      list,
      count,
    };
  }
  async comment(id) {
    const { ctx } = this;
    return ctx.model.Comment.find({ _id: id });
  }
  // 根据帖子id恢复帖子
  async reArticleById(id) {
    const { ctx } = this;
    return await ctx.model.Article.update({ _id: id }, { status: 0 });
  }
  // 根据帖子id的数组批量恢复帖子
  async reArticleBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Article.update({ _id: { $in: list } }, { status: 0 }, { multi: true });
  }
  // 根据用户id恢复用户
  async reUserById(id) {
    const { ctx } = this;
    return await ctx.model.User.update({ _id: id }, { status: 0 });
  }
  // 根据用户id的数组批量恢复用户
  async reUserBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.User.update({ _id: { $in: list } }, { status: 0 }, { multi: true });
  }
  // 根据用户id删除用户
  async delUserById(id) {
    const { ctx } = this;
    return await ctx.model.User.update({ _id: id }, { status: 1 });
  }
  // 根据用户id的数组批量删除用户
  async delUserBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.User.update({ _id: { $in: list } }, { status: 1 }, { multi: true });
  }
  // 根据评论id恢复评论
  async reCommentById(id) {
    const { ctx } = this;
    return await ctx.model.Comment.update({ _id: id }, { status: 0 });
  }
  // 根据评论id的数组批量恢复评论
  async reCommentBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Comment.update({ _id: { $in: list } }, { status: 0 }, { multi: true });
  }
  // 根据评论id删除评论
  async delCommentById(id) {
    const { ctx } = this;
    return await ctx.model.Comment.update({ _id: id }, { status: 1 });
  }
  // 根据评论id的数组批量删除评论
  async delCommentBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Comment.update({ _id: { $in: list } }, { status: 1 }, { multi: true });
  }
  // 根据板块id恢复板块
  async reBlockById(id) {
    const { ctx } = this;
    return await ctx.model.Block.update({ _id: id }, { status: 0 });
  }
  // 根据板块id的数组批量恢复板块
  async reBlockBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Block.update({ _id: { $in: list } }, { status: 0 }, { multi: true });
  }
  // 根据板块id删除板块
  async delBlockById(id) {
    const { ctx } = this;
    return await ctx.model.Block.update({ _id: id }, { status: 1 });
  }
  // 根据板块id的数组批量删除板块
  async delBlockBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Block.update({ _id: { $in: list } }, { status: 1 }, { multi: true });
  }
  // 任命版主
  async moderator(id, authority) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.User.update({ _id: id }, {
      authority,
    });
  }
  // 新建板块
  async createBlock(name, abbreviation) {
    const { ctx } = this;
    const res = {};
    const queryName = await ctx.model.Block.findOne({
      name,
    });
    const queryabbreviation = await ctx.model.Block.findOne({
      abbreviation,
    });
    if (queryName) {
      res.code = -1;
      res.msg = '板块已存在';
    } else if (queryabbreviation) {
      res.code = -1;
      res.msg = '中文名已存在';
    } else {
      const result = await ctx.model.Block.create({ name, abbreviation, status: 0 });
      res.data = result;
      res.code = 1;
      res.msg = '注册成功';
    }
    return res;
  }
}

module.exports = AdminService;
