<script setup>
import { ref, onMounted, watch } from 'vue'

const products = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = 12
const pageCount = ref(1)

// 获取产品列表
const fetchProducts = async (page) => {
  loading.value = true
  const baseUrl = 'https://seak-backend.onrender.com'
  
  try {
    const res = await $fetch(`${baseUrl}/api/products`, {
      query: {
        populate: '*',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      }
    })
    
    products.value = res.data || []
    pageCount.value = res.meta?.pagination?.pageCount || 1
  } catch (err) {
    console.error('API请求失败:', err)
  } finally {
    loading.value = false
  }
}

// 图片路径处理函数 (适配 Strapi 常见结构)
const getImageUrl = (item) => {
  const backendDomain = 'https://seak-backend.onrender.com'
  // 查找 image 字段的多种可能位置
  const imgData = item.image?.data || item.attributes?.image?.data
  
  if (imgData) {
    // 处理数组（多图）或对象（单图）
    const url = Array.isArray(imgData) ? imgData[0]?.attributes?.url : imgData.attributes?.url
    if (url) {
      return url.startsWith('http') ? url : `${backendDomain}${url}`
    }
  }
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

onMounted(() => fetchProducts(currentPage.value))
watch(currentPage, (newPage) => fetchProducts(newPage))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="loading" class="text-center py-20 text-gray-500">Loading products...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="bg-white shadow rounded-lg overflow-hidden border border-gray-100 flex flex-col">
        <div class="aspect-square overflow-hidden bg-gray-50">
          <img :src="getImageUrl(item)" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt="product image" />
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-gray-800 text-sm mb-2">{{ item.title || item.attributes?.title || 'Untitled Product' }}</h3>
          <p class="text-blue-600 font-bold mt-auto">${{ item.price || item.attributes?.price || '0.00' }}</p>
        </div>
      </div>
    </div>

    <div class="mt-12 flex justify-center items-center gap-4">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1" 
        class="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
      >Previous</button>
      
      <span class="text-gray-600">Page {{ currentPage }} of {{ pageCount }}</span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage >= pageCount" 
        class="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
      >Next</button>
    </div>
  </div>
</template>