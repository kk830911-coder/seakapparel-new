// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap'
  ],

  site: {
    url: 'https://www.seakapparel.com',
    name: 'SeakApparel'
  },

  // 扩展 sitemap，让它包含你的动态产品和博客路径
  sitemap: {
    // 方式 A：如果产品不多，可以直接在这里手动先写死几个核心款的动态路径，确保谷歌能爬到：
    urls: [
      '/products',
      '/blog',
      // '/products/这里放你的具体产品ID或Slug', 
      // '/blog/这里放你的具体文章ID或Slug'
    ]
  },

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