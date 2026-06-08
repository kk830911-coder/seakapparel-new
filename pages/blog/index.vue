<script setup>
import { ref, onMounted, computed } from 'vue'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// 拿到博客数组数据
const blogs = computed(() => responseData.value?.data || [])

// 适配 Strapi 的封面图片 cover 获取逻辑
const getImageUrl = (item) => {
  const defaultImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop'
  if (!item) return defaultImg
  
  // 兼容 Strapi v4 (普通格式或带 attributes 格式) 
  const coverData = item.cover || item.attributes?.cover
  if (!coverData) return defaultImg

  // 如果 cover 直接带 url (REST API 展开后)
  if (coverData.url) return coverData.url
  // 如果是标准的 Strapi 媒体嵌套格式 data.attributes.url
  if (coverData.data?.attributes?.url) return coverData.data.attributes.url
  
  return defaultImg
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
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
        <NuxtLink 
          :to="`/blog/${item.documentId || item.attributes?.documentId || item.id}`" 
          class="aspect-[16/10] overflow-hidden block bg-gray-50 relative"
        >
          <NuxtImg
            :src="getImageUrl(item)"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            alt="Blog Cover Image"
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
              <NuxtLink :to="`/blog/${item.documentId || item.attributes?.documentId || item.id}`">
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
              :to="`/blog/${item.documentId || item.attributes?.documentId || item.id}`" 
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