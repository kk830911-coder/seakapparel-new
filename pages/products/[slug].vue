<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute } from '#imports'

definePageMeta({
  revalidate: 300
})

useCanonicalUrl()

const route = useRoute()
const { strapiUrl } = useStrapi()

// Optimize: Use pagination limit to reduce response size
const { data: responseData } = await useFetch(() => `${strapiUrl}/api/products`, {
  query: {
    populate: '*',
    'filters[slug][$eq]': route.params.slug,
    'pagination[limit]': 1
  },
  key: `product-${route.params.slug}`
})

const product = computed(() => {
  const res = responseData.value
  if (res && Array.isArray(res.data) && res.data.length > 0) return res.data[0]
  return null
})

const activeImageIndex = ref(0)
const previewOpen = ref(false)
const previewIndex = ref(0)
const imgPreviewKey = ref(0)

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

const currentMainImageUrl = computed(() => imagesList.value[activeImageIndex.value] || '')
const previewImageUrl = computed(() => imagesList.value[previewIndex.value] || '')

const priceTiers = computed(() => getPriceTiers(product.value))
const priceFrom = computed(() => getPriceFrom(product.value))
const priceNote = computed(() => getPriceNote(product.value))
const offerRange = computed(() => getOfferRange(product.value))

useSeoMeta({
  title: () => `${getTitle(product.value) || 'Custom Sportswear'} | TontonSports`,
  ogTitle: () => `${getTitle(product.value) || 'Custom Sportswear'} - TontonSports`,
  description: () => {
    const title = getTitle(product.value) || 'Custom sportswear'
    const moq = getMoq(product.value)
    return priceFrom.value === null
      ? `Custom ${title} from TontonSports. OEM/ODM manufacturer, MOQ ${moq} pcs, free design and a detailed quote within 24 hours.`
      : `Custom ${title} from TontonSports. Reference price from $${formatPrice(priceFrom.value)}/pc, MOQ ${moq} pcs. OEM/ODM, free design, global shipping.`
  },
  ogDescription: () => `Custom ${getTitle(product.value) || 'sportswear'} at factory direct price. OEM/ODM, low MOQ, ISO certified manufacturer.`,
  ogImage: () => currentMainImageUrl.value ? getCleanImageUrl(currentMainImageUrl.value, strapiUrl) : 'https://www.tutesports.com/og-image.jpg',
  ogType: 'product',
  twitterCard: 'summary_large_image',
})

const productJsonLd = computed(() => {
  if (!product.value) return null
  const range = offerRange.value
  const node: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getTitle(product.value) || '',
    description: `Custom ${getTitle(product.value)} from TontonSports. Professional OEM/ODM sportswear manufacturer.`,
    image: currentMainImageUrl.value ? getCleanImageUrl(currentMainImageUrl.value, strapiUrl) : '',
    brand: { '@type': 'Brand', name: 'TontonSports' },
    manufacturer: { '@type': 'Organization', name: 'TontonSports' }
  }

  // 无价产品不输出 offers，避免出现 price: 0
  if (range) {
    const seller = { '@type': 'Organization', name: 'TontonSports' }
    node.offers = range.count > 1
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: formatPrice(range.low),
          highPrice: formatPrice(range.high),
          offerCount: range.count,
          availability: 'https://schema.org/InStock',
          seller
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: formatPrice(range.low),
          availability: 'https://schema.org/InStock',
          seller
        }
  }
  return node
})

useHead({
  script: computed(() => {
    const scripts: any[] = []
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
    return scripts
  })
})

const nextImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value + 1) % imagesList.value.length }
const prevImage = () => { if (imagesList.value.length > 1) activeImageIndex.value = (activeImageIndex.value - 1 + imagesList.value.length) % imagesList.value.length }
const nextPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value + 1) % imagesList.value.length; imgPreviewKey.value++ } }
const prevPreview = () => { if (imagesList.value.length > 1) { previewIndex.value = (previewIndex.value - 1 + imagesList.value.length) % imagesList.value.length; imgPreviewKey.value++ } }

const openPreview = async () => { previewIndex.value = activeImageIndex.value; imgPreviewKey.value++; await nextTick(); previewOpen.value = true }
const closePreview = async () => { previewOpen.value = false; await nextTick(); imgPreviewKey.value++ }

const renderStrapiRichTextNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => ({
    type: node.type === 'image' ? 'image' : (node.type === 'text' ? 'text' : 'block'),
    url: node.image?.url ? getCleanImageUrl(node.image.url, strapiUrl) : null,
    alt: node.image?.alternativeText || 'Product',
    content: node.text,
    tag: node.type,
    children: renderStrapiRichTextNodes(node.children || [])
  }))
}
const descriptionNodes = computed(() => renderStrapiRichTextNodes(product.value?.description || product.value?.attributes?.description))

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
      <span class="mx-2">/</span>
      <span class="text-gray-600">Product Detail</span>
    </nav>

    <div v-if="!product" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
      <p class="font-medium">Product not found</p>
      <p class="text-sm mt-1">Please return to the <NuxtLink to="/products" class="text-brand hover:underline">products page</NuxtLink>.</p>
    </div>

    <div v-else class="space-y-8 sm:space-y-12">
      <!-- Product Info -->
      <div class="grid md:grid-cols-2 gap-6 lg:gap-12">
        <!-- Image Gallery -->
        <div class="space-y-2 sm:space-y-3">
          <div class="rounded-xl overflow-hidden shadow-sm bg-gray-50 aspect-square border border-gray-100 relative group cursor-zoom-in" @touchstart="handleTouchStart" @touchend="e => handleTouchEnd(e, nextImage, prevImage)" @click="openPreview">
            <img :src="getCleanImageUrl(currentMainImageUrl, strapiUrl)" class="w-full h-full object-cover" :alt="`${getTitle(product) || 'Product'} - TontonSports`" loading="eager" fetchpriority="high" />
            <button v-if="imagesList.length > 1" @click.stop="prevImage" class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button v-if="imagesList.length > 1" @click.stop="nextImage" class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 text-white px-2 sm:px-3 py-1 text-xs rounded-full">{{ activeImageIndex + 1 }} / {{ imagesList.length }}</div>
          </div>
          <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button v-for="(url, i) in imagesList" :key="i" @click="activeImageIndex = i" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-colors" :class="activeImageIndex === i ? 'border-brand' : 'border-gray-200 hover:border-gray-300'">
              <img :src="getCleanImageUrl(url, strapiUrl)" width="64" height="64" class="w-full h-full object-cover" :alt="`${getTitle(product) || 'Product'} thumbnail ${i + 1}`" loading="lazy" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-navy mt-1 sm:mt-2">{{ getTitle(product) }}</h1>

          <!-- Price & MOQ -->
          <div class="bg-gray-50 rounded-xl p-4 sm:p-5 my-4 sm:my-6">
            <div class="flex items-baseline justify-between gap-3">
              <span class="text-gray-500 text-sm">Unit price</span>
              <span v-if="priceFrom !== null" class="text-xl sm:text-2xl font-heading font-bold text-brand whitespace-nowrap">
                <span class="text-xs sm:text-sm font-medium text-gray-500 mr-1">From</span>${{ formatPrice(priceFrom) }}<span class="text-xs sm:text-sm font-medium text-gray-500"> /pc</span>
              </span>
              <span v-else class="text-sm font-semibold text-navy">Price on request</span>
            </div>

            <div class="flex justify-between items-center mt-2">
              <span class="text-gray-500 text-sm">Minimum order</span>
              <span class="font-semibold text-navy text-sm">{{ getMoq(product) }} pcs</span>
            </div>

            <div v-if="priceTiers.length" class="mt-4 pt-4 border-t border-gray-200">
              <div class="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Quantity pricing</div>
              <div class="space-y-1.5">
                <div v-for="tier in priceTiers" :key="tier.minQty" class="flex justify-between items-baseline text-sm">
                  <span class="text-gray-600">{{ tier.label }}</span>
                  <span class="font-semibold text-navy">${{ formatPrice(tier.unitPrice) }}</span>
                </div>
              </div>
            </div>

            <p v-if="priceFrom !== null" class="text-xs leading-relaxed text-gray-400 mt-3">{{ priceNote }}</p>
          </div>

          <!-- Key Features -->
          <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
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
          <div class="border-t border-gray-100 pt-4 sm:pt-5 mb-4 sm:mb-6">
            <h3 class="font-heading font-semibold text-navy mb-2 sm:mb-3">Customization Options</h3>
            <div class="flex flex-wrap gap-1.5 sm:gap-2">
              <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Logo</span>
              <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Colors</span>
              <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Labels</span>
              <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Packaging</span>
              <span class="text-xs bg-brand/10 text-brand px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">Custom Sizes</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
            <a :href="`https://wa.me/8618271971983?text=Interested: ${getTitle(product)}`" target="_blank" class="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59z"/></svg>
              WhatsApp Inquiry
            </a>
            <NuxtLink to="/contact" class="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Send Email Inquiry
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
        <h3 class="text-base sm:text-lg font-heading font-bold text-navy mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-100">Product Description</h3>
        
        <!-- Company Profile GIFs -->
        <div class="mb-6 sm:mb-8">
          <img src="/xq_01.gif" alt="Tonton Sports - 22 Years of Experience Global Custom Sportswear Supplier" class="w-full" loading="lazy" />
          <img src="/xq_02.gif" alt="Digital Printing, UPS Sewing, Laser Cutting Production Process" class="w-full" loading="lazy" />
          <img src="/xq_03.gif" alt="Design Team, Sample Room, Sales Team" class="w-full" loading="lazy" />
          <img src="/xq_04.gif" alt="Your Service Specialist Contact Information" class="w-full" loading="lazy" />
        </div>
        
        <div class="prose max-w-none text-gray-600 text-sm sm:text-base">
          <template v-for="(node, idx) in descriptionNodes" :key="idx">
            <div v-if="node.type === 'image'" class="my-4 sm:my-6"><img :src="node.url" class="max-w-full rounded-lg" :alt="node.alt" /></div>
            <component v-else-if="node.type === 'block'" :is="node.tag === 'paragraph' ? 'p' : node.tag">
              <template v-for="(child, cIdx) in node.children" :key="cIdx">
                <img v-if="child.type === 'image'" :src="child.url" class="my-4 sm:my-6 rounded-lg" :alt="child.alt" />
                <span v-else>{{ child.content }}</span>
              </template>
            </component>
          </template>
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
  </div>
</template>

<style scoped>
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) { font-weight: 700; margin: 1.5rem 0 0.75rem; color: #0A1628; }
.prose :deep(p) { margin-bottom: 0.75rem; line-height: 1.75; }
</style>
