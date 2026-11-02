<script setup lang="ts">
// 详情页锚点导航：内容多时让客户能一步跳到关心的区块
defineProps<{ sections: { id: string; label: string }[] }>()
</script>

<template>
  <nav
    v-if="sections.length"
    class="sticky top-14 md:top-[148px] z-30 -mx-4 px-4 bg-white/95 backdrop-blur border-b border-gray-100"
    aria-label="Product detail sections"
  >
    <ul class="flex gap-1 overflow-x-auto py-2 text-sm">
      <li v-for="s in sections" :key="s.id" class="flex-shrink-0">
        <a
          :href="`#${s.id}`"
          class="block whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-600 font-medium hover:text-brand hover:bg-brand/5 transition-colors"
        >{{ s.label }}</a>
      </li>
    </ul>
  </nav>
</template>
