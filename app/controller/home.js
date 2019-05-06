'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.allUser();
  }
  async getQiniuToken() {
    const { ctx } = this;
    let resMsg = {};
    resMsg = {
      errcode: 0,
      data: {},
      msg: '获取token成功',
    };
    const uploadToken = await ctx.service.home.getQiniuToken();
    resMsg.data.token = uploadToken;
    ctx.body = resMsg;
  }
  async getUser() {
    let resMsg = [];
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    resMsg = {
      errcode: 0,
      data: {},
      msg: '登录成功',
    };
    const userData = await ctx.service.user.getUser({ username, password });
    // console.log(userData);
    if (!userData) {
      resMsg.errcode = 2;
      resMsg.msg = '用户名或密码错误';
      ctx.body = resMsg;
      return;
    }
    ctx.body = resMsg;
  }
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    let resMsg = [];
    resMsg = {
      errcode: 0,
      data: {},
      msg: '',
    };
    const userData = await ctx.service.user.register({ username, password });
    if (userData.code === -1) {
      resMsg.errcode = 2;
      resMsg.msg = '用户名已存在';
      ctx.body = resMsg;
      return;
    } else if (userData.code === 1) {
      resMsg.errcode = 3;
      resMsg.msg = '注册成功';
      ctx.body = resMsg;
      return;
    }
  }
}

module.exports = HomeController;
