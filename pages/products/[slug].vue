<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 获取后端 URL
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 纯净无参图片地址，剥离所有query
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  return rawUrl.split('?')[0]
}

const getOptimizedUrl = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=600&h=600&c_fill&q=75&f_auto`
  }
  return clean
}

const getThumb300 = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=300&h=300&c_fill&q=75&f_auto`
  }
  return clean
}

const { data: responseData } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  initialCache: false
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) {
    return res.data[0].attributes
  }
  return null
})

const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

// ========== 彻底修复Strapi图片提取逻辑（关键） ==========
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  const rawImages = []

  // 主图 single image
  if (data.image?.data) {
    rawImages.push(data.image.data.attributes.url)
  }
  // 多图图集 gallery
  if (data.images?.data && Array.isArray(data.images.data)) {
    data.images.data.forEach(item => {
      if (item?.attributes?.url) rawImages.push(item.attributes.url)
    })
  }

  // 过滤空url，返回完整有效图片地址数组
  return rawImages.filter(url => !!url)
})

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')
const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

// 列表主图切换
const nextImage = () => { 
  if (imagesList.value.length > 1) {
    activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length 
  }
}
const prevImage = () => { 
  if (imagesList.value.length > 1) {
    activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length 
  }
}

// 弹窗大图切换
const nextPreview = () => {
  if (imagesList.value.length <= 1) return
  previewIndex.value = (previewIndex.value + 1) % imagesList.value.length
  imgPreviewKey.value++
}
const prevPreview = () => {
  if (imagesList.value.length <= 1) return
  previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length
  imgPreviewKey.value++
}

// 打开弹窗同步索引
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

// 富文本图片解析
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  const result = []
  for (const node of nodes) {
    if (node.type === 'image') {
      const rawUrl = node.image?.url || ''
      const cleanUrl = getCleanImageUrl(rawUrl)
      result.push({
        type: 'image',
        url: cleanUrl,
        alt: node.image?.alternativeText || 'Product'
      })
    } else if (node.type === 'text') {
      result.push({
        type: 'text',
        content: node.text
      })
    } else {
      const childNodes = node.children ? renderStrapiRichTextNodes(node.children) : []
      result.push({
        type: 'block',
        tag: node.type,
        children: childNodes
      })
    }
  }
  return result
}

const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description))

const thumbScrollRef = ref(null)
const scrollThumbLeft = () => {}
const scrollThumbRight = () => {}

// 页面主图触摸滑动
let touchStartX = 0
let touchEndX = 0
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchEndX - touchStartX
  if (Math.abs(diff) > 50 && imagesList.value.length > 1) {
    diff < 0 ? nextImage() : prevImage()
  }
}

// 弹窗大图触摸滑动
let previewTouchStartX = 0
let previewTouchEndX = 0
const previewTouchStart = (e) => {
  previewTouchStartX = e.changedTouches[0].screenX
}
const previewTouchEnd = (e) => {
  previewTouchEndX = e.changedTouches[0].screenX
  const diff = previewTouchEndX - previewTouchStartX
  if (Math.abs(diff) > 50 && imagesList.value.length > 1) {
    diff < 0 ? nextPreview() : prevPreview()
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    
    <div v-if="!product || imagesList.value.length === 0" class="text-center py-20 text-red-500 bg-red-50 rounded-none">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        
        <div class="space-y-4">
          <div 
            class="rounded-none overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group cursor-zoom-in"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="openPreview"
          >
            <NuxtImg
              :src="getCleanImageUrl(currentMainImageUrl)"
              width="600"
              height="600"
              sizes="600px"
              class="w-full h-full object-cover transition-all duration-300"
              :alt="product.title || 'Product Image'"
              loading="lazy"
            />
            
            <button 
              v-if="imagesList.length > 1"
              @click.stop="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md hidden md:flex"
              aria-label="Previous Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button 
              v-if="imagesList.length > 1"
              @click.stop="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md hidden md:flex"
              aria-label="Next Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div v-if="imagesList.length > 1" class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-none text-xs font-medium tracking-wider z-10">
              {{ activeImageIndex + 1 }} / {{ imagesList.length }}
            </div>
          </div>
          
          <div v-if="imagesList.length > 1" class="w-full">
            <div 
              ref="thumbScrollRef"
              class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full"
            >
              <button
                v-for="(url, index) in imagesList"
                :key="index"
                @click="activeImageIndex = index"
                class="w-14 h-14 rounded-none overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
                :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
              >
                <NuxtImg 
                  :src="getCleanImageUrl(url)"
                  width="300"
                  height="300"
                  class="w-full h-full object-cover" 
                  :alt="'Thumbnail ' + (index + 1)"
                  loading="lazy"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-between">
          <div class="pl-[5px] pr-[5px]">
            <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-none text-xs font-semibold tracking-wide uppercase">
              Southeast Asia Wholesale
            </span>
            
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
              {{ product.title }}
            </h1>
            
            <div class="bg-gray-50 p-4 rounded-none space-y-3 my-6">
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-sm">Wholesale Price</span>
                <span class="text-2xl font-extrabold text-blue-600">
                  ${{ product.price }}
                </span>
              </div>
              <div class="flex justify-between items-center pt-1">
                <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
                <span class="text-gray-800 font-semibold">
                  {{ product.moq || 10 }} pcs
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 pl-[5px] pr-[5px]">
            <a 
              :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title}`"
              target="_blank"
              class="block w-full bg-green-600 text-white text-center py-4 rounded-none font-bold hover:bg-green-700 transition-colors shadow-sm text-base tracking-wide"
            >
              💬 Inquiry via WhatsApp (Fast Response)
            </a>
          </div>
        </div>

      </div>

      <div class="bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4 pl-[5px] pr-[5px]">
          Product Description
        </h3>
        <div class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-none min-h-[150px] markdown-body">
          <template v-for="(node, idx) in descriptionNodes" :key="idx">
            <div v-if="node.type === 'image'" class="my-6 flex justify-center">
              <NuxtImg
                :src="node.url"
                width="800"
                height="600"
                sizes="(max-width:768px) 100vw, 700px"
                class="rounded-none shadow-sm max-w-full"
                :alt="node.alt"
                loading="lazy"
              />
            </div>
            <span v-else-if="node.type === 'text'">{{ node.content }}</span>
            <component
              v-else
              :is="node.tag === 'paragraph' ? 'p' : node.tag"
              class="markdown-block"
            >
              <template v-for="(child, cIdx) in node.children" :key="cIdx">
                <div v-if="child.type === 'image'" class="my-6 flex justify-center">
                  <NuxtImg
                    :src="child.url"
                    width="800"
                    height="600"
                    sizes="(max-width:768px) 100vw, 700px"
                    class="rounded-none shadow-sm max-w-full"
                    :alt="child.alt"
                    loading="lazy"
                  />
                </div>
                <span v-else-if="child.type === 'text'">{{ child.content }}</span>
              </template>
            </component>
          </template>
        </div>
      </div>

    </div>

    <!-- 大图弹窗 -->
    <div 
      v-if="previewOpen"
      class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 w-full h-full"
      @click="closePreview"
      @touchstart="previewTouchStart"
      @touchend="previewTouchEnd"
    >
      <button
        v-if="imagesList.length > 1"
        @click.stop="prevPreview"
        class="absolute left-3 md:left-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div 
        :key="imgPreviewKey"
        class="w-full h-full flex items-center justify-center"
      >
        <NuxtImg
          :src="getCleanImageUrl(previewImageUrl)"
          sizes="100vw"
          class="max-w-[98vw] max-h-[90vh] w-auto h-auto object-contain block"
          :alt="product.title || 'Preview'"
          loading="eager"
        />
      </div>

      <button
        v-if="imagesList.length > 1"
        @click.stop="nextPreview"
        class="absolute right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <button
        @click.stop="closePreview"
        class="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full z-10"
      >
        ✕
      </button>

      <div v-if="imagesList.length > 1" class="absolute bottom-6 text-white text-sm bg-black/50 px-4 py-2 rounded z-10">
        {{ previewIndex + 1 }} / {{ imagesList.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  display: block;
}
.markdown-body :deep(h1):first-child,
.markdown-body :deep(h2):first-child,
.markdown-body :deep(h3):first-child {
  margin-top: 0;
}
.markdown-body :deep(ul) {
  list-style-type: disc !important;
  padding-left: 1.5rem !important;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
.markdown-body :deep(ol) {
  list-style-type: decimal !important;
  padding-left: 1.5rem !important;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
.markdown-body :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}
.markdown-body :deep(strong) {
  color: #0f172a;
  font-weight: 700;
}
.markdown-body :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
</style>