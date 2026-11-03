<script setup lang="ts">
// 核心参数表：纯 HTML 表格（可被引擎读取、可参与长尾词排名），不要做成图片
defineProps<{
  rows: { label: string; value: string }[]
}>()
</script>

<template>
  <div v-if="rows.length">
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
  </div>
  <p v-else class="text-sm text-gray-400">Specifications will be published soon.</p>
</template>
