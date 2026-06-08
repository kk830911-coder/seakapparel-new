<script setup>
import { computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 定义后端 URL 基础基准
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// ⚡ 核心 SEO 修正【重要】：摒弃 onMounted，改用 SSR 服务端预渲染请求，让谷歌蜘蛛能直接抓到 HTML
const { data: responseData, error: fetchError } = await useFetch(
  () => `${strapiUrl}/api/blogs/${route.params.id}`,
  {
    query: { populate: '*' },
    initialCache: false
  }
)

// 2. 响应式计算出博客主体对象
const post = computed(() => {
  const res = responseData.value
  if (res && res.data) {
    return Array.isArray(res.data) ? res.data[0] : res.data
  }
  return null
})

// 提取当前文章的干净标题（用于兜底 alt 标签和标题拼接）
const postTitle = computed(() => {
  return post.value?.title || post.value?.attributes?.title || 'Fashion Wholesale Insights'
})

// 3. 【SEO 强化】安全的封面图 URL 与 Alt 动态匹配
const coverImageInfo = computed(() => {
  const data = post.value
  if (!data) return { url: '', alt: 'SeakApparel Blog Cover' }

  const coverData = data.cover || data.attributes?.cover?.data
  if (!coverData) return { url: '', alt: `${postTitle.value} - SeakApparel Cover` }

  // 兼容不同的 Strapi API 结构返回
  let rawUrl = ''
  let rawAlt = ''
  
  if (coverData.attributes) {
    rawUrl = coverData.attributes.url || ''
    rawAlt = coverData.attributes.alternativeText || coverData.attributes.name || ''
  } else {
    rawUrl = coverData.url || ''
    rawAlt = coverData.alternativeText || coverData.name || ''
  }

  // 拼接完整的绝对路径
  if (rawUrl && rawUrl.startsWith('/')) {
    rawUrl = `${strapiUrl}${rawUrl}`
  }

  return {
    url: rawUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop',
    alt: rawAlt.trim() ? rawAlt : `${postTitle.value} - Southeast Asia Clothing Wholesale`
  }
})

/**
 * 💡 核心改造：富文本组件模块化语义生成（支持多行排版、列表、加粗以及带动态 Alt 的图片渲染）
 */
const renderBlogRichText = (nodes) => {
  if (!nodes) return ''
  if (typeof nodes === 'string') return nodes
  if (!Array.isArray(nodes)) return ''

  return nodes.map(node => {
    // 📷 1. 拦截富文本中插入的图片节点
    if (node.type === 'image') {
      const imgObj = node.image
      if (!imgObj) return ''
      
      let imgUrl = imgObj.url || ''
      if (!imgUrl) return ''

      if (imgUrl.startsWith('/')) {
        imgUrl = `${strapiUrl}${imgUrl}`
      }

      // 🔍 【SEO 黄金点】：如果小编在后台没填 Alt，自动用“博客文章名+批发/穿搭”补齐，拒绝让谷歌摸黑！
      const rawAlt = imgObj.alternativeText || imgObj.name || ''
      const safeAlt = rawAlt.trim() ? rawAlt : `${postTitle.value} - Apparel Vendor Spotlight`
      
      return `<div class="my-8 flex flex-col items-center">
        <img 
          src="${imgUrl}" 
          alt="${safeAlt}" 
          class="rounded-xl max-w-full h-auto shadow-md border border-gray-100"
          loading="lazy"
        />
        ${rawAlt ? `<span class="text-xs text-gray-400 mt-2 text-center">${rawAlt}</span>` : ''}
      </div>`
    }

    // 2. 渲染行内纯文本与修饰标记（粗体等）
    if (node.type === 'text') {
      let text = node.text || ''
      if (node.bold) text = `<strong>${text}</strong>`
      if (node.italic) text = `<em>${text}</em>`
      return text
    }

    // 3. 递归编译子级块内容
    const childrenHtml = node.children ? renderBlogRichText(node.children) : ''

    // 4. 标准语义化标签层级转化（用原生的语义标签让蜘蛛更易读）
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

// 提取文章的纯文本，用来自动填补谷歌 Meta 描述
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

// 编译输出供前端 v-html 灌入的排版字串
const renderedContentHtml = computed(() => {
  const contentData = post.value?.content || post.value?.attributes?.content
  if (!contentData) return '<p class="text-gray-400">Writing in progress...</p>'
  return renderBlogRichText(contentData)
})

// 4. 📈 【完美版动态 SEO 配置】完全适配谷歌抓取与海外社交媒体（Facebook/WhatsApp）分享卡片
useHead({
  title: computed(() => `${postTitle.value} | SeakApparel Blog`),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const customDesc = post.value?.description || post.value?.attributes?.description
        if (customDesc) return customDesc
        
        // 自动用文章内容前 150 字进行智能截取补足
        const rawContent = post.value?.content || post.value?.attributes?.content
        const pureText = getPureContentText(rawContent)
        return pureText ? `${pureText.slice(0, 150)}...` : 'Discover the latest Southeast Asia clothing wholesale market trends and boutique fashion tips.'
      })
    },
    {
      name: 'keywords',
      content: computed(() => {
        const cateName = post.value?.blog_category?.name || 'Women Clothing Wholesale'
        return `${postTitle.value}, ${cateName}, apparel supplier trend, Southeast Asia clothing vendor`
      })
    },
    // Open Graph 规范 (社交媒体与跨平台引流)
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
        <span>📅 Updated: {{ new Date(post.updatedAt || post.attributes?.updatedAt || '2026-06').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }}</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {{ postTitle }}
      </h1>

      <p v-if="post.description || post.attributes?.description" class="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 mb-8 bg-gray-50 text-base rounded-r">
        {{ post.description || post.attributes?.description }}
      </p>