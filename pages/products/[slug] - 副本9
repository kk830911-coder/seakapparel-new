<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 获取后端 URL
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  return rawUrl.split('?')[0]
}

const { data: responseData } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  key: `product-${route.params.slug}`
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) return res.data[0]
  return null
})

// 状态管理
const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  let list = []
  const images = data.image || data.attributes?.image
  const extraImages = data.images || data.attributes?.images
  if (images) Array.isArray(images) ? list.push(...images) : list.push(images)
  if (extraImages && Array.isArray(extraImages)) list.push(...extraImages)
  
  return list.map(img => (typeof img === 'string' ? img : (img.url || img.attributes?.url))).filter(Boolean)
})

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')
const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

// 切换逻辑
const nextImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length }
const prevImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length }

const nextPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value + 1) % imagesList.value.length; imgPreviewKey.value++ } }
const prevPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length; imgPreviewKey.value++ } }

const openPreview = async () => {
  previewIndex.value = activeImageIndex.value
  imgPreviewKey.value++
  await nextTick()
  previewOpen.value = true
}
const closePreview = async () => {
  previewOpen.value = false
  await nextTick()
  imgPreviewKey.value++
}

// 富文本渲染
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => ({
    type: node.type === 'image' ? 'image' : (node.type === 'text' ? 'text' : 'block'),
    url: node.image?.url ? getCleanImageUrl(node.image.url) : null,
    alt: node.image?.alternativeText || 'Product',
    content: node.text,
    tag: node.type,
    children: renderStrapiRichTextNodes(node.children || [])
  }))
}
const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))

// 手势逻辑
let touchStartX = 0
const handleTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX }
const handleTouchEnd = (e, next, prev) => {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 50) diff < 0 ? next() : prev()
}
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50">Product not found.</div>
    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 shadow-sm border border-gray-100">
        <div class="space-y-4">
          <div class="rounded-none overflow-hidden shadow-sm bg-gray-50 aspect-square border relative group cursor-zoom-in"
               @touchstart="handleTouchStart" @touchend="e => handleTouchEnd(e, nextImage, prevImage)" @click="openPreview">
            <NuxtImg :src="getCleanImageUrl(currentMainImageUrl)" class="w-full h-full object-cover" loading="eager" />
            <button v-if="imagesList.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">❮</button>
            <button v-if="imagesList.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">❯</button>
            <div class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 text-xs">{{ activeImageIndex + 1 }} / {{ imagesList.length }}</div>
          </div>
          <div class="flex gap-2 overflow-x-auto scrollbar-thin">
            <button v-for="(url, i) in imagesList" :key="i" @click="activeImageIndex = i" class="w-14 h-14 border-2 flex-shrink-0" :class="activeImageIndex === i ? 'border-blue-600' : 'border-gray-200'">
              <NuxtImg :src="getCleanImageUrl(url)" width="100" height="100" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="flex flex-col justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mt-3">{{ product.title || product.attributes?.title }}</h1>
            <div class="bg-gray-50 p-4 space-y-3 my-6">
              <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Price</span><span class="text-2xl font-extrabold text-blue-600">${{ product.price || product.attributes?.price }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">MOQ</span><span class="font-semibold">{{ product.moq || product.attributes?.moq || 10 }} pcs</span></div>
            </div>
          </div>
          <a :href="`https://wa.me/+8613800000000?text=Interested: ${product.title}`" target="_blank" class="block w-full bg-green-600 text-white text-center py-4 font-bold">💬 Inquiry via WhatsApp</a>
        </div>
      </div>

      <div class="bg-white p-6 shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-4">Product Description</h3>
        <div class="markdown-body text-gray-600 bg-slate-50 p-6">
          <template v-for="(node, idx) in descriptionNodes" :key="idx">
            <div v-if="node.type === 'image'" class="my-6"><NuxtImg :src="node.url" class="max-w-full" /></div>
            <component v-else-if="node.type === 'block'" :is="node.tag === 'paragraph' ? 'p' : node.tag">
              <template v-for="(child, cIdx) in node.children" :key="cIdx">
                <NuxtImg v-if="child.type === 'image'" :src="child.url" class="my-6" />
                <span v-else>{{ child.content }}</span>
              </template>
            </component>
          </template>
        </div>
      </div>
    </div>

    <div v-if="previewOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" @click="closePreview" @touchstart="handleTouchStart" @touchend="e => handleTouchEnd(e, nextPreview, prevPreview)">
      <button @click.stop="prevPreview" class="absolute left-4 text-white text-4xl">❮</button>
      <NuxtImg :key="imgPreviewKey" :src="getCleanImageUrl(previewImageUrl)" class="max-w-[95vw] max-h-[90vh] object-contain" />
      <button @click.stop="nextPreview" class="absolute right-4 text-white text-4xl">❯</button>
      <button @click.stop="closePreview" class="absolute top-4 right-4 text-white text-3xl">✕</button>
    </div>
  </div>
</template>