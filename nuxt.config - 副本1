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

  // 👇 全自动动态路由配置
  sitemap: {
    sources: [
      // 这里的路径可以随便命名，它会作为一个单独的动态源引入
      '/api/sitemap-dynamic-routes'
    ]
  },

  image: {
    // 保持你原有的 domains 配置
    domains: [
      'localhost:1337',
      'res.cloudinary.com'
    ],
    // 添加 cloudinary 配置
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/daybgtfi3/image/upload/'
    }
  },

  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})