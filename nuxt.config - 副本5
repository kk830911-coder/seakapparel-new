// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    'nuxt-schema-org'
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en' // 东南亚跨境B2B市场首选英文环境
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://www.seakapparel.com' } // 规范化网址，防止路由重复分散SEO权重
      ],
      meta: [
        { name: 'description', content: 'Seak Apparel is a premier B2B women\'s clothing wholesale supplier for Southeast Asia. High-quality dresses, tops, and skirts at factory direct prices. Bulk orders only.' }
      ], // ⬅️ 1. 这里帮你补上了逗号
      script: [
        {
          id: 'Cookiebot',
          src: 'https://consent.cookiebot.com/uc.js',
          'data-cbid': 'f1730657-c6ea-4296-848d-64d34b61b386',
          'data-blockingmode': 'auto',
          type: 'text/javascript'
        }
      ] // ⬅️ 2. 这里帮你补上了中括号
    }
  },

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