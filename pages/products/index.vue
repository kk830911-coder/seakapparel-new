<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  revalidate: 300
})

useCanonicalUrl()

const route = useRoute()
const router = useRouter()
const { strapiUrl } = useStrapi()
const pageSize = 20
const currentPage = ref(1)

const activeCategorySlug = computed(() => {
  const cat = route.query.category
  return typeof cat === 'string' ? cat : null
})
const activeCategoryName = computed(() => {
  if (!activeCategorySlug.value) return null
  const found = productCategories.find(c => c.slug === activeCategorySlug.value)
  return found?.name || null
})

const { data: responseData, pending: loading, error: fetchError } = await useFetch(`${strapiUrl}/api/products?populate=*&pagination[limit]=1000&sort=createdAt:desc`, {
  key: 'products-list'
})

const { data: catRes } = await useFetch(`${strapiUrl}/api/categories`, {
  key: 'products-categories'
})

const strapiCategories = computed(() => catRes.value?.data || [])
const allProducts = computed(() => responseData.value?.data || [])

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

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

const clearSearch = () => {
  const query = { ...route.query }
  delete query.q
  router.push({ path: '/products', query })
}

const totalPage = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const pageProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const selectCategory = (slug) => {
  currentPage.value = 1
  if (slug) {
    router.push({ path: '/products', query: { category: slug } })
  } else {
    router.push({ path: '/products' })
  }
}

watch(() => [route.query.category, route.query.q], () => { currentPage.value = 1 })

// 搜索结果页不收录，避免产生大量低质索引页
useHead({
  meta: computed(() => searchKeyword.value ? [{ name: 'robots', content: 'noindex, follow' }] : [])
})
watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

const pageTitle = computed(() => activeCategoryName.value ? `${activeCategoryName.value}` : 'Custom Sportswear Products')
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
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: activeCategorySlug.value ? `https://www.tutesports.com/products?category=${activeCategorySlug.value}` : 'https://www.tutesports.com/products' }
  ])
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 md:py-12">
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

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-4 pb-3 border-b border-gray-100">
      <button @click="selectCategory(null)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', !activeCategorySlug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">All Products</button>
      <button v-for="cat in productCategories" :key="cat.slug" @click="selectCategory(cat.slug)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeCategorySlug === cat.slug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">{{ cat.name }}</button>
    </div>

    <!-- Search results notice -->
    <div v-if="searchKeyword" class="mb-6 -mt-2 text-sm text-gray-600">
      Search results for <span class="font-semibold text-navy">“{{ searchKeyword }}”</span> — {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }} found.
      <button @click="clearSearch" class="ml-2 text-brand hover:underline font-medium">Clear search</button>
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
          <img :src="getProductImageUrl(item, strapiUrl)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" :alt="`${getTitle(item) || 'Custom Sportswear'} - TontonSports`" loading="lazy" />
          <div class="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="bg-brand text-white text-xs font-medium px-2.5 py-1 rounded-full">View Details</span>
          </div>
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

    <!-- Pagination -->
    <div v-if="totalPage > 1" class="flex justify-center items-center gap-2 mt-12">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Previous</button>
      <button v-for="page in totalPage" :key="page" @click="currentPage = page" :class="['w-10 h-10 text-sm font-medium rounded-lg border transition-colors', currentPage === page ? 'bg-brand text-white border-brand shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">{{ page }}</button>
      <button @click="currentPage++" :disabled="currentPage === totalPage" class="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Next</button>
    </div>
  </div>
</template>
