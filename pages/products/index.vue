<script setup>
// 1. 使用 Nuxt 运行时的运行时配置或自动读取我们配置的环境变量
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'https://seak-backend.onrender.com'

// 2. 动态抓取线上或本地 Strapi 的产品数据（包含多媒体字段 image）
const { data: productsData } = await useFetch(`${strapiUrl}/api/products`, {
  query: { populate: 'image' }
})

useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in (productsData?.data || [])" 
        :key="item.id" 
        class="bg-white rounded-xl shadow overflow-hidden"
      >
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block">
          <NuxtImg
            v-if="item.image"
            :src="item.image.url.startsWith('http') ? item.image.url : `${strapiUrl}${item.image.url}`"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt="Product Image"
          />
          <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        </NuxtLink>

        <div class="p-5">
          <h3 class="font-bold truncate text-lg text-gray-800">{{ item.title }}</h3>
          
          <div class="flex justify-between mt-3 text-sm">
            <span class="text-blue-600 font-bold">${{ item.price }}</span>
            <span class="text-gray-500">MOQ: {{ item.moq }} pcs</span>
          </div>
          
          <NuxtLink 
            :to="`/products/${item.id}`" 
            class="block w-full bg-slate-800 text-white text-center py-2 rounded mt-3 hover:bg-slate-700 transition-colors"
          >
            Check Detail & Inquiry
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>