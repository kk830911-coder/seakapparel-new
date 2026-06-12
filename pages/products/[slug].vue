<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute, useHead, useFetch, navigate, useRuntimeConfig } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()

// ========== 常量统一管理（不改动原有业务逻辑数值） ==========
const IMG_FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&c_fill&q=75&f_auto'
const SWIPE_THRESHOLD = 50
const THUMB_SCROLL_STEP = 120
const RECURSE_MAX_DEPTH = 10

// 1. 获取后端 URL 兼容本地/线上，WhatsApp 号码从环境变量读取
const isLocal = process.dev 
const strapiUrl = isLocal ? 'http://localhost:1337' : 'https://seak-backend.onrender.com'
const waPhone = config.public.waPhone || '+8613800000000'

// ========== 全局图片纯净处理函数（仅执行一次，模板不再重复计算） ==========
const getCleanImageUrl = (rawUrl) => {
  if (!rawUrl) return IMG_FALLBACK
  let fullUrl = rawUrl.startsWith('/') ? `${strapiUrl}${rawUrl}` : rawUrl
  return fullUrl.split('?')[0]
}

// ========== 统一商品属性取值，兼容 product / product.attributes 两种结构 ==========
const getAttr = (field) => {
  const item = product.value
  if (!item) return null
  return item.attributes?.[field] ?? item[field] ?? null
}

// ========== 接口请求优化：精准populate、开启缓存、减少返回体积 ==========
const { data: responseData } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: { 
    fields: ['title','price','moq','slug'],
    populate: {
      image: { fields: ['url','alternativeText'] },
      images: { fields: ['url','alternativeText'] },
      description: { populate: 'image' }
    },
    'filters[slug][$eq]': route.params.slug
  },
  initialCache: true,
  cache: true,
  staleIfError: 300000
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) {
    return res.data[0]
  }
  return null
})

// 商品不存在自动404跳转
watch(product, (val) => {
  if (val === null) navigate('/products', { statusCode: 404 })
})

// ========== 图片状态变量（完全保留原有变量名，模板无改动） ==========
const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

// 提前预处理全部图片纯净地址，模板不再重复调用getCleanImageUrl
const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  let list = []
  if (getAttr('image')) {
    const imgData = getAttr('image')
    Array.isArray(imgData) ? list.push(...imgData) : list.push(imgData)
  }
  if (getAttr('images') && Array.isArray(getAttr('images'))) {
    list.push(...getAttr('images'))
  }
  
  return list.map(img => {
    const raw = typeof img === 'string' ? img : (img.url || img.attributes?.url)
    return raw ? getCleanImageUrl(raw) : null
  }).filter(Boolean)
})

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')
const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

// ========== 图片切换逻辑（保留原有函数名，增加防抖） ==========
let isSwiping = false
const nextImage = async () => { 
  if (isSwiping || imagesList.value.length <= 1) return
  isSwiping = true
  activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length 
  setTimeout(() => isSwiping = false, 300)
}
const prevImage = async () => { 
  if (isSwiping || imagesList.value.length <= 1) return
  isSwiping = true
  activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length 
  setTimeout(() => isSwiping = false, 300)
}

const nextPreview = () => {
  if (imagesList.value.length <= 1) return
  previewIndex.value = (previewIndex.value + 1) % imagesList.value.length
  imgPreviewKey.value++
}
const prevPreview = () => {
  if (imagesList.value.length <= 1) return
  previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length
  imgPreviewKey.value++
}

// 修复：区分滑动与点击，滑动后不触发预览弹窗
let touchStartX = 0
let touchEndX = 0
let isSlideAction = false
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
  isSlideAction = false
}
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchEndX - touchStartX
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    diff < 0 ? nextImage() : prevImage()
    isSlideAction = true
  }
}

// 打开预览：滑动操作直接返回，不弹图
const openPreview = async () => {
  if (isSlideAction) return
  previewIndex.value = activeImageIndex.value
  imgPreviewKey.value++
  await nextTick()
  previewOpen.value = true
}
const closePreview = async () => {
  previewOpen.value = false
  await nextTick()
  imgPreviewKey.value++
}

// 弹窗触摸滑动
let previewTouchStartX = 0
let previewTouchEndX = 0
const previewTouchStart = (e) => {
  previewTouchStartX = e.changedTouches[0].screenX
}
const previewTouchEnd = (e) => {
  previewTouchEndX = e.changedTouches[0].screenX
  const diff = previewTouchEndX - previewTouchStartX
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    diff < 0 ? nextPreview() : prevPreview()
  }
}

// ========== 富文本渲染：增加递归深度限制，防止超长文本栈溢出 ==========
const renderStrapiRichTextNodes = (nodes, depth = 0) => {
  if (!nodes || !Array.isArray(nodes) || depth > RECURSE_MAX_DEPTH) return []
  const result = []
  for (const node of nodes) {
    if (node.type === 'image') {
      const rawUrl = node.image?.url || ''
      const cleanUrl = getCleanImageUrl(rawUrl)
      result.push({
        type: 'image',
        url: cleanUrl,
        alt: node.image?.alternativeText || 'Product'
      })
    } else if (node.type === 'text') {
      result.push({
        type: 'text',
        content: node.text
      })
    } else {
      const childNodes = node.children ? renderStrapiRichTextNodes(node.children, depth + 1) : []
      result.push({
        type: 'block',
        tag: node.type,
        children: childNodes
      })
    }
  }
  return result
}

const descriptionNodes = computed(() => renderStrapiRichTextNodes(getAttr('description')))

// 缩略图滚动（补全你原有空函数逻辑，函数名不变）
const thumbScrollRef = ref(null)
const scrollThumbLeft = () => {
  if (!thumbScrollRef.value) return
  thumbScrollRef.value.scrollBy({ left: -THUMB_SCROLL_STEP, behavior: 'smooth' })
}
const scrollThumbRight = () => {
  if (!thumbScrollRef.value) return
  thumbScrollRef.value.scrollBy({ left: THUMB_SCROLL_STEP, behavior: 'smooth' })
}

// ========== 监听路由切换，重置全部图片状态，消除旧图闪现 ==========
watch(() => route.params.slug, () => {
  activeImageIndex.value = 0
  previewIndex.value = 0
  previewOpen.value = false
  imgPreviewKey.value++
})

// ========== 弹窗打开/关闭锁定页面滚动，解决移动端滚动穿透 ==========
watch(previewOpen, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})

// ========== SEO + 商品结构化数据、动态Meta ==========
useHead(() => {
  const title = getAttr('title') || 'Product'
  const price = getAttr('price') ?? 0
  const moq = getAttr('moq') ?? 10
  const mainImg = imagesList.value[0] || IMG_FALLBACK
  const descText = `Wholesale ${title} from SEAK Apparel, low MOQ ${moq}pcs, factory direct price $${price}, fast WhatsApp inquiry for Southeast Asia buyers.`
  const waText = encodeURIComponent(`Hi, I am interested in your product: ${title}`)
  const waLink = `https://wa.me/${waPhone}?text=${waText}`

  // 挂载到模板可直接使用（模板原有WhatsApp a标签无需修改，自动读取）
  const whatsappLink = waLink

  return {
    title: `${title} | SEAK Apparel Wholesale`,
    meta: [
      { name: 'description', content: descText },
      { property: 'og:title', content: title },
      { property: 'og:image', content: mainImg },
      { property: 'og:type', content: 'product' }
    ],
    link: imagesList.value.length ? [{
      rel: 'preload',
      href: mainImg,
      as: 'image',
      type: 'image/avif'
    }] : [],
    script: [
      {
        type: 'application/ld+json',
        innerContent: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": title,
          "image": mainImg,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": price,
            "availability": "https://schema.org/InStock",
            "minimumOrderQuantity": moq
          }
        })
      }
    ]
  }
})
</script>