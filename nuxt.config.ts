// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  // 核心修复：在这里直接把 cloudinary 的安全大闸拉开，允许前端下载它的衣服大图
  image: {
    domains: [
      'localhost:1337',
      'res.cloudinary.com'
    ]
  },

  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})