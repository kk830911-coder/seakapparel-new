<script setup>
import { computed, ref, watch } from 'vue'
import { useFetch, useHead } from '#imports'

const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 定义当前页码
const currentPage = ref(1)

// 使用 useFetch 替代 onMounted，利用 SSR 提升首屏加载速度
// 增加了 sort 排序、pagination 翻页控制，并且将 key 与页码绑定，支持无缝翻页
const { data: responseData, pending, error, refresh } = await useFetch(`${strapiUrl}/api/blogs`, {
  query: computed(() => ({
    populate: '*',
    sort: 'publishedAt:desc',
    'pagination[page]': currentPage.value,
    'pagination[pageSize]': 20
  })),
  key: computed(() => `blogs-list-page-${currentPage.value}`)
})

// 监听页码变化，当点击翻页时自动刷新请求数据并滚动到页面顶部
watch(currentPage, () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// 获取文章列表数组
const blogs = computed(() => responseData.value?.data || [])

// 获取翻页元数据（总页数、总条数等）
const pagination = computed(() => responseData.value?.meta?.pagination || { page: 1, pageCount: 1 })

// 【修改点 1】：日期格式化逻辑，将内置的 publishedAt 转换为具体的年-月-日
const formatDate = (item) => {
  if (!item) return ''
  const publishedAt = item.publishedAt || item.attributes?.publishedAt
  if (!publishedAt) return ''
  
  const date = new Date(publishedAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 纯净图片处理：交给 NuxtImage 全局配置处理 avif/画质
// 修改点：支持动态设定图片总数，以后加图只改一个数字即可
const getCleanImageUrl = (rawUrl, item) => {
  if (!rawUrl) {
    // 1. 📢 以后你增加了新图片，只需要把下面这个数字改成你 public/cover 下实际的图片总数即可！
    // 比如以后你加到了 10 张图，把 4 改成 10 就行，名字必须保持 1.jpg, 2.jpg... 这样的规律
    const totalCoversCount = 4 
    
    // 2. 自动动态生成图片数组，无需手动一行行写路径
    const defaultCovers = Array.from({ length: totalCoversCount }, (_, i) => `/cover/${i + 1}.jpg`)
    
    // 3. 基于文章的 id 或固定属性做取模运算，确保同一篇文章永远分配到同一张随机图
    const seed = item?.id || (item?.title?.length || 0)
    const randomIndex = Math.abs(seed) % defaultCovers.length
    
    return defaultCovers[randomIndex]
  }
  
  return rawUrl.startsWith('/') ? `${strapiUrl}${rawUrl}` : rawUrl.split('?')[0]
}

// 兼容 Strapi 的各种图片数据结构
const getImageUrl = (item) => {
  const coverData = item.cover || item.attributes?.cover
  if (!coverData) return null
  
  if (coverData.url) return coverData.url
  if (coverData.data?.attributes?.url) return coverData.data.attributes.url
  return null
}

useHead({ title: 'Latest Blogs & Fashion News | SeakApparel' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">Latest Blogs & Fashion News</h1>
    
    <div v-if="pending" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading blogs...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">
      Failed to connect backend server. Please refresh.
    </div>

    <div v-else-if="blogs.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      No blogs found.
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-8">
        <div 
          v-for="item in blogs" 
          :key="item.id" 
          class="bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row border border-gray-100"
        >
          <NuxtLink 
            :to="`/blog/${item.slug || item.attributes?.slug}`" 
            target="_blank"
            class="w-full md:w-64 lg:w-72 aspect-square overflow-hidden block bg-gray-50 relative flex-shrink-0"
          >
            <NuxtImg
              :src="getCleanImageUrl(getImageUrl(item), item)"
              sizes="(max-width: 768px) 100vw, 300px"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              alt="Blog Cover Image"
              loading="lazy"
            />
          </NuxtLink>

          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span 
                class="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-2 block"
              >
                {{ item.blog_category || item.attributes?.blog_category || 'New Products' }}
              </span>

              <h3 class="font-bold text-xl text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                <NuxtLink :to="`/blog/${item.slug || item.attributes?.slug}`" target="_blank">
                  {{ item.title || item.attributes?.title }}
                </NuxtLink>
              </h3>

              <p class="text-sm text-gray-500 line-clamp-3 mt-2 leading-relaxed">
                {{ item.description || item.attributes?.description || 'Click to read full story...' }}
              </p>
            </div>
            
            <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span class="text-xs text-gray-400">{{ formatDate(item) || 'Recent' }}</span>
              <NuxtLink 
                :to="`/blog/${item.slug || item.attributes?.slug}`" 
                target="_blank"
                class="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Read Full Article →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pagination.pageCount > 1" class="mt-14 flex justify-center items-center gap-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          ← Previous
        </button>

        <div class="flex items-center gap-1 mx-2">
          <button
            v-for="page in pagination.pageCount"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 text-sm font-medium rounded-lg border transition-colors duration-200',
              currentPage === page 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="currentPage++" 
          :disabled="currentPage === pagination.pageCount"
          class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>