// 标签分类表
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const tagCategorySchema = new Schema(
  {
    name: {
      type: String,
      default: ''
    },
    // 分类描述
    desc: String
  },
  { versionKey: false }
);
tagCategorySchema.set('toJSON', { getters: true, virtuals: true });
tagCategorySchema.set('toObject', { getters: true, virtuals: true }); //普通+虚拟
const TagCategory = mongoose.model('TagCategory', tagCategorySchema);
export default TagCategory;
