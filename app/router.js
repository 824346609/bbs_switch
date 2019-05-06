'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 后台授权中间件
  const auth = app.middleware.auth();
  // 首页
  router.get('/', controller.home.index);
  // 登录
  router.post('/login', controller.user.getUser);
  // 注册
  router.post('/register', controller.user.register);
  // 获取验证码
  router.get('/getCaptcha', controller.user.getCaptcha);
  // 获取分类
  router.get('/getCategoryList', auth, controller.user.getCategoryList);
  // 获取七牛Token
  router.get('/getQiniuToken', auth, controller.home.getQiniuToken);
  // 新建分类
  router.post('/createCategory', auth, controller.user.createCategory);
  // 删除分类，如果提交一个id字符串，删除该分类；如果提交一个分类的数组，则删除该数组匹配的所有分类
  router.post('/delCategory', auth, controller.user.delCategory);
  // 修改分类信息
  router.post('/modifyCategory', auth, controller.user.modifyCategory);
  // 编辑文章页获取用户的标签和分类数据
  router.get('/getArticleOptions', auth, controller.user.getArticleOptions);
  // 创建或更新文章，如果有文章id就更新文章，否则新建文章
  router.post('/postArticle', auth, controller.user.postArticle);
  // 查询用户发的帖子
  router.post('/getArticleListByUserName', controller.user.getArticleListByUserName);
  // 获取文章的详细信息
  router.post('/p/getArticleDetail', controller.user.getArticleDetail);
  // 获取评论列表
  router.post('/p/getCommentList', controller.user.getCommentList);
  // 获取所有文章列表
  router.post('/getArticleList', controller.user.getArticleList);
  // 删除文章
  router.post('/delArticle', auth, controller.user.delArticle);
  // 批量删除文章
  router.post('/delArticleBatch', auth, controller.user.delArticleBatch);
  // 创建或更新评论，如果有评论id就更新评论，否则新建评论
  router.post('/postComment', auth, controller.user.postComment);
  // // 获取所有评论列表
  // router.get('/getCommentList', auth, controller.user.getCommentList);
  // 通过评论Id获取评论
  router.post('/getCommentById', controller.user.getCommentById);
  // 通过评论Id获取评论
  router.post('/getUserComment', controller.user.getUserComment);
  // 保存用户的个人信息
  router.post('/saveInfo', auth, controller.user.saveInfo);
  // 通过Id获取用户
  router.post('/getUserById', controller.user.getUserById);
  // 搜索功能
  router.post('/search', controller.user.search);
  // 回复提示
  router.get('/getBadge', auth, controller.user.getBadge);
  // 获取回复列表
  router.post('/getReplyList', auth, controller.user.getReplyList);
  // 查看回复
  router.post('/updateUser', auth, controller.user.updateUser);
  // 添加收藏
  router.post('/addCol', auth, controller.user.addCol);
  // 获取收藏
  router.post('/getColList', auth, controller.user.getColList);
  // 删除收藏
  router.post('/delCollection', auth, controller.user.delCollection);
  // 批量删除收藏
  router.post('/delCollectionBatch', auth, controller.user.delCollectionBatch);
  // 更新收藏贴的最后浏览日期
  router.get('/updateCollection', auth, controller.user.updateCollection);
  // 获取收藏贴的最后浏览日期
  router.post('/collectionDate', auth, controller.user.collectionDate);
  // 只看该作者
  router.post('/simple', auth, controller.user.simple);
  // 取消加精
  router.post('/canHandle', auth, controller.user.canHandle);
  // 加精
  router.post('/topHandle', auth, controller.user.topHandle);
  // git接口
  router.post('/getInfo', controller.user.getInfo);
  // git查询用户
  router.post('/getGitUser', controller.user.getGitUser);
  // 查询板块
  router.get('/getBlockList', controller.user.getBlockList);
  // 更改密码
  router.post('/resetPass', auth, controller.user.resetPass);
  // 获取版主
  router.post('/getModerator', controller.user.getModerator);

  // 管理员页面
  // 新增管理员
  router.get('/addAdmin', controller.admin.addAdmin);
  // 登录
  router.post('/admin/login', controller.admin.login);
  // 所有帖子
  router.post('/admin/articleList', controller.admin.articleList);
  // 所有用户
  router.post('/admin/userList', controller.admin.userList);
  // 所有评论
  router.post('/admin/commentList', controller.admin.commentList);
  // 所有分区
  router.post('/admin/blockList', controller.admin.blockList);
  // 查看评论
  router.post('/admin/comment', controller.admin.comment);
  // 恢复帖子
  router.post('/admin/reArticle', controller.admin.reArticle);
  // 批量恢复帖子
  router.post('/admin/reArticleBatch', controller.admin.reArticleBatch);
  // 删除用户
  router.post('/admin/delUser', controller.admin.delUser);
  // 批量删除用户
  router.post('/admin/delUserBatch', controller.admin.delUserBatch);
  // 恢复用户
  router.post('/admin/reUser', controller.admin.reUser);
  // 批量恢复用户
  router.post('/admin/reUserBatch', controller.admin.reUserBatch);
  // 删除评论
  router.post('/admin/delComment', controller.admin.delComment);
  // 批量删除评论
  router.post('/admin/delCommentBatch', controller.admin.delCommentBatch);
  // 恢复评论
  router.post('/admin/reComment', controller.admin.reComment);
  // 批量恢复评论
  router.post('/admin/reCommentBatch', controller.admin.reCommentBatch);
  // 删除板块
  router.post('/admin/delBlock', controller.admin.delBlock);
  // 批量删除板块
  router.post('/admin/delBlockBatch', controller.admin.delBlockBatch);
  // 恢复板块
  router.post('/admin/reBlock', controller.admin.reBlock);
  // 批量恢复板块
  router.post('/admin/reBlockBatch', controller.admin.reBlockBatch);
  // 搜索
  router.post('/admin/search', controller.admin.search);
  // 新建板块
  router.post('/admin/createBlock', controller.admin.createBlock);
  // 任命版主
  router.post('/admin/moderator', controller.admin.moderator);
};
