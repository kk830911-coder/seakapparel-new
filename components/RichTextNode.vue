<script setup>
// 递归渲染 Strapi blocks 富文本节点（支持任意嵌套：列表套列表、加粗斜体等行内样式）
defineProps({
  node: { type: Object, required: true }
})
</script>

<template>
  <img
    v-if="node.type === 'image'"
    :src="node.url"
    :alt="node.alt"
    class="my-4 sm:my-6 max-w-full rounded-lg"
    loading="lazy"
  />
  <component :is="node.tag || 'span'" v-else>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" />
    <template v-if="!node.children || !node.children.length">{{ node.content }}</template>
  </component>
</template>
