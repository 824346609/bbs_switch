'use strict';
const Service = require('egg').Service;
const qiniu = require('qiniu');

class HomeService extends Service {
  // 生成七牛token
  async getQiniuToken() {
    const { app } = this;
    // 这里需要七牛的Access Key和Secret Key
    const mac = new qiniu.auth.digest.Mac(app.config.qiniu.ak, app.config.qiniu.sk);
    const options = {
      scope: 'bbs-switch',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }
}

module.exports = HomeService;
