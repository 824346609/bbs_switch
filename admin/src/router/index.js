const routers = [{
  path: '/',
  name: 'Home',
  component: (resolve) => require(['../components/userList.vue'], resolve),
  meta: {
    title: '首页'
  }
},
{
  path: '/login',
  name: 'login',
  component: (resolve) => require(['../components/login/login.vue'], resolve),
  meta: {
    title: '登录'
  }
},
{
  path: '/header',
  name: 'header',
  component: (resolve) => require(['../components/header.vue'], resolve),
  meta: {
    title: '头部'
  }
},
{
  path: '/userList',
  name: 'userList',
  component: (resolve) => require(['../components/userList.vue'], resolve),
  meta: {
    title: '所有用户'
  }
},
{
  path: '/commentList',
  name: 'commentList',
  component: (resolve) => require(['../components/commentList.vue'], resolve),
  meta: {
    title: '所有评论'
  }
},
{
  path: '/blockList',
  name: 'blockList',
  component: (resolve) => require(['../components/blockList.vue'], resolve),
  meta: {
    title: '所有板块'
  }
},
{
  path: '/articleList',
  name: 'articleList',
  component: (resolve) => require(['../components/articleList.vue'], resolve),
  meta: {
    title: '所有帖子'
  }
},
{
  path: '/comment/:id',
  name: 'comment',
  component: (resolve) => require(['../components/commentDetail.vue'], resolve),
  meta: {
    title: '评论详情'
  }
}
]
export default routers
