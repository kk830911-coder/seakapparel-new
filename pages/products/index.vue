<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHead } from '#imports'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// 自动兼容 Strapi v4 (responseData.value.data) 和直出格式
const products = computed(() => responseData.value?.data || [])

// 兼容各种媒体库返回层级的图片提取函数
const getImageUrl = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  
  // 1. 尝试直接取最外层的层级
  if (item.image?.url) return item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  
  // 2. 尝试嵌套格式 (attributes.image.data...)
  const attrs = item.attributes
  if (attrs?.image?.url) return attrs.image.url
  if (attrs?.image?.data?.attributes?.url) return attrs.image.data.attributes.url
  if (Array.isArray(attrs?.image?.data) && attrs.image.data[0]?.attributes?.url) {
    return attrs.image.data[0].attributes.url
  }
  
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const res = await $fetch(`${strapiUrl}/api/products?populate=*`)
    console.log('列表页收到的原始数据:', res)
    responseData.value = res
  } catch (err) {
    console.error('Client fetch products failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

// ====== 优化后的首页 / 产品页 SEO 核心设置 ======
useHead({
  title: "All Wholesale Products | Southeast Asia Women's Apparel Supplier - SeakApparel",
  meta: [
    {
      name: 'description',
      content: "Browse our latest collection of wholesale women's apparel. SeakApparel offers high-quality fashion, factory direct pricing, low MOQ, and reliable shipping for clothing vendors and boutique owners across Southeast Asia."
    },
    {
      name: 'keywords',
      content: 'women clothing wholesale, southeast asia apparel supplier, bulk clothing vendor, wholesale dresses, boutique clothing supplier'
    }
  ]
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading wholesale products...</p>
    </div>

    <div v-else-if="fetchError" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in products" 
        :key="item.id" 
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
      >
        <NuxtLink 
          :to="`/products/${item.id}`" 
          class="aspect-square overflow-hidden block bg-gray-50 relative"
        >
          <NuxtImg
            :src="getImageUrl(item)"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            :alt="`${item.title || item.attributes?.title || 'Wholesale Women Clothing'} - SeakApparel`"
          />
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-lg text-gray-800 line-clamp-1">
              {{ item.title || item.attributes?.title }}
            </h3>
            <p class="text-sm text-gray-500 line-clamp-2 mt-1">
              {{ 
                Array.isArray(item.description || item.attributes?.description) 
                ? (item.description || item.attributes?.description)[0]?.children?.[0]?.text 
                : (item.description || item.attributes?.description || '') 
              }}
            </p>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-3">
              <span class="text-blue-600 font-bold text-lg">
                ${{ item.price || item.attributes?.price }}
              </span>
              <span class="text-gray-500 self-center">
                MOQ: {{ item.moq || item.attributes?.moq || 10 }} pcs
              </span>
            </div>
            
            <NuxtLink 
              :to="`/products/${item.id}`" 
              class="block w-full bg-slate-800 text-white text-center py-2 rounded hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              Check Detail & Inquiry
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>