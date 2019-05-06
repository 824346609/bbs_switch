'use strict';
const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
class UserService extends Service {
  // 生成验证码
  getCaptcha() {
    return svgCaptcha.create({
      width: 85,
      height: 38,
    });
  }
  // 检查验证码正确
  checkCaptcha(code) {
    const { ctx } = this;
    code = code.toLowerCase();
    const sessCode = ctx.session.code ? ctx.session.code.toLowerCase() : null; // 拿到之前存在session中的验证码
    // 进行验证
    if (code === sessCode) {
      // 成功后验证码作废
      ctx.session.code = null;
    }
    return code === sessCode;
  }
  async allUser() {
    const {
      ctx,
    } = this;
    const userData = await ctx.model.User.find();
    return userData;
  }
  // 获取用户
  async getUser({ username, password }) {
    const { ctx, app } = this;
    const userData = await ctx.model.User.find({
      userName: username,
      password,
      status: 0,
    }, { password: 0, __v: 0 });
    // 找不到则返回false
    if (userData.length === 0) {
      return false;
    }
    // console.log(userData);
    // 找到则以用户id生成token
    const token = jwt.sign({
      id: userData[0]._id,
    }, app.config.jwt.cert, {
      expiresIn: '10h', // token过期时间
    });
    return {
      user: userData[0],
      token,
    };
  }
  // 注册
  async register({ username, password, nickName }) {
    const { ctx } = this;
    const res = {};
    const queryName = await ctx.model.User.findOne({
      userName: username,
    });
    const queryNick = await ctx.model.User.findOne({
      nickName,
    });
    if (queryName) {
      res.code = -1;
      res.msg = '用户已存在';
    } else if (queryNick) {
      res.code = -1;
      res.msg = '用户名已存在';
    } else {
      const result = await ctx.model.User.create({
        userName: username,
        password,
        nickName,
        gitId: ctx.request.body.gitId ? ctx.request.body.gitId : '',
        sex: '',
        birthday: '',
        region: '',
        authority: '',
        col: '',
        imgUrl: 'http://user.3dmgame.com/data/avatar/007/71/09/06_avatar_middle.jpg',
        createTime: Date(),
        updateTime: Date(),
        status: 0,
      });
      res.data = result;
      res.code = 1;
      res.msg = '注册成功';
    }
    return res;
  }
  // 检查重复分类
  async checkDuplicateCategory(categoryName) {
    const { ctx } = this;
    const res = await ctx.model.Category.find({ categoryName });
    return res.length === 0;
  }
  // 创建分类
  async createCategory(categoryName, userId) {
    const { ctx } = this;
    // console.log(' categoryName = ' + categoryName);
    // console.log(' useName = ' + userId);
    return await ctx.model.Category.create({ categoryName, userId });
  }
  // 分类列表页获取分类列表，包括数量
  async getCategoryList(userId, page) {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Category.find({ userId }, { __v: 0, userId: 0 }).limit(10).skip((page - 1) * 10),
      ctx.model.Category.find({ userId }, { __v: 0, userId: 0 }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 删除分类信息
  async delCategory(id) {
    const { ctx } = this;
    return await ctx.model.Category.remove({ _id: id });
  }
  // 批量删除分类信息
  async delCategoryBatch(list) {
    const { ctx } = this;
    return await ctx.model.Category.remove({ _id: { $in: list } });
  }
  // 修改分类信息
  async modifyCategory({ _id, categoryName }) {
    const { ctx } = this;
    return await ctx.model.Category.update({ _id }, { categoryName });
  }
  // 根据用户id获取分类列表，只返回所有分类，用于文章编辑页
  async getCategoryListById(id) {
    const { ctx } = this;
    return await ctx.model.Category.find({ userId: id }, { __v: 0, userId: 0 });
  }
  // 更新文章
  async updateArticle(id) {
    const { ctx } = this;
    // let title = '';
    // title = tc.filter(ctx.request.body.title, function(err, censored) {
    //   title = censored;
    // });
    const [ oldArticle, res ] = await Promise.all([
      ctx.model.Article.findOne({ _id: id }),
      ctx.model.Article.update({ _id: id }, {
        userId: ctx.userId,
        categoryId: ctx.request.body.category || null,
        title: ctx.request.body.title,
        updateTime: Date(),
        status: ctx.request.body.status,
      }),
    ]);
    if (res.n > 0) {
      return {
        data: res,
        oldStatus: oldArticle,
      };
    }
  }
  // 创建文章
  async createArticle() {
    const { ctx } = this;
    // let title = '';
    // title = tc.filter(ctx.request.body.titlet, function(err, censored) {
    //   title = censored;
    // });
    return await ctx.model.Article.create({
      userId: ctx.userId,
      categoryId: ctx.request.body.category || null,
      block: ctx.request.body.block,
      title: ctx.request.body.title,
      userName: ctx.request.body.userName,
      top: false,
      createTime: Date(),
      updateTime: Date(),
      badge: false,
      status: ctx.request.body.status,
    });
  }
  // eslint-disable-next-line valid-jsdoc
  /**
   * 查询用户发的帖子
   */
  async getArticleListByUserName(page, id) {
    const { ctx } = this;
    console.log(page, id);
    const [ list, count ] = await Promise.all([
      ctx.model.Article.find({ userName: id, status: 0 }).limit(10)
        .skip((page - 1) * 10),
      ctx.model.Article.find({ userName: id, status: 0 }).count(),
    ]);
    return {
      list,
      count,
    };
    // return await ctx.model.Article.find({ userId: id });
  }
  // eslint-disable-next-line valid-jsdoc
  /**
   * 根据文章id查询文章内容
   */
  async getArticleDetailById(id) {
    const { ctx } = this;
    // console.log('articleId= ' + id);
    return await ctx.model.Article.find({ _id: id }, { html: 0 }).populate([{ path: 'categoryId', select: 'categoryName' }]);
  }
  // 根据板块获取文章列表
  async getArticleList(page, block, status) {
    const { ctx } = this;
    // const reg = new RegExp(keyword, 'i');
    // console.log('keyword: ' + keyword);
    const [ list, count ] = await Promise.all([
      ctx.model.Article.find({ status, block }).limit(10).skip((page - 1) * 10),
      ctx.model.Article.find({ status, block }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 根据文章id删除文章
  async delArticleById(id) {
    const { ctx } = this;
    return await ctx.model.Article.update({ _id: id }, { status: 1 });
  }
  // 根据文章id的数组批量删除文章
  async delArticleBatch(list) {
    const { ctx } = this;
    // console.log('truly = ' + ctx.request.body.truly);
    return await ctx.model.Article.update({ _id: { $in: list } }, { status: 1 }, { multi: true });
  }
  // 更新评论
  async updateComment(id) {
    const { ctx } = this;
    // let content = '';
    // content = tc.filter(ctx.request.body.content, function(err, censored) {
    //   content = censored;
    // });
    const [ oldComment, res ] = await Promise.all([
      ctx.model.Comment.findOne({ _id: id }),
      ctx.model.Comment.update({ _id: id }, {
        content: ctx.request.body.content,
        html: ctx.request.body.html,
        updateTime: Date(),
        status: ctx.request.body.status,
      }),
    ]);
    if (res.n > 0) {
      return {
        data: res,
        oldStatus: oldComment,
      };
    }
  }
  // 创建评论
  async createComment() {
    const { ctx } = this;
    console.log(ctx.request.body.replyName);
    let badge = true;
    if (ctx.request.body.replyName === ctx.request.body.userName) {
      badge = false;
    }
    return await Promise.all([
      ctx.model.Comment.create({
        articleId: ctx.request.body.articleId,
        parentId: ctx.request.body.parentId,
        userId: ctx.userId,
        replyName: ctx.request.body.replyName,
        userName: ctx.request.body.userName,
        content: ctx.request.body.content,
        html: ctx.request.body.html,
        block: ctx.request.body.block,
        createTime: Date(),
        updateTime: Date(),
        status: ctx.request.body.status,
      }),
      ctx.model.User.update({ nickName: ctx.request.body.replyName }, {
        badge,
        updateTime: Date(),
      }),
      ctx.model.Article.update({ _id: ctx.request.body.articleId }, {
        updateTime: Date(),
      }),
      ctx.model.Collection.updateMany({ articleId: ctx.request.body.articleId }, {
        updateTime: Date(),
      }),
    ]);
  }
  // 根据帖子id获取所有评论
  // eslint-disable-next-line no-dupe-class-members
  async getCommentList(page) {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find({ articleId: ctx.request.body.id, status: 0 }).limit(10).skip((page - 1) * 10),
      ctx.model.Comment.find({ articleId: ctx.request.body.id, status: 0 }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 根据用户id获取用户所有评论
  // eslint-disable-next-line no-dupe-class-members
  async getUserComment(id, page, keyword, status) {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find({ status, userId: id }).limit(10).skip((page - 1) * 10),
      ctx.model.Comment.find({ status, userId: id }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 通过评论id获取评论
  // eslint-disable-next-line no-dupe-class-members
  async getCommentById(id) {
    // getCommentById
    const { ctx } = this;
    if (!ctx.request.body.first) {
      return await ctx.model.Comment.find({ _id: id });
    }
    return await ctx.model.Comment.find({ articleId: ctx.request.body.articleId, parentId: null });
  }
  // 通过评论id获取评论
  // eslint-disable-next-line no-dupe-class-members
  // async getUserById(id) {
  //   // getCommentById
  //   const { ctx } = this;
  //   return await ctx.model.User.find({ _id: id });
  // }
  // 保存用户个人信息
  // eslint-disable-next-line no-dupe-class-members
  async saveInfo(id) {
    // getCommentById
    const { ctx } = this;
    console.log('123');
    console.log(id);
    return await ctx.model.User.update({ _id: id }, {
      sex: ctx.request.body.sex,
      birthday: ctx.request.body.birthday,
      region: ctx.request.body.region,
      authority: ctx.request.body.authority,
      imgUrl: ctx.request.body.imgUrl,
    });
  }
  /*
    搜索功能
  */
  async search(keyword, page) {
  // getCommentById
    const { ctx } = this;
    const reg = new RegExp(keyword, 'i');
    // ({ status, $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] }, { content: 0 }))
    // return await ctx.model.Article.find({ title: { $regex: reg } });
    const [ list, count ] = await Promise.all([
      ctx.model.Article.find({ title: { $regex: reg } }).sort({ createTime: -1 }).limit(10)
        .skip((page - 1) * 10),
      ctx.model.Article.find({ title: { $regex: reg } }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  /*
    回复提示
  */
  async getBadge() {
    const { ctx } = this;
    return await ctx.model.User.find({ _id: ctx.userId });
  }
  /*
    回复提示
  */
  async getReplyList(name, page) {
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find({ replyName: name, userId: { $ne: ctx.userId } }).sort({ createTime: -1 }).limit(7)
        .skip((page - 1) * 7),
      ctx.model.Comment.find({ replyName: name, userId: { $ne: ctx.userId } }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  async updateUser(id) {
    // getCommentById
    const { ctx } = this;
    return await ctx.model.User.update({ _id: id }, {
      badge: ctx.request.body.badge,
      updateTime: Date(),
    });
  }
  async addCol(id) {
    // getCommentById
    const { ctx } = this;
    const res = {};
    const artId = await ctx.model.Collection.findOne({
      articleId: id,
      userId: ctx.userId,
    });
    if (artId) {
      res.code = -1;
      res.msg = '帖子已存在';
    } else {
      return await ctx.model.Collection.create({
        title: ctx.request.body.title,
        articleId: id,
        userId: ctx.userId,
        createTime: Date(),
        checkTime: Date(),
        updateTime: Date(),
        status: 0,
      });
    }
    return res;
  }
  async getColList(page, id) {
    // getCommentById
    console.log(id);
    const { ctx } = this;
    const [ list, count ] = await Promise.all([
      ctx.model.Collection.find({ userId: id, status: 0 }).sort({ updateTime: -1 }).limit(10)
        .skip((page - 1) * 10),
      ctx.model.Collection.find({ userId: id, status: 0 }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 删除收藏
  async delCollection(id) {
    // getCommentById
    console.log(id);
    const { ctx } = this;
    return await ctx.model.Collection.remove({ _id: id });
  }
  // 删除收藏
  async delCollectionBatch(list) {
    // getCommentById
    const { ctx } = this;
    return await ctx.model.Collection.remove({ _id: { $in: list } });
  }
  // 收藏最后跟新时间
  async collectionDate() {
    // getCommentById
    const { ctx } = this;
    return await ctx.model.Collection.find({ userId: ctx.userId });
  }
  // 更新收藏帖子最后查看时间时间
  async updateCollection() {
    // getCommentById
    const { ctx } = this;
    const date = Date();
    await ctx.model.Collection.update({ userId: ctx.userId }, {
      checkTime: date,
    });
    return date;
  }
  // 只看该用户
  async simple(uId, aId, page) {
    // getCommentById
    const { ctx } = this;
    console.log(uId, aId);
    // return await ctx.model.Comment.find();
    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find({ userId: uId, articleId: aId }).limit(10)
        .skip((page - 1) * 10),
      ctx.model.Comment.find({ userId: uId, articleId: aId }).count(),
    ]);
    return {
      list,
      count,
    };
  }
  // 只看该用户
  async getGitUser(id) {
    // getCommentById
    const { ctx, app } = this;
    // console.log(uId, aId);
    // return await ctx.model.Comment.find();
    const userData = await ctx.model.User.findOne({ gitId: id }, { __v: 0 });
    console.log(id);
    console.log(userData);
    if (userData !== null) {
      const token = jwt.sign({
        id: userData._id,
      }, app.config.jwt.cert, {
        expiresIn: '10h', // token过期时间
      });
      return {
        user: userData,
        token,
      };
    } else if (userData === null) {
      return userData;
    }
  }
  async getBlockList() {
    const { ctx } = this;
    return await ctx.model.Block.find({ status: 0 });
  }
  async resetPass(id) {
    const { ctx } = this;
    return await ctx.model.User.update({ _id: id }, {
      password: ctx.request.body.password,
    });
  }
  async getModerator(block) {
    const { ctx } = this;
    return await ctx.model.User.find({
      authority: block,
    });
  }
  async topHandle(id) {
    const { ctx } = this;
    return await ctx.model.Article.update({ _id: id }, {
      top: true,
    });
  }
  async canHandle(id) {
    const { ctx } = this;
    return await ctx.model.Article.update({ _id: id }, {
      top: false,
    });
  }
}

module.exports = UserService;
