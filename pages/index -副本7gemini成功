<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'SeakApparel | Southeast Asia Women Clothing Wholesale'
})

// 轮播图片数组
const bannerList = ref([
  '/banner/banner1.jpg',
  '/banner/banner/banner2.jpg',
  '/banner/banner3.jpg'
])
const currentIndex = ref(0)
let timer = null

// 自动轮播逻辑保持不变
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

// 核心优化：获取纯净的图片原始地址，去掉任何 Cloudinary 的强制转换参数
const getCleanImageUrl = (item) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'
  let url = ''

  if (item?.image?.url) url = item.image.url
  else if (Array.isArray(item?.image) && item.image[0]?.url) url = item.image[0].url
  else if (item?.attributes?.image?.data?.attributes?.url) url = item.attributes.image.data.attributes.url
  
  if (!url) return fallback
  
  // 如果是本地路径，补全域名
  if (url.startsWith('/')) return `${strapiUrl}${url}`
  
  // 如果是 Cloudinary 地址，剥离现有的查询参数，只保留基础路径，交给 NuxtImg 处理
  return url.split('?')[0]
}

onMounted(() => {
  autoPlay()
  getHotProducts()
})
onUnmounted(() => stopPlay())
</script>

<template>
  <div>
    <section class="max-w-[1400px] mx-auto px-4 pb-16">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold" style="color:#9d25da;">Hot Selling Products</h2>
        <NuxtLink to="/products" target="_blank" class="px-6 py-2 rounded-lg border-2 font-medium transition-colors hover:text-white" style="border-color:#9d25da; color:#9d25da;">
          More &rsaquo;
        </NuxtLink>
      </div>

      <div v-if="hotLoading" class="text-center py-16 text-gray-500">Loading hot products...</div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="item in hotProducts" :key="item.documentId || item.id" class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100">
          <NuxtLink :to="`/products/${item.slug || item.attributes?.slug}`" target="_blank" class="aspect-square overflow-hidden block bg-gray-50 relative">
            <NuxtImg
              :src="getCleanImageUrl(item)"
              format="avif"
              width="600"
              height="600"
              sizes="300px md:600px"
              alt="product"
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </NuxtLink>

          <div class="p-4 flex-1 flex flex-col justify-between">
            <NuxtLink :to="`/products/${item.slug || item.attributes?.slug}`" target="_blank" class="block">
              <h3 class="text-lg text-gray-800 line-clamp-2 mb-3">{{ item.title || item.attributes?.title }}</h3>
            </NuxtLink>
            <div class="flex justify-between items-center">
              <span class="text-red-600 text-xl font-bold">¥{{ item.price || item.attributes?.price }}</span>
              <span class="text-gray-500 text-sm">MOQ: {{ item.moq || item.attributes?.moq || 10 }} pcs</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
</template>