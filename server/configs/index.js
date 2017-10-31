const config = {
  app: {
    port: process.env.PORT || 8000,
    baseApi: '/api'
  },
  // mongodb 配置
  mongodb: {
    url: 'mongodb://localhost:27017/blog',
    options: {
      useMongoClient: true
      // mongodb用户和密码
      // user: process.env.MONGO_USERNAME || '',
      // pass: process.env.MONGO_PASSWORD || ''
    }
  },
  // redis 配置
  redis: {
    db: 0,
    host: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },
  // session 配置
  session: {
    secrets: 'koa-blog-secret',
    cookie: { maxAge: 60000 * 60 * 24 * 365 }
  },
  jwt: {
    secret: 'me' //默认
  },
  //七牛配置
  qiniu: {
    app_key: process.env.QINIU_APP_KEY || '',
    app_secret: process.env.QINIU_APP_SECRET || '',
    domain: process.env.QINIU_APP_DOMAIN || '', //七牛配置域名
    bucket: process.env.QINIU_APP_BUCKET || '' //七牛空间名称
  }
};

export default config;
