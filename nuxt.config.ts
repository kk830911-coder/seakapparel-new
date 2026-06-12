// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo', // 替换原 @nuxtjs/sitemap，整合sitemap+robots+og+schema
    'nuxt-schema-org'
  ],

  site: {
    url: 'https://www.seakapparel.com',
    name: 'Seak Apparel | Wholesale Women Clothing Supplier Southeast Asia',
    description: 'Professional Southeast Asia women apparel wholesale manufacturer, cheap bulk ladies dresses, tops, skirts for Thailand, Malaysia, Indonesia, Vietnam retailers with low MOQ & fast SEA shipping.',
    defaultLocale: 'en',
    trailingSlash: false
  },

  // robots.txt 爬虫规则配置
robots: {
  allow: ['/'],
  disallow: [
    '/admin',
    '/server',
    '/checkout',
    '/member-center',
    '/draft'
  ],
  sitemap: '/sitemap.xml'
},

  sitemap: {
    sources: [
      '/api/sitemap-dynamic-routes'
    ],
    exclude: ['/404', '/admin/**', '/checkout/**'],
    autoI18n: false,
    filename: 'sitemap.xml'
  },

  // 全局OG社交分享图配置
  ogImage: {
    enabled: false,
    width: 1200,
    height: 630,
    format: 'jpg'
  },

  image: {
    domains: [
      'localhost:1337',
      'shturl.cc/GmALiZOe'
    ],
    // 全局默认优先 AVIF，降级 WebP
    format: ['avif', 'webp'],
    quality: 75,
    // Cloudinary 官方适配器，Nuxt 自动识别 CDN 参数
    cloudinary: {
      baseURL: 'https://shturl.cc/GmALiZOe/daybgtfi3/image/upload/'
    }
  },

  nitro: {
    compressPublicAssets: true, // 新增静态资源gzip/brotli压缩，提升页面速度
    prerender: {
      routes: ['/']
    }
  },

  // 开发环境自动检查死链，生产关闭减少请求
  linkChecker: {
    enabled: process.env.NODE_ENV === 'development'
  }
})