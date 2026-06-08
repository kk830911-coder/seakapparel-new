<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)
const currentPage = ref(1)
const pageSize = 12

const products = computed(() => responseData.value?.data || [])
const pagination = computed(() => responseData.value?.meta?.pagination)

const fetchProducts = async (page) => {
  loading.value = true
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    // 添加分页参数
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

onMounted(() => fetchProducts(currentPage.value))

// 监听页码变化重新获取数据
watch(currentPage, (newPage) => fetchProducts(newPage))

// ... getImageUrl 函数保持不变 ...
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="...">
         </div>
    </div>

    <div v-if="pagination" class="mt-12 flex justify-center items-center gap-2">
      <button 
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >Previous</button>
      
      <span class="px-4">Page {{ currentPage }} of {{ pagination.pageCount }}</span>
      
      <button 
        :disabled="currentPage === pagination.pageCount"
        @click="currentPage++"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >Next</button>
    </div>
  </div>
</template>