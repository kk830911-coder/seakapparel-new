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
    { property: 'og:image', content: 'https://www.seakapparel.com/og-image.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.seakapparel.com' }
  ]
})

// 2. 移动端移动导航菜单状态控制
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <!-- 白色导航栏，紫色点缀 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <NuxtLink to="/" class="text-2xl font-bold tracking-wide" style="color:#9d25da;">Seak-Apparel</NuxtLink>
        
        <nav class="hidden md:flex gap-8 font-medium text-gray-700">
          <NuxtLink to="/" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">Home</NuxtLink>
          <NuxtLink to="/products" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">Products</NuxtLink>
          <NuxtLink to="/blog" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">Blog</NuxtLink>
          <NuxtLink to="/faq" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">FAQ</NuxtLink>
          <NuxtLink to="/about" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">About Us</NuxtLink>
          <NuxtLink to="/contact" active-class="text-[#9d25da] border-b-2 border-[#9d25da] pb-1">Contact</NuxtLink>
        </nav>

        <button 
          @click="toggleMenu" 
          class="md:hidden p-2 rounded-md text-gray-600 hover:text-[#9d25da] hover:bg-gray-100 focus:outline-none transition-colors"
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
          <nav 
            v-if="isMenuOpen" 
            class="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden z-50 font-medium text-gray-700"
          >
            <NuxtLink to="/" active-class="text-[#9d25da]" @click="isMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/products" active-class="text-[#9d25da]" @click="isMenuOpen = false">Products</NuxtLink>
            <NuxtLink to="/blog" active-class="text-[#9d25da]" @click="isMenuOpen = false">Blog</NuxtLink>
            <NuxtLink to="/faq" active-class="text-[#9d25da]" @click="isMenuOpen = false">FAQ</NuxtLink>
            <NuxtLink to="/about" active-class="text-[#9d25da]" @click="isMenuOpen = false">About Us</NuxtLink>
            <NuxtLink to="/contact" active-class="text-[#9d25da]" @click="isMenuOpen = false">Contact</NuxtLink>
          </nav>
        </transition>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- 深灰高端页脚，紫色标题点缀 -->
    <footer class="mt-12 py-10 text-gray-300" style="background-color:#1a1a24;">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h4 class="text-lg font-semibold mb-3" style="color:#b866e0;">Seak-Apparel</h4>
            <p class="opacity-90">Women Clothing Wholesale Supplier For Southeast Asia<br>Professional OEM & ODM Custom Factory</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3" style="color:#b866e0;">Contact Information</h4>
            <p class="opacity-90 mb-2">WhatsApp: +86 18271971983</p>
            <p class="opacity-90 mb-2">Email: kk830911@gmail.com</p>
            <p class="opacity-90">Factory Address: Xiantao City, Hubei Province, China</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3" style="color:#b866e0;">Service Support</h4>
            <p class="opacity-90 mb-2">Low MOQ Wholesale</p>
            <p class="opacity-90 mb-2">Custom Sample & Production</p>
            <p class="opacity-90">24 Hours Online Service</p>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-6 text-center text-sm opacity-80">
          <p>©2026 seakapparel | All Rights Reserved</p>
        </div>
      </div>
    </footer>

    <!-- 右侧悬浮按钮：整体四格连在一起正方形，保留原有渐变颜色，hover特效 -->
    <div class="fixed right-5 bottom-8 z-[999] shadow-xl rounded-lg overflow-hidden">
      <div class="grid grid-cols-2 w-[112px]">
        <!-- WhatsApp 渐变绿 -->
        <a 
          href="https://wa.me/8618271971983" 
          target="_blank"
          class="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:brightness-110 group"
          style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);"
        >
          <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59zm-4.92 6.53c-1.635 0-3.24-.437-4.64-1.266l-.33-.195-1.156.304.31-1.127-.214-.341c-.87-1.402-1.333-3.024-1.333-4.682 0-5.733 4.667-10.4 10.4-10.4 5.733 0 10.4 4.667 10.4 10.4 0 5.733-4.667 10.4-10.4 10.4z"/>
          </svg>
        </a>
        <!-- Facebook 渐变蓝 -->
        <a 
          href="https://facebook.com/SeakApparel" 
          target="_blank"
          class="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:brightness-110 group"
          style="background: linear-gradient(135deg, #4267B2 0%, #1877F2 100%);"
        >
          <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <!-- 返回首页 品牌紫渐变 -->
        <NuxtLink 
          to="/"
          class="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:brightness-110 group"
          style="background: linear-gradient(135deg, #b866e0 0%, #9d25da 100%);"
        >
          <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </NuxtLink>
        <!-- 返回顶部 橙色渐变 -->
        <button 
          @click="scrollToTop"
          class="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:brightness-110 group"
          style="background: linear-gradient(135deg, #ffb347 0%, #ff8c28 100%);"
        >
          <svg width="26" height="26" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  padding: 0;
}
</style>