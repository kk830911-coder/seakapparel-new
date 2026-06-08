<script setup>
import { ref, onMounted, watch } from 'vue'

const products = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = 12
const pageCount = ref(1)

const fetchProducts = async (page) => {
  loading.value = true
  // 确保使用正确的后端地址
  const baseUrl = 'https://seak-backend.onrender.com'
  
  try {
    const res = await $fetch(`${baseUrl}/api/products`, {
      query: {
        populate: '*',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      }
    })
    
    // 调试：打开浏览器开发者工具(F12)查看 Console，看这里打印的数据结构
    console.log('Strapi 返回的完整数据:', res)
    
    products.value = res.data || []
    pageCount.value = res.meta?.pagination?.pageCount || 1
  } catch (err) {
    console.error('API请求失败:', err)
  } finally {
    loading.value = false
  }
}

// 获取图片辅助函数
const getImageUrl = (item) => {
  // 尝试多种可能的路径
  const imgData = item.image?.data || item.attributes?.image?.data
  const url = imgData?.attributes?.url || imgData?.url
  return url ? `https://seak-backend.onrender.com${url}` : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

onMounted(() => fetchProducts(currentPage.value))
watch(currentPage, (newPage) => fetchProducts(newPage))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="loading" class="text-center py-10">Loading...</div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="bg-white shadow rounded-lg overflow-hidden border">
        <img :src="getImageUrl(item)" class="w-full h-64 object-cover" />
        <div class="p-4">
          <h3 class="font-bold text-gray-800">{{ item.title || item.attributes?.title || '无标题产品' }}</h3>
          <p class="text-blue-600 font-semibold mt-2">${{ item.price || item.attributes?.price || '0.00' }}</p>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center items-center gap-4">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-200 rounded">Previous</button>
      <span>Page {{ currentPage }} / {{ pageCount }}</span>
      <button @click="currentPage++" :disabled="currentPage >= pageCount" class="px-4 py-2 bg-gray-200 rounded">Next</button>
    </div>
  </div>
</template>