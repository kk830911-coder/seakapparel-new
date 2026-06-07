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
        <!-- 路由保留 数字ID，符合你的要求 -->
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
const strapiUrl = process.dev ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 请求商品列表
const { data: res, error, pending } = await useFetch(`${strapiUrl}/api/products?populate=*`, {
  timeout: 10000
})

// 格式化列表数据
const products = computed(() => {
  if (!res.value?.data) return []
  return res.value.data.map(item => ({
    id: item.id,
    title: item.attributes?.title || '',
    description: item.attributes?.description || '',
    price: item.attributes?.price || 0,
    moq: item.attributes?.moq || 0,
    image: item.attributes?.image
  }))
})

// 图片地址处理
const getImageUrl = (img) => {
  if (!img?.data?.attributes?.url) return 'https://via.placeholder.com/600'
  const url = img.data.attributes.url
  return url.startsWith('http') ? url : `${strapiUrl}${url}`
}
</script>