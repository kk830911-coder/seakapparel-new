<script setup lang="ts">
// 详情区 FAQ：纯文本渲染（可输出 FAQPage 结构化数据，别做成图片）
defineProps<{ items: { question: string; answer: string }[] }>()
</script>

<template>
  <div class="space-y-3">
    <details
      v-for="item in items"
      :key="item.question"
      class="group rounded-xl border border-gray-100 bg-white px-4 py-3"
    >
      <summary class="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-navy text-sm sm:text-base">
        {{ item.question }}
        <svg class="w-4 h-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-3 text-sm text-gray-600 leading-relaxed">{{ item.answer }}</p>
    </details>
  </div>
</template>
