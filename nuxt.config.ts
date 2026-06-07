export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  image: {
    domains: ['localhost:1337']
  }
})