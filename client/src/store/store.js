import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    isLogin: false,
    userId: '',
    token: '',
    badge: false,
    update: '',
    collection: '',
    collectionBage: false,
    auth: ''
  },
  getters,
  mutations,
  actions
})
export default store
