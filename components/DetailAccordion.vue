<script setup lang="ts">
import { ref } from 'vue'

// 折叠面板：共用块内容很长时避免页面被拉成十几屏
const props = defineProps<{ items: { title: string; body: string }[] }>()
const openIndex = ref<number | null>(props.items.length ? 0 : null)

const toggle = (i: number) => { openIndex.value = openIndex.value === i ? null : i }
</script>

<template>
  <div class="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white overflow-hidden">
    <div v-for="(item, i) in items" :key="item.title">
      <button
        type="button"
        class="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <span class="font-medium text-navy text-sm sm:text-base">{{ item.title }}</span>
        <svg
          class="w-4 h-4 flex-shrink-0 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openIndex === i }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div v-show="openIndex === i" class="px-4 pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ item.body }}</div>
    </div>
  </div>
</template>
