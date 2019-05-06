'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ArticleSchema = new Schema({
    title: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    block: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
    },
    top: {
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
         * 1: 草稿
         * 2: 已删除
         */
    },
  });
  return mongoose.model('Article', ArticleSchema);
};

