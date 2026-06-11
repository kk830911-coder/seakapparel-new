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

// 后台热销产品接口，取8个商品
const hotProducts = ref([])
const hotLoading = ref(false)
const getHotProducts = async () => {
  hotLoading.value = true
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  try {
    // 拉取8条产品，完整关联图片
    const res = await $fetch(`${strapiUrl}/api/products?populate=image&pagination[limit]=8`)
    hotProducts.value = res.data || []
  } catch (err) {
    console.error('Hot products fetch error:', err)
  } finally {
    hotLoading.value = false
  }
}

// 获取图片地址工具函数（和产品列表页逻辑完全一致）
const getProductImg = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  if (item.image?.url) return item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  if (item.attributes?.image?.data?.attributes?.url) return item.attributes.image.data.attributes.url
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

onMounted(() => {
  autoPlay()
  getHotProducts()
})
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

    <!-- 三大优势区块 移到工厂介绍上方，宽度和工厂版块统一max-w-[1400px] -->
    <section class="max-w-[1400px] mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </section>

    <!-- 工厂介绍板块 卡片容器 -->
    <section class="max-w-[1400px] mx-auto px-4 pb-16">
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

          <!-- 右侧文字 -->
          <div class="lg:col-span-3 text-gray-600 text-lg leading-relaxed flex flex-col justify-center">
            <p>
              Our factory is located in Xiantao City, Hubei Province. We own a 5000m² intelligent workshop and 1000m² standard warehouse, equipped with more than 50 imported machines and digital pattern rooms. Our professional team of over 100 staff strictly follows ISO quality standards. Adhering to the philosophy of "Quality First, Customer Supreme", we realize efficient conversion between fashion trends and consumer demands through precise market research and flexible production systems.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 新增：源头工厂实景展示区域 完全匹配图片布局 英文翻译 -->
    <section class="max-w-[1400px] mx-auto px-4 pb-16">
      <div class="text-center mb-10">
        <h2 class="text-[clamp(2.2rem,5vw,3.8rem)] font-bold" style="color:#9d25da;">Source Factory / On-site Display</h2>
        <div class="w-40 h-[2px] mx-auto mt-3 mb-4" style="background-color:#9d25da;"></div>
        <p class="text-gray-500 text-lg">Direct factory supply, bulk order discount, one-stop service, 24-hour thoughtful support</p>
      </div>

      <!-- 第一行6宫格 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_01.jpg" alt="Source Factory" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Source Factory</div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_02.jpg" alt="Design & Sample Making" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Design & Sample Making</div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_03.jpg" alt="Ironing Area" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Ironing Zone</div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_04.jpg" alt="Cutting Area" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Cutting Workshop</div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_05.jpg" alt="Sewing Workshop" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Sewing Workshop</div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_06.jpg" alt="Packaging Area" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Final Packaging</div>
        </div>
      </div>

      <!-- 第二行通栏大图，高度改为h-[800px] -->
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img src="/gongchang_07.jpg" alt="5000+ Production Workshop" class="w-full h-[800px] object-cover">
        <div class="absolute top-6 left-1/2 -translate-x-1/2 py-2 px-6 text-center text-white font-bold text-xl" style="background-color:rgba(157, 37, 218, 0.9)">
          5000㎡+ Production Workshop<br>
          <span class="text-base font-normal">Carefully handle every production process</span>
        </div>
      </div>

      <!-- 第三行3宫格 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_08.jpg" alt="Warehouse Corner" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Warehouse Corner</div>
        </div>
        <!-- 中间紫色文字块 -->
        <div class="rounded-lg flex items-center justify-center text-white text-center p-8" style="background-color:#9d25da;">
          <div>
            <p class="text-5xl font-bold leading-tight">Full Real-shot<br>Factory Visit Welcome</p>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-lg">
          <img src="/gongchang_09.jpg" alt="Warehouse Corner" class="w-full h-64 object-cover">
          <div class="absolute bottom-0 left-0 right-0 py-2 text-center text-white font-medium" style="background-color:rgba(157, 37, 218, 0.85)">Warehouse Corner</div>
        </div>
      </div>
    </section>

    <!-- 热销产品推荐版块：从后台真实拉取8条，2行每行4个，右上角More按钮跳转产品页 -->
    <section class="max-w-[1400px] mx-auto px-4 pb-16">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold" style="color:#9d25da;">Hot Selling Products</h2>
        <NuxtLink
          to="/products"
          target="_blank"
          class="px-6 py-2 rounded-lg border-2 font-medium transition-colors hover:text-white"
          style="border-color:#9d25da; color:#9d25da;"
          @mouseover="$event.target.style.backgroundColor='#9d25da'"
          @mouseout="$event.target.style.backgroundColor='transparent'"
        >
          More &rsaquo;
        </NuxtLink>
      </div>

      <!-- 加载状态 -->
      <div v-if="hotLoading" class="text-center py-16 text-gray-500">
        Loading hot products...
      </div>

      <!-- 产品网格 桌面4列 自动2行共8个，和产品列表卡片样式统一 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in hotProducts"
          :key="item.documentId || item.id"
          class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
        >
          <NuxtLink
            :to="`/products/${item.slug}`"
            target="_blank"
            class="aspect-square overflow-hidden block bg-gray-50 relative"
          >
            <img
              :src="getProductImg(item)"
              alt="product"
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </NuxtLink>

          <div class="p-4 flex-1 flex flex-col justify-between">
            <NuxtLink
              :to="`/products/${item.slug}`"
              target="_blank"
              class="block"
            >
              <h3 class="text-lg text-gray-800 line-clamp-2 mb-3">{{ item.title }}</h3>
            </NuxtLink>
            <div class="flex justify-between items-center">
              <span class="text-red-600 text-xl font-bold">¥{{ item.price }}</span>
              <span class="text-gray-500 text-sm">MOQ: {{ item.moq || 10 }} pcs</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新增：定制流程板块 紫色背景 完全还原图片布局 全英文 -->
    <section class="py-16 px-4" style="background-color:#9d25da;">
      <div class="max-w-[1400px] mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-12">
          <h2 class="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white mb-3">CUSTOMIZATION PROCESS</h2>
          <div class="flex items-center justify-center gap-6">
            <div class="w-32 h-[1px] bg-white/70"></div>
            <span class="text-white/80 text-xl">Our Standard Order Steps</span>
            <div class="w-32 h-[1px] bg-white/70"></div>
          </div>
        </div>

        <!-- 6步流程卡片 大屏6列 自适应折叠 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <!-- Step1 Consult -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              <circle cx="9" cy="11" r="1.2"></circle>
              <circle cx="15" cy="11" r="1.2"></circle>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Consult</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Select Products</p>
            <p class="text-gray-500 text-sm">Contact customer service<br>Tell us your demands</p>
          </div>

          <!-- Step2 Quotation -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="16" x2="8" y2="16"></line>
              <circle cx="16.5" cy="9.5" r="2.5"></circle>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Quotation</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Satisfy Effect</p>
            <p class="text-gray-500 text-sm">Factory official quote<br>Sample by your drawing</p>
          </div>

          <!-- Step3 Sampling -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Sampling</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Sample Confirm</p>
            <p class="text-gray-500 text-sm">Provide physical sample<br>OEM private label</p>
          </div>

          <!-- Step4 Production -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="16" x2="8" y2="16"></line>
              <path d="M10 10h-1v-1"></path>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Production</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Confirm Custom</p>
            <p class="text-gray-500 text-sm">Pay deposit<br>Mass production start</p>
          </div>

          <!-- Step5 Shipment -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Shipment</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Order Dispatch</p>
            <p class="text-gray-500 text-sm">Pay balance payment<br>Pack & ship goods</p>
          </div>

          <!-- Step6 Receive Goods -->
          <div class="bg-white rounded-lg p-6 text-center">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#9d25da" stroke-width="1.5" class="mx-auto mb-4">
              <path d="M3 16h13l4 4V7H3z"></path>
              <polyline points="16 3 16 12"></polyline>
              <line x1="7" y1="10" x2="11" y2="10"></line>
            </svg>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Receive</h3>
            <div class="w-full h-[1px] bg-gray-200 mb-3"></div>
            <p class="text-[#9d25da] font-semibold mb-2">Order Completed</p>
            <p class="text-gray-500 text-sm">Confirm receipt<br>Perfect after-sales</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>