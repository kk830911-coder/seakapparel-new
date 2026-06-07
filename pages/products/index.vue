<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    
    <div v-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in products" 
        :key="item.id || item._id" 
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
      >
        <NuxtLink :to="`/products/${item.id || item._id}`" class="aspect-square overflow-hidden block bg-gray-50 relative">
          <NuxtImg
            :src="getImageUrl(item)"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt="Product Image"
          />
          <div v-if="!item.image" class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
            Sample Image
          </div>
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-lg text-gray-800 line-clamp-1">{{ item.title || item.attributes?.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mt-1">
              {{ 
                Array.isArray(item.description || item.attributes?.description) 
                ? (item.description || item.attributes?.description)[0]?.children?.[0]?.text 
                : (item.description || item.attributes?.description || '') 
              }}
            </p>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-3">
              <span class="text-blue-600 font-bold text-lg">${{ item.price || item.attributes?.price }}</span>
              <span class="text-gray-500 self-center">MOQ: {{ item.moq || item.attributes?.moq || 10 }} pcs</span>
            </div>
            
            <NuxtLink 
              :to="`/products/${item.id || item._id}`" 
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

<script setup>
const strapiUrl = process.dev 
  ? 'http://localhost:1337' 
  : 'https://seak-backend.onrender.com'

const { data: response, error } = await useFetch(`${strapiUrl}/api/products`, {
  query: { populate: '*' }
})

const products = computed(() => response.value?.data || [])

const getImageUrl = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  
  if (item.image?.url) return item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  if (item.attributes?.image?.data?.attributes?.url) return item.attributes.image.data.attributes.url

  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>