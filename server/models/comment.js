// 评论
import mongoose from 'mongoose';
import moment from 'moment';
moment.locale('zh-cn');
const Schema = mongoose.Schema;
const CommentSchema = new Schema(
  {
    article_id: { type: Schema.Types.ObjectId, ref: 'Article' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    // 针对评论的回复
    replys: [
      {
        content: String, // 回复内容
        user_info: Object,
        createTime: Date
      }
    ],
    // 评论状态 0: 删除, 1: 正常
    status: {
      type: Number,
      default: 1
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    lastEditTime: {
      type: Date,
      default: Date.now
    }
  },
  // 去掉版本锁定
  { versionKey: false }
);

CommentSchema.set('toJSON', { getters: true, virtuals: true });
CommentSchema.set('toObject', { getters: true, virtuals: true }); //普通+虚拟
CommentSchema.path('createTime').get(v => moment(v).format('lll'));
CommentSchema.path('lastEditTime').get(v => moment(v).format('lll'));

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
