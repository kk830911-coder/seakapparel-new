<script setup>
import { ref, computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 后端基础域名
const isLocal = process.dev 
const strapiBaseUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 判断是否为完整外网云存储URL（Cloudinary）
const isFullCloudUrl = (url) => /^https?:\/\//.test(url)

/**
 * 统一生成压缩裁切AVIF图片地址
 * @param rawUrl 原始图片路径
 * @param targetW 目标宽度
 * @param targetH 目标高度
 * @returns { avif: string, jpg: string } avif优先，jpg兜底
 */
const buildCompressedImage = (rawUrl, targetW = 600, targetH = 600) => {
  if (!rawUrl) return { avif: '', jpg: '' }
  // 剥离原有所有查询参数
  const cleanPath = rawUrl.split('?')[0]
  const transParams = `w=${targetW}&h=${targetH}&c_fill&q=70`
  let baseUrl = ''
  // 关键：完整外网链接不拼接后端域名
  if (isFullCloudUrl(cleanPath)) {
    baseUrl = cleanPath
  } else {
    baseUrl = `${strapiBaseUrl}${cleanPath}`
  }
  // 两套格式：avif压缩图 / jpg压缩图（兜底）
  return {
    avif: `${baseUrl}?${transParams}&format=avif`,
    jpg: `${baseUrl}?${transParams}`
  }
}

// 缩略图专用 300px 压缩AVIF
const getThumbImage = (rawUrl) => buildCompressedImage(rawUrl, 300, 300)
// 商品主预览图 600px 压缩AVIF
const getMainPreviewImage = (rawUrl) => buildCompressedImage(rawUrl, 600, 600)
// 富文本详情图 800px 压缩AVIF
const getDescImage = (rawUrl) => buildCompressedImage(rawUrl, 800, 800)
// 点击弹窗高清大图 1400px 压缩AVIF
const getFullSizeImage = (rawUrl) => buildCompressedImage(rawUrl, 1400, 1400)

// ========== 请求产品数据 ==========
const { data: responseData } = await useFetch(() => `${strapiBaseUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  initialCache: false
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) return res.data[0]
  return null
})

const activeImageIndex = ref(0)

// 过滤有效图片列表
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  let imgArr = []
  if (data.image) imgArr = Array.isArray(data.image) ? [...data.image] : [data.image]
  if (data.images) imgArr = [...imgArr, ...data.images]
  return imgArr.filter(item => item?.url)
})

// 当前展示主图双格式地址
const currentMainSrc = computed(() => {
  const item = imagesList.value[activeImageIndex.value]
  return item ? getMainPreviewImage(item.url) : { avif: '', jpg: '' }
})
// 弹窗高清大图地址
const bigPopupSrc = computed(() => {
  const item = imagesList.value[activeImageIndex.value]
  return item ? getFullSizeImage(item.url) : { avif: '', jpg: '' }
})

// 切换图片方法
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

// 富文本渲染：所有图片统一生成压缩AVIF，不再加载原图
const renderProductDescription = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return ''
  return nodes.map(node => {
    if (node.type === 'image') {
      const rawImgUrl = node.image?.url || ''
      const imgSource = getDescImage(rawImgUrl)
      return rawImgUrl
        ? `<div class="my-6 flex justify-center"><img src="${imgSource.avif}" alt="${node.image.alternativeText || 'Product'}" onerror="this.src='${imgSource.jpg}'" class="rounded-none shadow-sm max-w-full max-h-[70vh] object-contain" /></div>`
        : ''
    }
    if (node.type === 'text') return node.text
    const childHtml = node.children ? renderProductDescription(node.children) : ''
    return `<p>${childHtml}</p>`
  }).join('')
}
const renderedDescriptionHtml = computed(() => renderProductDescription(product.value?.description || ''))

// 缩略图滚动容器ref
const thumbScrollRef = ref(null)
const scrollThumbLeft = () => {}
const scrollThumbRight = () => {}

// 移动端左右滑动切换逻辑
let touchStartX = 0
let touchEndX = 0
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  const offset = touchEndX - touchStartX
  // 滑动阈值50px，防止误触
  if (Math.abs(offset) > 50) offset < 0 ? nextImage() : prevImage()
}

// 控制大图弹窗显示
const showBigImagePopup = ref(false)
</script>

<template>
  <div class="max-w-7xl mx-auto py-12">
    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-none">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="space-y-12">
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 rounded-none shadow-sm border border-gray-100">
        <!-- 左侧图片区域 -->
        <div class="space-y-4">
          <!-- 主图容器 正方形裁切 + 触摸滑动事件 + 点击弹窗 -->
          <div
            class="rounded-none overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group cursor-pointer"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="showBigImagePopup = true"
          >
            <!-- NuxtImg 多格式优先级：avif > jpg，响应式尺寸压缩 -->
            <NuxtImg
              :src="currentMainSrc.jpg"
              :srcset="`${currentMainSrc.avif} format('avif'), ${currentMainSrc.jpg}`"
              width="600"
              height="600"
              sizes="(max-width: 768px) 92vw, 600px"
              class="w-full h-full object-cover"
              :alt="product.title || 'Product Image'"
              loading="lazy"
            />

            <!-- 电脑端才显示左右切换箭头 hidden md:flex -->
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

            <!-- 图片页码指示器 -->
            <div v-if="imagesList.length > 1" class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-none text-xs font-medium tracking-wider z-10">
              {{ activeImageIndex + 1 }} / {{ imagesList.length }}
            </div>
          </div>

          <!-- 底部缩略图列表 60px w-14 h-14 -->
          <div v-if="imagesList.length > 1" class="w-full">
            <div ref="thumbScrollRef" class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full">
              <button
                v-for="(imgItem, index) in imagesList"
                :key="index"
                @click="activeImageIndex = index"
                class="w-14 h-14 rounded-none overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
                :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
              >
                <NuxtImg
                  :src="getThumbImage(imgItem.url).jpg"
                  :srcset="`${getThumbImage(imgItem.url).avif} format('avif'), ${getThumbImage(imgItem.url).jpg}`"
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

        <!-- 右侧商品信息区域 -->
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
                <span class="text-2xl font-extrabold text-blue-600">${{ product.price || product.attributes?.price }}</span>
              </div>
              <div class="flex justify-between items-center pt-1">
                <span class="text-gray-500 text-sm">Minimum Order Quantity</span>
                <span class="text-gray-800 font-semibold">{{ product.moq || product.attributes?.moq || 10 }} pcs</span>
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

      <!-- 商品详情描述卡片 -->
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
      v-if="showBigImagePopup"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click="showBigImagePopup = false"
    >
      <NuxtImg
        :src="bigPopupSrc.jpg"
        :srcset="`${bigPopupSrc.avif} format('avif'), ${bigPopupSrc.jpg}`"
        width="1400"
        height="1400"
        class="max-w-full max-h-[90vh] object-contain"
        loading="eager"
      />
      <span class="absolute top-4 right-6 text-white text-3xl cursor-pointer" @click="showBigImagePopup = false">×</span>
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