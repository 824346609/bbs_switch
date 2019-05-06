export const setUser = ({commit}, user) => {
  commit('userStatus', user)
}
export const setToken = ({commit}, token) => {
  commit('setToken', token)
}
export const setBadge = ({commit}, badge) => {
  commit('setBadge', badge)
}
export const setCollection = ({commit}, collection) => {
  commit('setCollection', collection)
}
export const setCollectionBadge = ({commit}, collectionBadge) => {
  commit('setCollectionBadge', collectionBadge)
}
export const setUserId = ({commit}, userId) => {
  commit('setUserId', userId)
}
export const setUpdate = ({commit}, update) => {
  commit('setUpdate', update)
}
export const setAuth = ({commit}, auth) => {
  commit('setAuth', auth)
}
export const delToken = ({commit}, token) => {
  commit('delToken', token)
}
