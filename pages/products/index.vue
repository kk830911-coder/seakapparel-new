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

const productCategories = [
  { name: 'Basketball Uniform', slug: 'basketball-uniform' },
  { name: 'Football Uniform', slug: 'football-uniform' },
  { name: 'Badminton Jersey', slug: 'badminton-jersey' },
  { name: 'Baseball Jersey', slug: 'baseball-jersey' },
  { name: 'Wrestling Singlet', slug: 'wrestling-singlet' },
  { name: 'Ice Hockey Jersey', slug: 'ice-hockey-jersey' },
  { name: 'Rugby Jersey', slug: 'rugby-jersey' },
  { name: 'American Football Jersey', slug: 'american-football-jersey' },
  { name: 'Boxing Outfit', slug: 'boxing-outfit' },
  { name: 'Sports Hoodie', slug: 'sports-hoodie' },
  { name: 'Yoga Wear', slug: 'yoga-wear' }
]

const activeCategorySlug = computed(() => {
  const cat = route.query.category
  return typeof cat === 'string' ? cat : null
})
const activeCategoryName = computed(() => {
  if (!activeCategorySlug.value) return null
  const found = productCategories.find(c => c.slug === activeCategorySlug.value)
  return found?.name || null
})

const { data: responseData, pending: loading, error: fetchError } = await useFetch(
  () => {
    const page = currentPage.value
    const cat = activeCategorySlug.value
    let url = `${strapiUrl}/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true&sort=createdAt:desc`
    if (cat) {
      url += `&filters[category][slug]=${encodeURIComponent(cat)}`
    }
    return url
  },
  { key: 'products-list' }
)

const { data: catRes } = await useFetch(`${strapiUrl}/api/categories`, {
  key: 'products-categories'
})

const strapiCategories = computed(() => catRes.value?.data || [])
const allProducts = computed(() => responseData.value?.data || [])
const totalItems = computed(() => responseData.value?.meta?.pagination?.total || 0)
const totalPage = computed(() => Math.ceil(totalItems.value / pageSize))
const pageProducts = computed(() => allProducts.value)

const selectCategory = (slug) => {
  currentPage.value = 1
  if (slug) {
    router.push({ path: '/products', query: { category: slug } })
  } else {
    router.push({ path: '/products' })
  }
}

watch(() => route.query.category, () => { currentPage.value = 1 })
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
    { property: 'og:url', content: activeCategorySlug.value ? `https://www.seakapparel.com/products?category=${activeCategorySlug.value}` : 'https://www.seakapparel.com/products' }
  ])
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 md:py-12">
    <!-- Breadcrumb & Title -->
    <div class="mb-8">
      <nav class="text-sm text-gray-400 mb-3">
        <NuxtLink to="/" class="hover:text-brand transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/products" class="hover:text-brand transition-colors">Products</NuxtLink>
        <template v-if="activeCategoryName">
          <span class="mx-2">/</span>
          <span class="text-gray-600">{{ activeCategoryName }}</span>
        </template>
      </nav>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-100">
      <button @click="selectCategory(null)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', !activeCategorySlug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">All Products</button>
      <button v-for="cat in productCategories" :key="cat.slug" @click="selectCategory(cat.slug)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeCategorySlug === cat.slug ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">{{ cat.name }}</button>
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
    <div v-else-if="allProducts.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
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
          <div class="flex justify-between items-center mb-2 sm:mb-3">
            <span class="text-brand font-bold text-xs sm:text-sm">${{ getPrice(item) }}</span>
            <span class="text-gray-400 text-xs">MOQ: {{ getMoq(item) }} pc</span>
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
