<script setup>
const route = useRoute()
const { data: product } = await useFetch(`http://localhost:1337/api/products/${route.params.id}`, {
  query: { populate: 'image' }
})

useHead(() => ({
  title: product?.data?.title ? `${product.data.title} | SeakApparel` : 'Product Detail'
}))
</script>

<template>
  <div v-if="product?.data" class="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
    <div class="rounded-xl overflow-hidden shadow bg-white">
      <NuxtImg
        v-if="product.data.image?.length"
        :src="`http://localhost:1337${product.data.image[0].url}`"
        class="w-full"
      />
    </div>
    <div>
      <h1 class="text-2xl font-bold">{{ product.data.title }}</h1>
      <p class="text-2xl font-bold text-blue-600 my-3">Price: ${{ product.data.price }}</p>
      <p>MOQ: {{ product.data.moq }}pcs</p>
      <div class="py-4 border-y my-4">
        <h3 class="font-bold">Description</h3>
        <p class="text-gray-600">{{ product.data.description }}</p>
      </div>
      <a
        :href="`https://wa.me/8613800000000?text=Inquiry about: ${product.data.title}`"
        target="_blank"
        class="block w-full bg-green-500 text-white py-3 rounded-lg text-center"
      >
        Chat WhatsApp
      </a>
    </div>
  </div>
</template>