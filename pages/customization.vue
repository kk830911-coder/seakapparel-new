<script setup>
useCanonicalUrl()

useHead({
  title: 'Custom Sportswear Manufacturing | OEM ODM Process',
  meta: [
    { name: 'description', content: 'Full custom sportswear manufacturing process — from design mockup to delivery. Sublimation, screen print, embroidery. Free design service. Low MOQ 1 piece.' },
    { name: 'keywords', content: 'custom sportswear manufacturing, OEM ODM sportswear, sublimation printing, custom activewear design, sportswear sampling' },
    { property: 'og:title', content: 'Custom Sportswear Manufacturing Process | TontonSports' },
    { property: 'og:description', content: 'From design to delivery — full OEM/ODM sportswear manufacturing. Free mockup, low MOQ.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tutesports.com/customization' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Custom Sportswear Manufacturing",
        "provider": {
          "@type": "Organization",
          "name": "TontonSports"
        },
        "description": "Full OEM/ODM custom sportswear manufacturing service including design, sampling, production, and global delivery.",
        "areaServed": ["North America", "Europe", "Australia", "South America"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Sportswear Manufacturing Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "OEM Manufacturing" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ODM Design Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Label" } }
          ]
        }
      })
    }
  ]
})

const processSteps = [
  { num: '01', title: 'Share Your Idea', desc: 'Send us your design, reference images, or concept. Tell us about your sport, team, or brand requirements.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { num: '02', title: 'Design Mockup', desc: 'Our design team creates a free digital mockup with your logo, colors, and artwork on the garment.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { num: '03', title: 'Confirm Details', desc: 'Finalize fabric type, size chart, colors, printing method, labels, and packaging specifications.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { num: '04', title: 'Sample Production', desc: 'We produce a physical sample so you can check quality, fit, colors, and all customization details.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { num: '05', title: 'Approve Sample', desc: 'Review the sample. Request adjustments if needed. Once approved, we proceed to bulk production.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { num: '06', title: 'Bulk Production', desc: 'Full-scale manufacturing begins. Strict quality control at every production stage.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { num: '07', title: 'QC Inspection', desc: '100% quality inspection before packaging. We check stitching, printing, sizing, and overall finish.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { num: '08', title: 'Global Delivery', desc: 'Careful packaging and fast international shipping via DHL, FedEx, or sea freight with full tracking.', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' }
]

const printingMethods = [
  { name: 'Sublimation Printing', desc: 'Full-color, all-over prints that never fade, crack, or peel. Ideal for polyester sportswear with complex designs.', features: ['Unlimited colors', 'No fading', 'Breathable'] },
  { name: 'Screen Printing', desc: 'Cost-effective for large orders with simple designs. Vibrant, durable ink on any fabric type.', features: ['Bulk pricing', 'Vibrant colors', 'Any fabric'] },
  { name: 'Heat Transfer', desc: 'Perfect for small batches and detailed graphics. Quick turnaround with excellent color reproduction.', features: ['Low MOQ', 'Detailed graphics', 'Fast turnaround'] },
  { name: 'Embroidery', desc: 'Premium look for logos and text. Adds texture and professionalism to polos, jackets, and caps.', features: ['Premium feel', 'Durable', 'Professional'] },
  { name: 'Tackle Twill', desc: 'Sewn fabric letters and numbers. The standard for professional team jerseys with a raised, textured look.', features: ['Pro look', 'Raised texture', 'Team standard'] },
  { name: 'DTF Printing', desc: 'Direct-to-film printing for complex, multi-color designs on any fabric including cotton and blends.', features: ['Any fabric', 'Photo quality', 'Flexible'] }
]

const fabrics = [
  { name: 'Polyester Mesh', desc: 'Lightweight, breathable. Perfect for jerseys and team uniforms.', use: 'Basketball, Football, Soccer' },
  { name: 'Nylon/Spandex', desc: 'Four-way stretch, moisture-wicking. Ideal for form-fitting athletic wear.', use: 'Yoga, Fitness, Cycling' },
  { name: 'Interlock Fabric', desc: 'Smooth, durable double-knit. Great for sublimation printing.', use: 'Rash Guards, MMA, Hockey' },
  { name: 'French Terry', desc: 'Soft interior loops, comfortable warmth. Perfect for training and casual wear.', use: 'Hoodies, Joggers, Warm-ups' },
  { name: 'Microfiber Polyester', desc: 'Ultra-light, quick-dry technology. Built for high-intensity performance.', use: 'Running, Training, Athletics' },
  { name: 'Bamboo Fiber Blend', desc: 'Eco-friendly, naturally antibacterial, ultra-soft hand feel.', use: 'Yoga, Lifestyle, Athleisure' }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-heading font-black text-white mb-4">From Idea to Delivery</h1>
        <p class="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">Your complete custom sportswear manufacturing partner. We handle every step — design, sampling, production, quality control, and global shipping.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/contact" class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
            Start Your Custom Project
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NuxtLink>
          <a href="https://wa.me/8618271971983" target="_blank" class="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>

    <!-- Process Steps -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Our 8-Step Process</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">A proven workflow refined over 20 years — designed to deliver exactly what you need, on time and on budget.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="step in processSteps" :key="step.num" class="relative bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-brand/20">
            <div class="absolute top-4 right-4 text-4xl font-heading font-black text-gray-100 group-hover:text-brand/10 transition-colors">{{ step.num }}</div>
            <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
              <svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="step.icon"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy text-lg mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Printing Methods -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Printing & Decoration Methods</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">We offer a full range of printing and decoration techniques to match your design requirements and budget.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="method in printingMethods" :key="method.name" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <h3 class="font-heading font-bold text-navy text-lg mb-2">{{ method.name }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ method.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="f in method.features" :key="f" class="text-xs bg-brand/10 text-brand px-2.5 py-1 rounded-full font-medium">{{ f }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fabrics -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Fabric & Material Options</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Premium performance fabrics sourced from trusted mills. We help you choose the right material for your sport and budget.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="fabric in fabrics" :key="fabric.name" class="rounded-xl p-6 border border-gray-200 hover:border-brand/30 hover:shadow-md transition-all duration-300">
            <h3 class="font-heading font-bold text-navy text-lg mb-2">{{ fabric.name }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-3">{{ fabric.desc }}</p>
            <div class="text-xs text-gray-400">
              <span class="font-medium text-gray-500">Best for:</span> {{ fabric.use }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy mb-3">Full-Service Manufacturing</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Everything you need to launch or grow your sportswear brand — under one roof.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy mb-2">Free Design</h3>
            <p class="text-gray-500 text-sm">Professional mockups at no cost. Bring your vision to life before committing.</p>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy mb-2">Private Label</h3>
            <p class="text-gray-500 text-sm">Custom labels, hang tags, and packaging with your brand identity.</p>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy mb-2">Tech Pack Support</h3>
            <p class="text-gray-500 text-sm">We help create detailed tech packs from sketches or reference photos.</p>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
            </div>
            <h3 class="font-heading font-bold text-navy mb-2">Global Logistics</h3>
            <p class="text-gray-500 text-sm">DHL, FedEx, sea freight — we handle customs and door-to-door delivery.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-brand py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to Bring Your Designs to Life?</h2>
        <p class="text-blue-100 text-lg mb-8">Get a free mockup and detailed quote within 24 hours. No commitment required.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/contact" class="inline-flex items-center justify-center gap-2 bg-white text-brand font-semibold px-7 py-3.5 rounded-lg hover:bg-gray-100 transition-colors">
            Get Free Mockup
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </NuxtLink>
          <a href="https://wa.me/8618271971983" target="_blank" class="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
