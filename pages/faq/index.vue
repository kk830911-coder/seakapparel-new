<script setup>
import { ref, onMounted, computed } from 'vue'

// 统一环境域名，和产品/博客保持一致
const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

const responseData = ref(null)
const loading = ref(true)
const fetchError = ref(false)

// FAQ 列表数据
const faqList = computed(() => responseData.value?.data || [])

// 富文本渲染函数，兼容Strapi blocks格式
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
    // 拉取全部FAQ，携带完整字段
    const res = await $fetch(`${strapiUrl}/api/faqs?populate=*`)
    console.log('FAQ 原始接口数据：', res)
    responseData.value = res
  } catch (err) {
    console.error('FAQ接口请求失败', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
})

useHead({ title: 'FAQ | SeakApparel' })
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-3">FAQ - Frequently Asked Questions</h1>

    <!-- 加载中 -->
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p>Loading FAQ questions...</p>
    </div>

    <!-- 接口错误 -->
    <div v-else-if="fetchError" class="text-center py-12 text-red-500 bg-red-50 rounded-xl">
      Failed to load FAQ data, please refresh page.
    </div>

    <!-- 无数据 -->
    <div v-else-if="faqList.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
      No FAQ entries published yet.
    </div>

    <!-- FAQ 列表 -->
    <div v-else class="space-y-5">
      <div 
        v-for="item in faqList" 
        :key="item.id" 
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <NuxtLink 
          :to="`/faq/${item.slug || item.attributes?.slug}`"
          class="block group"
        >
          <h3 class="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
            {{ item.title || item.attributes?.title }}
          </h3>
        </NuxtLink>
        <div class="text-gray-600 leading-relaxed">
          <span v-html="renderFaqContent(item.content || item.attributes?.content)"></span>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-100">
          <NuxtLink 
            :to="`/faq/${item.slug || item.attributes?.slug}`"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View full details →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>