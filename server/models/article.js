// 文章
import mongoose from 'mongoose';
import moment from 'moment';
moment.locale('zh-cn');
const Schema = mongoose.Schema;
const ArticleSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: { type: String, unique: true },
    content: { type: String },
    // 摘要
    abstract: { type: String },
    // 一篇文章可以有多个标签
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    // 存储文章所用到的图片
    images: {
      type: Array
    },
    // 访问数
    visit_count: {
      type: Number,
      default: 0
    },
    comment_count: {
      type: Number,
      default: 0
    },
    // 喜欢数
    like_count: {
      type: Number,
      default: 1
    },
    top: {
      type: Boolean,
      default: false
    },
    // 是否发布, 0: 草稿, 1: 发布
    status: {
      type: Number,
      default: 0
    },
    // 创建时间
    createTime: {
      type: Date
    },
    // 发布时间
    publishTime: {
      type: Date,
      default: Date.now
    },
    lastEditTime: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);
ArticleSchema.set('toJSON', { getters: true, virtuals: true });
ArticleSchema.set('toObject', { getters: true, virtuals: true }); //普通+虚拟
ArticleSchema.path('createTime').get(v => moment(v).format('lll'));
ArticleSchema.path('publishTime').get(v => moment(v).format('lll'));
ArticleSchema.path('lastEditTime').get(v => moment(v).format('lll'));

ArticleSchema.virtual('info').get(function() {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    images: this.images,
    visit_count: this.visit_count,
    comment_count: this.comment_count,
    like_count: this.like_count,
    publishTime: this.publishTime
  };
});

const Article = mongoose.model('Article', ArticleSchema);

export default Article;
