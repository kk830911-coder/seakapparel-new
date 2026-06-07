<script setup>
useHead({
  title: 'SeakApparel | Southeast Asia Women Clothing Wholesale'
})
</script>

<template>
  <div>
    <!-- 首屏横幅 -->
    <section class="bg-slate-900 text-white py-20 px-6 text-center">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">Southeast Asia Women's Apparel Wholesale</h1>
      <p class="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">Factory Direct Supply | Low MOQ | OEM & ODM Custom Service</p>
      <NuxtLink to="/products" class="inline-block bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-lg font-medium">
        Browse All Products
      </NuxtLink>
    </section>

    <!-- 三大优势 -->
    <section class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Low MOQ Support</h3>
        <p class="text-gray-600">Small batch order available for Southeast Asia shop owners & online sellers.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Custom OEM/ODM</h3>
        <p class="text-gray-600">Custom fabric, label, print & packing per buyer’s requirement.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="text-xl font-bold text-blue-600 mb-2">Fast Shipment</h3>
        <p class="text-gray-600">Stable logistics to Malaysia, Thailand, Indonesia, Philippines & Vietnam.</p>
      </div>
    </section>
  </div>
</template>