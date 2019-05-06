const routers = [{
  path: '/',
  name: 'Home',
  component: (resolve) => require(['../components/index.vue'], resolve),
  meta: {
    title: '首页'
  }
},
{
  path: '/user/base/:id',
  name: 'personal',
  component: (resolve) => require(['../components/user/base.vue'], resolve),
  meta: {
    title: '个人中心',
    auth: true
  }
},
{
  path: '/block/:name',
  name: 'block',
  component: (resolve) => require(['../components/zone/articleList.vue'], resolve),
  meta: {
    title: '板块详情',
    auth: true
  }
},
{
  path: '/user/editor',
  name: 'base',
  component: (resolve) => require(['../components/editor.vue'], resolve),
  meta: {
    title: '基本信息',
    auth: true
  }
},
{
  path: '/user/modify/:id',
  name: 'modify',
  component: (resolve) => require(['../components/user/modify.vue'], resolve),
  meta: {
    title: '更改密码',
    auth: true
  }
},
{
  path: '/user/myTopic/:id',
  name: 'myTopic',
  component: (resolve) => require(['../components/user/myTopic.vue'], resolve),
  meta: {
    title: '我的帖子',
    auth: true
  }
},
{
  path: '/user/myComment/:id',
  name: 'myComment',
  component: (resolve) => require(['../components/user/myComment.vue'], resolve),
  meta: {
    title: '我的评论',
    auth: true
  }
},
{
  path: '/user/reply/:id',
  name: 'reply',
  component: (resolve) => require(['../components/user/reply.vue'], resolve),
  meta: {
    title: '回复我的',
    auth: true
  }
},
{
  path: '/block/:name/articleList',
  name: 'articleList',
  component: (resolve) => require(['../components/zone/articleList.vue'], resolve),
  meta: {
    title: '帖子列表'
  }
},
{
  path: '/editor/:name',
  name: 'editor',
  component: (resolve) => require(['../components/editor.vue'], resolve),
  meta: {
    title: '编辑器',
    auth: true
  }
},
{
  path: '/user/myTopic/editArticle/:id',
  name: 'editArticle',
  component: (resolve) => require(['../components/user/editArticle.vue'], resolve),
  meta: {
    title: '编辑帖子',
    auth: true
  }
},
{
  path: '/user/collection/:id',
  name: 'collection',
  component: (resolve) => require(['../components/user/collection.vue'], resolve),
  meta: {
    title: '我的收藏',
    auth: true
  }
},
{
  path: '/user/myComment/editComment/:id',
  name: 'editComment',
  component: (resolve) => require(['../components/user/editComment.vue'], resolve),
  meta: {
    title: '编辑评论',
    auth: true
  }
},
{
  path: '/newArt',
  name: 'newArt',
  component: (resolve) => require(['../components/newAtr.vue'], resolve),
  meta: {
    title: '新建',
    auth: true
  }
},
{
  path: '/newCategory',
  name: 'newCategory',
  component: (resolve) => require(['../components/newCategory.vue'], resolve),
  meta: {
    title: '新建分类',
    auth: true
  }
},
{
  /**
   * @param id 文章id
   * **/
  path: '/block/:name/articleDetail/:id',
  name: 'articleDetail',
  component: (resolve) => require(['../components/articleDetail.vue'], resolve),
  meta: {
    title: '帖子详情'
  }
},
{
  /**
   * @param id 文章id
   * **/
  path: '/simple/:id&&:aId',
  name: 'simple',
  component: (resolve) => require(['../components/simple.vue'], resolve),
  meta: {
    title: '帖子详情',
    auth: true
  }
},
{
  /**
   * @param id 文章id
   * **/
  path: '/article',
  name: 'article',
  component: (resolve) => require(['../components/article.vue'], resolve),
  meta: {
    title: '帖子详情',
    auth: true
  }
},
{
  /**
   * 评论
   * **/
  path: '/block/:name/articleDetail/:aid/comment/:id',
  name: 'comment',
  component: (resolve) => require(['../components/comment.vue'], resolve),
  meta: {
    title: '评论',
    auth: true
  }
},
{
  /**
   * 评论
   * **/
  path: '/callback',
  name: 'callback',
  component: (resolve) => require(['../components/callback.vue'], resolve),
  meta: {
    title: '回调'
  }
},
{
  /**
   * 评论
   * **/
  path: '/user/:id',
  name: 'userDetail',
  component: (resolve) => require(['../components/user/detail.vue'], resolve),
  meta: {
    title: '用户详情'
  }
},
{
  /**
   * 评论
   * **/
  path: '/user/:id/comment',
  name: 'userComment',
  component: (resolve) => require(['../components/user/detailComment.vue'], resolve),
  meta: {
    title: '用户评论'
  }
},
{
  /**
   * 帖子
   * **/
  path: '/user/:id/topic',
  name: 'userTopic',
  component: (resolve) => require(['../components/user/detailTopic.vue'], resolve),
  meta: {
    title: '用户帖子'
  }
},
{
  /**
   * 结果
   * **/
  path: '/search/:key',
  name: 'search',
  component: (resolve) => require(['../components/result.vue'], resolve),
  meta: {
    title: '搜索结果'
  }
}
]
export default routers
