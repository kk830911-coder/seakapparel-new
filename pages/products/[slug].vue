<script setup>
import { ref, computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 后端域名
const isLocal = process.dev 
const strapiBaseUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 判断图片是否为完整外网URL（Cloudinary完整地址直接用，不再拼接后端域名）
const isFullExternalUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://')
}

// 1、修复：智能拼接地址，完整外链不重复加域名；优先avif，失败降级jpg
const getOptimizedImageUrl = (rawUrl, width = 600, height = 600) => {
  if (!rawUrl) return ''
  // 去除原有所有查询参数
  const cleanSrc = rawUrl.split('?')[0]
  const params = `w=${width}&h=${height}&c_fill&q=75`

  let baseImgUrl
  // 关键修复：如果已经是完整http/https地址，直接使用，不再拼接strapi域名
  if (isFullExternalUrl(cleanSrc)) {
    baseImgUrl = cleanSrc
  } else {
    baseImgUrl = `${strapiBaseUrl}${cleanSrc}`
  }
  // 返回两套地址，NuxtImg自动降级avif→jpg
  return {
    avif: `${baseImgUrl}?${params}&format=avif`,
    fallback: `${baseImgUrl}?${params}`
  }
}

// 缩略图专用 300px
const getThumbUrl = (rawUrl) => {
  return getOptimizedImageUrl(rawUrl, 300, 300)
}

// 富文本内图专用 800px
const getRichImageUrl = (rawUrl) => {
  return getOptimizedImageUrl(rawUrl, 800, 800)
}

// ========== 接口请求产品数据 ==========
const { data: responseData } = await useFetch(() => `${strapiBaseUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  initialCache: false
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) {
    return res.data[0]
  }
  return null
})

const activeImageIndex = ref(0)

const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  let list = []
  if (data.image) Array.isArray(data.image) ? list.push(...data.image) : list.push(data.image)
  if (data.images && Array.isArray(data.images)) list.push(...data.images)
  return list.filter(img => img?.url)
})

// 当前预览图链接对象（avif + 降级jpg）
const currentMainImageSrc = computed(() => {
  const item = imagesList.value[activeImageIndex.value]
  return item ? getOptimizedImageUrl(item.url, 600, 600) : { avif: '', fallback: '' }
})

// 点击弹窗高清大图（1400尺寸）
const bigViewImageSrc = computed(() => {
  const item = imagesList.value[activeImageIndex.value]
  return item ? getOptimizedImageUrl(item.url, 1400, 1400) : { avif: '', fallback: '' }
})

// 切换图片共用函数
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

// 修复：富文本图片，不强制avif参数，直接原图，避免Cloudinary报错
const renderStrapiRichText = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return ''
  return nodes.map(node => {
    if (node.type === 'image') {
      const rawUrl = node.image?.url || ''
      // 富文本不再强制format=avif，防止后端图片转换失败空白
      let imgSrc
      if (isFullExternalUrl(rawUrl)) {
        imgSrc = rawUrl
      } else {
        imgSrc = `${strapiBaseUrl}${rawUrl}`
      }
      return rawUrl ? `<div class="my-6 flex justify-center"><img src="${imgSrc}" alt="${node.image.alternativeText || 'Product'}" class="rounded-none shadow-sm max-w-full max-h-[70vh] object-contain" /></div>` : ''
    }
    if (node.type === 'text') return node.text
    const childrenHtml = node.children ? renderStrapiRichText(node.children) : ''
    return `<p>${childrenHtml}</p>`
  }).join('')
}
const renderedDescriptionHtml = computed(() => renderStrapiRichText(product.value?.description || ''))

// 缩略图滚动
const thumbScrollRef = ref(null)
const scrollThumbLeft = () => {}
const scrollThumbRight = () => {}

// 移动端触摸滑动
let touchStartX = 0
let touchEndX = 0
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchEndX - touchStartX
  if (Math.abs(diff) > 50) {
    diff < 0 ? nextImage() : prevImage()
  }
}

// 点击打开大图弹窗标记
const showBigImage = ref(false)
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    
    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-none">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        
        <div class="space-y-4">
          <div 
            class="rounded-none overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group cursor-pointer"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="showBigImage = true"
          >
            <!-- NuxtImg 支持srcset多格式，avif优先，失败自动加载fallback jpg -->
            <NuxtImg
              :src="currentMainImageSrc.fallback"
              :srcset="`${currentMainImageSrc.avif} format('avif'), ${currentMainImageSrc.fallback}`"
              width="600"
              height="600"
              sizes="(max-width:768px) 90vw, 600px"
              class="w-full h-full object-cover"
              :alt="product.title || 'Product Image'"
              loading="lazy"
            />
            
            <!-- 电脑端箭头 hidden md:flex -->
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
          
          <!-- 缩略图 w-14 h-14 60px -->
          <div v-if="imagesList.length > 1" class="w-full">
            <div 
              ref="thumbScrollRef"
              class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full"
            >
              <button
                v-for="(imgItem, index) in imagesList"
                :key="index"
                @click="activeImageIndex = index"
                class="w-14 h-14 rounded-none overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
                :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
              >
                <NuxtImg 
                  :src="getThumbUrl(imgItem.url).fallback"
                  :srcset="`${getThumbUrl(imgItem.url).avif} format('avif'), ${getThumbUrl(imgItem.url).fallback}`"
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
              {{ product.title || product.attributes?.title }}
            </h1>
            
            <div class="bg-gray-50 p-4 rounded-none space-y-3 my-6">
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-sm">Wholesale Price</span>
                <span class="text-2xl font-extrabold text-blue-600">
                  ${{ product.price || product.attributes?.price }}
                </span>
              </div>
              <div class="flex justify-between items-center pt-1">
                <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
                <span class="text-gray-800 font-semibold">
                  {{ product.moq || product.attributes?.moq || 10 }} pcs
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 pl-[5px] pr-[5px]">
            <a 
              :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
              target="_blank"
              class="block w-full bg-green-600 text-white text-center py-4 rounded-none font-bold hover:bg-green-700 transition-colors shadow-sm text-base tracking-wide"
            >
              💬 Inquiry via WhatsApp (Fast Response)
            </a>
          </div>
        </div>

      </div>

      <!-- 详情描述卡片 -->
      <div class="bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4 pl-[5px] pr-[5px]">
          Product Description
        </h3>
        <div 
          class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-none min-h-[150px] markdown-body"
          v-html="renderedDescriptionHtml"
        />
      </div>
    </div>

    <!-- 点击大图弹窗 -->
    <div 
      v-if="showBigImage" 
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click="showBigImage = false"
    >
      <NuxtImg
        :src="bigViewImageSrc.fallback"
        :srcset="`${bigViewImageSrc.avif} format('avif'), ${bigViewImageSrc.fallback}`"
        width="1400"
        height="1400"
        class="max-w-full max-h-[90vh] object-contain"
        loading="eager"
      />
      <span class="absolute top-4 right-6 text-white text-3xl cursor-pointer" @click="showBigImage = false">×</span>
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