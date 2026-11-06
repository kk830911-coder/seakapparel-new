<script setup>
useCanonicalUrl()

useHead({
  title: 'About Us | 20+ Years Sportswear Manufacturer',
  meta: [
    { name: 'description', content: 'Tonton Sports (Shenzhen) Co., Ltd. — manufacturing since 2002, entity incorporated 2008. Group factory in Hubei, 5,000m+ facility, 150+ staff. SEDEX SMETA 4-Pillar audited. Serving 500+ brands in 60+ countries.' },
    { name: 'keywords', content: 'sportswear manufacturer China, activewear factory, SEDEX SMETA audited sportswear, Tonton Sports Shenzhen, OEM factory China' },
    { property: 'og:title', content: 'About TontonSports | 20+ Years Sportswear Manufacturer' },
    { property: 'og:description', content: 'Manufacturing since 2002, entity incorporated 2008. SEDEX SMETA 4-Pillar audited factory serving 500+ brands in 60+ countries.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tutesports.com/about' }
  ]
})

const stats = [
  { number: '20+', label: 'Years in Business', sub: 'Manufacturing since 2002' },
  { number: '500+', label: 'Global Clients', sub: '60+ Countries' },
  { number: '150+', label: 'Staff Group-wide', sub: '70 at Hubei factory' },
  { number: '20,000+', label: 'Monthly Output', sub: 'Pieces per Month' }
]

// 只展示当前可核验的合规事实：过期证书与无编号的认证一律不写
const certifications = [
  { name: 'SEDEX SMETA', desc: '4-Pillar audit: Labour Standards, Health & Safety, Environment, Business Ethics', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Benchmarks Audited', desc: 'Audited at our Hubei manufacturing base, April 2025', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Intertek Tested', desc: 'Third-party fabric & garment test reports on request', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Verified by SGS Group', desc: 'SGS audited supplier on Alibaba International. SGS No. 485217897_P+T · Valid until 27 Jan 2027', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { name: 'Verified Entity', desc: 'Contracts signed with Tonton Sports (Shenzhen) Co., Ltd.', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
]

// 集团结构：三家公司都是独立法人，都能对外签约；网站默认以深圳公司为主体
const groupEntities = [
  {
    badge: 'Contracting entity',
    badgeClass: 'bg-brand/10 text-brand',
    name: 'Tonton Sports (Shenzhen) Co., Ltd.',
    cn: '图腾体育用品（深圳）有限公司',
    location: 'Pinghu, Longgang, Shenzhen',
    role: 'Our business hub and the company named on your contract and invoice. Handles global sales, product design, merchandising, order coordination and export documentation.',
    meta: 'Incorporated 2008 · Credit code 91440300678591414G',
    icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 12h2m-2 4h2m2-4h2m-2 4h2'
  },
  {
    badge: 'Manufacturing',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    name: 'Tonton Sportswear (Hubei) Co., Ltd.',
    cn: '图腾体育用品（湖北）有限公司',
    location: 'Xiantao, Hubei',
    role: 'Our 5,000m+ production base: sublimation printing, laser cutting, cut-and-sew, embroidery and packing, staffed by 70+ operators on flexible lines for low-MOQ and repeat orders.',
    meta: 'Incorporated 2023 · SEDEX SMETA 4-Pillar audited, April 2025',
    icon: 'M3 21h18M4 21V10l5 3V10l5 3V7l6 4v10'
  },
  {
    badge: 'Own brand',
    badgeClass: 'bg-indigo-50 text-indigo-700',
    name: 'Tute Outdoor Sports Goods (Hubei) Co., Ltd.',
    cn: '图特户外体育用品（湖北）有限公司',
    location: 'Xiantao, Hubei',
    role: 'Our own-brand operations for functional outdoor apparel and gear, running our direct-to-consumer store and overseas channels on the back of the same group supply chain.',
    meta: 'Incorporated 2026',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18 15 15 0 010-18'
  }
]

const factoryAreas = [
  { src: '/factory/01Imported Large Format Digital Inkjet Printer.png', alt: 'Imported Large Format Digital Inkjet Printer', label: 'Digital Printing' },
  { src: '/factory/02Dye Sublimation Transfer Workshop.png', alt: 'Dye Sublimation Transfer Workshop', label: 'Dye Sublimation' },
  { src: '/factory/03Laser Cutting Workshop.png', alt: 'Laser Cutting Workshop', label: 'Laser Cutting' },
  { src: '/factory/04Hanger Sewing Workshop.png', alt: 'Hanger Sewing Workshop', label: 'Hanger Sewing' },
  { src: '/factory/05Pressing Workshop.png', alt: 'Pressing Workshop', label: 'Pressing' },
  { src: '/factory/06Embroidery Workshop.png', alt: 'Embroidery Workshop', label: 'Embroidery' }
]

const milestones = [
  { year: '2002', event: 'Predecessor factory founded in Shenzhen' },
  { year: '2008', event: 'Expanded to 2,000m+ factory, 50+ workers' },
  { year: '2015', event: 'Launched sublimation printing division' },
  { year: '2018', event: 'Reached 300+ global clients milestone' },
  { year: '2020', event: 'Upgraded to AI-powered smart factory' },
  { year: '2023', event: 'Hubei manufacturing base opened, 5,000m+ facility' },
  { year: '2025', event: 'Serving 500+ brands across 60+ countries' }
]

// 工厂概览视频（32MB）：点击才加载，避免拖慢页面首屏
const overviewPlaying = ref(false)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy-light py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-3 text-center">
        <h1 class="text-3xl md:text-5xl font-heading font-black text-white mb-4">Two Decades of<br>Sportswear Excellence</h1>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto">From a small workshop to a 5,000m+ smart factory — our journey has been driven by one mission: helping brands create the best sportswear possible.</p>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-3 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl md:text-4xl font-heading font-black text-brand mb-1">{{ stat.number }}</div>
            <div class="font-semibold text-navy text-sm">{{ stat.label }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ stat.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-3">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-6">Our Story</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>Our story starts in 2002 with our predecessor factory in Shenzhen, <strong class="text-navy">Tongtong Garments (Shenzhen) Co., Ltd.</strong>, which produced teamwear and fashion garments for export. The current contracting entity, <strong class="text-navy">Tonton Sports (Shenzhen) Co., Ltd.</strong>, was incorporated in 2008 and is the company named on your contract and invoice. Operating under our brand <strong class="text-navy">TontonSports</strong>, we specialize in OEM/ODM manufacturing for sports brands, teams, and businesses worldwide.</p>
              <p>Our group's 5,000m+ production base in Xiantao, Hubei runs flexible lines for sublimation printing, laser cutting, cut-and-sew, embroidery and packing, staffed by 70+ trained operators and SEDEX SMETA 4-Pillar audited. It is backed by our Shenzhen business hub — sales, design and merchandising — which is the entity that signs your contract. Together the group employs 150+ people.</p>
              <p>We believe great sportswear starts with understanding the athlete. Whether you're launching a fitness brand, outfitting a sports team, or expanding your apparel line, our experienced design and production teams work closely with you at every step — from initial concept to final delivery.</p>
            </div>
          </div>
          <div class="relative">
            <!-- 集团工厂概览视频：封面 + 播放按钮，点击后才加载视频源 -->
            <video
              v-if="overviewPlaying"
              src="/videos/tonton-overview.mp4"
              controls
              autoplay
              playsinline
              class="w-full rounded-xl shadow-lg bg-black"
            ></video>
            <button v-else type="button" class="relative block w-full text-left group cursor-pointer" aria-label="Play factory overview video" @click="overviewPlaying = true">
              <img src="/factory/04Hanger Sewing Workshop.png" alt="Tonton Sportswear (Hubei) production base — click to play the factory overview video" class="w-full rounded-xl shadow-lg" loading="lazy" />
              <span class="absolute inset-0 rounded-xl bg-navy/25 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                <span class="w-16 h-16 bg-white/95 rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-brand ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
              <span class="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md">Factory overview video</span>
            </button>
            <!-- 2002 角标：只在封面态显示，视频播放时会盖住控制条 -->
            <div v-if="!overviewPlaying" class="absolute -bottom-4 -left-4 bg-brand text-white p-4 rounded-xl shadow-lg">
              <div class="text-2xl font-heading font-black">2002</div>
              <div class="text-sm">Manufacturing since</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Group Structure -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-3">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">One Group, Three Companies</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Sales in Shenzhen, manufacturing in Hubei, our own brand out of the same base — so you deal with one team from sampling to shipping.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="entity in groupEntities"
            :key="entity.name"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="entity.icon" />
                </svg>
              </div>
              <span class="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full" :class="entity.badgeClass">{{ entity.badge }}</span>
            </div>
            <h3 class="font-heading font-bold text-navy text-lg leading-snug">{{ entity.name }}</h3>
            <p class="text-xs text-gray-400 mt-1">{{ entity.cn }}</p>
            <p class="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ entity.location }}
            </p>
            <p class="text-sm text-gray-600 leading-relaxed mt-4 flex-1">{{ entity.role }}</p>
            <p class="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">{{ entity.meta }}</p>
          </div>
        </div>
        <p class="text-center text-sm text-gray-500 mt-10 max-w-3xl mx-auto">All three are independent legal entities and can contract directly. Most orders are quoted and invoiced by our Shenzhen company, with production at our Hubei base.</p>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-3xl font-heading font-bold text-navy mb-12 text-center">Our Journey</h2>
        <div class="relative">
          <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2"></div>
          <div v-for="(m, idx) in milestones" :key="m.year" class="relative flex items-start gap-6 mb-8 last:mb-0" :class="idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
            <div class="hidden md:block md:w-1/2" :class="idx % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'">
              <div class="inline-block bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div class="text-brand font-heading font-bold text-lg">{{ m.year }}</div>
                <div class="text-gray-600 text-sm mt-1">{{ m.event }}</div>
              </div>
            </div>
            <div class="absolute left-4 md:left-1/2 w-3 h-3 bg-brand rounded-full border-2 border-white shadow -translate-x-1/2 mt-1.5"></div>
            <div class="md:hidden ml-10 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div class="text-brand font-heading font-bold">{{ m.year }}</div>
              <div class="text-gray-600 text-sm mt-1">{{ m.event }}</div>
            </div>
            <div class="hidden md:block md:w-1/2"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Factory Tour -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-3">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Factory Tour</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Take a look inside our 5,000m+ production base in Xiantao, Hubei, China.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="area in factoryAreas" :key="area.src" class="relative overflow-hidden rounded-xl group">
            <NuxtImg :src="area.src" format="avif" fallbackFormat="webp" :alt="area.alt" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span class="text-white font-medium text-sm">{{ area.label }}</span>
            </div>
          </div>
        </div>
        <div class="mt-4 relative overflow-hidden rounded-xl">
          <NuxtImg src="/factory/07Hanging Sewing Workshop.png" format="avif" fallbackFormat="webp" alt="Hanging Sewing Workshop" class="w-full h-64 md:h-80 object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent flex items-center">
            <div class="p-8 text-white">
              <div class="text-3xl font-heading font-black">5,000m+</div>
              <div class="text-lg">Intelligent Production Workshop</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-3">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Certifications & Compliance</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">We maintain the highest standards in quality, social responsibility, and environmental management.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="cert in certifications" :key="cert.name" class="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2" :class="cert.color">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy text-lg">{{ cert.name }}</h3>
            <p class="text-gray-500 text-xs mt-1">{{ cert.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Reach -->
    <section class="py-16 md:py-20 bg-navy">
      <div class="max-w-7xl mx-auto px-3 text-center">
        <h2 class="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Trusted Worldwide</h2>
        <p class="text-gray-400 max-w-2xl mx-auto mb-10">We export to 60+ countries across North America, Europe, Australia, South America, and the Middle East.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-2xl font-heading font-bold text-brand-light mb-2">North America</div>
            <p class="text-gray-400 text-sm">USA, Canada, Mexico</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-2xl font-heading font-bold text-brand-light mb-2">Europe</div>
            <p class="text-gray-400 text-sm">UK, Germany, France, Spain, Italy</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-2xl font-heading font-bold text-brand-light mb-2">Oceania</div>
            <p class="text-gray-400 text-sm">Australia, New Zealand</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-2xl font-heading font-bold text-brand-light mb-2">Middle East</div>
            <p class="text-gray-400 text-sm">UAE, Saudi Arabia, Qatar</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-brand py-14">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-2xl md:text-3xl font-heading font-bold text-white mb-4">Want to Visit Our Factory?</h2>
        <p class="text-blue-100 mb-6">We welcome factory visits. See our production line, meet our team, and discuss your project in person.</p>
        <NuxtLink to="/contact" class="inline-flex items-center gap-2 bg-white text-brand font-semibold px-7 py-3.5 rounded-lg hover:bg-gray-100 transition-colors">
          Schedule a Visit
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
