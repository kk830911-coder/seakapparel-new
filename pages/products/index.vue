<script setup>
const { data: products } = await useFetch('http://localhost:1337/api/products', {
  query: { populate: 'image' }
})

useHead({ title: 'All Wholesale Products | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in products?.data || []" :key="item.id" class="bg-white rounded-xl shadow overflow-hidden">
        <NuxtLink :to="`/products/${item.id}`" class="aspect-square overflow-hidden block">
          <NuxtImg
            v-if="item.image?.length"
            :src="`http://localhost:1337${item.image[0].url}`"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </NuxtLink>
        <div class="p-5">
          <h3 class="font-bold truncate">{{ item.title }}</h3>
          <div class="flex justify-between mt-3">
            <span class="text-blue-600 font-bold">${{ item.price }}</span>
            <span>MOQ: {{ item.moq }}pcs</span>
          </div>
          <NuxtLink :to="`/products/${item.id}`" class="block w-full bg-slate-800 text-white text-center py-2 rounded mt-3">
            Check Detail & Inquiry
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>