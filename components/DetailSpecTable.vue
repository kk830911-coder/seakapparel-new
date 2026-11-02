<script setup lang="ts">
// 核心参数表：纯 HTML 表格（可被引擎读取、可参与长尾词排名），不要做成图片
defineProps<{
  rows: { label: string; value: string }[]
  sizeChart?: string | null
}>()
</script>

<template>
  <div v-if="rows.length || sizeChart">
    <div v-if="rows.length" class="overflow-hidden rounded-xl border border-gray-100">
      <table class="w-full text-sm">
        <caption class="sr-only">Product specifications</caption>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in rows" :key="row.label" class="bg-white">
            <th scope="row" class="w-2/5 text-left font-medium text-gray-500 py-3 pl-4 pr-2 align-top">{{ row.label }}</th>
            <td class="text-gray-800 py-3 pr-4 align-top">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <a
      v-if="sizeChart"
      :href="sizeChart"
      target="_blank"
      class="inline-flex items-center gap-2 mt-4 text-sm font-medium text-brand hover:text-brand-dark"
    >
      View size chart
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
    </a>
  </div>
  <p v-else class="text-sm text-gray-400">Specifications will be published soon.</p>
</template>
