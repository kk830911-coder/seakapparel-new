<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="pending" class="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
      Loading products...
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>
    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in products" :key="item.id" class="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <!-- 路由依然使用 数字 id，不改变原有链接 -->
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block bg-gray-50">
          <NuxtImg
            :src="getImageUrl(item.image)"
            class="w-full h-full object-cover hover:scale-110 transition duration-500"
            alt="Product"
            loading="lazy"
          />
        </NuxtLink>

        <div class="p-5">
          <h3 class="font-bold text-lg text-gray-800 line-clamp-1">{{ item.title }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 mt-2">
            {{ item.description || 'No description' }}
          </p>
          <div class="flex justify-between text-sm my-3">
            <span class="text-blue-600 font-bold text-lg">${{ item.price }}</span>
            <span class="text-gray-500">MOQ: {{ item.moq }} pcs</span>
          </div>
          <NuxtLink
            :to="`/products/${item.id}`"
            class="block w-full bg-slate-800 text-white text-center py-2 rounded hover:bg-slate-700"
          >
            Check Detail & Inquiry
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const strapiUrl = process.dev ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 拉取全量商品列表（用于匹配 ID）
const { data: res, error, pending } = await useFetch(`${strapiUrl}/api/products?populate=*`, {
  timeout: 10000
})

// 整理数据：同时保留 数字id 和 documentId
const productList = computed(() => {
  if (!res.value?.data) return []
  return res.value.data.map(item => ({
    id: item.id, // 数字ID（用于路由）
    documentId: item.documentId, // 真实查询ID
    title: item.attributes?.title || '',
    description: item.attributes?.description || '',
    price: item.attributes?.price || 0,
    moq: item.attributes?.moq || 0,
    image: item.attributes?.image
  }))
})

const getImageUrl = (img) => {
  if (!img?.data?.attributes?.url) return 'https://via.placeholder.com/600'
  let url = img.data.attributes.url
  return url.startsWith('http') ? url : `${strapiUrl}${url}`
}

// 全局挂载列表，给详情页使用
useState('allProducts', () => productList.value)
</script>