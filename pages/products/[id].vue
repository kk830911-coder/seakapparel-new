<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useHead } from '#imports' // 确保在 Nuxt3 环境中安全导入

const route = useRoute()
const product = ref(null)
const loading = ref(true)

// 当前选中的主图索引
const activeImageIndex = ref(0)

// 极其安全的图片列表解析函数（将后台单图或多图统一转换为纯 url 字符串数组）
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  
  let list = []
  
  // 1. 检查直接的 image 字段
  if (data.image) {
    if (Array.isArray(data.image)) {
      list = [...data.image]
    } else {
      list.push(data.image)
    }
  }
  
  // 2. 检查多图的 images 数组字段
  if (data.images && Array.isArray(data.images)) {
    list = [...list, ...data.images]
  }
  
  // 3. 兼容传统 attributes.image.data 嵌套结构
  if (data.attributes?.image?.data) {
    const imgData = data.attributes.image.data
    if (Array.isArray(imgData)) {
      imgData.forEach(item => list.push(item))
    } else {
      list.push(imgData)
    }
  }

  // 核心清洗：把各种奇葩多层嵌套的 Strapi 图片对象全部拍平，只提取出绝对安全的 url 字符串数组
  const processedUrls = list.map(img => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (img.url) return img.url
    if (img.attributes?.url) return img.attributes.url
    return null
  }).filter(url => url !== null)
  
  // 兜底保护：如果没有解析出任何图片，塞入一张好看的时尚女装占位图
  if (processedUrls.length === 0) {
    return ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop']
  }
  
  return processedUrls
})

// 获取当前展示的主图 URL
const currentMainImageUrl = computed(() => {
  return imagesList.value[activeImageIndex.value] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
})

// 下一张图片（循环切换）
const nextImage = () => {
  if (imagesList.value.length <= 1) return
  if (activeImageIndex.value === imagesList.value.length - 1) {
    activeImageIndex.value = 0 // 点到最后一张，回到第一张
  } else {
    activeImageIndex.value++
  }
}

// 上一张图片（循环切换）
const prevImage = () => {
  if (imagesList.value.length <= 1) return
  if (activeImageIndex.value === 0) {
    activeImageIndex.value = imagesList.value.length - 1 // 在第一张点左，跳到最后一张
  } else {
    activeImageIndex.value--
  }
}

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

// ====== 步骤2：重写后的动态 SEO 核心逻辑 ======
useHead({
  title: computed(() => {
    const titleText = product.value?.title || product.value?.attributes?.title || 'Product Detail'
    return `${titleText} | Southeast Asia Apparel Wholesale - SeakApparel`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const rawDesc = getDescriptionText(product.value)
        // 清洗默认提示词，防止无描述时拖累整体权重
        const cleanDesc = rawDesc === 'No specific description provided.' ? '' : rawDesc
        // 智能获取价格和起订量，填充在描述里增加吸引力
        const price = product.value?.price || product.value?.attributes?.price || ''
        const moq = product.value?.moq || product.value?.attributes?.moq || 10
        
        return `Wholesale ${product.value?.title || 'Women Clothing'}. ${cleanDesc.slice(0, 120)}... Factory direct price${price ? ': $' + price : ''}, Low MOQ: ${moq}pcs. Supplier for Southeast Asia fashion boutiques.`
      })
    },
    // 为每个单品加上语义化关键字
    {
      name: 'keywords',
      content: computed(() => {
        const titleText = product.value?.title || 'Women Clothing'
        return `${titleText} wholesale, bulk clothing supplier, Southeast Asia apparel vendor, custom dress factory`
      })
    },
    // Open Graph 社交网络支持 (Facebook / WhatsApp 预览卡片)
    {
      property: 'og:title',
      content: computed(() => `${product.value?.title || 'Product'} | SeakApparel Wholesale`)
    },
    {
      property: 'og:image',
      content: computed(() => currentMainImageUrl.value)
    }
  ]
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
          <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group">
            <NuxtImg
              :src="currentMainImageUrl"
              class="w-full h-full object-cover transition-all duration-300"
              :alt="`${product.title || product.attributes?.title || 'Wholesale Women Apparel'} - SeakApparel Image`"
            />
            
            <button 
              v-if="imagesList.length > 1"
              @click="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md"
              aria-label="Previous Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button 
              v-if="imagesList.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md"
              aria-label="Next Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div v-if="imagesList.length > 1" class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wider z-10">
              {{ activeImageIndex + 1 }} / {{ imagesList.length }}
            </div>
          </div>
          
          <div v-if="imagesList.length > 1" class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            <button
              v-for="(url, index) in imagesList"
              :key="index"
              @click="activeImageIndex = index"
              class="w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
              :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
            >
              <img :src="url" class="w-full h-full object-cover" :alt="`Thumbnail ${index + 1}`" />
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