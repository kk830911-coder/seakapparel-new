<script setup>
import { ref, computed } from 'vue'

// 全站统一后端域名
const isLocal = process.dev
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 全站统一图片工具函数（和所有页面保持一致，预留图片扩展）
const getCleanImageUrl = (rawUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&c_fill&q=75&f_auto'
  if (!rawUrl) return fallback
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  return rawUrl.split('?')[0]
}

const getOptimizedUrl = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=600&h=600&c_fill&q=75&f_auto`
  }
  return clean
}

const getThumb300 = (url) => {
  const clean = getCleanImageUrl(url)
  if (clean.includes('res.cloudinary.com')) {
    return `${clean}?w=300&h=300&c_fill&q=75&f_auto`
  }
  return clean
}

useHead({ title: 'Contact Us | SeakApparel' })
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8 border-l-4 border-blue-600 pl-3">Contact Us</h1>
    <div class="bg-white p-6 rounded-xl shadow">
      <p><strong>WhatsApp:</strong> +86 18271971983</p>
      <p><strong>Email:</strong> info@seakapparel.com</p>
    </div>
  </div>
</template>