<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SeakApparel",
        "alternateName": "Tonton Sportswear (Shenzhen) Co., Ltd.",
        "url": "https://www.seakapparel.com",
        "logo": "https://www.seakapparel.com/logo.png",
        "description": "Professional custom sportswear manufacturer since 2004. OEM/ODM activewear, gym wear, team uniforms. ISO9001 & BSCI certified.",
        "foundingDate": "2004",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Room 207, Building A, Jiewei Industrial Park, Longgang District",
          "addressLocality": "Shenzhen",
          "addressRegion": "Guangdong Province",
          "addressCountry": "CN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+86-18271971983",
          "contactType": "sales",
          "email": "dean@sztonton.com",
          "availableLanguage": ["English", "Chinese"]
        },
        "areaServed": ["North America", "Europe", "Australia", "South America"],
        "knowsAbout": ["Custom Sportswear", "Activewear Manufacturing", "OEM", "ODM", "Team Uniforms"],
        "sameAs": ["https://www.facebook.com/SeakApparel"]
      })
    }
  ]
})

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

const isProductsDropdownOpen = ref(false)
const dropdownTimeout = ref(null)

const productCategories = [
  { name: 'Basketball Uniform', slug: 'basketball-uniform' },
  { name: 'Football Uniform', slug: 'football-uniform' },
  { name: 'Badminton Jersey', slug: 'badminton-jersey' },
  { name: 'Baseball Jersey', slug: 'baseball-jersey' },
  { name: 'Wrestling Singlet', slug: 'wrestling-singlet' },
  { name: 'Ice Hockey Jersey', slug: 'ice-hockey-jersey' },
  { name: 'Rugby Jersey', slug: 'rugby-jersey' },
  { name: 'American Football Jersey', slug: 'american-football-jersey' },
  { name: 'Boxing Outfit', slug: 'boxing-outfit' },
  { name: 'Sports Hoodie', slug: 'sports-hoodie' },
  { name: 'Yoga Wear', slug: 'yoga-wear' }
]

const openDropdown = () => {
  if (dropdownTimeout.value) clearTimeout(dropdownTimeout.value)
  isProductsDropdownOpen.value = true
}
const closeDropdown = () => {
  dropdownTimeout.value = setTimeout(() => { isProductsDropdownOpen.value = false }, 150)
}

const isMobileProductsOpen = ref(false)

const showCookieBanner = ref(false)
onMounted(() => {
  const isCookieAccepted = localStorage.getItem('seak_cookie_accepted')
  if (!isCookieAccepted) {
    setTimeout(() => { showCookieBanner.value = true }, 1500)
  }
})
const acceptCookies = () => {
  localStorage.setItem('seak_cookie_accepted', 'true')
  showCookieBanner.value = false
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-body text-[#1A1A2E]">
    <!-- Top Info Bar -->
    <div class="bg-navy text-white text-xs md:text-sm py-2 hidden md:block">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            20+ Years Professional Sportswear Manufacturer
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ISO9001 | BSCI | WRAP Certified
          </span>
        </div>
        <div class="flex items-center gap-5">
          <a href="mailto:dean@sztonton.com" class="flex items-center gap-1.5 hover:text-brand-light transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            dean@sztonton.com
          </a>
          <a href="https://wa.me/8618271971983" target="_blank" class="flex items-center gap-1.5 hover:text-green-400 transition-colors">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 md:h-[68px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <NuxtImg src="/logo.png" alt="SeakApparel Logo" class="h-10 w-auto" loading="eager" />
          <div class="flex flex-col">
            <span class="text-xl font-heading font-bold text-navy leading-tight">SeakApparel</span>
            <span class="text-[10px] text-gray-400 tracking-wider hidden sm:block">BY TONTON SPORTSWEAR</span>
          </div>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-7 font-medium text-gray-600">
          <NuxtLink to="/" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors">Home</NuxtLink>
          <div class="relative" @mouseenter="openDropdown" @mouseleave="closeDropdown">
            <NuxtLink to="/products" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors flex items-center gap-1">
              Products
              <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': isProductsDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </NuxtLink>
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="isProductsDropdownOpen" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <NuxtLink to="/products" class="block px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors font-medium border-b border-gray-100 mb-1">All Products</NuxtLink>
                <NuxtLink v-for="cat in productCategories" :key="cat.slug" :to="`/products?category=${cat.slug}`" class="block px-4 py-2 text-sm text-gray-600 hover:bg-brand/5 hover:text-brand transition-colors">{{ cat.name }}</NuxtLink>
              </div>
            </transition>
          </div>
          <NuxtLink to="/customization" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors">Customization</NuxtLink>
          <NuxtLink to="/about" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors">About Us</NuxtLink>
          <NuxtLink to="/blog" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors">Blog</NuxtLink>
          <NuxtLink to="/contact" active-class="!text-brand font-semibold" class="hover:text-brand transition-colors">Contact</NuxtLink>
        </nav>

        <div class="hidden lg:block">
          <NuxtLink to="/contact" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            Get Free Quote
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <button @click="toggleMenu" class="lg:hidden p-2 rounded-md text-gray-600 hover:text-brand hover:bg-gray-100 focus:outline-none transition-colors" aria-label="Toggle Menu">
          <svg v-if="!isMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="isMenuOpen" class="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-3 z-50 font-medium text-gray-700 max-h-[70vh] overflow-y-auto">
          <NuxtLink to="/" active-class="!text-brand font-semibold" @click="isMenuOpen = false" class="py-1">Home</NuxtLink>
          <div>
            <button @click="isMobileProductsOpen = !isMobileProductsOpen" class="flex items-center justify-between w-full py-1 text-left">
              <span>Products</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isMobileProductsOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[500px]"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 max-h-[500px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="isMobileProductsOpen" class="overflow-hidden">
                <NuxtLink to="/products" @click="isMenuOpen = false" class="block py-2 pl-3 text-sm text-brand font-medium border-l-2 border-brand/20">All Products</NuxtLink>
                <NuxtLink v-for="cat in productCategories" :key="cat.slug" :to="`/products?category=${cat.slug}`" @click="isMenuOpen = false" class="block py-2 pl-3 text-sm text-gray-500 hover:text-brand border-l-2 border-gray-100 hover:border-brand/20 transition-colors">{{ cat.name }}</NuxtLink>
              </div>
            </transition>
          </div>
          <NuxtLink to="/customization" active-class="!text-brand font-semibold" @click="isMenuOpen = false" class="py-1">Customization</NuxtLink>
          <NuxtLink to="/about" active-class="!text-brand font-semibold" @click="isMenuOpen = false" class="py-1">About Us</NuxtLink>
          <NuxtLink to="/blog" active-class="!text-brand font-semibold" @click="isMenuOpen = false" class="py-1">Blog</NuxtLink>
          <NuxtLink to="/contact" active-class="!text-brand font-semibold" @click="isMenuOpen = false" class="py-1">Contact</NuxtLink>
          <NuxtLink to="/contact" @click="isMenuOpen = false" class="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold px-5 py-2.5 rounded-lg mt-2">Get Free Quote</NuxtLink>
        </nav>
      </transition>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-navy-dark text-gray-300 mt-0">
      <!-- CTA Banner -->
      <div class="bg-brand">
        <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-white text-center md:text-left">
            <h3 class="text-xl md:text-2xl font-heading font-bold">Ready to Start Your Custom Sportswear Project?</h3>
            <p class="text-blue-100 mt-1">Get a free mockup and quote within 24 hours.</p>
          </div>
          <NuxtLink to="/contact" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-7 py-3 rounded-lg transition-colors whitespace-nowrap">
            Get Free Quote
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Main Footer -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-sm">
          <!-- Company -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <NuxtImg src="/logo.png" alt="SeakApparel" class="h-8 w-auto brightness-200" />
              <span class="text-white font-heading font-bold text-lg">SeakApparel</span>
            </div>
            <p class="text-gray-400 leading-relaxed mb-4">Professional custom sportswear manufacturer since 2004. OEM/ODM services for teams, brands, and businesses worldwide.</p>
            <div class="flex gap-3">
              <a href="https://www.facebook.com/SeakApparel" target="_blank" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" aria-label="Facebook">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" aria-label="LinkedIn">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" aria-label="Instagram">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" aria-label="YouTube">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <!-- Products -->
          <div>
            <h4 class="text-white font-heading font-semibold text-base mb-4">Products</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/products" class="hover:text-white transition-colors">All Products</NuxtLink></li>
              <li><NuxtLink to="/products?category=basketball-uniform" class="hover:text-white transition-colors">Basketball Uniform</NuxtLink></li>
              <li><NuxtLink to="/products?category=football-uniform" class="hover:text-white transition-colors">Football Uniform</NuxtLink></li>
              <li><NuxtLink to="/products?category=ice-hockey-jersey" class="hover:text-white transition-colors">Ice Hockey Jersey</NuxtLink></li>
              <li><NuxtLink to="/products?category=wrestling-singlet" class="hover:text-white transition-colors">Wrestling Singlet</NuxtLink></li>
              <li><NuxtLink to="/products?category=yoga-wear" class="hover:text-white transition-colors">Yoga Wear</NuxtLink></li>
              <li><NuxtLink to="/products?category=sports-hoodie" class="hover:text-white transition-colors">Sports Hoodie</NuxtLink></li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4 class="text-white font-heading font-semibold text-base mb-4">Services</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/customization" class="hover:text-white transition-colors">OEM / ODM Manufacturing</NuxtLink></li>
              <li><NuxtLink to="/customization" class="hover:text-white transition-colors">Private Label</NuxtLink></li>
              <li><NuxtLink to="/customization" class="hover:text-white transition-colors">Free Design Service</NuxtLink></li>
              <li><NuxtLink to="/customization" class="hover:text-white transition-colors">Custom Sampling</NuxtLink></li>
              <li><NuxtLink to="/customization" class="hover:text-white transition-colors">Fabric & Materials</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-white transition-colors">Certifications</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-white font-heading font-semibold text-base mb-4">Contact Us</h4>
            <ul class="space-y-3">
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 text-brand-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Room 207, Building A, Jiewei Industrial Park, Longgang District, Shenzhen, China</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:dean@sztonton.com" class="hover:text-white transition-colors">dean@sztonton.com</a>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:+8618271971983" class="hover:text-white transition-colors">+86 182 7197 1983</a>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Mon - Sat: 9:00 - 18:00 (GMT+8)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-white/10 pt-6 text-xs text-gray-500">
          <div class="flex flex-col md:flex-row justify-between items-center gap-3">
            <p>&copy; 2004-2026 Tonton Sportswear (Shenzhen) Co., Ltd. All Rights Reserved.</p>
            <div class="flex gap-4">
              <NuxtLink to="/privacy-policy" class="hover:text-gray-300 transition-colors">Privacy Policy</NuxtLink>
              <NuxtLink to="/faq" class="hover:text-gray-300 transition-colors">FAQ</NuxtLink>
              <a href="/sitemap.xml" class="hover:text-gray-300 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Floating Action Buttons -->
    <div class="fixed right-4 bottom-8 z-[999] shadow-lg rounded-lg overflow-hidden">
      <div class="flex flex-col">
        <a href="https://wa.me/8618271971983" target="_blank" class="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:brightness-110 group" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);" aria-label="WhatsApp">
          <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59zm-4.92 6.53c-1.635 0-3.24-.437-4.64-1.266l-.33-.195-1.156.304.31-1.127-.214-.341c-.87-1.402-1.333-3.024-1.333-4.682 0-5.733 4.667-10.4 10.4-10.4 5.733 0 10.4 4.667 10.4 10.4 0 5.733-4.667 10.4-10.4 10.4z"/>
          </svg>
        </a>
        <a href="mailto:dean@sztonton.com" class="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:brightness-110 group" style="background: linear-gradient(135deg, #046BD2 0%, #0354A8 100%);" aria-label="Email">
          <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </a>
        <NuxtLink to="/" class="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:brightness-110 group" style="background: linear-gradient(135deg, #0A1628 0%, #1B2A4A 100%);" aria-label="Home">
          <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </NuxtLink>
        <button @click="scrollToTop" class="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:brightness-110 group" style="background: linear-gradient(135deg, #FF6B00 0%, #CC5500 100%);" aria-label="Scroll to top">
          <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24" class="transition-transform duration-300 group-hover:scale-110">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Cookie Banner -->
    <transition
      enter-active-class="transition ease-out duration-500 transform"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-300 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="showCookieBanner" class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-2xl z-[1000] py-4 px-6">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-600 max-w-4xl text-center md:text-left leading-relaxed">
            We use cookies to improve your experience and support our marketing efforts. By clicking "Accept", you agree to our use of cookies. Learn more in our <NuxtLink to="/privacy-policy" class="text-brand hover:underline font-medium">Privacy Policy</NuxtLink>.
          </div>
          <div class="flex items-center gap-4 flex-shrink-0">
            <button @click="showCookieBanner = false" class="text-xs text-gray-400 hover:text-gray-600 font-medium transition">Decline</button>
            <button @click="acceptCookies" class="bg-navy text-white text-xs md:text-sm font-semibold px-5 py-2 rounded-lg hover:bg-navy-light transition duration-300 shadow-sm">Accept Cookies</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
html { scroll-behavior: smooth; }
body { margin: 0; padding: 0; }
</style>
