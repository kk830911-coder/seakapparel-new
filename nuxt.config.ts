export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    // 按需重渲染（方案 B/Strapi Webhook），由环境变量注入
    revalidateSecret: process.env.REVALIDATE_SECRET || '',
    revalidateBypassToken: process.env.REVALIDATE_BYPASS_TOKEN || '',
    deployHookUrl: process.env.DEPLOY_HOOK_URL || '',
    public: {
      strapiUrl: 'https://tutesportswear-strapi-us.onrender.com'
    }
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    'nuxt-schema-org'
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: "Custom Sportswear Manufacturer | OEM Activewear & Gym Wear | TontonSports",
      titleTemplate: '%s | TontonSports',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "TontonSports by Tonton Sportswear — 20+ years professional custom sportswear manufacturer. OEM/ODM activewear, gym wear, team uniforms. Low MOQ from 1 piece. ISO9001 & BSCI certified. Global shipping." },
        { name: 'keywords', content: 'custom sportswear manufacturer, activewear OEM, gym wear supplier, custom athletic clothing, private label sportswear, wholesale activewear, team uniform manufacturer, OEM sportswear China' },
        { name: 'author', content: 'TontonSports - Tonton Sportswear (Shenzhen) Co., Ltd.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'TontonSports' },
        { property: 'og:title', content: 'Custom Sportswear Manufacturer | OEM Activewear | TontonSports' },
        { property: 'og:description', content: '20+ years professional custom sportswear manufacturer. OEM/ODM, low MOQ 1pc, ISO certified. Global shipping.' },
        { property: 'og:image', content: 'https://www.tutesports.com/og-image.jpg' },
        { property: 'og:url', content: 'https://www.tutesports.com' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Custom Sportswear Manufacturer | OEM Activewear | TontonSports' },
        { name: 'twitter:description', content: '20+ years professional custom sportswear manufacturer. OEM/ODM, low MOQ 1pc, ISO certified.' },
        { name: 'twitter:image', content: 'https://www.tutesports.com/og-image.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://tutesportswear-strapi-us.onrender.com' },
        { rel: 'preconnect', href: 'https://res.cloudinary.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap' }
      ]
    }
  },

  site: {
    url: 'https://www.tutesports.com',
    name: 'TontonSports',
    description: 'Custom Sportswear Manufacturer - OEM/ODM Activewear, Low MOQ, ISO Certified',
    defaultLocale: 'en'
  },

  sitemap: {
    sources: ['/api/sitemap-dynamic-routes'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString()
    }
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'TontonSports',
      alternateName: 'Tonton Sportswear (Shenzhen) Co., Ltd.',
      url: 'https://www.tutesports.com',
      logo: 'https://www.tutesports.com/logo.png',
      description: 'Professional custom sportswear manufacturer since 2004. OEM/ODM activewear, gym wear, team uniforms.',
      foundingDate: '2004',
      address: {
        type: 'PostalAddress',
        streetAddress: 'Room 207, Building A, Jiewei Industrial Park, Longgang District',
        addressLocality: 'Shenzhen',
        addressRegion: 'Guangdong Province',
        postalCode: '518000',
        addressCountry: 'CN'
      },
      contactPoint: {
        type: 'ContactPoint',
        telephone: '+86-18271971983',
        contactType: 'sales',
        email: 'Marc@tutesports.com',
        availableLanguage: ['English']
      },
      sameAs: [
        'https://www.facebook.com/profile.php?id=61596052913953',
        'https://www.instagram.com/tonton_sports',
        'https://www.linkedin.com/in/shuizhong-zheng-b4ba01447',
        'https://www.youtube.com/@tonton_marczheng'
      ]
    }
  },

  image: {
    domains: [
      'localhost:1337',
      'res.cloudinary.com'
    ],
    format: ['avif', 'webp'],
    quality: 75,
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/daybgtfi3/image/upload/'
    }
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            navy: {
              DEFAULT: '#0A1628',
              light: '#1B2A4A',
              dark: '#0D1B2A'
            },
            brand: {
              DEFAULT: '#046BD2',
              light: '#3B8FE3',
              dark: '#0354A8'
            },
            accent: {
              DEFAULT: '#FF6B00',
              light: '#FF8A33',
              dark: '#CC5500'
            }
          },
          fontFamily: {
            heading: ['Montserrat', 'sans-serif'],
            body: ['Inter', 'sans-serif']
          }
        }
      }
    }
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return
      
      const STRAPI_URL = process.env.NUXT_PUBLIC_STRAPI_URL || 'https://tutesportswear-strapi-us.onrender.com'
      
      try {
        console.log('🔍 Fetching dynamic routes for prerendering...')
        
        const jsonFetch = async (url: string) => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
          return res.json()
        }
        
        const [productsResponse, blogsResponse, faqsResponse] = await Promise.all([
          jsonFetch(`${STRAPI_URL}/api/products?fields[0]=slug`),
          jsonFetch(`${STRAPI_URL}/api/blogs?fields[0]=slug`),
          jsonFetch(`${STRAPI_URL}/api/faqs?fields[0]=slug`)
        ])

        // ⚠️ 详情页（/products/xxx 等）不再构建时预渲染。
        // prerender 的页面会变成静态文件，Vercel 直接返回文件系统版本，
        // ISR / Webhook 按需重渲染对它永远无效（内容冻结到下次部署）。
        // 详情页统一走 ISR 动态渲染：Webhook 秒级刷新 + 过期自动兜底。
        const counts: string[] = []
        for (const [name, res] of [['products', productsResponse], ['blogs', blogsResponse], ['faqs', faqsResponse]] as const) {
          counts.push(`${name}: ${(res as any)?.data?.length || 0}`)
        }
        console.log(`ℹ️ Dynamic detail routes are ISR-rendered (not prerendered): ${counts.join(', ')}`)

      } catch (error) {
        console.error('⚠️ Failed to fetch dynamic routes:', error)
      }
    }
  },

  nitro: {
    prerender: {
      // 只预渲染纯静态页（改动走代码部署）。
      // 首页和内容列表页（/ /products /blog /faq）也走 ISR：
      // prerender 会把它们变成静态文件，后台发布新内容后永远不会更新
      routes: ['/about', '/contact', '/privacy-policy', '/customization'],
      // 防止 crawlLinks 从列表页的链接里发现详情页又把它们预渲染成静态文件
      ignore: [/^\/products\/.+/, /^\/blog\/.+/, /^\/faq\/.+/],
      failOnError: false
    },
    // 方案 B：把 bypass token 写进 Vercel 的 prerender 配置，
    // 之后 /api/revalidate 带着这个 token 请求页面即可只刷新该页面
    vercel: process.env.REVALIDATE_BYPASS_TOKEN
      ? { config: { bypassToken: process.env.REVALIDATE_BYPASS_TOKEN } }
      : undefined,
    routeRules: {
      // 有 Webhook 主动通知后，ISR 只作为兜底，周期放长减少无效唤醒
      '/':            { isr: 120 },
      '/products':    { isr: 120 },
      '/products/**': { isr: 120 },
      '/blog':        { isr: 120 },
      '/blog/**':     { isr: 120 },
      '/faq':         { isr: 120 },
      '/faq/**':      { isr: 120 }
    }
  } as any
})
