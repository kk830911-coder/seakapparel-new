<script setup>
import { ref, onMounted, watch } from 'vue'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)
const currentPage = ref(1)
const pageSize = 12 // 每页 12 个

// 从 responseData 中解构出 products 和分页信息
const products = computed(() => responseData.value?.data || [])
const pagination = computed(() => responseData.value?.meta?.pagination)

const fetchProducts = async (page) => {
  loading.value = true
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    // 增加分页参数
    const res = await $fetch(`${strapiUrl}/api/products`, {
      query: {
        populate: '*',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      }
    })
    responseData.value = res
  } catch (err) {
    console.error('Fetch failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

// 修改后的图片获取逻辑，确保补全域名
const getImageUrl = (item) => {
  const backendUrl = 'https://seak-backend.onrender.com'
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  
  // 提取可能的图片路径
  const imgData = item.attributes?.image?.data || item.image?.data
  const url = imgData?.attributes?.url || imgData?.url
  
  if (url) {
    // 如果 url 不包含 http，则拼接域名
    return url.startsWith('http') ? url : `${backendUrl}${url}`
  }
  return fallback
}

onMounted(() => fetchProducts(currentPage.value))

// 监听页码切换
watch(currentPage, (newPage) => fetchProducts(newPage))

useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="!loading && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 flex flex-col">
        <NuxtLink :to="`/products/${item.documentId || item.id}`" class="aspect-square overflow-hidden block relative">
          <img :src="getImageUrl(item)" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
        </NuxtLink>
        <div class="p-4">
          <h3 class="font-bold text-gray-800 truncate">{{ item.attributes?.title || item.title }}</h3>
          <p class="text-blue-600 font-bold mt-2">${{ item.attributes?.price || item.price }}</p>
        </div>
      </div>
    </div>

    <div v-if="pagination" class="mt-12 flex justify-center items-center gap-4">
      <button :disabled="currentPage === 1" @click="currentPage--" class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
      <span>Page {{ currentPage }} / {{ pagination.pageCount }}</span>
      <button :disabled="currentPage === pagination.pageCount" @click="currentPage++" class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
    </div>
  </div>
</template>