import jwt from 'jsonwebtoken';
import config from '../configs';
export default async (ctx, next) => {
  // 是在登录的时候从后台获取，存储在前端，等访问后台接口时，放在header携带过来
  // （Axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.auth.token; // 全局设定header的token验证，注意Bearer后有个空格）
  const authorization = ctx.get('Authorization');
  console.log(authorization);
  if (authorization === '') {
    ctx.throw(401, "no token detected in http header 'Authorization'");
  }
  const token = authorization.split(' ')[1];
  let tokenContent = null;
  try {
    tokenContent = await jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      ctx.throw(401, 'token expired,请及时本地保存数据！');
    }
    ctx.throw(401, 'invalid token');
  }
  console.log('鉴权成功');
  await next();
};
