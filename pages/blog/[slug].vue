<script setup>
import { computed } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const postSlug = route.params.slug
const { strapiUrl } = useStrapi()

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

const { data: responseData, pending: loading, error: fetchError } = await useFetch(`${strapiUrl}/api/blogs`, {
  query: { 'filters[slug][$eq]': postSlug, populate: '*' },
  key: `blog-${postSlug}`
})

const post = computed(() => responseData.value?.data?.[0] || null)

const formatDate = (item) => {
  const publishedAt = item?.publishedAt || item?.attributes?.publishedAt
  if (!publishedAt) return ''
  const date = new Date(publishedAt)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const renderMarkdownContent = (content) => {
  if (!content) return '<p>No content available.</p>'
  if (Array.isArray(content)) {
    let html = ''
    content.forEach(block => {
      if (block.type === 'heading' && block.level === 2) {
        html += `<h2>${block.children?.map(c => c.text).join('') || ''}</h2>`
      } else if (block.type === 'list' && block.format === 'unordered') {
        html += '<ul>'
        block.children?.forEach(item => {
          html += '<li>'
          item.children?.forEach(child => { html += child.bold ? `<strong>${child.text}</strong>` : child.text })
          html += '</li>'
        })
        html += '</ul>'
      } else if (block.type === 'paragraph') {
        let p = '<p>'
        block.children?.forEach(child => { p += child.bold ? `<strong>${child.text}</strong>` : child.text })
        html += p + '</p>'
      } else if (block.type === 'image' && block.image?.url) {
        html += `<div class="blog-image-wrapper"><img src="${block.image.url}" alt="${block.image.alternativeText || post.value?.title || 'SeakApparel Blog Image'}" /></div>`
      }
    })
    return html
  }
  if (typeof content === 'string') return md.render(content)
  return '<p>No content available.</p>'
}

useHead({
  title: computed(() => `${post.value?.title || post.value?.attributes?.title || 'Blog Detail'} | SeakApparel`),
  meta: computed(() => [
    { name: 'description', content: post.value?.description || post.value?.attributes?.description || 'Read the full article on SeakApparel blog.' },
    { property: 'og:title', content: post.value?.title || post.value?.attributes?.title || 'Blog Detail' },
    { property: 'og:description', content: post.value?.description || post.value?.attributes?.description || '' },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: post.value?.publishedAt || post.value?.attributes?.publishedAt || '' }
  ]),
  script: computed(() => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.value?.title || post.value?.attributes?.title || '',
      "description": post.value?.description || post.value?.attributes?.description || '',
      "author": {
        "@type": "Organization",
        "name": "SeakApparel"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SeakApparel",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.seakapparel.com/logo.png"
        }
      },
      "datePublished": post.value?.publishedAt || post.value?.attributes?.publishedAt || '',
      "url": `https://www.seakapparel.com/blog/${post.value?.slug || post.value?.attributes?.slug || ''}`
    })
  }])
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <NuxtLink to="/blog" class="inline-flex items-center text-sm text-gray-500 hover:text-brand gap-1 mb-8 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back to Blog
    </NuxtLink>
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full mb-4"></div>
      <p>Loading article content...</p>
    </div>
    <div v-else-if="fetchError || !post" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">Article not found or server error. Please return to the blog list.</div>
    <article v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
      <div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span class="bg-brand/10 text-brand px-3 py-1 rounded-full font-medium text-xs">{{ post.blog_category || post.attributes?.blog_category || 'New Products' }}</span>
        <span v-if="formatDate(post)">{{ formatDate(post) }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{{ post.title || post.attributes?.title }}</h1>
      <p class="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 mb-8 bg-gray-50 text-base rounded-r">{{ post.description || post.attributes?.description }}</p>
      <div class="prose max-w-none text-gray-700 leading-relaxed text-lg" v-html="renderMarkdownContent(post.content || post.attributes?.content)"></div>
    </article>
  </div>
</template>

<style scoped>
:deep(.prose) h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 1rem; }
:deep(.prose) h3 { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-top: 1.5rem; margin-bottom: 0.75rem; }
:deep(.prose) p { margin-bottom: 1.5rem; color: #374151; line-height: 1.75; }
:deep(.prose) ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
:deep(.prose) li { margin-bottom: 0.5rem; }
:deep(.prose) table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
:deep(.prose) th, :deep(.prose) td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
:deep(.prose) th { background-color: #f9fafb; font-weight: 600; }
:deep(.prose) .blog-image-wrapper { margin: 2rem 0; text-align: center; }
:deep(.prose) .blog-image-wrapper img { border-radius: 1rem; max-height: 500px; margin: 0 auto; object-fit: cover; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
</style>
