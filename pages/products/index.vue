<script setup>
import { useRoute } from 'vue-router'

definePageMeta({
  revalidate: 300
})

useCanonicalUrl()

const route = useRoute()
const { strapiUrl } = useStrapi()
const pageSize = 20
// 页码写进 URL：可分享、刷新不丢、第 2 页起能被爬虫通过 <a> 发现
const parsePage = (v) => {
  const raw = Array.isArray(v) ? v[0] : v
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}
const currentPage = ref(parsePage(route.query.page))

// 分类改成独立 URL（/products/category/<slug>）：每个分类可被单独收录、单独缓存，
// 不再让 ?category= 十几个变体共用一份 HTML 且 canonical 互相打架。
// 旧链接（外链、广告、已收录的 ?category=）用 301 搬过去，权重不丢。
const legacyCategory = typeof route.query.category === 'string' ? route.query.category : ''
if (legacyCategory && !route.params.slug) {
  await navigateTo(`/products/category/${legacyCategory}`, { redirectCode: 301, replace: true })
}

const activeCategorySlug = computed(() => {
  const fromPath = route.params.slug
  return typeof fromPath === 'string' && fromPath ? fromPath : null
})
const activeCategoryName = computed(() => {
  if (!activeCategorySlug.value) return null
  const found = productCategories.find(c => c.slug === activeCategorySlug.value)
  return found?.name || null
})

// 不存在的分类直接返回 404，避免任意 slug 都能生成可索引的空页面
if (activeCategorySlug.value && !activeCategoryName.value) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}

const { data: responseData, pending: loading, error: fetchError } = await useFetch(`${strapiUrl}/api/products?populate=*&pagination[limit]=1000&sort=createdAt:desc`, {
  key: 'products-list'
})

// 分类导航一直用 productCategories 常量，之前额外请求的 /api/categories 从未被使用，白等一次 RTT
const allProducts = computed(() => responseData.value?.data || [])

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// 产品卡图片 alt：优先用后台填写的 Alternative text，没填才回退产品标题
const getProductImageAlt = (item) => {
  const img = item.image || item.attributes?.image
  const first = Array.isArray(img) ? img[0] : img
  const alt = first?.alternativeText || first?.attributes?.alternativeText
  return alt || `${getTitle(item) || 'Custom Sportswear'} - TontonSports`
}

// 头部搜索框跳转过来的关键词（?q=）
const searchKeyword = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

const filteredProducts = computed(() => {
  let list = allProducts.value
  if (activeCategorySlug.value) {
    list = list.filter(item => {
      const cat = item.category || item.attributes?.category
      if (!cat) return false
      const catSlug = cat.slug || toSlug(cat.name || '')
      return catSlug === activeCategorySlug.value
    })
  }
  if (searchKeyword.value) {
    const q = searchKeyword.value.toLowerCase()
    list = list.filter(item => {
      const desc = item.description || item.attributes?.description
      return (getTitle(item) || '').toLowerCase().includes(q) ||
        (typeof desc === 'string' ? desc.toLowerCase().includes(q) : false)
    })
  }
  return list
})

// 当前分类的路径前缀：分类页与总列表页共用这个文件（见 nuxt.config 的 pages:extend）
const basePath = computed(() => activeCategorySlug.value ? `/products/category/${activeCategorySlug.value}` : '/products')

// 搜索条件清除后回到当前分类，而不是掉回全站列表
const clearSearchLink = computed(() => {
  const query = { ...route.query }
  delete query.q
  delete query.category
  return { path: basePath.value, query }
})

const totalPage = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const pageProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

// 分类一律用链接（<a>），既利于爬虫也能中键新开
const categoryLink = (slug) => slug ? `/products/category/${slug}` : '/products'

// 分页链接：保留当前分类/搜索条件，page=1 时不带参数避免产生重复 URL
const pageLink = (page) => {
  const query = { ...route.query }
  delete query.page
  delete query.category
  if (page > 1) query.page = String(page)
  return { path: basePath.value, query }
}

watch(() => route.query.page, (v) => { currentPage.value = parsePage(v) })
watch(() => [route.params.slug, route.query.q], () => { currentPage.value = 1 })

// 空分类页 = 薄内容，先 noindex；等后台补上产品，ISR 刷新后会自动恢复收录
const isThinCategory = computed(() =>
  !!activeCategorySlug.value && allProducts.value.length > 0 && filteredProducts.value.length === 0
)

// 搜索结果页不收录，避免产生大量低质索引页
useHead({
  meta: computed(() => (searchKeyword.value || isThinCategory.value)
    ? [{ name: 'robots', content: 'noindex, follow' }]
    : [])
})
watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

const pageTitle = computed(() => activeCategoryName.value ? `Custom ${activeCategoryName.value} Manufacturer` : 'Custom Sportswear Products')
const pageDescription = computed(() => activeCategoryName.value
  ? `Browse our custom ${activeCategoryName.value} collection. OEM/ODM, low MOQ, factory direct pricing.`
  : 'Browse custom sportswear products — basketball jerseys, football uniforms, hockey jerseys, yoga wear. OEM/ODM, low MOQ, factory direct pricing.'
)

useHead({
  title: computed(() => pageTitle.value),
  meta: computed(() => [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: `${pageTitle.value} | TontonSports` },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:type', content: 'website' }
    // og:url 交给 useCanonicalUrl 统一输出，这里再写会覆盖成旧的 ?category= 形式
  ]),
  // 分类页补面包屑结构化数据（视觉面包屑本来就有，之前缺对应 JSON-LD）
  script: computed(() => {
    if (!activeCategoryName.value) return []
    const items = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tutesports.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.tutesports.com/products' },
      {
        '@type': 'ListItem',
        position: 3,
        name: activeCategoryName.value,
        item: `https://www.tutesports.com/products/category/${activeCategorySlug.value}`
      }
    ]
    return [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
      })
    }]
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-3 py-6 md:py-12">
    <!-- Breadcrumb & Title -->
    <div class="mb-4">
      <nav class="text-sm text-gray-400 mb-2">
        <NuxtLink to="/" class="hover:text-brand transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/products" class="hover:text-brand transition-colors">Products</NuxtLink>
        <template v-if="activeCategoryName">
          <span class="mx-2">/</span>
          <span class="text-gray-600">{{ activeCategoryName }}</span>
        </template>
      </nav>
      <h1 class="text-xl md:text-2xl font-heading font-bold text-navy mb-2 text-center">
        {{ activeCategoryName ? `Custom ${activeCategoryName} Manufacturer` : 'Custom Sportswear Products' }}
      </h1>
      <p class="text-sm text-gray-500 text-center">
        {{ activeCategoryName
          ? `Sublimation printing, OEM/ODM production, low MOQ from 1 piece, free design.`
          : 'OEM/ODM custom sportswear — low MOQ from 1 piece, free design, global shipping.' }}
      </p>
    </div>

    <!-- Category Filter：每个分类都是真实 URL，可被收录、可分享 -->
    <div class="flex flex-wrap gap-2 mb-4 pb-3 border-b border-gray-100">
      <NuxtLink to="/products" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', !activeCategorySlug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">All Products</NuxtLink>
      <NuxtLink v-for="cat in productCategories" :key="cat.slug" :to="categoryLink(cat.slug)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeCategorySlug === cat.slug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">{{ cat.name }}</NuxtLink>
    </div>

    <!-- Search results notice -->
    <div v-if="searchKeyword" class="mb-6 -mt-2 text-sm text-gray-600">
      Search results for <span class="font-semibold text-navy">“{{ searchKeyword }}”</span> — {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }} found.
      <NuxtLink :to="clearSearchLink" class="ml-2 text-brand hover:underline font-medium">Clear search</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full mb-4"></div>
      <p>Loading products...</p>
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="text-center py-10 text-red-500 bg-red-50 rounded-xl p-6">
      <p class="font-medium">Unable to load products</p>
      <p class="text-sm mt-1">Please refresh the page or <NuxtLink to="/contact" class="text-brand hover:underline">contact us</NuxtLink> directly.</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
      <p class="text-lg font-medium mb-2">No products found in this category</p>
      <p class="text-sm">Try selecting a different category or <NuxtLink to="/contact" class="text-brand hover:underline">contact us</NuxtLink> for custom orders.</p>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <div v-for="item in pageProducts" :key="item.id" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-100">
        <NuxtLink :to="`/products/${getSlug(item) || item.id}`" class="aspect-square overflow-hidden block bg-gray-50 relative">
          <NuxtImg :src="getProductImageUrl(item, strapiUrl)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" :alt="getProductImageAlt(item)" width="600" height="600" loading="lazy" decoding="async" />
        </NuxtLink>
        <div class="p-2 sm:p-3 flex flex-col">
          <NuxtLink :to="`/products/${getSlug(item) || item.id}`" class="block">
            <h3 class="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-brand transition-colors">{{ getTitle(item) }}</h3>
          </NuxtLink>
          <div class="flex justify-between items-baseline mb-2 sm:mb-3 gap-1">
            <span v-if="hasPrice(item)" class="text-brand font-bold text-xs sm:text-sm whitespace-nowrap">
              <span class="font-medium text-gray-400">From</span> ${{ formatPrice(getPriceFrom(item)) }}
            </span>
            <span v-else class="text-navy font-semibold text-xs sm:text-sm">Price on request</span>
            <span class="text-gray-400 text-xs whitespace-nowrap">MOQ {{ getMoq(item) }}</span>
          </div>
          <NuxtLink :to="`/products/${getSlug(item) || item.id}`" class="block w-full text-center text-xs font-medium text-brand border border-brand/20 hover:bg-brand hover:text-white py-1.5 sm:py-2 rounded-lg transition-colors">Send Inquiry</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pagination：用链接而不是按钮，第 2 页以后才能被爬虫顺着 <a> 抓到 -->
    <div v-if="totalPage > 1" class="flex justify-center items-center gap-2 mt-12">
      <NuxtLink v-if="currentPage > 1" :to="pageLink(currentPage - 1)" rel="prev" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Previous</NuxtLink>
      <span v-else class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed">Previous</span>

      <NuxtLink v-for="page in totalPage" :key="page" :to="pageLink(page)" :aria-current="currentPage === page ? 'page' : undefined" :class="['w-10 h-10 inline-flex items-center justify-center text-sm font-medium rounded-lg border transition-colors', currentPage === page ? 'bg-brand text-white border-brand shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">{{ page }}</NuxtLink>

      <NuxtLink v-if="currentPage < totalPage" :to="pageLink(currentPage + 1)" rel="next" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Next</NuxtLink>
      <span v-else class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed">Next</span>
    </div>
  </div>
</template>
