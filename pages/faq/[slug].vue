<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

useCanonicalUrl()

const route = useRoute()
const faqSlug = route.params.slug
const { strapiUrl } = useStrapi()

const { data: responseData, pending: loading, error: fetchError } = await useFetch(`${strapiUrl}/api/faqs`, {
  query: { 'filters[slug][$eq]': faqSlug, populate: '*' },
  key: `faq-${faqSlug}`
})

const faqItem = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) return res.data[0]
  return null
})

const renderFaqContent = (content) => {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(block => block.type === 'paragraph' ? block.children?.map(c => c.text).join('') || '' : '').filter(Boolean).join('<br>')
  }
  return ''
}

useHead({
  title: computed(() => `${faqItem.value?.title || faqItem.value?.attributes?.title || 'FAQ Detail'} | TontonSports`),
  meta: computed(() => [
    { name: 'description', content: `Answer to: ${faqItem.value?.title || faqItem.value?.attributes?.title || 'FAQ question'} - TontonSports` },
    { property: 'og:title', content: faqItem.value?.title || faqItem.value?.attributes?.title || 'FAQ Detail' },
    { property: 'og:type', content: 'article' }
  ]),
  script: computed(() => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": faqItem.value?.title || faqItem.value?.attributes?.title || '',
        "acceptedAnswer": {
          "@type": "Answer",
          "text": renderFaqContent(faqItem.value?.content || faqItem.value?.attributes?.content)
        }
      }]
    })
  }])
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 md:py-16">
    <NuxtLink to="/faq" class="inline-flex items-center text-sm text-gray-500 hover:text-brand gap-1 mb-8">← Back to all FAQs</NuxtLink>
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full mb-4"></div>
      <p>Loading FAQ content...</p>
    </div>
    <div v-else-if="fetchError || !faqItem" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">This FAQ question not found. Return to FAQ list.</div>
    <article v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{{ faqItem.title || faqItem.attributes?.title }}</h1>
      <div class="text-gray-700 leading-relaxed text-base" v-html="renderFaqContent(faqItem.content || faqItem.attributes?.content)"></div>
    </article>
  </div>
</template>
