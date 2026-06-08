<script setup>
import { computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 定义后端 URL 基础基准
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// ⚡【Strapi v5 核心适配】：直接将路由绑定的 documentId 传递给 Restful 接口，让谷歌蜘蛛能落地直接抓到完整 HTML
const { data: responseData, error: fetchError } = await useFetch(
  () => `${strapiUrl}/api/blogs/${route.params.id}`,
  {
    query: { 
      populate: '*',
      status: 'published'
    },
    initialCache: false
  }
)

// 2. 响应式解析博客主体（完美兼容 Strapi 单条数据返回格式）
const post = computed(() => {
  const res = responseData.value
  if (!res) return null
  
  if (res.data) {
    return Array.isArray(res.data) ? res.data[0] : res.data
  }
  return res
})

// 提取当前文章的干净标题（用于 Meta 拼接及图片 alt 自动补全）
const postTitle = computed(() => {
  const rawPost = post.value
  if (!rawPost) return 'Fashion Wholesale Insights'
  return rawPost.title || rawPost.attributes?.title || 'Fashion Wholesale Insights'
})

// 安全格式化发布更新时间
const formattedDate = computed(() => {
  const rawPost = post.value
  if (!rawPost) return 'June 2026'
  const dateStr = rawPost.updatedAt || rawPost.attributes?.updatedAt || rawPost.createdAt
  if (!dateStr) return 'June 2026'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
})

// 3. 【SEO 强化】主大封面图 URL 与 Alt 智能对齐
const coverImageInfo = computed(() => {
  const data = post.value
  if (!data) return { url: '', alt: 'SeakApparel Blog Cover' }

  const coverData = data.cover || data.attributes?.cover?.data || data.cover?.data
  if (!coverData) return { url: '', alt: `${postTitle.value} - SeakApparel Cover` }

  let rawUrl = ''
  let rawAlt = ''
  
  if (coverData.attributes) {
    rawUrl = coverData.attributes.url || ''
    rawAlt = coverData.attributes.alternativeText || coverData.attributes.name || ''
  } else {
    rawUrl = coverData.url || ''
    rawAlt = coverData.alternativeText || coverData.name || ''
  }

  if (rawUrl && rawUrl.startsWith('/')) {
    rawUrl = `${strapiUrl}${rawUrl}`
  }

  return {
    url: rawUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop',
    alt: rawAlt.trim() ? rawAlt : `${postTitle.value} - Southeast Asia Clothing Wholesale`
  }
})

/**
 * 💡 SEO 编译器：将富文本安全转换为原生语义化 HTML（完美解决图片空 alt 隐患）
 */
const renderBlogRichText = (nodes) => {
  if (!nodes) return ''
  if (typeof nodes === 'string') return nodes
  if (!Array.isArray(nodes)) return ''

  return nodes.map(node => {
    // 📷 1. 深度拦截并修复富文本中嵌入的图片节点
    if (node.type === 'image') {
      const imgObj = node.image || node.file || node
      let imgUrl = imgObj?.url || ''
      if (!imgUrl) return ''

      if (imgUrl.startsWith('/')) {
        imgUrl = `${strapiUrl}${imgUrl}`
      }

      // 🔍【Alt 保底绝招】：如果运营漏填，自动用“文章名 + 标签”顶上
      const rawAlt = imgObj.alternativeText || imgObj.caption || imgObj.name || ''
      const safeAlt = rawAlt.trim() ? rawAlt : `${postTitle.value} - Apparel Vendor Spotlight`
      
      return `<div class="my-8 flex flex-col items-center">
        <img 
          src="${imgUrl}" 
          alt="${safeAlt}" 
          class="rounded-xl max-w-full h-auto shadow-md border border-gray-100"
          loading="lazy"
        />
        ${rawAlt ? `<span class="text-xs text-gray-400 mt-2 text-center tracking-wide">${rawAlt}</span>` : ''}
      </div>`
    }

    // 2. 渲染文本加粗、斜体样式
    if (node.type === 'text') {
      let text = node.text || ''
      if (node.bold) text = `<strong>${text}</strong>`
      if (node.italic) text = `<em>${text}</em>`
      return text
    }

    // 3. 递归编译子节点
    const childrenHtml = node.children ? renderBlogRichText(node.children) : ''

    // 4. 标准语义标签映射（让谷歌爬虫更易读懂长文章结构）
    switch (node.type) {
      case 'heading':
        const level = node.level || 2
        return `<h${level}>${childrenHtml}</h${level}>`
      case 'list':
        const listTag = node.format === 'ordered' ? 'ol' : 'ul'
        return `<${listTag}>${childrenHtml}</${listTag}>`
      case 'list-item':
        return `<li>${childrenHtml}</li>`
      case 'paragraph':
      default:
        if (!childrenHtml || childrenHtml.trim() === '') {
          return '<p><br /></p>'
        }
        return `<p>${childrenHtml}</p>`
    }
  }).join('')
}

// 提取纯文本做 Meta Description 摘要描述
const getPureContentText = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return ''
  return nodes
    .map(node => {
      if (node.type === 'image') return ''
      return node.children?.map(c => c.text || '').join('') || ''
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 编译输出 HTML 字符串
const renderedContentHtml = computed(() => {
  const contentData = post.value?.content || post.value?.attributes?.content
  if (!contentData) return '<p class="text-gray-400">Writing in progress...</p>'
  return renderBlogRichText(contentData)
})

// 4. 📈【全套动态 SEO Meta 配置】拒绝全站统一，实现一文一元标签
useHead({
  title: computed(() => `${postTitle.value} | SeakApparel Blog`),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const rawPost = post.value
        if (!rawPost) return 'Discover the latest Southeast Asia clothing wholesale market trends.'
        const customDesc = rawPost.description || rawPost.attributes?.description
        if (customDesc) return customDesc
        
        const rawContent = rawPost.content || rawPost.attributes?.content
        const pureText = getPureContentText(rawContent)
        return pureText ? `${pureText.slice(0, 150)}...` : 'Discover the latest Southeast Asia clothing wholesale market trends and boutique fashion insights.'
      })
    },
    {
      name: 'keywords',
      content: computed(() => {
        const rawPost = post.value
        const category = rawPost?.blog_category || rawPost?.attributes?.blog_category?.data
        const cateName = category?.name || category?.attributes?.name || 'Women Clothing Wholesale'
        return `${postTitle.value}, ${cateName}, apparel supplier trend, Southeast Asia clothing vendor`
      })
    },
    // Open Graph 海外社媒卡片标准
    { property: 'og:title', content: computed(() => `${postTitle.value} | SeakApparel`) },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: computed(() => coverImageInfo.value.url) },
    { property: 'og:url', content: computed(() => `https://www.seakapparel.com/blog/${route.params.id}`) },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <NuxtLink to="/blog" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 gap-1 mb-8 transition-colors">
      ← Back to Blogs
    </NuxtLink>

    <div v-if="fetchError || !post" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">
      Article not found or server error. Please return to the blog list.
    </div>

    <article v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
      
      <div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium text-xs">
          {{ post.blog_category?.name || post.attributes?.blog_category?.data?.attributes?.name || 'Trends' }}
        </span>
        <span>📅 Updated: {{ formattedDate }}</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {{ postTitle }}
      </h1>

      <p v-if="post.description || post.attributes?.description" class="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 mb-8 bg-gray-50 text-base rounded-r">
        {{ post.description || post.attributes?.description }}
      </p>

      <div v-if="coverImageInfo.url" class="w-full aspect-[21/9] rounded-xl overflow-hidden mb-10 bg-gray-100">
        <img 
          :src="coverImageInfo.url" 
          :alt="coverImageInfo.alt"
          class="w-full h-full object-cover"
          loading="eager" 
        />
      </div>

      <div 
        class="prose blog-rich-body max-w-none text-gray-700 leading-relaxed text-lg"
        v-html="renderedContentHtml"
      />

    </article>
  </div>
</template>

<style scoped>
/* ==========================================================================
   🎨 博客深度排版控制样式
   ========================================================================== */
.blog-rich-body :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  color: #374151;
}

.blog-rich-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
  display: block;
}

.blog-rich-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  display: block;
}

.blog-rich-body :deep(ul) {
  list-style-type: disc !important;
  padding-left: 1.75rem !important;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.blog-rich-body :deep(ol) {
  list-style-type: decimal !important;
  padding-left: 1.75rem !important;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.blog-rich-body :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.blog-rich-body :deep(strong) {
  color: #030712;
  font-weight: 700;
}
</style>