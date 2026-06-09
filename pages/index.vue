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
          <!-- 1920宽750高图片自适应，不变形裁切 -->
          <img 
            :src="img" 
            alt="SeakApparel Wholesale Banner" 
            class="w-full h-full object-cover object-center"
          >
        </div>
      </div>

      <!-- 左右切换箭头：背景改为半透明紫色 -->
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
        class="inline-block bg-[#ff4000] hover:bg-[#e03800] px-7 py-3 rounded-lg font-medium transition-colors"
      >
        Browse All Products
      </NuxtLink>
    </section>

    <!-- 新增工厂介绍板块 复刻你提供图片排版布局 -->
    <section class="max-w-[1400px] mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧图片+标题 -->
        <div class="lg:col-span-3 text-center">
          <h2 class="text-[clamp(2rem,4vw,3.2rem)] font-bold mb-6" style="color:#9d25da;">梵菡服饰</h2>
          <img src="/gongchang.jpg" alt="湖北梵菡服饰工厂厂房" class="w-full rounded-md shadow-md">
        </div>
        <!-- 中间文字段落 -->
        <div class="lg:col-span-6 text-gray-600 text-lg leading-relaxed space-y-6">
          <p>
            <span class="font-bold" style="color:#9d25da;">湖北梵菡服饰有限公司</span>是集研发设计、柔性生产与跨境电商运营于一体的女装智造企业。主营服装ODM/OEM全案服务，涵盖欧美快时尚开发、女装代工及FOB贴牌生产，产品线覆盖女装、棉服、羽绒服、裙装、衬衫、连体衣等全品类。
          </p>
          <p>
            公司依托智能供应链系统实现每周30+新款开发，支持来图定制、小单快反及跨境电商代发，深度对接Amazon、SHEIN、TikTok、Temu等主流平台，市场覆盖欧美、日韩、中东等60余国及国内重点区域，提供现货直发与样衣定制双模式服务。
          </p>
        </div>
        <!-- 右侧文字段落 -->
        <div class="lg:col-span-3 text-gray-600 text-lg leading-relaxed space-y-6">
          <p>
            工厂位于湖北省仙桃市，拥有5000m²智能车间与1000m标准仓储，配置50+进口设备及数字化板房，逾百人专业团队严格执行ISO质量体系。秉承"品质为基、客户至上"理念，通过精准市场洞察与柔性生产系统，实现流行趋势与消费需求的高效转化。
          </p>
          <p class="font-medium" style="color:#9d25da;">
            诚邀全球客商实地考察，共探ODM开发与跨境供应链合作。
          </p>
        </div>
      </div>
    </section>

    <!-- 三大优势区块 完全保留原样 -->
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