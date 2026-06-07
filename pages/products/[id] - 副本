<script setup>
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

// 用来记录当前用户选中的大图索引（默认显示第一张 0）
const activeImageIndex = ref(0)

// 核心优化：提取所有的图片并转化为数组
const getAllImages = computed(() => {
  const fallback = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop']
  if (!product.value) return fallback

  // 1. 尝试直接读取数组（Strapi 5 标准多图结构）
  const imgData = product.value.image || product.value.attributes?.image
  
  if (Array.isArray(imgData)) {
    return imgData.map(img => img.url).filter(Boolean)
  }
  
  // 2. 兼容 Strapi 4 格式的多图关联：image.data 是数组
  if (imgData?.data && Array.isArray(imgData.data)) {
    return imgData.data.map(item => item.attributes?.url || item.url).filter(Boolean)
  }

  // 3. 如果只是单图单媒体对象
  if (imgData?.url) return [imgData.url]
  if (imgData?.data?.attributes?.url) return [imgData.data.attributes.url]

  return fallback
})

// 当前展示的大图 URL
const currentImageUrl = computed(() => {
  return getAllImages.value[activeImageIndex.value] || getAllImages.value[0]
})

const getDescriptionText = (data) => {
  if (!data) return 'No specific description provided.'
  const desc = data.description || data.attributes?.description
  if (!desc) return 'No specific description provided.'
  if (Array.isArray(desc)) {
    return desc[0]?.children?.[0]?.text || 'No specific description provided.'
  }
  return desc
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const response = await $fetch(`${strapiUrl}/api/products/${route.params.id}?populate=*`)
    console.log('详情页收到的多图原始数据:', response)
    
    if (response && response.data) {
      product.value = Array.isArray(response.data) ? response.data[0] : response.data
    }
  } catch (error) {
    console.error('Fetch product detail failed:', error)
  } finally {
    loading.value = false
  }
})

useHead(() => {
  const titleText = product.value?.title || product.value?.attributes?.title || 'Product Detail'
  return {
    title: `${titleText} | SeakApparel Wholesale`
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading wholesale product details...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="space-y-4">
        <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100">
          <NuxtImg
            :src="currentImageUrl"
            class="w-full h-full object-cover transition-all duration-300"
            alt="Product Detail Image"
          />
        </div>

        <div v-if="getAllImages.length > 1" class="grid grid-cols-4 gap-3">
          <button
            v-for="(imgUrl, index) in getAllImages"
            :key="index"
            @click="activeImageIndex = index"
            class="aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 transition-all focus:outline-none"
            :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'"
          >
            <NuxtImg
              :src="imgUrl"
              class="w-full h-full object-cover"
              alt="Thumbnail"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <div>
          <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Southeast Asia Wholesale
          </span>
          
          <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            {{ product.title || product.attributes?.title }}
          </h1>
          
          <div class="bg-gray-50 p-4 rounded-xl space-y-3 my-6">
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Wholesale Price</span>
              <span class="text-2xl font-extrabold text-blue-600">
                ${{ product.price || product.attributes?.price }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
              <span class="text-gray-800 font-semibold">
                {{ product.moq || product.attributes?.moq || 10 }} pcs
              </span>
            </div>
          </div>

          <div class="py-4">
            <h3 class="font-bold text-gray-800 border-l-4 border-slate-800 pl-2 mb-3">Product Description</h3>
            <p class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg whitespace-pre-line">
              {{ getDescriptionText(product) }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <a 
            :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
            target="_blank"
            class="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            💬 Inquiry via WhatsApp (Fast Response)
          </a>
        </div>
      </div>

    </div>
  </div>
</template>