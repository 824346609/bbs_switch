'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AdminSchema = new Schema({
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createTime: {
      type: String,
      // 因为mongodb存入date类型会有早8个小时的问题，所以这里用String
    },
  });
  return mongoose.model('Admin', AdminSchema);
};
