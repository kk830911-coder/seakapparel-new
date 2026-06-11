<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const faqSlug = route.params.slug

const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// 单条FAQ数据
const faqItem = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) {
    return res.data[0]
  }
  return null
})

// 富文本解析
const renderFaqContent = (content) => {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph') {
        return block.children?.map(c => c.text).join('') || ''
      }
      return ''
    }).filter(Boolean).join('<br>')
  }
  return ''
}

onMounted(async () => {
  try {
    // 通过slug筛选单条FAQ
    const res = await $fetch(`${strapiUrl}/api/faqs?filters[slug][$eq]=${faqSlug}&populate=*`)
    responseData.value = res
  } catch (err) {
    console.error('FAQ详情请求失败', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => `${faqItem.value?.title || faqItem.value?.attributes?.title || 'FAQ Detail'} | SeakApparel`)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <NuxtLink to="/faq" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 gap-1 mb-8">
      ← Back to all FAQs
    </NuxtLink>

    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading FAQ content...</p>
    </div>

    <div v-else-if="fetchError || !faqItem" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">
      This FAQ question not found. Return to FAQ list.
    </div>

    <article v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {{ faqItem.title || faqItem.attributes?.title }}
      </h1>
      <div class="text-gray-700 leading-relaxed text-base" v-html="renderFaqContent(faqItem.content || faqItem.attributes?.content)"></div>
    </article>
  </div>
</template>