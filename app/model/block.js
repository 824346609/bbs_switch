'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const BlockSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    abbreviation: {
      type: String,
    },
    status: {
      type: Number,
      /**
         * 0: 已发表
         * 1: 已删除
         */
    },
  });
  return mongoose.model('Block', BlockSchema);
};

