<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// 获取路由中的动态参数 ID (可能是 id 或 documentId)
const postId = route.params.id

// 拿到单篇博客的完整数据对象
const post = computed(() => responseData.value?.data || null)

// 适配 Strapi 的主封面图获取逻辑
const getImageUrl = (postItem) => {
  if (!postItem) return ''
  const coverData = postItem.cover || postItem.attributes?.cover
  if (!coverData) return ''
  if (coverData.url) return coverData.url
  if (coverData.data?.attributes?.url) return coverData.data.attributes.url
  return ''
}

// 针对 Strapi Rich Text (Blocks) 富文本的处理函数
// 如果你后续安装了 @strapi/blocks-react-renderer 的 vue 版本可以替换，这里用原生方法安全解析
const renderBlocks = (content) => {
  if (!content) return ''
  if (typeof content === 'string') return content // 如果是普通字符串直接返回
  
  // 如果是 Strapi 的 Blocks 数组结构，将其安全组合为文本
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph') {
        return block.children?.map(child => child.text).join('') || ''
      }
      if (block.type === 'heading') {
        return block.children?.map(child => child.text).join('') || ''
      }
      return ''
    }).filter(Boolean)
  }
  return ''
}

onMounted(async () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
  
  try {
    // 根据单篇文档的唯一 ID 请求 Strapi 详情接口，并填充媒体和分类
    const res = await $fetch(`${strapiUrl}/api/blogs/${postId}?populate=*`)
    console.log('详情页收到的原始数据:', res)
    responseData.value = res
  } catch (err) {
    console.error('Client fetch blog detail failed:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

// 动态设置页面 SEO 标题
useHead({
  title: computed(() => `${post.value?.title || post.value?.attributes?.title || 'Blog Detail'} | SeakApparel`)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <NuxtLink to="/blog" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 gap-1 mb-8 transition-colors">
      ← Back to Blogs
    </NuxtLink>

    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading article content...</p>
    </div>

    <div v-else-if="fetchError || !post" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">
      Article not found or server error. Please return to the blog list.
    </div>

    <article v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
      <div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium text-xs">
          {{ post.blog_category?.name || post.attributes?.blog_category?.data?.attributes?.name || 'Trends' }}
        </span>
        <span>June 2026</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {{ post.title || post.attributes?.title }}
      </h1>

      <p class="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 mb-8 bg-gray-50 text-base rounded-r">
        {{ post.description || post.attributes?.description }}
      </p>

      <div v-if="getImageUrl(post)" class="w-full aspect-[21/9] rounded-xl overflow-hidden mb-10 bg-gray-100">
        <NuxtImg 
          :src="getImageUrl(post)" 
          class="w-full h-full object-cover"
          alt="Blog Detail Cover"
        />
      </div>

      <div class="prose max-w-none text-gray-700 leading-relaxed text-lg space-y-6">
        <template v-if="Array.isArray(post.content || post.attributes?.content)">
          <p v-for="(paragraph, index) in renderBlocks(post.content || post.attributes?.content)" :key="index">
            {{ paragraph }}
          </p>
        </template>
        
        <template v-else>
          <p>{{ post.content || post.attributes?.content || 'No content available.' }}</p>
        </template>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* 自定义富文本的一些间距和样式排版优化 */
.prose p {
  margin-bottom: 1.5rem;
  color: #374151;
}
</style>