<script setup>
import { ref, onMounted, computed } from 'vue'

// 后端域名置顶统一声明，和产品页逻辑完全一致
const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// 拿到博客数组数据
const blogs = computed(() => responseData.value?.data || [])

// 新增：获取纯净无参数图片地址，剥离全部query，交给NuxtImage全局配置处理avif
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=375&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  // 本地Strapi路径补全域名
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  // Cloudinary剥离全部查询参数
  return rawUrl.split('?')[0]
}

// 统一图片裁切压缩，格式由nuxt.config全局avif配置控制
const getOptimizedUrl = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=600&h=375&c_fill&q=75&f_auto`
  }
  return clean
}

// 适配 Strapi 的封面图片 cover 获取逻辑 + 补全后端域名修复404
const getImageUrl = (item) => {
  const defaultImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'
  if (!item) return defaultImg
  
  // 兼容 Strapi v4 (普通格式或带 attributes 格式) 
  const coverData = item.cover || item.attributes?.cover
  if (!coverData) return defaultImg

  // 如果 cover 直接带 url (REST API 展开后)
  if (coverData.url) {
    return coverData.url.startsWith('/') ? `${strapiUrl}${coverData.url}` : coverData.url
  }
  // 如果是标准的 Strapi 媒体嵌套格式 data.attributes.url
  if (coverData.data?.attributes?.url) {
    const raw = coverData.data.attributes.url
    return raw.startsWith('/') ? `${strapiUrl}${raw}` : raw
  }
  
  return defaultImg
}

onMounted(async () => {
  try {
    // 请求 blogs 接口，并使用 populate=* 展开 cover 图片和分类数据
    const res = await $fetch(`${strapiUrl}/api/blogs?populate=*`)
    console.log('博客列表页收到的原始数据:', res)
    responseData.value = res
  } catch (err) {
    console.error('Client fetch blogs failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

useHead({ title: 'Latest Blogs & Fashion News | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">Latest Blogs & Fashion News</h1>
    
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading blogs...</p>
    </div>

    <div v-else-if="fetchError" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <div v-else-if="blogs.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No blogs found.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="item in blogs" 
        :key="item.id" 
        class="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between border border-gray-100"
      >
        <!-- 跳转改用slug链接 -->
        <NuxtLink 
          :to="`/blog/${item.slug || item.attributes?.slug}`" 
          class="aspect-[16/10] overflow-hidden block bg-gray-50 relative"
        >
          <NuxtImg
            :src="getCleanImageUrl(getImageUrl(item))"
            width="600"
            height="375"
            sizes="600px"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            alt="Blog Cover Image"
            loading="lazy"
          />
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span 
              v-if="item.blog_category || item.attributes?.blog_category?.data" 
              class="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-2 block"
            >
              {{ item.blog_category?.name || item.attributes?.blog_category?.data?.attributes?.name || 'Trends' }}
            </span>

            <h3 class="font-bold text-xl text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
              <NuxtLink :to="`/blog/${item.slug || item.attributes?.slug}`">
                {{ item.title || item.attributes?.title }}
              </NuxtLink>
            </h3>

            <p class="text-sm text-gray-500 line-clamp-3 mt-2 leading-relaxed">
              {{ item.description || item.attributes?.description || 'Click to read full story...' }}
            </p>
          </div>
          
          <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span class="text-xs text-gray-400">June 2026</span>
            <NuxtLink 
              :to="`/blog/${item.slug || item.attributes?.slug}`" 
              class="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Read Full Article →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>