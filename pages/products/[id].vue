<script setup>
const route = useRoute()

// 1. 动态获取环境对应的后端基准地址
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'https://seak-backend.onrender.com'

// 2. 根据 URL 传过来的项目 ID，动态精准请求单件服装的数据
const { data: productResponse } = await useFetch(`${strapiUrl}/api/products/${route.params.id}`, {
  query: { populate: 'image' }
})

// 计算属性：兼容并解构 Strapi 返回的单条核心数据
const product = computed(() => productResponse.value?.data)

useHead(() => ({
  title: product.value?.title ? `${product.value.title} | SeakApparel Wholesale` : 'Product Detail'
}))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="!product" class="text-center py-20 text-gray-500">
      Loading wholesale product details...
    </div>

    <div v-else class="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm">
      
      <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square">
        <NuxtImg
          v-if="product.image?.url"
          :src="product.image.url.startsWith('http') ? product.image.url : `${strapiUrl}${product.image.url}`"
          class="w-full h-full object-cover"
          alt="Product Detail Image"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          No Image Available
        </div>
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
            <p class="text-gray-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg text-sm">
              {{ product.description || 'No specific description provided. Please contact our manager for material, sizing, and color breakdown.' }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100 space-y-3">
          <a 
            :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title} (ID: ${product.id}). Please send more wholesale details.`"
            target="_blank"
            class="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            💬 Inquiry via WhatsApp (Fast Response)
          </a>
          
          <NuxtLink 
            to="/contact" 
            class="block w-full bg-slate-900 text-white text-center py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors text-sm"
          >
            ✉️ Bulk Order Inquiry / Custom OEM
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>