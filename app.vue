<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <NuxtLink to="/" class="text-2xl font-bold tracking-wide text-slate-800">seakapparel</NuxtLink>
        
        <nav class="hidden md:flex gap-8 font-medium text-gray-600">
          <NuxtLink to="/" active-class="text-blue-600">Home</NuxtLink>
          <NuxtLink to="/products" active-class="text-blue-600">Products</NuxtLink>
          <NuxtLink to="/blog" active-class="text-blue-600">Blog</NuxtLink>
          <NuxtLink to="/faq" active-class="text-blue-600">FAQ</NuxtLink>
          <NuxtLink to="/about" active-class="text-blue-600">About Us</NuxtLink>
          <NuxtLink to="/contact" active-class="text-blue-600">Contact</NuxtLink>
        </nav>

        <button 
          @click="toggleMenu" 
          class="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
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
            <NuxtLink to="/" active-class="text-blue-600" @click="isMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/products" active-class="text-blue-600" @click="isMenuOpen = false">Products</NuxtLink>
            <NuxtLink to="/blog" active-class="text-blue-600" @click="isMenuOpen = false">Blog</NuxtLink>
            <NuxtLink to="/faq" active-class="text-blue-600" @click="isMenuOpen = false">FAQ</NuxtLink>
            <NuxtLink to="/about" active-class="text-blue-600" @click="isMenuOpen = false">About Us</NuxtLink>
            <NuxtLink to="/contact" active-class="text-blue-600" @click="isMenuOpen = false">Contact</NuxtLink>
          </nav>
        </transition>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <footer class="bg-gray-900 text-gray-400 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>©2026 seakapparel | Women Clothing Wholesale Supplier For Southeast Asia</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制手机端菜单打开/关闭的状态变量
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>