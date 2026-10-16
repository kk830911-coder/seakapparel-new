<script setup>
import { computed, ref, watch } from 'vue'
import { useFetch, useHead } from '#imports'

const { strapiUrl } = useStrapi()
const currentPage = ref(1)

const { data: responseData, pending, error } = await useFetch(`${strapiUrl}/api/blogs`, {
  query: computed(() => ({ populate: '*', sort: 'publishedAt:desc', 'pagination[page]': currentPage.value, 'pagination[pageSize]': 20 })),
  key: computed(() => `blogs-list-page-${currentPage.value}`)
})

watch(currentPage, () => { if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' }) })

const blogs = computed(() => responseData.value?.data || [])
const pagination = computed(() => responseData.value?.meta?.pagination || { page: 1, pageCount: 1 })

const formatDate = (item) => {
  const publishedAt = item?.publishedAt || item?.attributes?.publishedAt
  if (!publishedAt) return ''
  const date = new Date(publishedAt)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getBlogImageUrl = (item) => {
  if (!item) return '/cover/1.jpg'
  const coverData = item.cover || item.attributes?.cover
  let mediaUrl = null
  if (typeof coverData === 'string') mediaUrl = coverData
  else if (coverData?.url) mediaUrl = coverData.url
  else if (coverData?.data?.attributes?.url) mediaUrl = coverData.data.attributes.url

  const fallbackUrl = mediaUrl || item.cover_url || item.attributes?.cover_url
  if (fallbackUrl) return fallbackUrl.startsWith('/') ? `${strapiUrl}${fallbackUrl}` : fallbackUrl.split('?')[0]

  const defaultCovers = ['/cover/1.jpg', '/cover/2.jpg', '/cover/3.jpg', '/cover/4.jpg']
  const seed = item.id || (item.title?.length || 0) || (item.attributes?.title?.length || 0)
  return defaultCovers[Math.abs(seed) % defaultCovers.length]
}

useHead({
  title: 'Sportswear Industry Blog | Manufacturing Tips & Trends',
  meta: [
    { name: 'description', content: 'Expert insights on custom sportswear manufacturing — fabric guides, printing techniques, industry trends, and tips for launching your activewear brand.' },
    { name: 'keywords', content: 'sportswear blog, activewear manufacturing tips, custom sportswear guide, fabric technology, printing techniques' },
    { property: 'og:title', content: 'Sportswear Industry Blog | TontonSports' },
    { property: 'og:description', content: 'Expert insights on custom sportswear manufacturing and industry trends.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.seakapparel.com/blog' }
  ]
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="mb-8">
      <nav class="text-sm text-gray-400 mb-3">
        <NuxtLink to="/" class="hover:text-brand transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-600">Blog</span>
      </nav>
      <h1 class="text-3xl md:text-4xl font-heading font-bold text-navy">Sportswear Industry Insights</h1>
      <p class="text-gray-500 mt-2">Manufacturing guides, fabric technology, and tips for building your sportswear brand.</p>
    </div>
    <div v-if="pending" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full mb-4"></div>
      <p>Loading articles...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500 bg-red-50 rounded-xl">Failed to connect backend server. Please refresh.</div>
    <div v-else-if="blogs.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">No blogs found.</div>
    <div v-else>
      <div class="grid grid-cols-1 gap-8">
        <div v-for="item in blogs" :key="item.id" class="bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <NuxtLink :to="`/blog/${item.slug || item.attributes?.slug}`" class="w-full md:w-64 lg:w-72 aspect-square overflow-hidden block bg-gray-50 relative flex-shrink-0">
            <img :src="getBlogImageUrl(item)" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" :alt="`${item.title || item.attributes?.title || 'Blog'} - TontonSports`" loading="lazy" />
          </NuxtLink>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-semibold text-brand tracking-wider uppercase mb-2 block">{{ item.blog_category || item.attributes?.blog_category || 'New Products' }}</span>
              <h3 class="font-bold text-xl text-gray-800 line-clamp-2 hover:text-brand transition-colors">
                <NuxtLink :to="`/blog/${item.slug || item.attributes?.slug}`">{{ item.title || item.attributes?.title }}</NuxtLink>
              </h3>
              <p class="text-sm text-gray-500 line-clamp-3 mt-2 leading-relaxed">{{ item.description || item.attributes?.description || 'Click to read full story...' }}</p>
            </div>
            <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span class="text-xs text-gray-400">{{ formatDate(item) || 'Recent' }}</span>
              <NuxtLink :to="`/blog/${item.slug || item.attributes?.slug}`" class="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1">Read Full Article →</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="pagination.pageCount > 1" class="mt-14 flex justify-center items-center gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50">← Previous</button>
        <div class="flex items-center gap-1 mx-2">
          <button v-for="page in pagination.pageCount" :key="page" @click="currentPage = page" :class="['w-10 h-10 text-sm font-medium rounded-lg border transition-colors duration-200', currentPage === page ? 'bg-brand text-white border-brand shadow-sm shadow-blue-100' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">{{ page }}</button>
        </div>
        <button @click="currentPage++" :disabled="currentPage === pagination.pageCount" class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50">Next →</button>
      </div>
    </div>
  </div>
</template>
