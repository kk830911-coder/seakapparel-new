<template>
  <div class="max-w-7xl mx-auto px-2 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">All Wholesale Products</h1>

    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading wholesale products...</p>
    </div>

    <div v-else-if="fetchError" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <div v-else-if="allProducts.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No products found.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      <div
        v-for="item in pageProducts"
        :key="item.id"
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
      >
        <NuxtLink
          :to="`/products/${item.documentId || item.attributes?.documentId || item.id}`"
          target="_blank"
          class="aspect-square overflow-hidden block bg-gray-50 relative"
        >
          <NuxtImg
            :src="getImageUrl(item)"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            :alt="`${item.title || item.attributes?.title || 'Wholesale Women Clothing'} - SeakApparel`"
          />
        </NuxtLink>

        <div class="p-0.5 flex-1 flex flex-col justify-between">
          <div>
            <NuxtLink
              :to="`/products/${item.documentId || item.attributes?.documentId || item.id}`"
              target="_blank"
              class="block"
            >
              <!-- 字号缩小：text-lg 改为 text-base -->
              <h3 class="text-base text-gray-800 line-clamp-2">{{ item.title || item.attributes?.title }}</h3>
            </NuxtLink>
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-sm mb-3">
              <!-- 价格增加 font-bold 加粗 -->
              <span class="text-red-600 text-lg font-bold">¥{{ item.price || item.attributes?.price }}</span>
              <span class="text-gray-500 self-center">MOQ: {{ item.moq || item.attributes?.moq || 10 }} pcs</span>
            </div>

            <NuxtLink
              :to="`/products/${item.documentId || item.attributes?.documentId || item.id}`"
              class="block w-full bg-slate-800 text-white text-center py-2 rounded hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              Check Detail & Inquiry
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPage > 1" class="flex justify-center items-center gap-3 mt-12">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Prev
      </button>

      <button
        v-for="page in totalPage"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-4 py-2 rounded border',
          currentPage === page ? 'bg-slate-800 text-white border-slate-800' : 'hover:bg-gray-100'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="currentPage++"
        :disabled="currentPage === totalPage"
        class="px-4 py-2 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const pageSize = 12
const currentPage = ref(1)

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

const allProducts = computed(() => {
  if (!responseData.value?.data) return []
  return responseData.value.data
})

const totalPage = computed(() => {
  const list = allProducts.value
  if (!Array.isArray(list) || list.length === 0) return 0
  return Math.ceil(list.length / pageSize)
})

const pageProducts = computed(() => {
  const list = allProducts.value
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
})

const getImageUrl = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  if (item.image?.url) return item.image.url
  if (Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url
  if (item.attributes?.image?.data?.attributes?.url) return item.attributes.image.data.attributes.url
  return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

  try {
    const res = await $fetch(`${strapiUrl}/api/products?populate=*`)
    console.log('列表页收到的原始数据:', res)
    responseData.value = res
  } catch (err) {
    console.error('Client fetch products failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'All Wholesale Products | Southeast Asia Women\'s Apparel Supplier - SeakApparel',
  meta: [
    {
      name: 'description',
      content: 'Browse our latest collection of wholesale women\'s apparel. SeakApparel offers high-quality fashion, factory direct pricing, low MOQ, and reliable shipping for clothing vendors and boutique owners across Southeast Asia.'
    },
    {
      name: 'keywords',
      content: 'women clothing wholesale, southeast asia apparel supplier, bulk clothing vendor, wholesale dresses, boutique clothing supplier'
    }
  ]
})
</script>