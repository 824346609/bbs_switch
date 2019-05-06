export const userStatus = (state, user) => {
  if (user) {
    state.currentUser = user
    state.isLogin = true
  } else if (user === null) {
    sessionStorage.setItem('userName', null)
    sessionStorage.setItem('userToken', '')
    state.currentUser = null
    state.isLogin = false
    state.token = ''
  }
}
export const setToken = (state, token) => {
  state.token = token
  sessionStorage.token = token
}
export const delToken = (state) => {
  state.token = ''
  sessionStorage.removeItem('token')
}
export const setUserId = (state, userId) => {
  state.userId = userId
}
