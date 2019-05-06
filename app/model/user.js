'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    gitId: {
      type: String,
    },
    nickName: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
    },
    region: {
      type: String,
    },
    authority: {
      type: String,
    },
    col: {
      type: String,
    },
    badge: {
      type: Boolean,
    },
    imgUrl: {
      type: String,
    },
    createTime: {
      type: String,
      // 因为mongodb存入date类型会有早8个小时的问题，所以这里用String
    },
    updateTime: {
      type: String,
      // 因为mongodb存入date类型会有早8个小时的问题，所以这里用String
    },
    status: {
      type: Number,
      /**
         * 0: 已发表
         * 1: 已删除
         */
    },
  });
  return mongoose.model('User', UserSchema);
};
