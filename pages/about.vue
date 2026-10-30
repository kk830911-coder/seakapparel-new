<script setup>
useCanonicalUrl()

useHead({
  title: 'About Us | 20+ Years Sportswear Manufacturer',
  meta: [
    { name: 'description', content: 'Tonton Sportswear (Shenzhen) Co., Ltd. — Established 2004. 5,000m+ factory, 200+ workers, ISO9001/BSCI/WRAP certified. Serving 500+ brands in 60+ countries.' },
    { name: 'keywords', content: 'sportswear manufacturer China, activewear factory, ISO certified sportswear, Tonton Sportswear, OEM factory Shenzhen' },
    { property: 'og:title', content: 'About TontonSports | 20+ Years Sportswear Manufacturer' },
    { property: 'og:description', content: 'Established 2004. ISO certified factory serving 500+ brands in 60+ countries.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tutesports.com/about' }
  ]
})

const stats = [
  { number: '20+', label: 'Years in Business', sub: 'Since 2004' },
  { number: '500+', label: 'Global Clients', sub: '60+ Countries' },
  { number: '200+', label: 'Skilled Workers', sub: 'Professional Team' },
  { number: '20,000+', label: 'Monthly Output', sub: 'Pieces per Month' }
]

const certifications = [
  { name: 'ISO 9001', desc: 'Quality Management System', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'ISO 14001', desc: 'Environmental Management', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'BSCI', desc: 'Business Social Compliance', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'WRAP', desc: 'Worldwide Responsible Accredited Production', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'ROHS', desc: 'Restriction of Hazardous Substances', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Disney', desc: 'Disney FAMA Certified Supplier', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
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
  { year: '2004', event: 'Company founded in Shenzhen, China' },
  { year: '2008', event: 'Expanded to 2,000m+ factory, 50+ workers' },
  { year: '2012', event: 'Obtained ISO 9001 certification' },
  { year: '2015', event: 'Launched sublimation printing division' },
  { year: '2018', event: 'Reached 300+ global clients milestone' },
  { year: '2020', event: 'Upgraded to AI-powered smart factory' },
  { year: '2023', event: 'Expanded to 5,000m+ facility, 200+ workers' },
  { year: '2025', event: 'Serving 500+ brands across 60+ countries' }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-heading font-black text-white mb-4">Two Decades of<br>Sportswear Excellence</h1>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto">From a small workshop to a 5,000m+ smart factory — our journey has been driven by one mission: helping brands create the best sportswear possible.</p>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-10">
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
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-6">Our Story</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>Founded in 2004, <strong class="text-navy">Tonton Sportswear (Shenzhen) Co., Ltd.</strong> has grown from a small garment workshop into one of China's leading custom sportswear manufacturers. Operating under our brand <strong class="text-navy">TontonSports</strong>, we specialize in OEM/ODM manufacturing for sports brands, teams, and businesses worldwide.</p>
              <p>Our 5,000m+ smart factory in Shenzhen's Longgang District houses over 200 skilled workers and 50+ imported production machines. With digital pattern rooms, automated cutting systems, and AI-assisted quality control, we deliver precision at scale — producing over 20,000 pieces monthly.</p>
              <p>We believe great sportswear starts with understanding the athlete. Whether you're launching a fitness brand, outfitting a sports team, or expanding your apparel line, our experienced design and production teams work closely with you at every step — from initial concept to final delivery.</p>
            </div>
          </div>
          <div class="relative">
            <img src="/factory/00Group photo of Hu Xinzhen, Chairman of Totem Group, and Jack Ma of Alibaba at Jiangnan Club on May 9, 2013.jpg" alt="Group photo of Hu Xinzhen, Chairman of Totem Group, and Jack Ma of Alibaba at Jiangnan Club on May 9, 2013" class="w-full rounded-xl shadow-lg" loading="lazy" />
            <div class="absolute -bottom-4 -left-4 bg-brand text-white p-4 rounded-xl shadow-lg">
              <div class="text-2xl font-heading font-black">2004</div>
              <div class="text-sm">Established</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-16 md:py-20 bg-gray-50">
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
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Factory Tour</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Take a look inside our 5,000m+ production facility in Shenzhen, China.</p>
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
      <div class="max-w-7xl mx-auto px-4">
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
      <div class="max-w-7xl mx-auto px-4 text-center">
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
