<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 1. 获取商品数据
const { data: responseData } = await useFetch(`${strapiUrl}/api/products`, {
  query: { populate: '*', 'filters[slug][$eq]': route.params.slug },
  key: `product-${route.params.slug}`
})

const product = computed(() => responseData.value?.data?.[0] || null)

// SEO 动态设置
useHead({
  title: computed(() => (product.value ? `${product.value.title || product.value.attributes?.title} | SeakApparel` : 'Loading...'))
})

// 图片处理
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=75&f_auto'
  if (!rawUrl) return fallback
  return rawUrl.startsWith('/') ? `${strapiUrl}${rawUrl}` : rawUrl.split('?')[0]
}

const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

const imagesList = computed(() => {
  const p = product.value
  if (!p) return []
  const raw = p.image || p.attributes?.image || []
  const list = Array.isArray(raw) ? raw : [raw]
  return list.map(img => (typeof img === 'string' ? img : (img.url || img.attributes?.url))).filter(Boolean)
})

// 切换逻辑
const nextImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length }
const prevImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length }

const nextPreview = () => { previewIndex.value = (previewIndex.value + 1) % imagesList.value.length; imgPreviewKey.value++ }
const prevPreview = () => { previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length; imgPreviewKey.value++ }

const openPreview = async () => {
  previewIndex.value = activeImageIndex.value
  previewOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closePreview = () => { previewOpen.value = false; document.body.style.overflow = '' }

// 触摸滑动
let touchStartX = 0
const handleTouchEnd = (e, callbackNext, callbackPrev) => {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 50) diff < 0 ? callbackNext() : callbackPrev()
}

// 富文本渲染
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(n => ({
    type: n.type === 'image' ? 'image' : (n.type === 'text' ? 'text' : 'block'),
    url: n.image?.url ? getCleanImageUrl(n.image.url) : null,
    content: n.text,
    tag: n.type,
    children: renderStrapiRichTextNodes(n.children || [])
  }))
}
const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="!product" class="text-center py-20 text-red-500">Product not found.</div>
    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 p-2 rounded-none border">
        <div class="space-y-4">
          <div class="aspect-square bg-gray-50 relative group cursor-zoom-in" 
               @touchstart="e => touchStartX = e.changedTouches[0].screenX" 
               @touchend="e => handleTouchEnd(e, nextImage, prevImage)" 
               @click="openPreview">
            <NuxtImg :src="getCleanImageUrl(imagesList[activeImageIndex])" class="w-full h-full object-cover" />
            <button v-if="imagesList.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">❮</button>
            <button v-if="imagesList.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">❯</button>
          </div>
          <div class="flex gap-2 overflow-x-auto">
            <button v-for="(url, i) in imagesList" :key="i" @click="activeImageIndex = i" class="w-14 h-14 border-2" :class="activeImageIndex === i ? 'border-blue-600' : 'border-gray-200'">
              <NuxtImg :src="getCleanImageUrl(url)" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold mb-4">{{ product.title || product.attributes?.title }}</h1>
          <div class="bg-gray-50 p-4 mb-6 text-xl font-bold text-blue-600">${{ product.price || product.attributes?.price }}</div>
          <a :href="`https://wa.me/+8613800000000?text=Interested in: ${product.title}`" target="_blank" class="w-full bg-green-600 text-white text-center py-4 font-bold">💬 Inquiry via WhatsApp</a>
        </div>
      </div>
    </div>

    <div v-if="previewOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" @click="closePreview" @touchstart="e => touchStartX = e.changedTouches[0].screenX" @touchend="e => handleTouchEnd(e, nextPreview, prevPreview)">
      <button @click.stop="prevPreview" class="absolute left-4 text-white text-4xl z-10">❮</button>
      <NuxtImg :key="imgPreviewKey" :src="getCleanImageUrl(imagesList[previewIndex])" class="max-w-[95vw] max-h-[90vh] object-contain" />
      <button @click.stop="nextPreview" class="absolute right-4 text-white text-4xl z-10">❯</button>
      <button @click.stop="closePreview" class="absolute top-4 right-4 text-white text-3xl">✕</button>
    </div>
  </div>
</template>