import Koa from 'koa';
import convert from 'koa-convert';
import onerror from 'koa-onerror';
import Router from 'koa-router';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import cors from 'koa-cors';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';

import config from './configs';
import api from './api';

const app = new Koa();
onerror(app, {
  accepts() {
    return 'json';
  }
});

const router = Router();

// middlewares
app.use(
  convert(
    cors({
      origin: '*',
      credentials: true,
      maxAge: 86400000,
      methods: 'OPTIONS, GET, PUT, POST, DELETE',
      headers: 'x-requested-with, accept, origin, content-type'
    })
  )
);
app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger());

// session
app.keys = [config.session.secrets];
app.use(
  session({
    key: 'koa.sid',
    store: redisStore({
      host: config.redis.host,
      port: config.redis.port,
      auth_pass: config.redis.password || ''
    }),
    cookie: config.session.cookie
  })
);

import './connect_mongo';

// 导入路由

// logger
app.use(async (ctx, next) => {
  const start = new Date();

  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/favicon.ico', ctx => {
  return;
});

// api/router
app.use(api());
// router.use("/user", users.routes(), users.allowedMethods());
// router.use("/tag", tags.routes(), tags.allowedMethods());
// router.use("/article", articles.routes(), articles.allowedMethods());
// router.use("/comment", comments.routes(), comments.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.on('error', err => {
  // console.error(err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

// create server
app.listen(config.app.port, () => {
  console.log('The server is running at http://localhost:' + config.app.port);
});

export default app;
