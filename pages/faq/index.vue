<script setup>
import { ref, onMounted, computed } from 'vue'

const { strapiUrl } = useStrapi()
const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)
const faqList = computed(() => responseData.value?.data || [])

const renderFaqContent = (content) => {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph') return block.children?.map(c => c.text).join('') || ''
      return ''
    }).filter(Boolean).join('<br>')
  }
  return ''
}

onMounted(async () => {
  try {
    const res = await $fetch(`${strapiUrl}/api/faqs?populate=*`)
    responseData.value = res
  } catch (err) {
    console.error('FAQ fetch error:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'FAQ | Custom Sportswear Manufacturing Questions',
  meta: [
    { name: 'description', content: 'Find answers to common questions about custom sportswear manufacturing — MOQ, lead times, pricing, OEM/ODM process, shipping, and more.' },
    { name: 'keywords', content: 'sportswear FAQ, custom sportswear questions, MOQ, OEM ODM, shipping, manufacturing process' },
    { property: 'og:title', content: 'FAQ | Custom Sportswear Manufacturing' },
    { property: 'og:description', content: 'Answers to common questions about custom sportswear manufacturing.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.seakapparel.com/faq' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqList.value.map(item => ({
          "@type": "Question",
          "name": item.title || item.attributes?.title || '',
          "acceptedAnswer": {
            "@type": "Answer",
            "text": renderFaqContent(item.content || item.attributes?.content)
          }
        }))
      })
    }
  ]
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <div class="mb-8">
      <nav class="text-sm text-gray-400 mb-3">
        <NuxtLink to="/" class="hover:text-brand transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-600">FAQ</span>
      </nav>
      <h1 class="text-3xl md:text-4xl font-heading font-bold text-navy">Frequently Asked Questions</h1>
      <p class="text-gray-500 mt-2">Everything you need to know about ordering custom sportswear from SeakApparel.</p>
    </div>
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full mb-4"></div>
      <p>Loading FAQ questions...</p>
    </div>
    <div v-else-if="fetchError" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">Failed to load FAQ data, please refresh page.</div>
    <div v-else-if="faqList.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">No FAQ entries published yet.</div>
    <div v-else class="space-y-5">
      <div v-for="item in faqList" :key="item.id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <NuxtLink :to="`/faq/${item.slug || item.attributes?.slug}`" class="block group">
          <h3 class="font-bold text-lg text-gray-900 group-hover:text-brand transition-colors mb-3">{{ item.title || item.attributes?.title }}</h3>
        </NuxtLink>
        <div class="text-gray-600 leading-relaxed"><span v-html="renderFaqContent(item.content || item.attributes?.content)"></span></div>
        <div class="mt-4 pt-3 border-t border-gray-100">
          <NuxtLink :to="`/faq/${item.slug || item.attributes?.slug}`" class="text-sm text-brand hover:text-brand font-medium">View full details →</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
