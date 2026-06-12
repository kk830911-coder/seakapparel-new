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
        { name: 'description', content: "Seak Apparel is a premier B2B women's clothing wholesale supplier for Southeast Asia. High-quality dresses, tops, and skirts at factory direct prices. Bulk orders only." }
      ],
      script: [
        // ✅ 帮您把刚才不小心删掉的 script 数组头补回来了
        // GA4 全局跟踪代码配置
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-H794JGCTR0',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H794JGCTR0');
          `,
          type: 'text/javascript'
        }
      ]
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