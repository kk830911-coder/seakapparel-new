<template>
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <div v-if="pending" class="text-center text-xl py-20">
      Loading product details...
    </div>
    <div v-else-if="error" class="text-center text-red-500 text-xl py-20">
      Failed to load product, please try again later
    </div>
    <div v-else-if="!targetDocId" class="text-center text-gray-500 py-20">
      Product not found
    </div>

    <div v-else-if="product" class="grid md:grid-cols-2 gap-10 items-start">
      <div class="rounded-lg overflow-hidden shadow-lg">
        <NuxtImg
          :src="getImageUrl(product.image)"
          alt="Product Image"
          class="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>
        <div class="text-2xl text-red-600 font-semibold">${{ product.price }}</div>
        <div class="text-gray-700">
          <p><strong>MOQ (Minimum Order Quantity):</strong> {{ product.moq }} pcs</p>
        </div>
        <div class="border-t pt-6">
          <h3 class="text-xl font-medium mb-3">Product Description</h3>
          <p class="text-gray-600 leading-relaxed">
            {{ product.description || 'No description available' }}
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
const route = useRoute()
const strapiUrl = process.dev ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 1. 获取全局商品列表（来自列表页）
const allProducts = useState('allProducts')
// 当前路由的 数字ID
const numId = route.params.id

// 2. 根据数字ID 匹配出真实 documentId
const targetDocId = computed(() => {
  const item = allProducts.value.find(p => p.id == numId)
  return item ? item.documentId : null
})

// 3. 用 documentId 请求详情接口
const { data, pending, error } = await useFetch(
  () => targetDocId.value ? `${strapiUrl}/api/products/${targetDocId.value}?populate=*` : null,
  { timeout: 10000 }
)

// 4. 解析数据
const product = computed(() => {
  if (!data.value?.data) return null
  const d = data.value.data
  return {
    title: d.attributes?.title || '',
    price: d.attributes?.price || 0,
    moq: d.attributes?.moq || 0,
    description: d.attributes?.description || '',
    image: d.attributes?.image
  }
})

// 图片处理
const getImageUrl = (img) => {
  if (!img?.data?.attributes?.url) return 'https://via.placeholder.com/600'
  let url = img.data.attributes.url
  return url.startsWith('http') ? url : `${strapiUrl}${url}`
}
</script>