'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1541756374392_8754';

  // add your config here
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/bbs_switch',
      options: {},
    },
  };
  config.session = {
    maxAge: 3600 * 1000,
  };
  config.jwt = {
    cert: 'bbs_switch', // jwt秘钥
  };
  config.qiniu = { // 这里填写你七牛的Access Key和Secret Key
    ak: 'ybef5PlTmJ15AaHzIA0Zoxe5dbd__ZuHdrSNGUVO',
    sk: 'kL23EPcxRBQlJ21l51w7_GLZ5_Zp_V_aLPRHn_Rg',
  };
  // 加密盐
  config.pwd_salt = 'egg-api-salt';

  config.view = {
    defaultViewEngine: 'pug',
    mapping: {
      '.pug': 'pug',
    },
  };

  config.cors = {
    // origin: 'https://github.com/',
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  return config;
};
