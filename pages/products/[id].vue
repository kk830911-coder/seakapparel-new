<template>
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <div v-if="pending" class="text-center text-xl py-20">
      Loading product details...
    </div>

    <div v-else-if="error" class="text-center text-red-500 text-xl py-20">
      Failed to load product, please try again later
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

        <div class="text-2xl text-red-600 font-semibold">
          ${{ product.price }}
        </div>

        <div class="text-gray-700">
          <p><strong>MOQ (Minimum Order Quantity):</strong> {{ product.moq }}</p>
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

    <div v-else class="text-center text-gray-500 py-20">
      Product not found
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.strapiUrl

// 关键：用 route.params.id 也就是 documentId 来请求
const { data, pending, error } = await useFetch(
  () => `${baseUrl}/api/products/${route.params.id}?populate=*`
)

const product = computed(() => {
  if (!data.value?.data) return null
  return data.value.data.attributes
})

const getImageUrl = (img) => {
  if (!img?.url) return '/placeholder.png'
  return img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
}
</script>