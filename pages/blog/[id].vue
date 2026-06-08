<script setup>
import { computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

const route = useRoute()

// 1. 定义后端 URL 基础基准
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

/**
 * ⚡【SEO 修复】：移除 useFetch 的第一个参数的箭头函数，改用字符串模板直接触发 SSR 阻塞式渲染。
 * 这样可以确保 Nuxt 在服务端 100% 拿到数据后再输出 HTML 给谷歌爬虫。
 */
const { data: responseData, error: fetchError } = await useFetch(
  `${strapiUrl}/api/blogs/${route.params.id}`,
  {
    query: { 
      populate: '*',
      status: 'published'
    }
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

// ISO 标准时间格式（专门给搜索引擎爬虫读取）
const isoDateStr = computed(() => {
  const rawPost = post.value
  if (!rawPost) return ''
  return rawPost.updatedAt || rawPost.attributes?.updatedAt || rawPost.createdAt || ''
})

// 人类友好阅读时间格式
const formattedDate = computed(() => {
  const dateStr = isoDateStr.value
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
 * 💡 SEO 编译器：将富文本安全转换为原生语义化 HTML
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

      // 🔍【Alt 保底绝招】
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

    // 4. 标准语义标签映射
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

/**
 * 4. 📈【全套动态 SEO Meta 配置】
 * 修复原 computed 内部判断逻辑，确保响应式数据变化时，Meta 标签能被正确刷新并写入 SSR 页面
 */
const pageTitle = computed(() => `${postTitle.value} | SeakApparel Blog`)
const pageDesc = computed(() => {
  const rawPost = post.value
  if (!rawPost) return 'Discover