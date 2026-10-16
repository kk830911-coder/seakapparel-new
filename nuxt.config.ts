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

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return
      
      const STRAPI_URL = process.env.NUXT_PUBLIC_STRAPI_URL || 'https://seak-backend.onrender.com'
      
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
        
        const dynamicRoutes: string[] = []
        
        const products = (productsResponse as any)?.data || []
        products.forEach((item: any) => {
          const slug = item.slug || item.attributes?.slug
          if (slug) dynamicRoutes.push(`/products/${slug}`)
        })
        
        const blogs = (blogsResponse as any)?.data || []
        blogs.forEach((item: any) => {
          const slug = item.slug || item.attributes?.slug
          if (slug) dynamicRoutes.push(`/blog/${slug}`)
        })
        
        const faqs = (faqsResponse as any)?.data || []
        faqs.forEach((item: any) => {
          const slug = item.slug || item.attributes?.slug
          if (slug) dynamicRoutes.push(`/faq/${slug}`)
        })
        
        console.log(`✅ Found ${dynamicRoutes.length} dynamic routes to prerender`)
        
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        nitroConfig.prerender.routes.push(...dynamicRoutes)
        
      } catch (error) {
        console.error('⚠️ Failed to fetch dynamic routes:', error)
      }
    }
  },

  nitro: {
    prerender: {
      routes: ['/', '/products', '/blog', '/faq', '/about', '/contact', '/privacy-policy', '/customization'],
      failOnError: false
    },
    routeRules: {
      '/products/**': { swr: 1200 },
      '/blog/**': { swr: 1200 },
      '/faq/**': { swr: 1200 }
    }
  }
})
