<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

const getImageUrl = (data) => {
  if (!data) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
  if (data.image?.url) return data.image.url
  if (Array.isArray(data.image) && data.image[0]?.url) return data.image[0].url
  if (data.attributes?.image?.data?.attributes?.url) return data.attributes.image.data.attributes.url
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
}

const getDescriptionText = (data) => {
  if (!data) return 'No specific description provided.'
  const desc = data.description || data.attributes?.description
  if (!desc) return 'No specific description provided.'
  if (Array.isArray(desc)) {
    return desc[0]?.children?.[0]?.text || 'No specific description provided.'
  }
  return desc
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const response = await $fetch(`${strapiUrl}/api/products/${route.params.id}?populate=*`)
    console.log('详情页收到的原始数据:', response)
    
    if (response && response.data) {
      product.value = Array.isArray(response.data) ? response.data[0] : response.data
    }
  } catch (error) {
    console.error('Fetch product detail failed:', error)
  } finally {
    loading.value = false
  }
})

useHead(() => {
  const titleText = product.value?.title || product.value?.attributes?.title || 'Product Detail'
  return {
    title: `${titleText} | SeakApparel Wholesale`
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading wholesale product details...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="space-y-12">
      
      <div class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        
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
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <a 
              :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
              target="_blank"
              class="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-base tracking-wide"
            >
              💬 Inquiry via WhatsApp (Fast Response)
            </a>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4">
          Product Description
        </h3>
        <p class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-xl whitespace-pre-line min-h-[150px]">
          {{ getDescriptionText(product) }}
        </p>
      </div>

    </div>
  </div>
</template>