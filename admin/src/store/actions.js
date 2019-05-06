export const setUser = ({commit}, user) => {
  commit('userStatus', user)
}
export const setToken = ({commit}, token) => {
  commit('setToken', token)
}
export const setUserId = ({commit}, userId) => {
  commit('setUserId', userId)
}
export const delToken = ({commit}, token) => {
  commit('delToken', token)
}
