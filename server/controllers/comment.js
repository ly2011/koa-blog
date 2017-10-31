import xss from 'xss';
import Comment from '../models/comment';
import User from '../models/user';
import Article from '../models/article';
import config from '../configs';

export async function createComment(ctx) {
  let content = ctx.request.body.content;
  const user_id = ctx.request.body.user_id; // 用户user_id
  const article_id = ctx.request.body.article_id; // 文章id
  const createTime = new Date();
  const lastEditTime = new Date();
  let err_msg;
  if (!user_id) {
    err_msg = '缺少用户id';
  }
  if (!article_id) {
    err_msg = '缺少文章id';
  }
  if (!content) {
    err_msg = '评论内容不能为空';
  }
  if (err_msg) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      message: err_msg
    });
  }
  content = xss(content);
  let uid = null;
  try {
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      ctx.body = {
        status: 401,
        message: '该用户不存在'
      };
      return;
    }
    uid = user._id;
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
  const newComment = new Comment({
    user_id: uid,
    article_id,
    content,
    createTime,
    lastEditTime
  });
  try {
    let createResult = await newComment.save();
    await Comment.populate(
      createResult,
      { path: 'user article' },
      (err, result) => {
        createResult = result;
      }
    );
    await Article.findByIdAndUpdate(article_id, {
      $inc: { comment_count: 1 }
    }).exec();
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: createResult
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}
export async function getAllComments(ctx) {
  try {
    const comments = await Comment.find({}).populate({
      path: 'user article'
    });
    ctx.body = {
      success: true,
      list: comments
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

/**
 * 根据文章id获取评论
 * @param {*} ctx
 */
export async function getCommentsByAid(ctx) {
  const article_id = ctx.request.body.article_id || ctx.query.article_id;
  if (!article_id) {
    return (ctx.body = {
      success: false,
      message: '缺少文章id'
    });
  }
  try {
    const comments = await Comment.find({ article_id, status: { $eq: 1 } })
      .sort('createTime')
      .populate({
        path: 'user_id',
        select: 'username avatar',
        match: { username: { $exists: true } }
      });
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: comments
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

// 删除评论
export async function delComment(ctx) {
  const comment_id = ctx.request.body.id || ctx.query.id;
  if (!comment_id) {
    return (ctx.body = {
      success: false,
      message: '缺少评论id'
    });
  }
  try {
    const result = await Comment.findByIdAndRemove(comment_id);
    // 评论数 -1
    Article.findByIdAndUpdate(result.article_id, {
      $inc: { comment_count: -1 }
    }).exec();
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: '删除评论成功'
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}
