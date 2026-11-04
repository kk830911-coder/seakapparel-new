<template>
  <!-- ============ 桌面端（md+）：右侧居中竖排联系卡 ============ -->
  <div class="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-[900] flex-col items-center">
    <img
      src="/sales-avatar.jpg"
      alt="Contact Marc at TontonSports"
      class="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
      loading="lazy"
    />
    <div class="bg-[#B08968] text-white text-xs font-bold tracking-[0.15em] px-6 py-1.5 rounded-lg shadow-md">
      CONTACT
    </div>
    <div class="bg-white border border-gray-100 rounded-b-xl shadow-xl flex flex-col divide-y divide-gray-100 w-[84px]">
      <a
        href="https://wa.me/8618271971983"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center gap-1 py-3 text-green-600 hover:bg-green-50 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59zm-4.92 6.53c-1.635 0-3.24-.437-4.64-1.266l-.33-.195-1.156.304.31-1.127-.214-.341c-.87-1.402-1.333-3.024-1.333-4.682 0-5.733 4.667-10.4 10.4-10.4 5.733 0 10.4 4.667 10.4 10.4 0 5.733-4.667 10.4-10.4 10.4z"/></svg>
        <span class="text-[11px] font-medium">WhatsApp</span>
      </a>
      <a
        href="mailto:Marc@tutesports.com"
        class="flex flex-col items-center gap-1 py-3 text-brand hover:bg-blue-50 transition-colors"
        aria-label="Send an email"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span class="text-[11px] font-medium">E-mail</span>
      </a>
      <button
        type="button"
        class="flex flex-col items-center gap-1 py-3 text-green-600 hover:bg-green-50 transition-colors"
        title="Copy WeChat ID"
        aria-label="Copy WeChat ID"
        @click="copyWechat"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 576 512" aria-hidden="true"><path d="M385.2 167.6c6.4 0 12.6.3 18.8 1.1C387.4 90.3 303.3 32 207.7 32 100.5 32 13 104.8 13 197.4c0 53.4 29.3 97.5 77.9 131.6l-19.3 58.6 68-34.1c24.4 4.8 43.8 9.7 68.2 9.7 6.2 0 12.1-.3 18.3-.8-4-12.9-6.2-26.6-6.2-40.8-.1-84.1 72.9-154 165.3-154zm-104.5-52.9c14.5 0 24.2 9.7 24.2 24.4 0 14.5-9.7 24.2-24.2 24.2-14.8 0-29.3-9.7-29.3-24.2.1-14.7 14.6-24.4 29.3-24.4zm-136.4 48.6c-14.5 0-29.3-9.7-29.3-24.2 0-14.8 14.8-24.4 29.3-24.4 14.8 0 24.4 9.7 24.4 24.4 0 14.6-9.6 24.2-24.4 24.2zM563 319.4c0-77.9-77.9-141.3-165.4-141.3-92.7 0-165.4 63.4-165.4 141.3S305 460.7 397.6 460.7c19.3 0 38.9-5.1 58.6-9.7l53.4 29.3-14.8-48.6C534 402.1 563 363.2 563 319.4zm-219.1-24.5c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.8 0 24.4 9.7 24.4 19.3 0 10-9.7 19.6-24.4 19.6zm107.1 0c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.5 0 24.4 9.7 24.4 19.3 0 10-9.9 19.6-24.4 19.6z"/></svg>
        <span class="text-[11px] font-medium">WeChat</span>
      </button>
      <NuxtLink
        to="/contact"
        class="flex flex-col items-center gap-1 py-3 text-navy hover:bg-blue-50 transition-colors"
        aria-label="Open inquiry form"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/></svg>
        <span class="text-[11px] font-medium">Inquiry</span>
      </NuxtLink>
      <button
        type="button"
        class="flex flex-col items-center gap-1 py-3 text-gray-500 hover:bg-gray-50 transition-colors rounded-b-xl"
        aria-label="Back to top"
        @click="scrollToTop"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>
        <span class="text-[11px] font-medium">Top</span>
      </button>
    </div>
  </div>

  <!-- ============ 移动端（<md）：底部固定联系栏 ============ -->
  <nav class="md:hidden fixed bottom-0 inset-x-0 z-[900] bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.12)]" aria-label="Quick contact">
    <div class="grid grid-cols-5 h-[60px]">
      <a
        href="https://wa.me/8618271971983"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center justify-center gap-0.5 text-green-600"
        aria-label="Chat on WhatsApp"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59zm-4.92 6.53c-1.635 0-3.24-.437-4.64-1.266l-.33-.195-1.156.304.31-1.127-.214-.341c-.87-1.402-1.333-3.024-1.333-4.682 0-5.733 4.667-10.4 10.4-10.4 5.733 0 10.4 4.667 10.4 10.4 0 5.733-4.667 10.4-10.4 10.4z"/></svg>
        <span class="text-[10px] font-medium">WhatsApp</span>
      </a>
      <a
        href="tel:+8618271971983"
        class="flex flex-col items-center justify-center gap-0.5 text-navy"
        aria-label="Call us"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <span class="text-[10px] font-medium">Phone</span>
      </a>
      <div class="relative flex justify-center">
        <button
          type="button"
          class="absolute -top-6 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center ring-4 ring-white"
          style="background: linear-gradient(135deg, #FF6B00 0%, #CC5500 100%);"
          aria-label="Back to top"
          @click="scrollToTop"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>
        </button>
      </div>
      <a
        href="mailto:Marc@tutesports.com"
        class="flex flex-col items-center justify-center gap-0.5 text-brand"
        aria-label="Send an email"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span class="text-[10px] font-medium">E-Mail</span>
      </a>
      <NuxtLink
        to="/contact"
        class="flex flex-col items-center justify-center gap-0.5 text-navy"
        aria-label="Open inquiry form"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/></svg>
        <span class="text-[10px] font-medium">Inquiry</span>
      </NuxtLink>
    </div>
  </nav>

  <!-- 复制微信号的轻提示 -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="wechatCopied"
      class="fixed bottom-20 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-4 py-2 rounded-full shadow-lg z-[950] whitespace-nowrap"
      role="status"
    >
      WeChat ID copied: 182 7197 1983
    </div>
  </transition>
</template>

<script setup>
defineProps({
  // Cookie 横幅出现时无需特殊处理：横幅 z-[1000] 天然盖住 z-[900] 的联系栏
  showCookieBanner: { type: Boolean, default: false }
})

const wechatCopied = ref(false)
let copyTimer = null

const copyWechat = async () => {
  try {
    await navigator.clipboard.writeText('18271971983')
  } catch {
    // 剪贴板权限被拒（老浏览器/非安全上下文）也不打断用户
  }
  wechatCopied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { wechatCopied.value = false }, 2200)
}

const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>
