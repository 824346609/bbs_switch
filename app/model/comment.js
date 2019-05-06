'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CommentSchema = new Schema({
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // 评论人
    userName: {
      type: String,
    },
    // 被评论人
    replyName: {
      type: String,
    },
    content: {
      type: String,
    },
    html: {
      type: String,
    },
    block: {
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
  return mongoose.model('Comment', CommentSchema);
};

