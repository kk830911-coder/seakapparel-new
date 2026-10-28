<script setup>

definePageMeta({
  revalidate: 300
})

useCanonicalUrl()

useHead({
  title: 'Custom Sportswear Manufacturer | OEM Activewear & Gym Wear',
  meta: [
    { name: 'description', content: 'TontonSports by Tonton Sportswear — 20+ years professional custom sportswear manufacturer. OEM/ODM activewear, gym wear, team uniforms. Low MOQ from 1 piece. ISO9001 & BSCI certified.' },
    { name: 'keywords', content: 'custom sportswear manufacturer, activewear OEM, gym wear supplier, custom athletic clothing, team uniform manufacturer' },
    { property: 'og:title', content: 'Custom Sportswear Manufacturer | OEM Activewear | TontonSports' },
    { property: 'og:description', content: '20+ years professional custom sportswear manufacturer. OEM/ODM, low MOQ 1pc, ISO certified. Global shipping.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tutesports.com' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "TontonSports",
        "url": "https://www.tutesports.com",
        "description": "Professional Custom Sportswear Manufacturer Since 2004",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.tutesports.com/products?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})

const { strapiUrl } = useStrapi()

const bannerImage = '/banner/banner1.jpg'

const { data: hotProductsData, pending: hotLoading } = await useFetch(`${strapiUrl}/api/products`, {
  query: { populate: 'image', 'pagination[limit]': 20, 'sort': 'createdAt:desc' },
  key: 'home-hot-products'
})
const hotProducts = computed(() => hotProductsData.value?.data || [])


const trustItems = [
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', number: '20+', label: 'Years Experience' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', number: '500+', label: 'Global Clients' },
  { icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', number: 'Multiple', label: 'Custom Processes' },
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', number: 'ISO', label: '9001 Certified' },
  { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', number: '1pc', label: 'Low MOQ' },
  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', number: '60+', label: 'Countries Served' }
]

const categories = [
  { name: 'Basketball Uniform', slug: 'basketball-uniform', img: '/category/basketball.png' },
  { name: 'Football Uniform', slug: 'football-uniform', img: '/category/football.png' },
  { name: 'Badminton Jersey', slug: 'badminton-jersey', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop&q=80' },
  { name: 'Baseball Jersey', slug: 'baseball-jersey', img: 'https://images.unsplash.com/photo-1529737857439-769e35827323?w=400&h=300&fit=crop&q=80' },
  { name: 'Wrestling Singlet', slug: 'wrestling-singlet', img: 'https://images.unsplash.com/photo-1555597673-b21d5c934865?w=400&h=300&fit=crop&q=80' },
  { name: 'Ice Hockey Jersey', slug: 'ice-hockey-jersey', img: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=400&h=300&fit=crop&q=80' },
  { name: 'Rugby Jersey', slug: 'rugby-jersey', img: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e5d?w=400&h=300&fit=crop&q=80' },
  { name: 'American Football Jersey', slug: 'american-football-jersey', img: '/category/AmericanFootball.png' },
  { name: 'Boxing Outfit', slug: 'boxing-outfit', img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop&q=80' },
  { name: 'Sports Hoodie', slug: 'sports-hoodie', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&q=80' },
  { name: 'Yoga Wear', slug: 'yoga-wear', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&q=80' }
]

const processSteps = [
  { num: '01', title: 'Inquiry', desc: 'Share your design ideas, quantities, and requirements', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { num: '02', title: 'Design Mockup', desc: 'Free digital mockup with your logo and colors', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { num: '03', title: 'Confirm Details', desc: 'Finalize fabric, size, colors, and printing method', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { num: '04', title: 'Sample', desc: 'Physical sample produced for your approval', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { num: '05', title: 'Approve', desc: 'Review sample quality, fit, and customization', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { num: '06', title: 'Production', desc: 'Bulk manufacturing with strict QC at every stage', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { num: '07', title: 'QC Inspection', desc: '100% quality check before packaging', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { num: '08', title: 'Delivery', desc: 'Fast global shipping with tracking', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' }
]

const advantages = [
  { title: '20+ Years Experience', desc: 'Established in 2004, two decades of sportswear manufacturing expertise serving global brands.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'AI Smart Factory', desc: '5,000m+ intelligent production facility with 200+ skilled workers and 20,000+ monthly output.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'Low MOQ (1 Piece)', desc: 'Start your brand with as few as 1 piece. Perfect for startups, teams, and small businesses.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { title: 'Free Design Service', desc: 'Our professional design team creates mockups at no cost. Bring your vision to life before committing.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Global Shipping', desc: 'Fast, reliable delivery to 60+ countries. DHL, FedEx, sea freight — we handle logistics.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Quality Assured', desc: 'ISO9001, BSCI, WRAP certified. Every garment undergoes strict quality inspection.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
]

const testimonials = [
  { name: 'Mike Johnson', country: 'United States', text: 'TontonSports has been our go-to manufacturer for 3 years. The quality is consistent and the design team is incredibly responsive. Our basketball jersey line has never looked better.', rating: 5 },
  { name: 'Sarah Williams', country: 'United Kingdom', text: 'Starting our fitness brand was daunting, but TontonSports made it easy. Low MOQ let us test designs without huge investment. Now we order 2,000+ pieces per season.', rating: 5 },
  { name: 'Thomas Mueller', country: 'Germany', text: 'Professional team, excellent communication, and fast turnaround. The sublimation quality on our cycling jerseys is outstanding. Highly recommended for European brands.', rating: 5 },
  { name: 'David Chen', country: 'Australia', text: 'We switched from another supplier and the difference is night and day. Better fabrics, sharper printing, and they actually care about getting the details right.', rating: 5 }
]
</script>

<template>
  <div>
    <!-- Section 1: Hero Banner -->
    <section class="relative w-full overflow-hidden">
      <div class="relative h-[45vh] min-h-[350px] md:h-[50vh] lg:h-[calc(100vw*600/1920)] lg:max-h-[600px]">
        <NuxtImg :src="bannerImage" format="avif" fallbackFormat="webp" class="w-full h-full object-cover" alt="Custom Sportswear Manufacturing" preload fetchpriority="high" />

        <!-- Hero Content Overlay -->
        <div class="absolute inset-0 flex items-start justify-center pt-2.5 md:pt-12 lg:pt-16">
          <div class="px-6 w-full text-center">
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-brand leading-tight mb-3 drop-shadow-lg">
              Your Trusted Custom Sportswear Manufacturer
            </h1>
            <p class="text-accent text-base md:text-lg lg:text-xl font-semibold mb-6 drop-shadow-md">
              OEM/ODM activewear, team uniforms & athletic clothing. From design to delivery — we bring your vision to life.
            </p>
            <div class="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <NuxtLink to="/contact" class="inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap">
                Get Free Mockup
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </NuxtLink>
              <NuxtLink to="/products" class="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap">
                Explore Products
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Trust Bar -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4">
          <div v-for="item in trustItems" :key="item.label" class="flex items-center gap-3 justify-center">
            <div class="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/></svg>
            </div>
            <div>
              <div class="text-xl font-heading font-bold text-navy">{{ item.number }}</div>
              <div class="text-xs text-gray-500">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Product Categories -->
    <section class="bg-gray-50 py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Sportswear by Category</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Custom designs for every sport. Click a category to explore our capabilities.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <NuxtLink v-for="cat in categories" :key="cat.slug" :to="`/products?category=${cat.slug}`" class="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300">
            <img :src="cat.img" :alt="`${cat.name} Custom Sportswear`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <h3 class="text-white font-heading font-semibold text-sm sm:text-lg">{{ cat.name }}</h3>
              <span class="text-white/70 text-xs sm:text-sm flex items-center gap-1 mt-1">
                View Products
                <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 4: Customization Process -->
    <section class="bg-white py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">How Custom Orders Work</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">From your initial idea to final delivery — a streamlined 8-step process designed for efficiency.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="step in processSteps" :key="step.num" class="relative bg-gray-50 rounded-xl p-6 hover:bg-brand/5 hover:shadow-md transition-all duration-300 group">
            <div class="absolute top-4 right-4 text-4xl font-heading font-black text-gray-100 group-hover:text-brand/10 transition-colors">{{ step.num }}</div>
            <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
              <svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="step.icon"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy text-lg mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
        <div class="text-center mt-10">
          <NuxtLink to="/customization" class="inline-flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors">
            Learn More About Our Process
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 5: Why Choose Us -->
    <section class="bg-navy py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Why Choose TontonSports</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">We combine two decades of manufacturing expertise with modern technology to deliver sportswear that exceeds expectations.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="adv in advantages" :key="adv.title" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="adv.icon"/></svg>
            </div>
            <h3 class="font-heading font-bold text-white text-lg mb-2">{{ adv.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: Featured Products -->
    <section class="bg-gray-50 py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-2">Featured Products</h2>
            <p class="text-gray-500">A selection of our latest custom sportswear projects.</p>
          </div>
          <NuxtLink to="/products" class="hidden md:inline-flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors">
            View All Products
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NuxtLink>
        </div>
        <div v-if="hotLoading" class="text-center py-16 text-gray-500">Loading products...</div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div v-for="item in hotProducts" :key="item.documentId || item.id" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-100">
            <NuxtLink :to="`/products/${getSlug(item)}`" class="aspect-square overflow-hidden block bg-gray-50 relative">
              <img :src="getProductImageUrl(item, strapiUrl)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" :alt="`${getTitle(item) || 'Custom Sportswear'} - TontonSports`" loading="lazy" />
            </NuxtLink>
            <div class="p-2 sm:p-4">
              <NuxtLink :to="`/products/${getSlug(item)}`" class="block">
                <h3 class="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-brand transition-colors">{{ getTitle(item) }}</h3>
              </NuxtLink>
              <div class="flex justify-between items-center mb-2">
                <span class="text-brand font-bold text-sm sm:text-lg">${{ getPrice(item) }}</span>
                <span class="text-gray-400 text-xs">MOQ: {{ getMoq(item) }} pc</span>
              </div>
              <NuxtLink :to="`/products/${getSlug(item)}`" class="block w-full text-center text-xs sm:text-sm font-medium text-brand border border-brand/20 hover:bg-brand hover:text-white py-1.5 sm:py-2 rounded-lg transition-colors">Send Inquiry</NuxtLink>
            </div>
          </div>
        </div>
        <div class="text-center mt-8 md:hidden">
          <NuxtLink to="/products" class="inline-flex items-center gap-2 text-brand font-semibold">View All Products <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 7: Testimonials -->
    <section class="bg-white py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">What Our Clients Say</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Trusted by sports brands, teams, and businesses across 60+ countries.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="t in testimonials" :key="t.name" class="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex gap-0.5 mb-4">
              <svg v-for="s in t.rating" :key="s" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
              <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">{{ t.name.charAt(0) }}</div>
              <div>
                <div class="font-semibold text-navy text-sm">{{ t.name }}</div>
                <div class="text-xs text-gray-400">{{ t.country }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
