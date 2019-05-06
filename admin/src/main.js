// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import Routers from './router'
import store from './store/store'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import axios from '@/plugins/axios'
import 'element-ui/lib/theme-chalk/index.css'
// import store from './store/store'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.productionTip = false
const RouterConfig = {
  mode: 'history',
  routes: Routers
}
if (sessionStorage.getItem('token')) {
  store.commit('setToken', sessionStorage.getItem('token'))
  store.commit('userStatus', sessionStorage.getItem('username'))
  store.commit('setUserId', sessionStorage.getItem('userId'))
}
const router = new VueRouter(RouterConfig)
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(r => to.meta.auth)) {
//     if (store.state.isLogin) {
//       next()
//     } else {
//       next({
//         path: '/',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next()
//   }
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})
