<script setup>
import { ref, onMounted } from 'vue'
const route = useRoute()

const product = ref(null)
const loading = ref(true)

const getImageUrl = (item) => {
  if (!item) return null
  if (item.image?.url) return item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  if (item.attributes?.image?.data?.attributes?.url) return item.attributes.image.data.attributes.url
  if (item.image_url) return item.image_url
  return null
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    const response = await $fetch(`${strapiUrl}/api/products/${route.params.id}?populate=*`)
    product.value = response?.data || null
  } catch (error) {
    console.error('Fetch product detail failed:', error)
  } finally {
    loading.value = false
  }
})

useHead(() => ({
  title: product.value?.title ? `${product.value.title} | SeakApparel Wholesale` : 'Product Detail'
}))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center py-20 text-gray-500">
      Loading wholesale product details...
    </div>

    <div v-else-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Product not found.
    </div>

    <div v-else class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm">
      <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square">
        <NuxtImg
          :src="getImageUrl(product) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'"
          class="w-full h-full object-cover"
          alt="Product Detail Image"
        />
      </div>

      <div class="flex flex-col justify-between">
        <div>
          <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Southeast Asia Wholesale
          </span>
          <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">{{ product.title }}</h1>
          
          <div class="bg-gray-50 p-4 rounded-xl space-y-3 my-6">
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Wholesale Price</span>
              <span class="text-2xl font-extrabold text-blue-600">${{ product.price }}</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
              <span class="text-gray-800 font-semibold">{{ product.moq || 10 }} pcs</span>
            </div>
          </div>

          <div class="py-4">
            <h3 class="font-bold text-gray-800 border-l-4 border-slate-800 pl-2 mb-3">Product Description</h3>
            <p class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg">
              {{ Array.isArray(product.description) ? product.description[0]?.children[0]?.text : product.description }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <a 
            :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title}`"
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