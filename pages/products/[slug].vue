<script setup>
import { ref, computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 获取后端 URL
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 新增：纯净无参图片地址，剥离所有query，交给NuxtImage全局配置自动处理avif/尺寸/画质
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  // 本地Strapi路径补全域名
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  // Cloudinary剥离全部查询参数
  return rawUrl.split('?')[0]
}

// 生成主图600尺寸参数（仅裁切画质，格式由全局nuxt.config控制avif）
const getOptimizedUrl = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=600&h=600&c_fill&q=75&f_auto`
  }
  return clean
}

// 缩略图300尺寸
const getThumb300 = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=300&h=300&c_fill&q=75&f_auto`
  }
  return clean
}

// ========== 仅此处修改：由ID单条查询改为slug筛选查询 ==========
const { data: responseData } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: { 
    populate: '*',
    'filters[slug][$eq]': route.params.slug
  },
  initialCache: false
})

const product = computed(() => {
  const res = responseData.value
  // 筛选接口返回 { data: [商品数组] }，取第一条匹配slug的商品
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
  
  return list.map(img => {
    const url = typeof img === 'string' ? img : (img.url || img.attributes?.url)
    return url || null
  }).filter(Boolean)
})

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')

const nextImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length }
const prevImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length }

// ✅ 渲染函数优化：富文本图片改用NuxtImg逻辑，统一avif转换
const renderStrapiRichText = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return ''
  return nodes.map(node => {
    if (node.type === 'image') {
      const rawUrl = node.image?.url || ''
      const imgUrl = getOptimizedUrl(rawUrl)
      return rawUrl ? `<div class="my-6 flex justify-center"><img src="${imgUrl}" alt="${node.image.alternativeText || 'Product'}" class="rounded-xl shadow-sm" /></div>` : ''
    }
    // ... 其他逻辑保持不变
    if (node.type === 'text') return node.text
    const childrenHtml = node.children ? renderStrapiRichText(node.children) : ''
    return `<p>${childrenHtml}</p>`
  }).join('')
}

const renderedDescriptionHtml = computed(() => renderStrapiRichText(product.value?.description || product.value?.attributes?.description))

// 移除滚动箭头对应函数，保留变量不报错
const thumbScrollRef = ref(null)
const scrollThumbLeft = () => {}
const scrollThumbRight = () => {}
</script>

<template>
  <!-- 核心修改：移除 px-4 页面左右内边距，手机端贴左右屏幕边缘 -->
  <div class="max-w-7xl mx-auto py-12">
    
    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      Product detail not found. Please refresh the page or back to list.
    </div>

    <div v-else class="space-y-12">
      <!-- md: 桌面端保留左右内边距，移动端无左右间隙，卡片贴边 -->
      <div class="grid md:grid-cols-2 gap-12 bg-white md:p-6 md:px-10 rounded-2xl shadow-sm border border-gray-100">
        
        <div class="space-y-4">
          <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group">
            <!-- 替换原生img为NuxtImg，自动走图片代理输出avif -->
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
              @click="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md"
              aria-label="Previous Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button 
              v-if="imagesList.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10 shadow-md"
              aria-label="Next Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div v-if="imagesList.length > 1" class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wider z-10">
              {{ activeImageIndex + 1 }} / {{ imagesList.length }}
            </div>
          </div>
          
          <!-- 缩略图区域：删除左右箭头按钮，取消左右padding，其余全部样式不变 -->
          <div v-if="imagesList.length > 1" class="w-full">
            <!-- 滚动容器，移除pl-10 pr-10，删除左右悬浮箭头 -->
            <div 
              ref="thumbScrollRef"
              class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full"
            >
              <!-- 缩略图 w-10 h-10 尺寸保持不变 -->
              <button
                v-for="(url, index) in imagesList"
                :key="index"
                @click="activeImageIndex = index"
                class="w-10 h-10 rounded-lg overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all"
                :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100 scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'"
              >
                <!-- 缩略图替换为NuxtImg -->
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
          <div>
            <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              Southeast Asia Wholesale
            </span>
            
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
              {{ product.title || product.attributes?.title }}
            </h1>
            
            <div class="bg-gray-50 p-4 rounded-xl space-y-3 my-6">
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

          <div class="mt-4 pt-4 border-t border-gray-100">
            <a 
              :href="`https://wa.me/+8613800000000?text=Hi, I am interested in your product: ${product.title || product.attributes?.title}`"
              target="_blank"
              class="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-base tracking-wide"
            >
              💬 Inquiry via WhatsApp (Fast Response)
            </a>
          </div>
        </div>

      </div>

      <!-- 描述卡片：移动端无左右内边距，贴屏幕边缘 -->
      <div class="bg-white md:p-6 md:px-10 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4">
          Product Description
        </h3>
        <div 
          class="text-gray-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-xl min-h-[150px] markdown-body"
          v-html="renderedDescriptionHtml"
        />
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

/* ==========================================================================
   🎨 针对富文本输出的 HTML 样式层级微调
   ========================================================================== */
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