<script setup>
// 自定义错误页：Nuxt 出错时默认页没有品牌、没有导航、没有联系方式，
// 对询盘站来说，错误页也必须能引导客户回到转化路径。
const props = defineProps({
  error: { type: Object, default: null }
})

const isNotFound = computed(() => props.error?.statusCode === 404)

const heading = computed(() =>
  isNotFound.value ? 'Page Not Found' : 'Something Went Wrong'
)

const description = computed(() =>
  isNotFound.value
    ? 'The page you are looking for may have been moved or no longer exists. Try the links below, or message us directly — we reply within 24 hours.'
    : 'An unexpected error occurred on our side. Please try again in a moment, or reach us on WhatsApp / email — your inquiry will not be lost.'
)

const goHome = () => clearError({ redirect: '/' })
const goProducts = () => clearError({ redirect: '/products' })

useHead({
  title: computed(() => (isNotFound.value ? 'Page Not Found | TontonSports' : 'Something Went Wrong | TontonSports')),
  meta: [{ name: 'robots', content: 'noindex, follow' }]
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header（error.vue 不经过默认布局，导航需自带） -->
    <header class="bg-navy">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-white font-heading font-black text-xl">Tonton<span class="text-brand">Sports</span></NuxtLink>
        <a href="https://wa.me/8618271971983" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-300 hover:text-white transition-colors">WhatsApp Us</a>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-20">
      <div class="max-w-xl w-full text-center">
        <div class="text-7xl md:text-8xl font-heading font-black text-brand mb-4">{{ error?.statusCode || 500 }}</div>
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-4">{{ heading }}</h1>
        <p class="text-gray-600 mb-8">{{ description }}</p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button type="button" class="px-6 py-3 rounded-lg bg-brand text-white font-semibold text-sm hover:brightness-110 transition-all" @click="goHome">
            Back to Homepage
          </button>
          <button type="button" class="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors" @click="goProducts">
            Browse Products
          </button>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p class="text-sm text-gray-600 mb-3 font-medium">Need help right away?</p>
          <div class="flex flex-col sm:flex-row gap-2 justify-center text-sm">
            <a href="https://wa.me/8618271971983" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 00-8.51 14.93L2 22l5.2-1.49A9.9 9.9 0 1012.04 2zm5.77 14.06c-.24.68-1.4 1.3-1.93 1.35-.5.05-.98.23-3.3-.69-2.78-1.1-4.53-3.95-4.67-4.13-.13-.19-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.7-.34h.51c.16 0 .38-.06.6.45.23.55.78 1.9.85 2.04.07.14.11.3.02.49-.09.19-.14.3-.27.47-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.27.72 1.18 1.54 1.92 1.06.94 1.95 1.24 2.22 1.38.27.14.43.12.59-.07.16-.2.68-.8.86-1.07.18-.27.36-.22.61-.13.24.09 1.56.74 1.83.87.27.14.45.2.51.31.07.12.07.66-.16 1.33z"/></svg>
              WhatsApp: +86 182 7197 1983
            </a>
            <a href="mailto:Marc@tutesports.com" class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors font-medium">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Marc@tutesports.com
            </a>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-navy py-4 text-center text-xs text-gray-400">
      © {{ new Date().getFullYear() }} TontonSports · Custom Sportswear Manufacturer since 2002
    </footer>
  </div>
</template>
