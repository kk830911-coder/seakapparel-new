<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute } from '#imports'

definePageMeta({
  revalidate: 300
})

useCanonicalUrl()

const route = useRoute()
const { strapiUrl } = useStrapi()

const baseQuery = {
  'filters[slug][$eq]': route.params.slug,
  'pagination[limit]': 1
}

const { data: responseData, error: productError } = await useFetch(`${strapiUrl}/api/products`, {
  query: {
    ...baseQuery,
    'populate[image]': true,
    'populate[priceTiers]': true,
    'populate[specRows]': true,
    'populate[sizeChart]': true,
    'populate[detailImages]': true,
    'populate[skuImages]': true,
    'populate[video]': true,
    'populate[category][populate][specRows]': true
  },
  key: `product-${route.params.slug}`
})

// 后端还没部署新字段（specRows / sizeChart / detailImages）时 Strapi 会返回 400，
// 这里回退到旧的基础字段，避免整个产品页在后端升级前变成 404
const hasProductData = () => !!(responseData.value && responseData.value.data && responseData.value.data.length)

if (productError.value || !hasProductData()) {
  const { data: legacyData } = await useFetch(`${strapiUrl}/api/products`, {
    query: { ...baseQuery, populate: '*' },
    key: `product-legacy-${route.params.slug}`
  })
  if (legacyData.value && legacyData.value.data && legacyData.value.data.length) {
    responseData.value = legacyData.value
  }
}

// 全站共用区块（工艺 / 认证 / 客户 / 工厂 / 物流 / 条款 / FAQ）
const { blocks: globalBlocks } = await useGlobalProductBlocks()

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) return res.data[0]
  return null
})

// 产品不存在时返回真正的 404，避免软 404 被 Google 判为低质页
const event = useRequestEvent()
if (!product.value && event) setResponseStatus(event, 404)

const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)
const activeSkuIndex = ref(-1)
const sizeChartZoomOpen = ref(false)

// 全站共用工厂视频（放前端 public/videos/factory.mp4，走 Vercel 边缘 CDN，点击才加载）
const FACTORY_VIDEO_SRC = '/videos/factory.mp4'
const factoryVideoVisible = ref(true)
const onFactoryVideoError = () => (factoryVideoVisible.value = false)

const imagesList = computed(() => {
  const data = product.value
  if (!data) return []
  let list = []
  const imgData = data.image || data.attributes?.image
  const imagesData = data.images || data.attributes?.images
  if (imgData) Array.isArray(imgData) ? list.push(...imgData) : list.push(imgData)
  if (imagesData && Array.isArray(imagesData)) list.push(...imagesData)
  return list.map(img => (typeof img === 'string' ? img : (img.url || img.attributes?.url))).filter(Boolean)
})

// 产品视频（单视频字段，放在图片列表末尾作为一个可选项）
const videoUrl = computed(() => {
  const v = product.value?.video || product.value?.attributes?.video
  const raw = v?.url || v?.attributes?.url || (typeof v === 'string' ? v : '')
  return raw ? getCleanImageUrl(raw, strapiUrl) : ''
})

// 画廊条目：视频固定在第一位，图片随后（不同产品主图数量不一样）
const galleryItems = computed(() => {
  const items = imagesList.value.map(u => ({ type: 'image', url: u, poster: '' }))
  if (videoUrl.value) items.unshift({ type: 'video', url: videoUrl.value, poster: items[0]?.url || '' })
  return items
})
const currentItem = computed(() => galleryItems.value[activeImageIndex.value] || { type: 'image', url: '', poster: '' })

// SKU 颜色图（后台 skuImages，点击切换主图预览）
const skuImages = computed(() => getMediaList(product.value?.skuImages, strapiUrl))

// 当前主图：选中 SKU 时显示 SKU 图，否则显示画廊当前项
const mainImageUrl = computed(() => {
  if (activeSkuIndex.value >= 0 && skuImages.value[activeSkuIndex.value]) return skuImages.value[activeSkuIndex.value].url
  return currentItem.value.url
})
const selectSku = (i) => { activeSkuIndex.value = activeSkuIndex.value === i ? -1 : i }
const selectGalleryItem = (i) => { activeImageIndex.value = i; activeSkuIndex.value = -1 }

const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

const priceTiers = computed(() => getPriceTiers(product.value))
const priceFrom = computed(() => getPriceFrom(product.value))
const priceNote = computed(() =>
  priceFrom.value === null
    ? 'Final price depends on fabric, print method and quantity. Send us your requirements for a detailed quote within 24 hours.'
    : getPriceNote(product.value)
)
const offerRange = computed(() => getOfferRange(product.value))

// ---------- 详情区数据（参数表继承：产品 → 分类 → 全站默认） ----------
const specRows = computed(() => resolveSpecRows(product.value, globalBlocks.value))
const craft = computed(() => resolveCraft(product.value, globalBlocks.value, strapiUrl))
const sizeChartUrl = computed(() => getMediaUrl(product.value?.sizeChart, strapiUrl))
const detailShots = computed(() => getMediaList(product.value?.detailImages, strapiUrl))
const tradeTerms = computed(() => globalBlocks.value?.tradeTerms || '')

const certifications = computed(() =>
  (globalBlocks.value?.certifications || [])
    .map(c => ({
      name: c?.name,
      desc: c?.desc,
      issuer: c?.issuer,
      validUntil: c?.validUntil,
      image: getMediaUrl(c?.image, strapiUrl)
    }))
    .filter(c => !!c.name)
)

const clients = computed(() =>
  (globalBlocks.value?.clients || [])
    .map(c => ({ name: c?.name, image: getMediaUrl(c?.image, strapiUrl) }))
    .filter(c => !!c.name)
)

const factoryShots = computed(() =>
  (globalBlocks.value?.factoryShots || [])
    .map(s => ({ url: getMediaUrl(s?.image, strapiUrl), alt: s?.caption || '' }))
    .filter(s => !!s.url)
)

const infoBlocks = computed(() =>
  (globalBlocks.value?.infoBlocks || [])
    .map(b => ({ title: b?.title, body: b?.body, images: getMediaList(b?.images, strapiUrl) }))
    .filter(b => !!b.title && (b.body || b.images.length))
)

const detailFaqs = computed(() =>
  (globalBlocks.value?.detailFaqs || [])
    .map(q => ({ question: q?.question, answer: q?.answer }))
    .filter(q => !!q.question && !!q.answer)
)

const hasSharedBlocks = computed(
  () => !!craft.value.body || craft.value.images.length > 0 || certifications.value.length > 0 ||
    clients.value.length > 0 || factoryShots.value.length > 0 || infoBlocks.value.length > 0
)

const anchorSections = computed(() => {
  const list = []
  if (specRows.value.length) list.push({ id: 'specs', label: 'Specifications' })
  if (hasDescription.value) list.push({ id: 'description', label: 'Description' })
  if (detailShots.value.length) list.push({ id: 'gallery', label: 'Close-ups' })
  if (craft.value.body || craft.value.images.length) list.push({ id: 'craft', label: 'Craft & Fabric' })
  if (certifications.value.length) list.push({ id: 'certifications', label: 'Certifications' })
  if (clients.value.length) list.push({ id: 'clients', label: 'Our Clients' })
  if (factoryShots.value.length) list.push({ id: 'factory', label: 'Factory' })
  if (infoBlocks.value.length) list.push({ id: 'logistics', label: 'Shipping' })
  if (tradeTerms.value || detailFaqs.value.length) list.push({ id: 'terms', label: 'Terms & FAQ' })
  return list
})

// 阶梯卡数量区间文案
function tierRange(tier) {
  return tier.maxQty ? `${tier.minQty}–${tier.maxQty} pieces` : `≥${tier.minQty} pieces`
}

// 价格拆成 元/分 两段：$5.9 → { dollars: '5', cents: '90' }；整数 $5 → { dollars: '5', cents: '' }
function splitPrice(v) {
  const n = Number(v)
  if (!isFinite(n)) return { dollars: String(v), cents: '' }
  const cents = Math.round((n - Math.floor(n)) * 100)
  return { dollars: String(Math.floor(n)), cents: cents ? String(cents).padStart(2, '0') : '' }
}

useSeoMeta({
  // 不要手写 "| TontonSports"：nuxt.config 的 titleTemplate 会自动追加，否则线上会出现两个品牌名
  title: () => (getTitle(product.value) || 'Custom Sportswear').trim(),
  ogTitle: () => `${(getTitle(product.value) || 'Custom Sportswear').trim()} - TontonSports`,
  description: () => {
    const title = (getTitle(product.value) || 'Custom sportswear').trim()
    const moq = getMoq(product.value)
    return priceFrom.value === null
      ? `Custom ${title} from TontonSports. OEM/ODM manufacturer, MOQ ${moq} pcs, free design and a detailed quote within 24 hours.`
      : `Custom ${title} from TontonSports. Reference price from $${formatPrice(priceFrom.value)}/pc, MOQ ${moq} pcs. OEM/ODM, free design, global shipping.`
  },
  ogDescription: () => `Custom ${getTitle(product.value) || 'sportswear'} at factory direct price. OEM/ODM, low MOQ, ISO certified manufacturer.`,
  ogImage: () => imagesList.value[0] ? getCleanImageUrl(imagesList.value[0], strapiUrl) : 'https://www.tutesports.com/og-image.jpg',
  ogType: 'product',
  twitterCard: 'summary_large_image',
})

const productJsonLd = computed(() => {
  if (!product.value) return null
  const range = offerRange.value
  const node = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: (getTitle(product.value) || '').trim(),
    description: `Custom ${(getTitle(product.value) || '').trim()} from TontonSports. Professional OEM/ODM sportswear manufacturer.`,
    // 多图有助于 Google 图片搜索与商品富摘要
    image: imagesList.value.slice(0, 6).map(u => getCleanImageUrl(u, strapiUrl)).filter(Boolean),
    url: `https://www.tutesports.com/products/${route.params.slug}`,
    brand: { '@type': 'Brand', name: 'TontonSports', url: 'https://www.tutesports.com' },
    manufacturer: { '@type': 'Organization', name: 'TontonSports', url: 'https://www.tutesports.com' }
  }

  // 参数表同步进结构化数据，让 Google 能读到具体规格
  if (specRows.value.length) {
    node.additionalProperty = specRows.value.map(row => ({
      '@type': 'PropertyValue',
      name: row.label,
      value: row.value
    }))
  }

  // 无价产品不输出 offers，避免出现 price: 0
  if (range) {
    const seller = { '@type': 'Organization', name: 'TontonSports', url: 'https://www.tutesports.com' }
    const productUrl = `https://www.tutesports.com/products/${route.params.slug}`
    node.offers = range.count > 1
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: formatPrice(range.low),
          highPrice: formatPrice(range.high),
          offerCount: range.count,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          url: productUrl,
          seller
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: formatPrice(range.low),
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          url: productUrl,
          seller
        }
  }
  return node
})

useHead({
  script: computed(() => {
    const scripts = []
    if (productJsonLd.value) {
      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(productJsonLd.value)
      })
    }
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.tutesports.com"
        }, {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://www.tutesports.com/products"
        }, {
          "@type": "ListItem",
          "position": 3,
          "name": getTitle(product.value) || 'Product Detail',
          "item": `https://www.tutesports.com/products/${route.params.slug}`
        }]
      })
    })
    // 详情区 FAQ（有内容才输出，避免出现空 mainEntity）
    if (detailFaqs.value.length) {
      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": detailFaqs.value.map(q => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": { "@type": "Answer", "text": q.answer }
          }))
        })
      })
    }
    return scripts
  })
})

const nextImage = () => { activeSkuIndex.value = -1; if (galleryItems.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % galleryItems.value.length }
const prevImage = () => { activeSkuIndex.value = -1; if (galleryItems.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + galleryItems.value.length) % galleryItems.value.length }
const nextPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value + 1) % imagesList.value.length; imgPreviewKey.value++ } }
const prevPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length; imgPreviewKey.value++ } }

const openPreview = async () => { previewIndex.value = activeImageIndex.value; imgPreviewKey.value++; await nextTick(); previewOpen.value = true }
const closePreview = async () => { previewOpen.value = false; await nextTick(); imgPreviewKey.value++ }

// Strapi blocks 节点 → 真实 HTML 标签（heading→h1~h6、list→ul/ol、list-item→li、quote→blockquote）
const blockTagMap = (node) => {
  switch (node.type) {
    case 'paragraph': return 'p'
    // 详情页已有产品标题作为唯一 H1，CMS 里的标题最低降为 H2，避免一页多个 H1
    case 'heading': return `h${Math.min(Math.max(Number(node.level) || 2, 2), 6)}`
    case 'list': return node.format === 'ordered' ? 'ol' : 'ul'
    case 'list-item': return 'li'
    case 'quote': return 'blockquote'
    case 'code': return 'pre'
    default: return node.type
  }
}
// 行内文本：按后台设置的加粗/斜体/下划线/删除线/代码映射标签
const inlineTagMap = (node) => {
  if (node.code) return 'code'
  if (node.bold) return 'strong'
  if (node.italic) return 'em'
  if (node.underline) return 'u'
  if (node.strikethrough) return 's'
  return 'span'
}
const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => {
    if (node.type === 'image') {
      return {
        type: 'image',
        url: node.image?.url ? getCleanImageUrl(node.image.url, strapiUrl) : null,
        alt: node.image?.alternativeText || 'Product',
        content: node.text, tag: 'p', children: []
      }
    }
    return {
      type: node.type === 'text' ? 'text' : 'block',
      url: null,
      alt: '',
      content: node.text,
      tag: node.type === 'text' ? inlineTagMap(node) : blockTagMap(node),
      children: renderStrapiRichTextNodes(node.children || [])
    }
  })
}
const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))
const hasDescription = computed(() => descriptionNodes.value.length > 0)

let touchStartX = 0
const handleTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX }
const handleTouchEnd = (e, next, prev) => {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 50) diff < 0 ? next() : prev()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
    <!-- Breadcrumb -->
    <nav class="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
      <NuxtLink to="/" class="hover:text-brand transition-colors">Home</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/products" class="hover:text-brand transition-colors">Products</NuxtLink>
      <template v-if="product">
        <template v-if="product.category?.name">
          <span class="mx-2">/</span>
          <NuxtLink :to="`/products?category=${product.category.slug}`" class="hover:text-brand transition-colors">{{ product.category.name }}</NuxtLink>
        </template>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ getTitle(product) }}</span>
      </template>
    </nav>

    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      <p class="font-medium">Product not found</p>
      <p class="text-sm mt-1">Please return to the <NuxtLink to="/products" class="text-brand hover:underline">products page</NuxtLink>.</p>
    </div>

    <div v-else class="space-y-8 sm:space-y-12">
      <!-- Product Info -->
      <div class="grid md:grid-cols-2 gap-3 lg:gap-6 items-stretch">
        <!-- Image Gallery -->
        <div class="space-y-2 sm:space-y-3">
          <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-300 relative group" :class="currentItem.type === 'image' && activeSkuIndex < 0 ? 'cursor-zoom-in' : ''" @touchstart="handleTouchStart" @touchend="e => handleTouchEnd(e, nextImage, prevImage)" @click="currentItem.type === 'image' && activeSkuIndex < 0 && openPreview()">
            <video v-if="currentItem.type === 'video'" :key="currentItem.url" :src="currentItem.url" :poster="currentItem.poster ? getCleanImageUrl(currentItem.poster, strapiUrl) : undefined" controls playsinline preload="metadata" class="w-full h-full object-contain bg-black"></video>
            <img v-else :src="getCleanImageUrl(mainImageUrl, strapiUrl)" class="w-full h-full object-cover" :alt="`${getTitle(product) || 'Product'} - TontonSports`" loading="eager" fetchpriority="high" />
            <button v-if="galleryItems.length > 1" @click.stop="prevImage" class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button v-if="galleryItems.length > 1" @click.stop="nextImage" class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 text-white px-2 sm:px-3 py-1 text-xs rounded-full">{{ activeImageIndex + 1 }} / {{ galleryItems.length }}</div>
          </div>
          <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button v-for="(item, i) in galleryItems" :key="i" @click="selectGalleryItem(i)" class="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-colors" :class="activeSkuIndex < 0 && activeImageIndex === i ? 'border-brand' : 'border-gray-200 hover:border-gray-300'">
              <img :src="getCleanImageUrl(item.type === 'video' ? item.poster : item.url, strapiUrl)" width="64" height="64" class="w-full h-full object-cover" :alt="`${getTitle(product) || 'Product'} thumbnail ${i + 1}`" loading="lazy" />
              <span v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <!-- 产品信息大卡片：标题 / 价格 / SKU / 定制信息，横线分割（类国际站样式） -->
          <div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm mb-2 sm:mb-3 flex-1">
            <h1 class="text-lg font-bold text-[#222222]">{{ getTitle(product) }}</h1>

            <!-- 价格 -->
            <div class="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <div v-if="priceTiers.length" class="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3">
                <div v-for="tier in priceTiers" :key="tier.minQty">
                  <div class="text-navy whitespace-nowrap">
                    <span class="text-sm sm:text-base align-top font-semibold">$</span><span class="font-heading font-bold text-xl sm:text-2xl">{{ splitPrice(tier.unitPrice).dollars }}</span><span v-if="splitPrice(tier.unitPrice).cents" class="text-sm sm:text-base align-top font-semibold">{{ splitPrice(tier.unitPrice).cents }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5">{{ tierRange(tier) }}</div>
                </div>
              </div>
              <div v-else class="flex justify-between items-center">
                <span class="text-gray-500 text-sm">Unit price</span>
                <span class="text-sm font-semibold text-navy">Price on request</span>
              </div>

              <p class="text-xs leading-relaxed text-gray-400 mt-3">{{ priceNote }}</p>

              <div v-if="sizeChartUrl" class="mt-2 flex justify-end">
                <button @click="sizeChartZoomOpen = true" class="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark">
                  View size chart
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
            </div>

            <!-- SKU 色卡（颜色分类，后台 skuImages 上传，点击在上方主图区预览） -->
            <div v-if="skuImages.length" class="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <h3 class="font-heading font-semibold text-navy mb-2">Color / SKU</h3>
              <div class="flex flex-wrap gap-2">
                <button v-for="(sku, i) in skuImages" :key="i" @click="selectSku(i)" class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden transition-colors" :class="activeSkuIndex === i ? 'border-brand' : 'border-gray-200 hover:border-gray-300'" :title="sku.alt || 'Color option'">
                  <img :src="sku.url" class="w-full h-full object-cover" :alt="sku.alt || 'Color option'" loading="lazy" />
                </button>
              </div>
            </div>

            <!-- 定制信息 -->
            <div class="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div class="space-y-2 sm:space-y-3">
              <h3 class="font-heading font-semibold text-navy">Key Features</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Custom Design & Logo
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Sublimation / Screen Print
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Quick-dry & Breathable
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Custom Size & Label
                </div>
              </div>
            </div>

            <!-- Customization Options -->
            <div class="border-t border-gray-100 pt-4 sm:pt-5 mt-4 sm:mt-5">
              <h3 class="font-heading font-semibold text-navy mb-2 sm:mb-3">Customization Options</h3>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Logo</span>
                <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Colors</span>
                <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Labels</span>
                <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Packaging</span>
                <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Sizes</span>
              </div>
            </div>
          </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
            <a :href="`https://wa.me/8618271971983?text=Interested: ${getTitle(product)}`" target="_blank" class="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59z"/></svg>
              WhatsApp Inquiry
            </a>
            <NuxtLink :to="`/contact?product=${getSlug(product)}&title=${encodeURIComponent(getTitle(product) || '')}`" class="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Send Email Inquiry
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ===== 详情区（与顶部同宽，共用块来自 Strapi，后台一次维护全站生效） ===== -->
      <div>
        <DetailAnchorNav :sections="anchorSections" />

        <!-- 全站共用工厂视频：背景卡片与页面同宽，preload=none + 海报图，点击才加载 -->
        <div v-if="factoryVideoVisible" class="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
          <video
            :src="FACTORY_VIDEO_SRC"
            :poster="factoryShots[0]?.url"
            controls
            playsinline
            preload="none"
            class="w-full aspect-video rounded-lg bg-black object-contain"
            @error="onFactoryVideoError"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div class="space-y-5 sm:space-y-7 pt-6">
          <!-- 1. 核心参数表 -->
          <section v-if="specRows.length" id="specs" class="scroll-mt-[170px]">
            <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4">Technical Specifications</h2>
            <DetailSpecTable :rows="specRows" />
          </section>

          <!-- 2. 产品描述（单品独有，后台 product.description） -->
          <section v-if="hasDescription" id="description" class="scroll-mt-[170px] bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-100">Product Description</h2>
            <div class="prose max-w-none text-gray-600 text-sm sm:text-base">
              <RichTextNode v-for="(node, idx) in descriptionNodes" :key="idx" :node="node" />
              <!-- 尺码表图片：直接展示，点击放大查看原图 -->
              <div v-if="sizeChartUrl" class="mt-5">
                <img :src="sizeChartUrl" @click="sizeChartZoomOpen = true" class="w-full rounded-lg border border-gray-100 cursor-zoom-in" alt="Size chart" loading="lazy" />
                <p class="text-xs text-gray-400 text-center mt-2">Click the image to view full size</p>
              </div>
            </div>
          </section>

          <!-- 3. 细节实拍（单品独有，后台 product.detailImages） -->
          <section v-if="detailShots.length" id="gallery" class="scroll-mt-[170px]">
            <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4">Product Details & Close-ups</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <img
                v-for="shot in detailShots"
                :key="shot.url"
                :src="shot.url"
                :alt="shot.alt || `${getTitle(product)} detail`"
                class="w-full h-48 sm:h-56 object-cover rounded-xl"
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          <!-- 4. 全站共用区块：工艺面料 / 认证 / 客户 / 工厂 / 物流 -->
          <ProductSharedBlocks
            v-if="hasSharedBlocks"
            :craft="craft"
            :certifications="certifications"
            :clients="clients"
            :factory-shots="factoryShots"
            :info-blocks="infoBlocks"
          />

          <!-- 5. 交易条款 + FAQ（CTA 统一用页脚那条，不在页内重复） -->
          <section v-if="tradeTerms || detailFaqs.length" id="terms" class="scroll-mt-[170px] space-y-6">
            <div v-if="tradeTerms">
              <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-3">Trade Terms</h2>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ tradeTerms }}</p>
            </div>

            <div v-if="detailFaqs.length">
              <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4">FAQ</h2>
              <DetailFaq :items="detailFaqs" />
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Fullscreen Preview -->
    <div v-if="previewOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" @click="closePreview" @touchstart="handleTouchStart" @touchend="e => handleTouchEnd(e, nextPreview, prevPreview)">
      <button @click.stop="prevPreview" class="absolute left-2 sm:left-4 text-white text-3xl sm:text-4xl">
        <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <img :key="imgPreviewKey" :src="getCleanImageUrl(previewImageUrl, strapiUrl)" class="max-w-[95vw] max-h-[90vh] object-contain" :alt="`${getTitle(product) || 'Product'} preview`" />
      <button @click.stop="nextPreview" class="absolute right-2 sm:right-4 text-white text-3xl sm:text-4xl">
        <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
      <button @click.stop="closePreview" class="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-2xl sm:text-3xl">
        <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div class="absolute bottom-4 sm:bottom-6 text-white text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">{{ previewIndex + 1 }} / {{ imagesList.length }}</div>
    </div>

    <!-- Size Chart Zoom -->
    <div v-if="sizeChartZoomOpen" class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" @click="sizeChartZoomOpen = false">
      <img :src="sizeChartUrl" class="max-w-[95vw] max-h-[90vh] object-contain" alt="Size chart full size" />
      <button @click.stop="sizeChartZoomOpen = false" class="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-2xl sm:text-3xl">
        <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(h1) { font-size: 1.75rem; font-weight: 700; margin: 1.75rem 0 0.875rem; color: #0A1628; line-height: 1.3; }
.prose :deep(h2) { font-size: 1.375rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #0A1628; line-height: 1.35; }
.prose :deep(h3), .prose :deep(h4), .prose :deep(h5), .prose :deep(h6) { font-size: 1.125rem; font-weight: 600; margin: 1.25rem 0 0.625rem; color: #0A1628; }
.prose :deep(p) { margin-bottom: 0.75rem; line-height: 1.75; }
.prose :deep(ul), .prose :deep(ol) { margin: 0 0 1rem; padding-left: 1.5rem; }
.prose :deep(ul) { list-style-type: disc; }
.prose :deep(ol) { list-style-type: decimal; }
.prose :deep(li) { margin-bottom: 0.5rem; line-height: 1.75; }
.prose :deep(blockquote) { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #4b5563; font-style: italic; margin: 1rem 0; }
.prose :deep(strong) { font-weight: 700; color: #111827; }
.prose :deep(pre) { background: #f3f4f6; border-radius: 0.5rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
.prose :deep(code) { font-family: ui-monospace, monospace; font-size: 0.9em; }
</style>
