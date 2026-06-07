<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

// 智能解构：不管图片藏在多深的结构里，都把它揪出来
const getImageUrl = (data) => {
  if (!data) return null
  if (data.image?.url) return data.image.url
  if (Array.isArray(data.image) && data.image[0]?.url) return data.image[0].url
  if (data.attributes?.image?.url) return data.attributes.image.url
  if (data.attributes?.image?.data?.attributes?.url) return data.attributes.image.data.attributes.url
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
}

onMounted(async () => {
  // 核心：动态识别环境！在线上用 Render，在本地用 Localhost，绝不写死！
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const response = await $fetch(`${strapiUrl}/api/products/${route.params.id}?populate=*`)
    
    // 兼容 Strapi v4 和 v5 不同的数据包裹外壳
    if (response?.data) {
      product.value = response.data
    }
    console.log('详情页拿到的原始数据:', response)
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
})

useHead(() => ({
  title: product.value?.title || product.value?.attributes?.title ? `${product.value?.title || product.value?.attributes?.title} | SeakApparel Wholesale` : 'Product Detail'
}))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading wholesale product details...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Product details not found or connection lost.
    </div>

    <div v-else class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm">
      
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
              {{ 
                Array.isArray(product.description || product.attributes?.description) 
                ? (product.description || product.attributes?.description)[0]?.children[0]?.text 
                : (product.description || product.attributes?.description || 'No specific description provided.') 
              }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <a 
            :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
            target="_blank"
            class="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            💬 Inquiry via WhatsApp (Fast Response)
          </a>
        </div>
      </div>

    </div>
  </div>
</template>