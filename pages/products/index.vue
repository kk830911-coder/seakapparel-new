<script setup>
import { ref, onMounted, watch } from 'vue'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)
const currentPage = ref(1)
const pageSize = 12
const pageCount = ref(0) // 显式声明总页数

const products = ref([]) // 改用 ref 直接存储数据

const fetchProducts = async (page) => {
  loading.value = true
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const res = await $fetch(`${strapiUrl}/api/products`, {
      query: {
        populate: '*',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      }
    })
    
    // 关键修正：确保数据路径匹配你的后端返回格式
    products.value = res.data || []
    pageCount.value = res.meta?.pagination?.pageCount || 1
    console.log('加载到的产品数量:', products.value.length)
  } catch (err) {
    console.error('Fetch failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchProducts(currentPage.value))
watch(currentPage, (newPage) => fetchProducts(newPage))

const getImageUrl = (item) => {
  // 根据 Strapi 结构，这里通常在 attributes 中
  const url = item.attributes?.image?.data?.attributes?.url || item.image?.url
  return url ? (url.startsWith('http') ? url : `https://seak-backend.onrender.com${url}`) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="loading" class="text-center py-20">Loading...</div>
    
    <div v-else-if="products.length === 0" class="text-center py-20">没有找到产品。请确保 Strapi 中已有已发布的数据。</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="bg-white shadow rounded-lg overflow-hidden">
        <NuxtImg :src="getImageUrl(item)" class="w-full h-64 object-cover" />
        <div class="p-4">
          <h3 class="font-bold">{{ item.attributes?.title || '无标题' }}</h3>
          <p class="text-blue-600">${{ item.attributes?.price }}</p>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center gap-4">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 border rounded">上一页</button>
      <span>第 {{ currentPage }} 页 / 共 {{ pageCount }} 页</span>
      <button @click="currentPage++" :disabled="currentPage >= pageCount" class="px-4 py-2 border rounded">下一页</button>
    </div>
  </div>
</template>