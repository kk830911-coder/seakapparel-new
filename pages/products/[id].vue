<script setup>
import { ref, computed } from 'vue'
import { useRoute, useHead, useAsyncData } from '#imports'

const route = useRoute()

// 1. 获取运行环境和后端 URL
const isLocal = process.dev // Nuxt自带的判断是否是开发环境
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'

// 2. 【核心修改】使用 useAsyncData 让 Nuxt 在服务端就把数据请求好，直接注入到 HTML 源码中
const { data: responseData, pending: loading } = await useAsyncData(
  `product-${route.params.id}`,
  () => $fetch(`${strapiUrl}/api/products/${route.params.id}?populate=*`)
)

// 3. 解析出当前产品数据
const product = computed(() => {
  const res = responseData.value
  if (res && res.data) {
    return Array.isArray(res.data) ? res.data[0] : res.data
  }
  return null
})

// 当前选中的主图索引
const activeImageIndex = ref(0)

// 安全的图片列表解析
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  
  let list = []
  if (data.image) {
    if (Array.isArray(data.image)) { list = [...data.image] } else { list.push(data.image) }
  }
  if (data.images && Array.isArray(data.images)) {
    list = [...list, ...data.images]
  }
  if (data.attributes?.image?.data) {
    const imgData = data.attributes.image.data
    if (Array.isArray(imgData)) {
      imgData.forEach(item => list.push(item))
    } else {
      list.push(imgData)
    }
  }

  const processedUrls = list.map(img => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (img.url) return img.url
    if (img.attributes?.url) return img.attributes.url
    return null
  }).filter(url => url !== null)
  
  if (processedUrls.length === 0) {
    return ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop']
  }
  return processedUrls
})

// 获取当前展示的主图 URL
const currentMainImageUrl = computed(() => {
  return imagesList.value[activeImageIndex.value] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop'
})

const nextImage = () => {
  if (imagesList.value.length <= 1) return
  if (activeImageIndex.value === imagesList.value.length - 1) { activeImageIndex.value = 0 } else { activeImageIndex.value++ }
}

const prevImage = () => {
  if (imagesList.value.length <= 1) return
  if (activeImageIndex.value === 0) { activeImageIndex.value = imagesList.value.length - 1 } else { activeImageIndex.value-- }
}

const getDescriptionText = (data) => {
  if (!data) return 'No specific description provided.'
  const desc = data.description || data.attributes?.description
  if (!desc) return 'No specific description provided.'
  if (Array.isArray(desc)) {
    return desc[0]?.children?.[0]?.text || 'No specific description provided.'
  }
  return desc
}

// 4. 【动态 SEO】现在产品数据在服务端就有了，useHead 生成的标签会直接写进源码！
useHead({
  title: computed(() => {
    const titleText = product.value?.title || product.value?.attributes?.title || 'Product Detail'
    return `${titleText} | Southeast Asia Apparel Wholesale - SeakApparel`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const rawDesc = getDescriptionText(product.value)
        const cleanDesc = rawDesc === 'No specific description provided.' ? '' : rawDesc
        const price = product.value?.price || product.value?.attributes?.price || ''
        const moq = product.value?.moq || product.value?.attributes?.moq || 10
        return `Wholesale ${product.value?.title || 'Women Clothing'}. ${cleanDesc.slice(0, 120)}... Factory direct price${price ? ': $' + price : ''}, Low MOQ: ${moq}pcs. Supplier for Southeast Asia fashion boutiques.`
      })
    },
    {
      name: 'keywords',
      content: computed(() => {
        const titleText = product.value?.title || 'Women Clothing'
        return `${titleText} wholesale, bulk clothing supplier, Southeast Asia apparel vendor`
      })
    },
    {
      property: 'og:title',
      content: computed(() => `${product.value?.title || 'Product'} | SeakApparel Wholesale`)
    },
    {
      property: 'og:image',
      content: computed(() => currentMainImageUrl.value)
    }
  ]
})
</script>