<template>
  <!-- 页面容器 -->
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <!-- 加载中状态 -->
    <div v-if="pending" class="text-center text-xl py-20">
      Loading product details...
    </div>

    <!-- 请求报错状态 -->
    <div v-else-if="error" class="text-center text-red-500 text-xl py-20">
      Failed to load product, please try again later
    </div>

    <!-- 产品详情主体 -->
    <div v-else-if="product" class="grid md:grid-cols-2 gap-10 items-start">
      <!-- 产品图片区域 -->
      <div class="rounded-lg overflow-hidden shadow-lg">
        <NuxtImg
          :src="getImageUrl(product.image)"
          alt="Product Image"
          class="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>

      <!-- 产品信息区域 -->
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>

        <div class="text-2xl text-red-600 font-semibold">
          ${{ product.price }}
        </div>

        <div class="text-gray-700">
          <p><strong>MOQ (Minimum Order Quantity):</strong> {{ product.moq }}</p>
        </div>

        <!-- 产品描述 -->
        <div class="border-t pt-6">
          <h3 class="text-xl font-medium mb-3">Product Description</h3>
          <p class="text-gray-600 leading-relaxed">
            {{ product.description || 'No description available' }}
          </p>
        </div>

        <!-- 返回列表按钮 -->
        <div class="pt-4">
          <NuxtLink
            to="/products"
            class="inline-block bg-slate-800 text-white px-6 py-3 rounded hover:bg-slate-700 transition"
          >
            Back to Product List
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 无产品数据 -->
    <div v-else class="text-center text-gray-500 py-20">
      Product not found
    </div>
  </div>
</template>

<script setup>
// 1. 获取路由参数（当前产品 ID）
const route = useRoute()
// 2. 获取全局后端接口地址
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.strapiUrl

// 3. 请求 Strapi 单条产品数据
// populate=* 必须加：Strapi 默认不返回图片等关联资源
const { data, pending, error } = await useFetch(
  () => `${baseUrl}/api/products/${route.params.id}?populate=*`
)

// 4. 格式化数据（Strapi 标准返回结构：data -> attributes）
const product = computed(() => {
  if (!data.value?.data) return null
  return data.value.data.attributes
})

// 5. 工具函数：拼接图片完整地址（解决图片不显示）
const getImageUrl = (img) => {
  // 无图片时返回占位图
  if (!img?.url) return '/placeholder.png'
  // Strapi 图片分相对路径/绝对路径，统一处理
  return img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
}
</script>