<template>
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <!-- 加载状态 -->
    <div v-if="pending" class="text-center text-xl py-20">
      Loading product details...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center text-red-500 text-xl py-20">
      Failed to load product, please try again later
    </div>

    <!-- 产品详情 -->
    <div v-else-if="product" class="grid md:grid-cols-2 gap-10 items-start">
      <div class="rounded-lg overflow-hidden shadow-lg">
        <NuxtImg
          :src="getImageUrl(product.image)"
          :alt="`${product.title} image`"
          class="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>

      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>

        <div class="text-2xl text-red-600 font-semibold">
          ${{ product.price }}
        </div>

        <div class="text-gray-700">
          <p><strong>MOQ (Minimum Order Quantity):</strong> {{ product.moq }} pcs</p>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-xl font-medium mb-3">Product Description</h3>
          <p class="text-gray-600 leading-relaxed">
            {{ 
              Array.isArray(product.description) 
              ? (product.description[0]?.children?.[0]?.text || 'No description available') 
              : (product.description || 'No description available') 
            }}
          </p>
        </div>

        <div class="pt-4">
          <NuxtLink
            to="/products"
            class="inline-block bg-slate-800 text-white px-6 py-3 rounded hover:bg-slate-700 transition"
          >
            Back to Product List
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 产品不存在 -->
    <div v-else class="text-center text-gray-500 py-20">
      Product not found
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// 统一环境判断
const strapiUrl = process.dev 
  ? 'http://localhost:1337' 
  : 'https://seak-backend.onrender.com'

// 请求产品详情
const { data, pending, error } = await useFetch(
  () => `${strapiUrl}/api/products/${route.params.id}?populate=*`,
  {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

// 统一数据解析（兼容Strapi v4/v5）
const product = computed(() => {
  if (!data.value?.data) return null
  
  const rawData = data.value.data
  // 提取核心字段，统一数据结构
  return {
    id: rawData.id,
    title: rawData.title || rawData.attributes?.title || 'Untitled Product',
    price: rawData.price || rawData.attributes?.price || 0,
    moq: rawData.moq || rawData.attributes?.moq || 10,
    description: rawData.description || rawData.attributes?.description || '',
    image: rawData.image || rawData.attributes?.image || null
  }
})

// 统一的图片URL处理函数
const getImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  
  let imgUrl = ''
  // 兼容不同的图片数据结构
  if (img?.url) imgUrl = img.url
  if (Array.isArray(img) && img[0]?.url) imgUrl = img[0].url
  if (img?.data?.attributes?.url) imgUrl = img.data.attributes.url
  
  // 处理相对路径
  if (imgUrl && !imgUrl.startsWith('http')) {
    imgUrl = `${strapiUrl}${imgUrl}`
  }
  
  return imgUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

// 设置页面标题
useHead({ 
  title: computed(() => product.value ? `${product.value.title} | SeakApparel` : 'Product Not Found | SeakApparel') 
})
</script>