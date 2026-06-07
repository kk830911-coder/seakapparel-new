<script setup>
const route = useRoute()

// 1. 自动判断环境（本地用 localhost，线上用 Render）
const strapiUrl = process.dev 
  ? 'http://localhost:1337' 
  : 'https://seak-backend.onrender.com'

// 2. 用真正的 useFetch 完美支持 SSR 渲染架构
const { data: response, error } = await useFetch(`${strapiUrl}/api/products/${route.params.id}`, {
  query: { populate: '*' }
})

// 3. 提取核心单条商品数据
const product = computed(() => response.value?.data || null)

// 4. 图片解析路径防御
const getImageUrl = (data) => {
  if (!data) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
  
  if (data.image?.url) return data.image.url
  if (Array.isArray(data.image) && data.image[0]?.url) return data.image[0].url
  if (data.attributes?.image?.data?.attributes?.url) return data.attributes.image.data.attributes.url
  
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
}

// 5. 富文本文字解析防御
const getDescriptionText = (data) => {
  if (!data) return 'No specific description provided.'
  const desc = data.description || data.attributes?.description
  if (!desc) return 'No specific description provided.'
  
  if (Array.isArray(desc)) {
    return desc[0]?.children?.[0]?.text || 'No specific description provided.'
  }
  return desc
}

useHead(() => ({
  title: product.value?.title || product.value?.attributes?.title 
    ? `${product.value?.title || product.value?.attributes?.title} | SeakApparel Wholesale` 
    : 'Product Detail'
}))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="error" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Failed to load product detail from server. Please try again.
    </div>

    <div v-else-if="!product" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      Product detail not found.
    </div>

    <div v-else class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square">
        <NuxtImg
          :src="getImageUrl(product)"
          class="w-full h-full object-cover"
          alt="Product Detail Image"
        />
      </div>

      <div class="flex flex-col justify-between">
        <div>
          <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Southeast Asia Wholesale
          </span>
          
          <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            {{ product.title || product.attributes?.title }}
          </h1>
          
          <div class="bg-gray-50 p-4 rounded-xl space-y-3 my-6">
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Wholesale Price</span>
              <span class="text-2xl font-extrabold text-blue-600">
                ${{ product.price || product.attributes?.price }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
              <span class="text-gray-800 font-semibold">
                {{ product.moq || product.attributes?.moq || 10 }} pcs
              </span>
            </div>
          </div>

          <div class="py-4">
            <h3 class="font-bold text-gray-800 border-l-4 border-slate-800 pl-2 mb-3">Product Description</h3>
            <p class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg whitespace-pre-line">
              {{ getDescriptionText(product) }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <a 
            :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
            target="_blank"
            class="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm animate-pulse"
          >
            💬 Inquiry via WhatsApp (Fast Response)
          </a>
        </div>
      </div>

    </div>
  </div>
</template>