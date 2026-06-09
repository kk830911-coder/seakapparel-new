<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'SeakApparel | Southeast Asia Women Clothing Wholesale'
})

// 轮播图片数组，替换成你public/banner里真实图片文件名
const bannerList = ref([
  '/banner/banner1.jpg',
  '/banner/banner2.jpg',
  '/banner/banner3.jpg'
])
const currentIndex = ref(0)
let timer = null

// 自动轮播3秒切换
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

onMounted(() => autoPlay())
onUnmounted(() => stopPlay())
</script>

<template>
  <div>
    <!-- 顶部轮播横幅 适配1920*750标准横幅尺寸 -->
    <section 
      class="relative w-full overflow-hidden"
      @mouseenter="stopPlay"
      @mouseleave="autoPlay"
    >
      <div 
        class="flex w-full transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="img in bannerList" 
          :key="img" 
          class="relative min-w-full h-[calc(100vw*750/1920)] max-h-[750px]"
        >
          <img 
            :src="img" 
            alt="SeakApparel Wholesale Banner" 
            class="w-full h-full object-cover object-center"
          >
        </div>
      </div>

      <!-- 左右切换箭头：半透明紫色 -->
      <button 
        @click="prevSlide"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-colors"
        style="background-color: rgba(157, 37, 218, 0.4);"
        @mouseover="$event.target.style.backgroundColor='rgba(157, 37, 218, 0.7)'"
        @mouseout="$event.target.style.backgroundColor='rgba(157, 37, 218, 0.4)'"
      >
        ‹
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-colors"
        style="background-color: rgba(157, 37, 218, 0.4);"
        @mouseover="$event.target.style.backgroundColor='rgba(157, 37, 218, 0.7)'"
        @mouseout="$event.target.style.backgroundColor='rgba(157, 37, 218, 0.4)'"
      >
        ›
      </button>

      <!-- 底部圆点指示器 -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        <button 
          v-for="(item, idx) in bannerList" 
          :key="idx"
          @click="switchSlide(idx)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentIndex === idx ? 'bg-white' : 'bg-white/40'"
        ></button>
      </div>
    </section>

    <!-- 轮播下方紫色文字区块 -->
    <section class="text-white py-20 px-6 text-center" style="background-color: #9d25da;">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">Southeast Asia Women's Apparel Wholesale</h1>
      <p class="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">Factory Direct Supply | Low MOQ | OEM & ODM Custom Service</p>
      <NuxtLink 
        to="/products" 
        target="_blank"
        class="inline-block bg-[#ff4000] hover:bg-[#e03800] px-7 py-3 rounded-lg font-medium transition-colors"
      >
        Browse All Products
      </NuxtLink>
    </section>

    <!-- 工厂介绍板块 卡片容器 -->
    <section class="max-w-[1400px] mx-auto px-4 py-16">
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <!-- 左侧：缩小单行标题 + 工厂图 + 联系方式模块 -->
          <div class="lg:col-span-3 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-center whitespace-nowrap" style="color:#9d25da;">Seak Apparel</h2>
            <img src="/gongchang.jpg" alt="Seak Apparel Factory Building" class="w-full rounded-md shadow-md">
            <!-- 联系信息卡片 -->
            <div class="bg-gray-50 p-4 rounded-lg mt-auto">
              <h4 class="text-lg font-semibold mb-3 text-gray-800">Contact Information</h4>
              <p class="mb-2">WhatsApp: +86 18271971983</p>
              <p class="mb-4">Email: kk830911@gmail.com</p>
              <NuxtLink
                to="/contact"
                target="_blank"
                class="inline-block px-5 py-2 rounded-lg text-white font-medium w-full text-center"
                style="background-color:#9d25da;"
              >
                Contact Us
              </NuxtLink>
            </div>
          </div>

          <!-- 中间主体介绍文字 -->
          <div class="lg:col-span-6 text-gray-600 text-lg leading-relaxed space-y-6 flex flex-col justify-center">
            <p>
              <span class="font-bold" style="color:#9d25da;">Hubei Seak Apparel Co., Ltd.</span> is a women's wear intelligent manufacturing enterprise integrating R&D design, flexible production and cross-border e-commerce operation. We provide full-process ODM/OEM clothing services, including European & American fast fashion development, women's clothing processing and FOB label production. Our product line covers women's dresses, cotton coats, down jackets, skirts, blouses, jumpsuits and all other categories.
            </p>
            <p>
              Supported by an intelligent supply chain system, we launch over 30 new styles weekly. We support custom design based on pictures, small-batch quick orders and cross-border e-commerce dropshipping. We deeply cooperate with mainstream platforms including Amazon, SHEIN, TikTok and Temu. Our markets cover more than 60 countries in Europe, America, Japan, South Korea, the Middle East and key domestic regions, supporting two service modes: ready goods direct delivery and sample custom production.
            </p>
          </div>

          <!-- 右侧文字，已删除底部紫色邀约段落 -->
          <div class="lg:col-span-3 text-gray-600 text-lg leading-relaxed flex flex-col justify-center">
            <p>
              Our factory is located in Xiantao City, Hubei Province. We own a 5000m² intelligent workshop and 1000m² standard warehouse, equipped with more than 50 imported machines and digital pattern rooms. Our professional team of over 100 staff strictly follows ISO quality standards. Adhering to the philosophy of "Quality First, Customer Supreme", we realize efficient conversion between fashion trends and consumer demands through precise market research and flexible production systems.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 三大优势区块 原样保留 -->
    <section class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Low MOQ Support</h3>
        <p class="text-gray-600">Small batch order available for Southeast Asia shop owners & online sellers.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Custom OEM/ODM</h3>
        <p class="text-gray-600">Custom fabric, label, print & packing per buyer’s requirement.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Fast Shipment</h3>
        <p class="text-gray-600">Stable logistics to Malaysia, Thailand, Indonesia, Philippines & Vietnam.</p>
      </div>
    </section>
  </div>
</template>