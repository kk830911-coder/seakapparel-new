<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(true)

// 智能提取 Strapi 各种奇葩结构图片 URL 的函数
const getImageUrl = (item) => {
  if (!item) return null
  
  // 1. 如果直接有 image.url
  if (item.image?.url) return item.image.url
  
  // 2. 如果 image 是一个数组（Strapi 多图情况）
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  
  // 3. 兼容 Strapi 旧版 data.attributes 结构
  if (item.attributes?.image?.data?.attributes?.url) return item.attributes.image.data.attributes.url
  
  // 4. 尝试寻找隐藏的直连字段
  if (item.image_url) return item.image_url
  
  return null
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    // 强制带上全部相关的媒体解析参数
    const response = await $fetch(`${strapiUrl}/api/products?populate=*`)
    products.value = response?.data || []
    console.log('Frontend received products:', products.value)
  } catch (error) {
    console.error('Fetch products failed:', error)
  } finally {
    loading.value = false
  }
})

useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <div v-if="loading" class="text-center py-20 text-gray-500">
      Loading wholesale products...
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in products" 
        :key="item.id" 
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between"
      >
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block bg-gray-100 relative">
          <NuxtImg
            :src="getImageUrl(item) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt="Product Image"
          />
          <div v-if="!getImageUrl(item)" class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
            Sample Image
          </div>
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold truncate text-lg text-gray-800">{{ item.title }}</h3>
            <p v-if="item.description" class="text-sm text-gray-500 line-clamp-2 mt-1">
              {{ Array.isArray(item.description) ? item.description[0]?.children[0]?.text : item.description }}
            </p>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-3">
              <span class="text-blue-600 font-bold text-lg">${{ item.price }}</span>
              <span class="text-gray-500 self-center">MOQ: {{ item.moq || 10 }} pcs</span>
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