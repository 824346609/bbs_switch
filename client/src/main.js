// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Routers from './router'
import ElementUI from 'element-ui'
import '@/assets/css/index.styl'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import iView from 'iview'
import store from './store/store'
import mavonEditor from 'mavon-editor'
// import axios from 'axios'
import axios from '@/plugins/axios'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import 'mavon-editor/dist/css/index.css'

Vue.use(iView)
Vue.use(mavonEditor)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vuex)
// Vue.prototype.$axios = axios
Vue.config.productionTip = false
const RouterConfig = {
  mode: 'history',
  routes: Routers
}
if (sessionStorage.getItem('token')) {
  store.commit('setToken', sessionStorage.getItem('token'))
  store.commit('userStatus', sessionStorage.getItem('username'))
  store.commit('setUserId', sessionStorage.getItem('userId'))
  store.commit('setBadge', sessionStorage.getItem('badge'))
  store.commit('setUpdate', sessionStorage.getItem('updateTime'))
  store.commit('setCollection', sessionStorage.getItem('collection'))
  store.commit('setAuth', sessionStorage.getItem('auth'))
}
const router = new VueRouter(RouterConfig)
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => to.meta.auth)) {
    if (store.state.isLogin) {
      next()
    } else {
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})
