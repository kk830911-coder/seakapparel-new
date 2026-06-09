<script setup>
import { ref } from 'vue'
import { useHead } from '#imports'

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
    { property: 'og:title', content: "Southeast Asia Women's Apparel Wholesale | SeakApparel" },
    { property: 'og:description', content: 'Factory direct supply, low MOQ, and professional OEM/ODM services for Southeast Asia fashion buyers.' },
    { property: 'og:image', content: 'https://www.seakapparel.com/og-image.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.seakapparel.com' }
  ]
})

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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