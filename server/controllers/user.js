import User from '../models/user';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import captcha from 'trek-captcha';
import validator from 'node-validator';
import config from '../configs';

const checkUser = validator.isObject().withRequired(
  'email',
  validator.isString({
    regex: /^(\w-*\.*)+@(\w-?)+(\.\w{2,4})+$/
  })
);

/**
 * 获取验证码
 * @param {*} ctx
 */
export async function getCaptcha(ctx) {
  const { token, buffer } = await captcha({ size: 6 });
  // ctx.session.captcha = token;
  ctx.status = 200;
  ctx.body = buffer;
}
/**
 * 根据user_id获取用户信息
 * @param {*} ctx
 */
export async function getMe(ctx) {
  const user_id = ctx.request.body.user._id || ctx.query.user._id;
  try {
    const user = await User.findById(user_id);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: user.userInfo
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

/**
 * 删除用户
 * @param {*} ctx
 */
export async function removeUser(ctx) {
  const user_id = ctx.request.body.user._id || ctx.query.user._id;
  if (!user_id) {
    return (ctx.body = {
      success: false,
      message: '缺少用户id'
    });
  }
  try {
    const user = await User.findByIdAndRemove(user_id);
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: '用户删除成功'
    };
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}

export async function createUser(ctx) {
  const { name, username, email, password, avatar } = ctx.request.body;
  let err_msg;
  if (!username) {
    err_msg = '帐号不能为空';
  }
  if (!password) {
    err_msg = '密码不能为空';
  }
  if (!!email || email === '') {
    validator.run(checkUser, { email }, (errorCount, errors) => {
      if (errorCount !== 0) {
        err_msg = errors.map(error => (error.message += error.message));
      }
    });
  }
  if (err_msg) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      message: err_msg
    });
  }
  let users = null;
  try {
    users = await User.find();
  } catch (err) {
    throw (500, '服务器错误');
  }
  if (users.length === 0) {
    users = {
      name: 'ly',
      username: 'admin',
      password: md5('admin').toUpperCase(),
      email: '123456@qq.com',
      avatar: '',
      createTime: new Date()
    };
    const user = new User(users);

    let userResult = null;
    try {
      userResult = await user.save();
    } catch (err) {
      ctx.throw(500, '服务器错误');
    }

    ctx.body = {
      success: true,
      user: userResult
    };
  }
  ctx.body = {
    success: true,
    user: users
  };
}

export async function listUser(ctx) {
  try {
    const users = await User.find();
    ctx.body = {
      success: true,
      list: users
    };
  } catch (err) {
    ctx.staus = err.staus || 500;
    ctx.body = {
      message: '服务器错误'
    };
  }
}

export async function login(ctx) {
  const username = ctx.request.body.username;
  let password = ctx.request.body.password;
  if (!username || !password) {
    ctx.body = {
      status: 401,
      message: '用户名或密码为空'
    };
    return;
  }
  password = md5(password).toUpperCase();
  try {
    const conditions = {
      username
    };
    let user = await User.findOne(conditions);
    if (!!user) {
      if (user.password === password) {
        const token = jwt.sign(
          {
            uid: user._id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //1 hours
          },
          config.jwt.secret
        );
        ctx.body = {
          success: true,
          uid: user._id,
          name: user.name,
          token
        };
      } else {
        ctx.body = {
          status: 401,
          message: '密码错误'
        };
      }
    } else {
      ctx.body = {
        status: 401,
        message: '该用户不存在'
      };
    }
  } catch (err) {
    ctx.throw(500, '服务器错误');
  }
}
