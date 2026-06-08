
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
    '@nuxtjs/sitemap'
  ],

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