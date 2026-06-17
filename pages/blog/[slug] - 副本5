<script setup>
import { computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'
// 引入 markdown-it 解析器
import MarkdownIt from 'markdown-it'

const route = useRoute()
const postSlug = route.params.slug

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,         // 允许解析内容中的 HTML
  linkify: true,      // 自动将链接转换为可点击链接
  typographer: true
})

// 后端域名声明
const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 1. 使用 useFetch 替代 onMounted，支持服务端渲染(SSR)以获取更好的 SEO 和首屏速度
const { data: responseData, pending: loading, error: fetchError } = await useFetch(`${strapiUrl}/api/blogs`, {
  query: { 
    'filters[slug][$eq]': postSlug,
    'populate': '*'
  },
  key: `blog-${postSlug}`
})

const post = computed(() => responseData.value?.data?.[0] || null)

// 日期格式化核心逻辑：将 Strapi 复杂的 ISO 时间戳转换为 "YYYY-MM-DD" 具体的某一天
const formatDate = (postItem) => {
  if (!postItem) return ''
  
  // 兼容 Strapi v4 不同的解构层级获取内置的 publishedAt
  const publishedAt = postItem.publishedAt || postItem.attributes?.publishedAt
  
  if (!publishedAt) return ''
  
  // 转换为本地时间戳对象
  const date = new Date(publishedAt)
  
  // 格式化为：年-月-日
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 【完美排版核心逻辑】：将大模型生成的各种格式的正文转换为漂亮的网页 HTML
const renderMarkdownContent = (content) => {
  if (!content) return '<p>No content available.</p>'
  
  // 情况 A：如果 Dify 发送的是新版 Strapi Blocks (JSON 数组)
  if (Array.isArray(content)) {
    // 提取出里面的纯文本，并保留换行，再由 markdown-it 解析
    const textContent = content.map(block => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        return block.children?.map(child => child.text).join('') || ''
      }
      return ''
    }).join('\n\n')
    return md.render(textContent)
  }
  
  // 情况 B：如果传入的是纯 Markdown 字符串文本，直接完美解析
  if (typeof content === 'string') {
    return md.render(content)
  }
  
  return '<p>No content available.</p>'
}

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
          {{ post.blog_category || post.attributes?.blog_category || 'New Products' }}
        </span>
        <span v-if="formatDate(post)">{{ formatDate(post) }}</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {{ post.title || post.attributes?.title }}
      </h1>

      <p class="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 mb-8 bg-gray-50 text-base rounded-r">
        {{ post.description || post.attributes?.description }}
      </p>

      <div 
        class="prose max-w-none text-gray-700 leading-relaxed text-lg"
        v-html="renderMarkdownContent(post.content || post.attributes?.content)"
      ></div>
    </article>
  </div>
</template>

<style scoped>
/* 针对解析生成的 HTML 标签做美化加持，防止样式丢失，让排版瞬间高级 */
:deep(.prose) h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
:deep(.prose) h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
:deep(.prose) p {
  margin-bottom: 1.5rem;
  color: #374151;
  line-height: 1.75;
}
:deep(.prose) ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}
:deep(.prose) li {
  margin-bottom: 0.5rem;
}
:deep(.prose) table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}
:deep(.prose) th, :deep(.prose) td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}
:deep(.prose) th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>