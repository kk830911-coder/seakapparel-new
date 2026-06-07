<script setup>
// 1. 统一环境判断（兼容Nuxt 3的环境变量）
const strapiUrl = process.dev 
  ? 'http://localhost:1337' 
  : 'https://seak-backend.onrender.com'

// 2. 使用Nuxt 3标准的useFetch，增加超时和请求选项
const { data: response, error, pending } = await useFetch(`${strapiUrl}/api/products`, {
  query: { populate: '*' },
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 3. 安全获取产品列表（兼容Strapi v4/v5数据结构）
const products = computed(() => {
  if (!response.value) return []
  
  // 兼容Strapi v5（扁平结构）和v4（嵌套结构）
  const items = Array.isArray(response.value.data) ? response.value.data : []
  return items.map(item => {
    // 统一数据结构，把attributes里的字段提升到顶层
    return {
      id: item.id,
      title: item.title || item.attributes?.title || 'Untitled Product',
      description: item.description || item.attributes?.description || '',
      price: item.price || item.attributes?.price || 0,
      moq: item.moq || item.attributes?.moq || 10,
      image: item.image || item.attributes?.image || null
    }
  })
})

// 4. 统一的图片URL处理函数（兼容相对路径和绝对路径）
const getImageUrl = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  
  let imgUrl = ''
  // 兼容Strapi v5扁平结构
  if (item.image?.url) imgUrl = item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) imgUrl = item.image[0].url
  
  // 兼容Strapi v4嵌套结构
  if (item.image?.data?.attributes?.url) imgUrl = item.image.data.attributes.url
  
  // 处理相对路径
  if (imgUrl && !imgUrl.startsWith('http')) {
    imgUrl = `${strapiUrl}${imgUrl}`
  }
  
  return imgUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

// 5. 设置页面标题
useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <!-- 加载状态 -->
    <div v-if="pending" class="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
      Loading products...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <!-- 产品列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in products" 
        :key="item.id" 
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
      >
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block bg-gray-50 relative">
          <NuxtImg
            :src="getImageUrl(item)"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt="Product Image"
            loading="lazy"
          />
          <div v-if="!item.image" class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
            Sample Image
          </div>
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-lg text-gray-800 line-clamp-1">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mt-1">
              {{ 
                Array.isArray(item.description) 
                ? (item.description[0]?.children?.[0]?.text || '') 
                : (item.description || '') 
              }}
            </p>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-3">
              <span class="text-blue-600 font-bold text-lg">${{ item.price }}</span>
              <span class="text-gray-500 self-center">MOQ: {{ item.moq }} pcs</span>
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