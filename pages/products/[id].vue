<script setup>
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

// 当前选中的主图索引
const activeImageIndex = ref(0)

// 极其安全的图片列表解析函数（将后台单图或多图统一转换为标准的数组结构）
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  
  let list = []
  
  // 1. 检查标准的直接 image 字段
  if (data.image) {
    if (Array.isArray(data.image)) {
      list = [...data.image]
    } else if (data.image.url) {
      list.push(data.image)
    }
  }
  
  // 2. 检查多图的 images 数组字段（防备你以后在 Strapi 建立了多图媒体字段）
  if (data.images && Array.isArray(data.images)) {
    list = [...list, ...data.images]
  }
  
  // 3. 兼容旧版 attributes 嵌套结构
  if (data.attributes?.image?.data) {
    const imgData = data.attributes.image.data
    if (Array.isArray(imgData)) {
      imgData.forEach(item => {
        if (item.attributes) list.push(item.attributes)
      })
    } else if (imgData.attributes) {
      list.push(imgData.attributes)
    }
  }
  
  // 过滤确保每一项都有有效的 url
  const sortedList = list.filter(img => img && (img.url || typeof img === 'string'))
  
  // 兜底保护：如果没有解析出任何图片，塞入一张好看的时尚女装占位图
  if (sortedList.length === 0) {
    return [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop' }]
  }
  
  return sortedList.map(img => typeof img === 'string' ? { url: img } : img)
})

// 获取当前展示的主图 URL
const currentMainImageUrl = computed(() => {
  const currentImg = imagesList.value[activeImageIndex.value]
  return currentImg?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
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
    console.log('详情页收到的原始多图数据:', response)
    
    if (response && response.data) {
      product.value = Array.isArray(response.data) ? response.data[0] : response.data
    }
    
    // 重置默认选中的第一张主图
    activeImageIndex.value = 0
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

    <div v-else class="space-y-12">
      
      <div class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        
        <div class="space-y-4">
          <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative">
            <NuxtImg
              :src="currentMainImageUrl"
              class="w-full h-full object-cover transition-all duration-300"
              alt="Product Main Detail Image"
            />
          </div>
          
          <div v-if="imagesList.length > 1" class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            <button
              v-for="(img, index) in imagesList"
              :key="index"
              @click="activeImageIndex = index"
              class="w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
              :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
            >
              <img :src="img.url" class="w-full h-full object-cover" alt="Thumbnail" />
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
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <a 
              :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
              target="_blank"
              class="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-base tracking-wide"
            >
              💬 Inquiry via WhatsApp (Fast Response)
            </a>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4">
          Product Description
        </h3>
        <p class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-xl whitespace-pre-line min-h-[150px]">
          {{ getDescriptionText(product) }}
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 优化缩略图滚动的横向滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>