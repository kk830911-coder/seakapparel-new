export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    public: {
      strapiUrl: 'https://seak-backend.onrender.com'
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
        { property: 'og:image', content: 'https://www.seakapparel.com/og-image.jpg' },
        { property: 'og:url', content: 'https://www.seakapparel.com' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Custom Sportswear Manufacturer | OEM Activewear | TontonSports' },
        { name: 'twitter:description', content: '20+ years professional custom sportswear manufacturer. OEM/ODM, low MOQ 1pc, ISO certified.' },
        { name: 'twitter:image', content: 'https://www.seakapparel.com/og-image.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://seak-backend.onrender.com' },
        { rel: 'preconnect', href: 'https://res.cloudinary.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap' }
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-H794JGCTR0', async: true },
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
      url: 'https://www.seakapparel.com',
      logo: 'https://www.seakapparel.com/logo.png',
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
        availableLanguage: ['English', 'Chinese']
      },
      sameAs: [
        'https://www.facebook.com/TontonSports'
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

  nitro: {
    prerender: {
      // 只预渲染真正的静态页。动态内容页(首页/产品/博客/FAQ)交给 isr 按需渲染+定时再验证,
      // 否则它们会变成 Vercel 静态文件,永远不会再验证,后台新增内容无法自动出现在前端。
      routes: ['/about', '/contact', '/privacy-policy', '/customization'],
      failOnError: false
    },
    routeRules: {
      '/':            { isr: 300 },
      '/products':    { isr: 300 },
      '/products/**': { isr: 300 },
      '/blog':        { isr: 300 },
      '/blog/**':     { isr: 300 },
      '/faq':         { isr: 300 },
      '/faq/**':      { isr: 300 }
    }
  }
})
