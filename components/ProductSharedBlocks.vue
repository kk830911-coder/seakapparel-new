<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import DetailAccordion from './DetailAccordion.vue'

/**
 * 全站共用区块（一次维护，所有产品详情页生效）：
 * 工艺与面料 → 认证资质 → 客户品牌墙 → 工厂实拍 → 付款/物流/包装
 * 任何一块在后台没填内容，就自动隐藏，不留空白占位。
 */
const props = defineProps<{
  craft: { title: string; body: string; images: { url: string; alt: string }[] }
  certifications: { name: string; desc?: string; issuer?: string; validUntil?: string; image?: string }[]
  clients: { name: string; image?: string }[]
  factoryShots: { url: string; alt: string }[]
  infoBlocks: { title: string; body?: string; images?: { url: string; alt: string }[] }[]
}>()

const hasCraft = computed(() => !!(props.craft?.body || props.craft?.images?.length))
const hasCerts = computed(() => props.certifications?.length > 0)
const hasClients = computed(() => props.clients?.length > 0)
const hasFactory = computed(() => props.factoryShots?.length > 0)

const accordionItems = computed(() =>
  (props.infoBlocks || [])
    .filter(b => b?.title && (b.body || b.images?.length))
    .map(b => ({ title: b.title, body: b.body || '' }))
)
const hasInfoBlocks = computed(() => accordionItems.value.length > 0)

// 工厂实拍点击查看大图（Esc / 点击遮罩关闭）
const lightbox = ref<{ url: string; alt: string } | null>(null)
const openLightbox = (shot: { url: string; alt?: string }) =>
  (lightbox.value = { url: shot.url, alt: shot.alt || 'Factory photo' })
const closeLightbox = () => (lightbox.value = null)

// 全站共用工厂视频（放前端 public/videos/factory.mp4，走 Vercel 边缘 CDN，点击才加载）
const FACTORY_VIDEO_SRC = '/videos/factory.mp4'
const factoryVideoVisible = ref(true)
const onFactoryVideoError = () => (factoryVideoVisible.value = false)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="space-y-10 sm:space-y-14">
    <!-- 工艺与面料 -->
    <section v-if="hasCraft" id="craft" class="scroll-mt-[170px]">
      <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4">{{ craft.title }}</h2>
      <div class="grid gap-5 lg:grid-cols-2 items-start">
        <p v-if="craft.body" class="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">{{ craft.body }}</p>
        <div v-if="craft.images?.length" class="grid grid-cols-2 gap-3">
          <img
            v-for="img in craft.images"
            :key="img.url"
            :src="img.url"
            :alt="img.alt || craft.title"
            class="w-full h-40 sm:h-48 object-cover rounded-xl"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <!-- 认证与资质 -->
    <section v-if="hasCerts" id="certifications" class="scroll-mt-[170px]">
      <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-1">Certifications & Compliance</h2>
      <p class="text-sm text-gray-500 mb-5">Verifiable certificates — click any image to open the full scan.</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a
          v-for="cert in certifications"
          :key="cert.name"
          :href="cert.image || undefined"
          :target="cert.image ? '_blank' : undefined"
          class="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
        >
          <img
            v-if="cert.image"
            :src="cert.image"
            :alt="`${cert.name} certificate`"
            class="w-full h-28 object-contain mb-3"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="w-full h-28 flex items-center justify-center mb-3 text-gray-300">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="font-heading font-bold text-navy text-sm sm:text-base">{{ cert.name }}</h3>
          <p v-if="cert.desc" class="text-gray-500 text-xs mt-1">{{ cert.desc }}</p>
          <p v-if="cert.issuer || cert.validUntil" class="text-gray-400 text-xs mt-1">
            {{ [cert.issuer, cert.validUntil].filter(Boolean).join(' · ') }}
          </p>
        </a>
      </div>
    </section>

    <!-- 客户品牌墙 -->
    <section v-if="hasClients" id="clients" class="scroll-mt-[170px]">
      <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-1">Trusted by Global Brands</h2>
      <p class="text-sm text-gray-500 mb-5">Brands and teams we manufacture for.</p>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        <div
          v-for="client in clients"
          :key="client.name"
          class="bg-white rounded-xl border border-gray-100 h-20 flex items-center justify-center p-3"
        >
          <img
            v-if="client.image"
            :src="client.image"
            :alt="client.name"
            class="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="text-xs text-gray-400 text-center">{{ client.name }}</span>
        </div>
      </div>
    </section>

    <!-- 工厂实拍 -->
    <section v-if="hasFactory" id="factory" class="scroll-mt-[170px]">
      <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-1">Inside Our Factory</h2>
      <p class="text-sm text-gray-500 mb-5">Real shots from our Hubei manufacturing base.</p>

      <!-- 全站共用工厂视频：preload=none + 海报图，点击才开始加载，不影响页面打开速度 -->
      <video
        v-if="factoryVideoVisible"
        :src="FACTORY_VIDEO_SRC"
        :poster="factoryShots[0]?.url"
        controls
        playsinline
        preload="none"
        class="w-full max-w-3xl mx-auto aspect-video rounded-xl shadow-sm border border-gray-100 bg-black object-contain mb-5"
        @error="onFactoryVideoError"
      >
        Your browser does not support the video tag.
      </video>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <figure
          v-for="shot in factoryShots"
          :key="shot.url"
          class="rounded-xl overflow-hidden bg-white border border-gray-100 cursor-zoom-in group"
          @click="openLightbox(shot)"
        >
          <div class="relative">
            <img
              :src="shot.url"
              :alt="shot.alt || 'Factory production shot'"
              class="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors flex items-center justify-center">
              <span class="w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14zM11 8v6M8 11h6" />
                </svg>
              </span>
            </div>
          </div>
          <figcaption v-if="shot.alt" class="text-xs text-gray-500 px-3 py-2">{{ shot.alt }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- 付款 / 物流 / 包装 -->
    <section v-if="hasInfoBlocks" id="logistics" class="scroll-mt-[170px]">
      <h2 class="text-xl sm:text-2xl font-heading font-bold text-navy mb-4">Payment, Shipping & Packaging</h2>
      <DetailAccordion :items="accordionItems" />
    </section>

    <!-- 工厂实拍大图 -->
    <Teleport to="body">
      <div
        v-if="lightbox"
        class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <button
          class="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
          @click.stop="closeLightbox"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <figure class="max-w-[95vw] max-h-[90vh] flex flex-col items-center gap-3" @click.stop>
          <img :src="lightbox.url" :alt="lightbox.alt" class="max-h-[80vh] w-auto max-w-full object-contain rounded-lg" />
          <figcaption v-if="lightbox.alt" class="text-xs sm:text-sm text-white/70 text-center">{{ lightbox.alt }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </div>
</template>
