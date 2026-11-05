<script setup>
// 递归渲染 Strapi blocks 富文本节点（支持任意嵌套：列表套列表、加粗斜体等行内样式）
defineProps({
  node: { type: Object, required: true },
  // 开启后图片可点击放大：点击时把整个 image 节点抛给父组件，由父组件弹大图
  zoomable: { type: Boolean, default: false }
})
const emit = defineEmits(['zoom'])
</script>

<template>
  <img
    v-if="node.type === 'image'"
    :src="node.url"
    :alt="node.alt"
    class="my-4 sm:my-6 max-w-full rounded-lg"
    :class="zoomable ? 'cursor-zoom-in' : ''"
    loading="lazy"
    @click="zoomable && node.url && emit('zoom', node)"
  />
  <component :is="node.tag || 'span'" v-else>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :zoomable="zoomable" @zoom="emit('zoom', $event)" />
    <template v-if="!node.children || !node.children.length">{{ node.content }}</template>
  </component>
</template>
