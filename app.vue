<script setup>
import { ref } from 'vue'
import { useHead } from '#imports'

// 1. 全局 SEO 头信息设置（提升谷歌收录和社交卡片分享）
useHead({
  title: "Southeast Asia Women's Apparel Wholesale | SeakApparel",
  meta: [
    { 
      name: 'description', 
      content: 'SeakApparel is a leading women clothing wholesale supplier for Southeast Asia. Factory direct supply, low MOQ, and professional OEM/ODM custom services for boutique owners in Malaysia, Singapore, Thailand, and Vietnam.' 
    },
    { 
      name: 'keywords', 
      content: 'women clothing wholesale, apparel supplier southeast asia, clothing factory, clothing vendor Malaysia, custom clothing manufacturing' 
    },
    // Open Graph (用于 WhatsApp, Facebook 等社交软件分享时显示漂亮卡片)
    { property: 'og:title', content: "Southeast Asia Women's Apparel Wholesale | SeakApparel" },
    { property: 'og:description', content: 'Factory direct supply, low MOQ, and professional OEM/ODM services for Southeast Asia fashion buyers.' },
    { property: 'og:image', content: 'https://www.seakapparel.com/og-image.jpg' } // 品牌宣传图路径
  ],
  link: [
    { rel: 'canonical', href: 'https://www.seakapparel.com' } // 锁定正版主页，防止 SEO 权重分散
  ]
})

// 2. 移动端移动导航菜单状态控制
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <!-- 导航栏改为紫色背景，文字白色，激活链接橙色 -->
    <header class="shadow-sm sticky top-0 z-50" style="background-color: #9d25da;">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <NuxtLink to="/" class="text-2xl font-bold tracking-wide text-white">Seak-Apparel</NuxtLink>
        
        <nav class="hidden md:flex gap-8 font-medium text-white">
          <NuxtLink to="/" active-class="text-orange-500">Home</NuxtLink>
          <NuxtLink to="/products" active-class="text-orange-500">Products</NuxtLink>
          <NuxtLink to="/blog" active-class="text-orange-500">Blog</NuxtLink>
          <NuxtLink to="/faq" active-class="text-orange-500">FAQ</NuxtLink>
          <NuxtLink to="/about" active-class="text-orange-500">About Us</NuxtLink>
          <NuxtLink to="/contact" active-class="text-orange-500">Contact</NuxtLink>
        </nav>

        <button 
          @click="toggleMenu" 
          class="md:hidden p-2 rounded-md text-white hover:text-orange-500 hover:bg-white/10 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          <svg v-if="!isMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <!-- 移动端下拉菜单紫色背景、白色文字、激活橙色 -->
          <nav 
            v-if="isMenuOpen" 
            class="absolute top-16 left-0 w-full border-b shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden z-50 font-medium"
            style="background-color: #9d25da; border-color: rgba(255,255,255,0.15); color:#fff;"
          >
            <NuxtLink to="/" active-class="text-orange-500" @click="isMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/products" active-class="text-orange-500" @click="isMenuOpen = false">Products</NuxtLink>
            <NuxtLink to="/blog" active-class="text-orange-500" @click="isMenuOpen = false">Blog</NuxtLink>
            <NuxtLink to="/faq" active-class="text-orange-500" @click="isMenuOpen = false">FAQ</NuxtLink>
            <NuxtLink to="/about" active-class="text-orange-500" @click="isMenuOpen = false">About Us</NuxtLink>
            <NuxtLink to="/contact" active-class="text-orange-500" @click="isMenuOpen = false">Contact</NuxtLink>
          </nav>
        </transition>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- 底部改为紫色背景，增加联系方式，文字白色 -->
    <footer class="py-10 mt-12 text-white" style="background-color: #9d25da;">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h4 class="text-lg font-semibold mb-3">Seak-Apparel</h4>
            <p class="opacity-90">Women Clothing Wholesale Supplier For Southeast Asia<br>Professional OEM & ODM Custom Factory</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p class="opacity-90 mb-2">WhatsApp: +86 18271971983</p>
            <p class="opacity-90 mb-2">Email: kk830911@gmail.com</p>
            <p class="opacity-90">Factory Address: Xiantao City, Hubei Province, China</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3">Service Support</h4>
            <p class="opacity-90 mb-2">Low MOQ Wholesale</p>
            <p class="opacity-90 mb-2">Custom Sample & Production</p>
            <p class="opacity-90">24 Hours Online Service</p>
          </div>
        </div>
        <div class="border-t border-white/20 pt-6 text-center text-sm opacity-80">
          <p>©2026 seakapparel | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* 保证页面平滑滚动与基础样式一致性 */
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  padding: 0;
}
</style>