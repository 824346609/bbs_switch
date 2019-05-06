'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CategorySchema = new Schema({
    categoryName: { type: String },
    userId: {
      type: String,
      required: true,
    },
  });
  return mongoose.model('Category', CategorySchema);
};
