'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CollectionSchema = new Schema({
    title: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
    },
    createTime: {
      type: String,
    // 因为mongodb存入date类型会有早8个小时的问题，所以这里用String
    },
    checkTime: {
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
  return mongoose.model('Collection', CollectionSchema);
};

