// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    'nuxt-schema-org'
  ],

  site: {
    url: 'https://www.seakapparel.com',
    name: 'SeakApparel'
  },

  sitemap: {
    sources: [
      '/api/sitemap-dynamic-routes'
    ]
  },

  image: {
    domains: [
      'localhost:1337',
      'res.cloudinary.com'
    ],
    // 全局默认优先 AVIF，降级 WebP
    format: ['avif', 'webp'],
    quality: 75,
    // Cloudinary 官方适配器，Nuxt 自动识别 CDN 参数
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