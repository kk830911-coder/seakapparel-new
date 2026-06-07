export default defineNuxtConfig({
  compatibilityDate: '2025-07-15', // 保持你原有的兼容日期
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/strapi' // 1. 新增注册 Strapi 官方模块
  ],

  nitro: {
    prerender: {
      routes: ['/'] // 保持你原有的静态路由预渲染
    }
  },

  // 2. 配置 Strapi 模块，使其动态读取环境变量，若没有则回退到本地
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4' // Strapi v5 的 API 格式完美向下兼容 v4 结构
  },

  // 3. 核心修改：允许你的独立站去加载来自本地和线上 Cloudinary 的图片
  image: {
    domains: [
      'localhost:1337', 
      'res.cloudinary.com' // 必须加上 Cloudinary，否则独立站上的衣服高清图会因为跨域而变成空白！
    ]
  }
})