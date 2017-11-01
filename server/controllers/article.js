import Article from '../models/article';
import Comment from '../models/comment';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import config from '../configs';

export async function createArticle(ctx) {
  const title = ctx.request.body.title;
  const content = ctx.request.body.content;
  const abstract = ctx.request.body.abstract || '';
  const status = ctx.request.body.status;
  let tags = ctx.request.body.tags; // tag的_id
  const createTime = new Date();
  const lastEditTime = new Date();
  let err_msg;
  if (!title) {
    err_msg = '标题不能为空';
  }
  if (!content) {
    err_msg = '文章内容不能为空';
  }
  if (!abstract) {
    err_msg = '文章摘要不能为空';
  }
  if (err_msg) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      message: err_msg
    });
  }
  if (!!tags) {
    tags = tags.split(',');
  }

  const newArticle = new Article({
    title,
    content,
    abstract,
    status,
    tags,
    createTime,
    lastEditTime
  });
  try {
    let createResult = await newArticle.save();
    await Article.populate(createResult, { path: 'tags' }, (err, result) => {
      createArticle = result;
    });
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: createResult
    };
  } catch (err) {
    ctx.throw(500, err.errmsg);
  }
}

export async function getArticles(ctx) {
  let cur_page = ctx.request.body.cur_page || ctx.query.cur_page;
  cur_page = parseInt(cur_page) > 0 ? parseInt(cur_page) : 1;
  let page_size = ctx.request.body.page_size || ctx.query.page_size;
  page_size = parseInt(page_size) > 0 ? parseInt(page_size) : 10;
  const start_row = (cur_page - 1) * page_size;
  try {
    // const articles = await Article.find({});
    const articles = await Article.find({})
      .populate({
        path: 'tags',
        select: { name: 1, _id: 1, id: 1 }, // _id以外，要么全是1，要么全是0，否则就报错
        options: { title: -1 }
      })
      .skip(start_row)
      .limit(page_size)
      .exec()
      .catch(err => {
        ctx.throw(500, '服务器内部错误');
      });
    const count = await Article.count();
    ctx.body = {
      success: true,
      list: articles,
      count: count
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

// 更新文章
export async function updateArticle(ctx) {
  const { id, title, content, abstract, tags } = ctx.request.body;
  let err_msg;
  if (!title) {
    err_msg = '标题不能为空';
  }
  if (!content) {
    err_msg = '文章内容不能为空';
  }
  if (!abstract) {
    err_msg = '文章摘要不能为空';
  }
  if (err_msg) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      message: err_msg
    });
  }
  const update_article = {
    title,
    content,
    abstract
  };
  try {
    const article = await Article.findByIdAndUpdate(
      id,
      {
        $set: update_article
      },
      { new: true }
    ).catch(err => {
      if (err.name === 'CastError') {
        ctx.throw(401, '文章id不存在');
      } else {
        ctx.throw(500, '服务器内部错误');
      }
    });
    ctx.body = {
      success: true,
      message: '更新文章成功',
      article_id: article._id
    };
  } catch (err) {
    if (err.name === 'CastError') {
      ctx.throw(401, 'id不存在');
    } else {
      ctx.throw(500, '服务器错误');
    }
  }
}

// 获取单篇文章
export async function getArticle(ctx) {
  const id = ctx.request.body.id || ctx.query.id;
  if (!id) {
    ctx.body = {
      status: 401,
      message: 'id不能为空'
    };
    return;
  }
  try {
    const article = await Article.findById(id)
      .populate('tags')
      .exec()
      .catch(err => {
        if (err.name === 'CastError') {
          ctx.throw(401, '文章id不存在');
        } else {
          ctx.throw(500, '服务器内部错误');
        }
      });
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: article
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

// 删除文章(连同这篇文章的评论一起删除)
export async function deleteArticle(ctx) {
  const id = ctx.request.body.id || ctx.query.id;
  if (!id) {
    ctx.body = {
      status: 401,
      message: 'id不能为空'
    };
    return;
  }
  try {
    await Article.findByIdAndRemove(id).catch(err => {
      if (err.name === 'CastError') {
        ctx.throw(401, '文章id不存在');
      } else {
        ctx.throw(500, '服务器错误');
      }
    });
    await Comment.remove({ article_id: id });
    ctx.body = {
      success: true,
      message: '删除文章成功!'
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}
