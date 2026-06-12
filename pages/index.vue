<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'SeakApparel | Southeast Asia Women Clothing Wholesale'
})

// 轮播图片数组
const bannerList = ref([
  '/banner/banner1.jpg',
  '/banner/banner2.jpg',
  '/banner/banner3.jpg'
])
const currentIndex = ref(0)
let timer = null

const autoPlay = () => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % bannerList.value.length
  }, 3000)
}
const stopPlay = () => clearInterval(timer)
const prevSlide = () => {
  stopPlay()
  currentIndex.value = currentIndex.value - 1 < 0 ? bannerList.value.length - 1 : currentIndex.value - 1
  autoPlay()
}
const nextSlide = () => {
  stopPlay()
  currentIndex.value = (currentIndex.value + 1) % bannerList.value.length
  autoPlay()
}
const switchSlide = (idx) => {
  stopPlay()
  currentIndex.value = idx
  autoPlay()
}

const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 核心优化：统一清洗图片地址，剥离 query 参数
const getCleanImageUrl = (url) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=75&f_auto'
  if (!url) return fallback
  if (url.startsWith('/')) return `${strapiUrl}${url}`
  return url.split('?')[0]
}

// 提取产品图片逻辑
const getProductImageUrl = (item) => {
  let url = ''
  if (item?.image?.url) url = item.image.url
  else if (Array.isArray(item?.image) && item.image[0]?.url) url = item.image[0].url
  else if (item?.attributes?.image?.data?.attributes?.url) url = item.attributes.image.data.attributes.url
  return getCleanImageUrl(url)
}

const hotProducts = ref([])
const hotLoading = ref(false)
const getHotProducts = async () => {
  hotLoading.value = true
  try {
    const res = await $fetch(`${strapiUrl}/api/products?populate=image&pagination[limit]=8`)
    hotProducts.value = res.data || []
  } catch (err) {
    console.error('Hot products fetch error:', err)
  } finally {
    hotLoading.value = false
  }
}

onMounted(() => {
  autoPlay()
  getHotProducts()
})
onUnmounted(() => stopPlay())
</script>

<template>
  <div>
    <section class="relative w-full overflow-hidden" @mouseenter="stopPlay" @mouseleave="autoPlay">
      <div class="flex w-full transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="img in bannerList" :key="img" class="relative min-w-full h-[20vh] min-h-[220px] md:h-[42vh] lg:h-[calc(100vw*750/1920)] lg:max-h-[750px]">
          <NuxtImg :src="img" class="w-full h-full object-cover md:object-center object-[center,25%]" alt="Banner" loading="lazy" />
        </div>
      </div>
      <button @click="prevSlide" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl bg-[rgba(157,37,218,0.4)] hover:bg-[rgba(157,37,218,0.7)] transition-colors">‹</button>
      <button @click="nextSlide" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl bg-[rgba(157,37,218,0.4)] hover:bg-[rgba(157,37,218,0.7)] transition-colors">›</button>
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        <button v-for="(item, idx) in bannerList" :key="idx" @click="switchSlide(idx)" class="w-3 h-3 rounded-full transition-colors" :class="currentIndex === idx ? 'bg-white' : 'bg-white/40'"></button>
      </div>
    </section>

    <section class="text-white py-10 md:py-20 px-[5px] md:px-6 text-center" style="background-color: #9d25da;">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">Southeast Asia Women's Apparel Wholesale</h1>
      <p class="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">Factory Direct Supply | Low MOQ | OEM & ODM Custom Service</p>
      <NuxtLink to="/products" target="_blank" class="inline-block bg-[#ff4000] hover:bg-[#e03800] px-7 py-3 rounded-lg font-medium transition-colors text-base tracking-wide">Browse All Products</NuxtLink>
    </section>

    <section class="max-w-[1400px] mx-auto px-[5px] md:px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-xl font-bold text-blue-600 mb-2">Low MOQ Support</h3><p class="text-gray-600">Small batch order available for Southeast Asia shop owners & online sellers.</p></div>
        <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-xl font-bold text-blue-600 mb-2">Custom OEM/ODM</h3><p class="text-gray-600">Custom fabric, label, print & packing per buyer’s requirement.</p></div>
        <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-xl font-bold text-blue-600 mb-2">Fast Shipment</h3><p class="text-gray-600">Stable logistics to Malaysia, Thailand, Indonesia, Philippines & Vietnam.</p></div>
      </div>
    </section>

    <section class="max-w-[1400px] mx-auto px-[5px] md:px-4 pb-16">
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div class="lg:col-span-3 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-center whitespace-nowrap" style="color:#9d25da;">Seak Apparel</h2>
            <NuxtImg src="/gongchang.jpg" alt="Factory" class="w-full rounded-md shadow-md" loading="lazy" />
            <div class="bg-gray-50 p-4 rounded-lg mt-auto">
              <h4 class="text-lg font-semibold mb-3 text-gray-800">Contact Information</h4>
              <p class="mb-2">WhatsApp: +86 18271971983</p>
              <p class="mb-4">Email: kk830911@gmail.com</p>
              <NuxtLink to="/contact" target="_blank" class="inline-block px-5 py-2 rounded-lg text-white font-medium w-full text-center" style="background-color:#9d25da;">Contact Us</NuxtLink>
            </div>
          </div>
          <div class="hidden lg:block lg:col-span-6 text-gray-600 text-lg leading-relaxed space-y-6">
            <p><span class="font-bold" style="color:#9d25da;">Hubei Seak Apparel Co., Ltd.</span> is a women's wear intelligent manufacturing enterprise...</p>
          </div>
          <div class="hidden lg:block lg:col-span-3 text-gray-600 text-lg leading-relaxed">
            <p>Our factory is located in Xiantao City, Hubei Province. We own a 5000m² intelligent workshop...</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-[1400px] mx-auto px-[5px] md:px-4 pb-16">
        <NuxtImg src="/gongchang_01.jpg" alt="Factory" class="w-full h-64 object-cover" loading="lazy" />
        </section>

    <section class="max-w-[1400px] mx-auto px-[5px] lg:px-4 pb-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-[8px] lg:gap-[15px]">
        <div v-for="item in hotProducts" :key="item.id" class="bg-white rounded-xl shadow overflow-hidden">
          <NuxtLink :to="`/products/${item.slug || item.attributes?.slug}`" target="_blank" class="aspect-square overflow-hidden block relative">
            <NuxtImg 
              :src="getProductImageUrl(item)" 
              sizes="(max-width: 768px) 300px, 600px" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
              loading="lazy" 
            />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>