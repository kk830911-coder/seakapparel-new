// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  // 1. 正确修复了 modules 内部的逗号问题
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss', // <-- 这里之前漏掉了逗号，已帮你补上！
    '@nuxtjs/sitemap'
  ],

  // 2. 站点地图基础配置（必须提供你的独立站网址，sitemap 模块才能正确生成链接）
  site: {
    url: 'https://www.seakapparel.com',
    name: 'SeakApparel'
  },

  // 3. 你的图片安全域名配置
  image: {
    domains: [
      'localhost:1337',
      'res.cloudinary.com'
    ]
  },

  // 4. 静态预渲染配置
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})