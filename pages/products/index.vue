<script setup>
const route = useRoute()
const page = ref(parseInt(route.query.page) || 1)
const pageSize = 20

// 1. 使用 useFetch 进行服务端数据请求，对 SEO 最友好
const { data: responseData, pending, error } = await useFetch(() => {
  const isLocal = window.location.hostname === 'localhost'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  // 带上分页参数给 Strapi
  return `${strapiUrl}/api/products?populate=*&pagination[page]=${page.value}&pagination[pageSize]=${pageSize}`
})

const products = computed(() => responseData.value?.data || [])
const meta = computed(() => responseData.value?.meta?.pagination)

// 2. 翻页逻辑
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= (meta.value?.pageCount || 1)) {
    navigateTo({ query: { page: newPage } })
  }
}

// 辅助函数：确保图片路径正确
const getImageUrl = (item) => {
  const url = item.image?.url || item.attributes?.image?.data?.attributes?.url
  return url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

// 3. SEO 核心配置
useHead({
  title: 'All Wholesale Products | Southeast Asia Women\'s Apparel Supplier - SeakApparel',
  meta: [
    { name: 'description', content: 'Browse our latest collection of wholesale women\'s apparel. Factory direct pricing, low MOQ for boutique owners across Southeast Asia.' },
    { name: 'keywords', content: 'women clothing wholesale, southeast asia apparel supplier, bulk clothing, boutique clothing vendor' }
  ]
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <div v-if="pending" class="text-center py-20 text-gray-500">Loading products...</div>
    
    <div v-else-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to load products. Please check the backend connection.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="item in products" :key="item.id" class="bg-white rounded-xl shadow border border-gray-100 flex flex-col">
        <NuxtLink :to="`/products/${item.documentId || item.id}`" class="aspect-square overflow-hidden block relative bg-gray-50">
          <NuxtImg :src="getImageUrl(item)" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" :alt="item.title || 'Product'" />
        </NuxtLink>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{{ item.title || item.attributes?.title }}</h3>
          <div class="flex justify-between text-xs mt-auto pt-2">
            <span class="text-blue-600 font-bold text-base">${{ item.price || item.attributes?.price }}</span>
            <span class="text-gray-400 self-center">MOQ: {{ item.moq || item.attributes?.moq || 10 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="meta && meta.pageCount > 1" class="mt-12 flex justify-center items-center gap-4">
      <button @click="changePage(page - 1)" :disabled="page === 1" class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
      <span class="font-bold">Page {{ page }} of {{ meta.pageCount }}</span>
      <button @click="changePage(page + 1)" :disabled="page >= meta.pageCount" class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
    </div>
  </div>
</template>