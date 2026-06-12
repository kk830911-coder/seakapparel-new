<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useHead, useFetch, useSchemaOrg, defineProduct } from '#imports'

const route = useRoute()

// 1. 获取后端 URL
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 2. 数据获取
const { data: responseData, pending } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: { populate: '*', 'filters[slug][$eq]': route.params.slug },
  initialCache: false
})

const product = computed(() => (responseData.value?.data?.[0] || null))

// SEO: 注入 Schema.org 数据
useSchemaOrg([
  defineProduct({
    name: computed(() => product.value?.title || 'Product'),
    image: computed(() => product.value?.image?.[0]?.url || ''),
    offers: {
      price: product.value?.price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    brand: { name: 'SeakApparel' }
  })
])

useHead({
  title: computed(() => product.value ? `${product.value.title} | SeakApparel Wholesale` : 'Loading...'),
  meta: [{ name: 'description', content: 'High-quality fashion wholesale from Southeast Asia.' }]
})

// 图片处理
const getCleanImageUrl = (rawUrl) => {
  if (!rawUrl) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
  return rawUrl.startsWith('/') ? `${strapiUrl}${rawUrl}` : rawUrl.split('?')[0]
}

const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  const list = [...(Array.isArray(data.image) ? data.image : [data.image]), ...(Array.isArray(data.images) ? data.images : [])]
  return list.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
})

// 弹窗逻辑优化：锁定 Body 滚动
const openPreview = () => {
  document.body.style.overflow = 'hidden'
  previewIndex.value = activeImageIndex.value
  imgPreviewKey.value++
  previewOpen.value = true
}

const closePreview = () => {
  document.body.style.overflow = ''
  previewOpen.value = false
}

// 富文本渲染
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => ({
    ...node,
    url: node.image?.url ? getCleanImageUrl(node.image.url) : null,
    children: node.children ? renderStrapiRichTextNodes(node.children) : []
  }))
}

const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))

// 滑动逻辑
const handleTouch = (start, end, next, prev) => {
  const diff = end - start
  if (Math.abs(diff) > 50) diff < 0 ? next() : prev()
}
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="pending" class="text-center py-20">Loading product details...</div>
    <div v-else-if="!product" class="text-center py-20 text-red-500">Product not found.</div>

    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 shadow-sm border border-gray-100">
        <div class="space-y-4">
          <div 
            class="aspect-square bg-gray-50 relative group cursor-zoom-in"
            @click="openPreview"
            @touchstart="s => touchStartX = s.changedTouches[0].screenX"
            @touchend="e => handleTouch(touchStartX, e.changedTouches[0].screenX, () => activeImageIndex = (activeImageIndex + 1) % imagesList.length, () => activeImageIndex = (activeImageIndex - 1 + imagesList.length) % imagesList.length)"
          >
            <NuxtImg :src="getCleanImageUrl(imagesList[activeImageIndex])" width="600" height="600" class="w-full h-full object-cover" />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button v-for="(url, idx) in imagesList" :key="idx" @click="activeImageIndex = idx" class="w-14 h-14 border-2 flex-shrink-0" :class="activeImageIndex === idx ? 'border-blue-600' : 'border-gray-200'">
              <NuxtImg :src="getCleanImageUrl(url)" width="100" height="100" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="flex flex-col justify-between">
          <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>
          <div class="bg-gray-50 p-4 space-y-3 my-6">
            <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Price</span> <span class="text-2xl font-extrabold text-blue-600">${{ product.price }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">MOQ</span> <span>{{ product.moq || 10 }} pcs</span></div>
          </div>
          <a :href="`https://wa.me/8613800000000?text=Interested in: ${product.title}`" target="_blank" class="block w-full bg-green-600 text-white text-center py-4 font-bold hover:bg-green-700">
            💬 Inquiry via WhatsApp
          </a>
        </div>
      </div>
    </div>

    <div v-if="previewOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4" @click="closePreview">
      <NuxtImg :key="imgPreviewKey" :src="getCleanImageUrl(imagesList[previewIndex])" class="max-w-[98vw] max-h-[90vh] object-contain" />
      <button @click.stop="closePreview" class="absolute top-4 right-4 text-white text-3xl">✕</button>
    </div>
  </div>
</template>