import axios from '../../plugins/axios'
let baseUrl = '/'

function getUser (options) {
  return axios.get(baseUrl + 'login', options)
}

function register (options) {
  return axios.post(baseUrl + 'register', options)
}

function getArticleDetail (options) {
  return axios.post(baseUrl + 'p/getArticleDetail', options)
}

function getCommentList (options) {
  return axios.post(baseUrl + 'p/getCommentList', options)
}

function getArticleList (options) {
  return axios.get(baseUrl + 'p/getArticleList', options)
}

function searchByCategory (options) {
  return axios.get(baseUrl + 'p/searchByCategory', options)
}

function searchByTag (options) {
  return axios.get(baseUrl + 'p/searchByTag', options)
}

function getTagsAndCategories (options) {
  return axios.get(baseUrl + 'p/getTagsAndCategories', options)
}

export {
  getUser,
  register,
  getArticleDetail,
  getArticleList,
  searchByCategory,
  searchByTag,
  getTagsAndCategories,
  getCommentList
}
