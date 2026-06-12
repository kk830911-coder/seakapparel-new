<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 获取后端 URL
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 2. 数据获取：添加 key 缓存，确保路由跳转时能正确重新渲染
const { data: responseData } = await useFetch(`${strapiUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  key: `product-${route.params.slug}`
})

const product = computed(() => responseData.value?.data?.[0] || null)

// 动态设置页面 SEO
useHead({
  title: computed(() => (product.value ? `${product.value.title || product.value.attributes?.title} | SeakApparel` : 'Loading...')),
  meta: [
    { name: 'description', content: computed(() => product.value?.description || 'View our wholesale product details.') }
  ]
})

// 图片处理：统一剥离查询参数
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  return rawUrl.startsWith('/') ? `${strapiUrl}${rawUrl}` : rawUrl.split('?')[0]
}

// 轮播与弹窗状态
const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

const imagesList = computed(() => {
  const p = product.value
  if (!p) return []
  const rawImages = p.image || p.attributes?.image || []
  const list = Array.isArray(rawImages) ? rawImages : [rawImages]
  return list.map(img => (typeof img === 'string' ? img : (img.url || img.attributes?.url))).filter(Boolean)
})

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')
const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

// 交互逻辑
const nextImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length }
const prevImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length }

const openPreview = async () => {
  previewIndex.value = activeImageIndex.value
  imgPreviewKey.value++
  await nextTick()
  previewOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closePreview = () => {
  previewOpen.value = false
  document.body.style.overflow = ''
}

// 富文本渲染
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => {
    if (node.type === 'image') return { type: 'image', url: getCleanImageUrl(node.image?.url), alt: node.image?.alternativeText || 'Product' }
    if (node.type === 'text') return { type: 'text', content: node.text }
    return { type: 'block', tag: node.type, children: renderStrapiRichTextNodes(node.children || []) }
  })
}
const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))

// 触摸滑动逻辑
let touchStartX = 0
const handleTouchEnd = (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 50) diff < 0 ? nextImage() : prevImage()
}
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-none">
      Product detail not found.
    </div>

    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        <div class="space-y-4">
          <div class="rounded-none overflow-hidden shadow-sm bg-gray-50 aspect-square border relative group cursor-zoom-in" 
               @touchstart="e => touchStartX = e.changedTouches[0].screenX" 
               @touchend="handleTouchEnd" 
               @click="openPreview">
            <NuxtImg
              provider="cloudinary"
              :src="getCleanImageUrl(currentMainImageUrl)"
              sizes="600px"
              fetchpriority="high"
              class="w-full h-full object-cover"
              :alt="product.title || 'Product Image'"
            />
          </div>
          <div v-if="imagesList.length > 1" class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full">
            <button v-for="(url, index) in imagesList" :key="index" @click="activeImageIndex = index" class="w-14 h-14 border-2 flex-shrink-0" :class="activeImageIndex === index ? 'border-blue-600' : 'border-gray-200'">
              <NuxtImg :src="getCleanImageUrl(url)" width="300" height="300" class="w-full h-full object-cover" loading="lazy" />
            </button>
          </div>
        </div>

        <div class="flex flex-col justify-between">
          <div class="pl-[5px] pr-[5px]">
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">{{ product.title || product.attributes?.title }}</h1>
            <div class="bg-gray-50 p-4 space-y-3 my-6">
              <div class="flex justify-between border-b pb-2"><span class="text-gray-500 text-sm">Price</span><span class="text-2xl font-extrabold text-blue-600">${{ product.price || product.attributes?.price }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500 text-sm">MOQ</span><span class="font-semibold">{{ product.moq || product.attributes?.moq || 10 }} pcs</span></div>
            </div>
          </div>
          <a :href="`https://wa.me/+8613800000000?text=Hi, I am interested in: ${product.title}`" target="_blank" class="block w-full bg-green-600 text-white text-center py-4 font-bold hover:bg-green-700 transition-colors">💬 Inquiry via WhatsApp</a>
        </div>
      </div>

      <div class="bg-white p-6 rounded-none shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-4">Product Description</h3>
        <div class="markdown-body text-gray-600 text-sm bg-slate-50 p-6">
          <template v-for="(node, idx) in descriptionNodes" :key="idx">
            <div v-if="node.type === 'image'" class="my-6"><NuxtImg :src="node.url" sizes="800px" class="max-w-full" /></div>
            <component v-else-if="node.type === 'block'" :is="node.tag === 'paragraph' ? 'p' : node.tag" class="markdown-block">
              <template v-for="(child, cIdx) in node.children" :key="cIdx">
                <NuxtImg v-if="child.type === 'image'" :src="child.url" class="my-6 max-w-full" />
                <span v-else>{{ child.content }}</span>
              </template>
            </component>
          </template>
        </div>
      </div>
    </div>

    <div v-if="previewOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4" @click="closePreview">
      <NuxtImg :src="getCleanImageUrl(previewImageUrl)" class="max-w-[98vw] max-h-[90vh] object-contain" />
      <button @click.stop="closePreview" class="absolute top-4 right-4 text-white text-3xl">✕</button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar { height: 5px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) { font-weight: 700; margin: 1.5rem 0 0.75rem; }
.markdown-body :deep(p) { margin-bottom: 0.75rem; }
</style>