<script setup>
// 1. 动态获取环境变量或自动回退到 Render 线上后端
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'https://seak-backend.onrender.com'

// 2. 动态抓取产品列表数据，并关联抓取多媒体字段 image
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
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between"
      >
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block bg-gray-50">
          <NuxtImg
            v-if="item.image?.url"
            :src="item.image.url.startsWith('http') ? item.image.url : `${strapiUrl}${item.image.url}`"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt="Product Image"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold truncate text-lg text-gray-800">{{ item.title }}</h3>
            <p v-if="item.description" class="text-sm text-gray-500 line-clamp-2 mt-1">{{ item.description }}</p>
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