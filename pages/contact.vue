<script setup>
import { ref, onMounted } from 'vue'

useCanonicalUrl()

const route = useRoute()

const form = ref({
  name: '',
  email: '',
  company: '',
  phone: '',
  product: '',
  quantity: '',
  message: '',
  // honeypot：对真人不可见，机器人填了就丢弃这次提交
  botfield: ''
})
const formSubmitted = ref(false)
const formSubmitting = ref(false)
const formError = ref('')
const errors = ref({})
const agreedToPrivacy = ref(false)

// 从产品页点"Send Email Inquiry"过来时自动带出产品和分类，客户不用重新描述需求
onMounted(() => {
  const productSlug = typeof route.query.product === 'string' ? route.query.product : ''
  const title = typeof route.query.title === 'string' ? route.query.title : ''
  // 产品页会额外带上 category=<分类 slug>；只带 product 时按分类 slug 兜底匹配
  const categorySlug = typeof route.query.category === 'string' && route.query.category
    ? route.query.category
    : productSlug
  const categoryName = getCategoryName(categorySlug) || getCategoryName(productSlug)
  if (categoryName) form.value.product = categoryName
  if (title) {
    form.value.message = `I'm interested in: ${title}${categoryName ? ` (${categoryName})` : ''}\n\n`
  }
  // 配了 Turnstile 才加载验证框
  if (turnstileSiteKey) mountTurnstile()
})

// 邮箱按"错在哪"给具体提示，而不是一句笼统的 invalid
const validateEmail = (value) => {
  const v = String(value || '').trim()
  if (!v) return 'Please enter your email address'
  if (/\s/.test(v)) return 'Email address cannot contain spaces'
  if (!v.includes('@')) return 'This email is missing "@" — e.g. name@company.com'
  const [local, domain] = v.split('@')
  if (!local) return 'This email is missing the name before "@"'
  if (!domain) return 'This email is missing the domain after "@" — e.g. gmail.com'
  if (!domain.includes('.')) return 'This email domain has no ending like ".com"'
  if (!/\.[A-Za-z]{2,}$/.test(domain)) return 'This email domain ending looks incomplete (e.g. ".com")'
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) return 'This email has an invalid character before "@"'
  if (/\.\./.test(v) || /^\./.test(local) || /\.$/.test(local)) return 'This email has a misplaced dot — please check it'
  return ''
}

// 改动某个字段就立刻清掉它自己的旧报错，避免"改了还红着"
const clearError = (field) => {
  if (!errors.value[field]) return
  const next = { ...errors.value }
  delete next[field]
  errors.value = next
}

// 失焦就校验邮箱，不必等到点提交
const checkEmailField = () => {
  const msg = validateEmail(form.value.email)
  const next = { ...errors.value }
  if (msg) next.email = msg
  else delete next.email
  errors.value = next
}

const focusField = async (id) => {
  await nextTick()
  document.getElementById(id)?.focus()
}

// 只校验必填项；Company / Phone / Product / Quantity 都是选填，永不报错
const validateForm = () => {
  const next = {}
  if (!form.value.name.trim()) next.name = 'Please enter your name'
  const emailMsg = validateEmail(form.value.email)
  if (emailMsg) next.email = emailMsg
  if (!form.value.message.trim()) next.message = 'Please tell us what you need'
  if (!agreedToPrivacy.value) next.privacy = 'Please tick the box to accept the Privacy Policy'
  errors.value = next
  return Object.keys(next).length === 0
}

/* ---------- 人机验证（Cloudflare Turnstile）----------
 * 配了 TURNSTILE_SITE_KEY 就渲染验证框，并改走服务端 /api/inquiry：
 * 服务端校验 token 之后才发信，密钥不进浏览器，机器人也过不了验证，刷不了额度。
 * 没配则维持浏览器直连 Web3Forms，表单永远可用。
 */
const runtimeConfig = useRuntimeConfig()
const turnstileSiteKey = String(runtimeConfig.public.turnstileSiteKey || '')
const turnstileToken = ref('')
const turnstileReady = ref(false)
let turnstileWidget = null

const ensureTurnstileScript = () => new Promise((resolve) => {
  if (window.turnstile) return resolve(true)
  const existing = document.querySelector('script[data-turnstile]')
  if (existing) {
    existing.addEventListener('load', () => resolve(true), { once: true })
    return
  }
  const s = document.createElement('script')
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  s.async = true
  s.defer = true
  s.setAttribute('data-turnstile', '1')
  s.addEventListener('load', () => resolve(true), { once: true })
  document.head.appendChild(s)
})

const mountTurnstile = async () => {
  await nextTick()
  await ensureTurnstileScript()
  const el = document.getElementById('turnstile-slot')
  if (!el || !window.turnstile || turnstileWidget) return
  turnstileWidget = window.turnstile.render(el, {
    sitekey: turnstileSiteKey,
    theme: 'light',
    callback: (token) => {
      turnstileToken.value = token
      clearError('turnstile')
    },
    'expired-callback': () => { turnstileToken.value = '' },
    'error-callback': () => { turnstileToken.value = '' }
  })
  turnstileReady.value = true
}

const resetTurnstile = () => {
  turnstileToken.value = ''
  if (turnstileWidget && window.turnstile) window.turnstile.reset(turnstileWidget)
}

// 服务端通道：Turnstile 在服务端校验，密钥只在服务端
const sendViaServer = async () => {
  await $fetch('/api/inquiry', {
    method: 'POST',
    body: {
      name: form.value.name,
      email: form.value.email,
      company: form.value.company,
      phone: form.value.phone,
      product: form.value.product,
      quantity: form.value.quantity,
      message: form.value.message,
      botfield: form.value.botfield,
      turnstileToken: turnstileToken.value
    }
  })
}

// 直连通道：服务端未配置时的兜底，保证询盘不丢
const sendViaWeb3Forms = async () => {
  const result = await $fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: {
      access_key: runtimeConfig.public.web3formsKey,
      subject: `Inquiry from ${form.value.name} - ${form.value.company || 'Individual'}`,
      from_name: 'TontonSports Website',
      replyto: form.value.email,
      name: form.value.name,
      email: form.value.email,
      company: form.value.company || 'N/A',
      phone: form.value.phone || 'N/A',
      product: form.value.product || 'N/A',
      quantity: form.value.quantity || 'N/A',
      message: form.value.message
    }
  })
  // Web3Forms 可能返回 200 + success:false（例如它判定邮箱不可用）
  if (result && result.success === false) {
    const msg = String(result.message || '')
    throw Object.assign(new Error(msg || 'delivery failed'), { data: {}, statusCode: 0, _serverMsg: msg })
  }
}

const submitForm = async () => {
  formError.value = ''
  // 机器人命中 honeypot：静默丢弃，不消耗表单额度
  if (form.value.botfield) return

  const valid = validateForm()
  // 配了验证框就必须先过验证
  if (turnstileSiteKey && !turnstileToken.value) {
    errors.value = { ...errors.value, turnstile: 'Please tick the box to verify you are human' }
  }
  if (!valid || (turnstileSiteKey && !turnstileToken.value)) {
    // 聚焦到第一个出错的具体字段
    const firstInvalid = Object.keys(errors.value)[0]
    const map = { name: 'inquiry-name', email: 'inquiry-email', message: 'inquiry-message', privacy: 'inquiry-privacy' }
    if (firstInvalid && map[firstInvalid]) await focusField(map[firstInvalid])
    return
  }

  formSubmitting.value = true
  try {
    if (turnstileSiteKey) {
      try {
        await sendViaServer()
      } catch (serverErr) {
        // 服务端还没配好（501）→ 自动回退直连，不让客户白填
        const code = serverErr?.statusCode || serverErr?.response?.status || 0
        if (code === 501 || serverErr?.data?.fallback) {
          await sendViaWeb3Forms()
        } else {
          throw serverErr
        }
      }
    } else {
      await sendViaWeb3Forms()
    }

    formSubmitted.value = true
    // GA4 转化事件：没有它，广告和 SEO 的询盘无法归因
    if (process.client && window.gtag) {
      window.gtag('event', 'generate_lead', {
        event_category: 'inquiry',
        event_label: form.value.product || 'general'
      })
    }
  } catch (err) {
    const status = err?.statusCode || err?.response?.status || 0
    const field = err?.data?.field
    const serverMsg = String(err?.data?.message || err?._serverMsg || err?.data?.statusMessage || '')

    if (field === 'turnstile') {
      errors.value.turnstile = serverMsg || 'Verification failed, please tick the box again'
      resetTurnstile()
    } else if (field === 'name' || field === 'email' || field === 'message') {
      // 服务端明确指出哪个字段有问题 → 就提示在那个字段下面
      errors.value[field] = serverMsg
      await focusField(`inquiry-${field}`)
    } else if (status === 429) {
      formError.value = serverMsg || 'Too many submissions from this network. Please wait a few minutes, or message us on WhatsApp.'
    } else if (/email/i.test(serverMsg)) {
      errors.value.email = serverMsg
      await focusField('inquiry-email')
    } else {
      formError.value = serverMsg || 'We could not send your message just now. Please try again, or reach us on WhatsApp / email directly.'
    }
  } finally {
    formSubmitting.value = false
    if (turnstileSiteKey) resetTurnstile()
  }
}

useHead({
  title: 'Contact Us | Get a Free Quote',
  meta: [
    { name: 'description', content: 'Contact TontonSports for custom sportswear inquiries. Get a free quote within 24 hours. WhatsApp, email, or fill out our inquiry form.' },
    { name: 'keywords', content: 'contact sportswear manufacturer, get quote custom sportswear, sportswear supplier inquiry' },
    { property: 'og:title', content: 'Contact TontonSports | Get a Free Quote' },
    { property: 'og:description', content: 'Get a free custom sportswear quote within 24 hours.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.tutesports.com/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact TontonSports",
        "description": "Contact TontonSports for custom sportswear manufacturing inquiries",
        "url": "https://www.tutesports.com/contact"
      })
    }
  ]
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy py-14 md:py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-heading font-black text-white mb-4">Let's Start Your Project</h1>
        <p class="text-gray-300 text-lg max-w-2xl mx-auto">Tell us about your custom sportswear needs. We'll respond with a detailed quote within 24 hours.</p>
      </div>
    </section>

    <!-- Quick Contact Bar -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="https://wa.me/8618271971983" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow-md transition-all group">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
              <svg class="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.145-.575.297-.101.15-.39.54-.72 1.09-.134.212-.249.227-.46.082-.16-.074-.729-.27-1.393-.866-.515-.462-.862-1.029-.968-1.248-.099-.21.01-.325.083-.46.075-.134.15-.247.299-.492.099-.168.049-.312-.024-.439-.075-.126-.67-1.611-.916-2.206-.242-.59-.487-.511-.67-.52-.16-.008-.341-.01-.52-.01-.18 0-.47.07-.719.347-.248.277-.944.92-1.433 1.798-.49.878-.49 1.933.028 3.774.52 1.84 1.56 3.582 2.994 4.828 1.433 1.247 3.174 1.943 4.919 2.429.64.14 1.225.227 1.655.273.695.086 1.331.074 1.843-.04 1.05-.23 3.393-1.324 3.896-2.61.503-1.287.503-2.399.354-2.61-.149-.21-.54-.339-1.13-.59z"/></svg>
            </div>
            <div>
              <div class="font-semibold text-green-800 text-sm">WhatsApp</div>
              <div class="text-green-600 text-xs">+86 182 7197 1983</div>
            </div>
          </a>
          <a href="mailto:Marc@tutesports.com" class="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-md transition-all group">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
              <svg class="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div class="font-semibold text-blue-800 text-sm">Email</div>
              <div class="text-blue-600 text-xs">Marc@tutesports.com</div>
            </div>
          </a>
          <a href="tel:+8618271971983" class="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100 hover:shadow-md transition-all group">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
              <svg class="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <div>
              <div class="font-semibold text-purple-800 text-sm">Phone</div>
              <div class="text-purple-600 text-xs">+86 182 7197 1983</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Form -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 class="text-2xl font-heading font-bold text-navy mb-2">Send Us an Inquiry</h2>
              <p class="text-gray-500 text-sm mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>

              <div v-if="formSubmitted" role="status" aria-live="polite" class="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <h3 class="font-heading font-bold text-green-800 text-lg mb-2">Inquiry Sent!</h3>
                <p class="text-green-600 text-sm">Thank you for reaching out. We'll respond within 24 hours.</p>
                <!-- 把收件地址显示出来：填错了客户当场能发现，不至于白等 24 小时 -->
                <p class="text-green-700 text-sm mt-2">A confirmation will go to <strong>{{ form.email }}</strong> — please double-check the spelling.</p>
              </div>

              <form v-else @submit.prevent="submitForm" novalidate class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="inquiry-name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input id="inquiry-name" v-model="form.name" type="text" required autocomplete="name" placeholder="Your full name" :aria-invalid="errors.name ? 'true' : 'false'" :aria-describedby="errors.name ? 'inquiry-name-error' : undefined" @input="clearError('name')" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" :class="errors.name ? 'border-red-300 bg-red-50/40' : ''" />
                    <p v-if="errors.name" id="inquiry-name-error" role="alert" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label for="inquiry-email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input id="inquiry-email" v-model="form.email" type="email" required autocomplete="email" placeholder="your@email.com" :aria-invalid="errors.email ? 'true' : 'false'" :aria-describedby="errors.email ? 'inquiry-email-error' : undefined" @input="clearError('email')" @blur="checkEmailField" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" :class="errors.email ? 'border-red-300 bg-red-50/40' : ''" />
                    <p v-if="errors.email" id="inquiry-email-error" role="alert" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="inquiry-company" class="block text-sm font-medium text-gray-700 mb-1">Company <span class="text-gray-400 font-normal">(optional)</span></label>
                    <input id="inquiry-company" v-model="form.company" type="text" autocomplete="organization" maxlength="200" placeholder="Company name" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label for="inquiry-phone" class="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp <span class="text-gray-400 font-normal">(optional)</span></label>
                    <input id="inquiry-phone" v-model="form.phone" type="tel" autocomplete="tel" maxlength="60" placeholder="+1 234 567 8900" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="inquiry-product" class="block text-sm font-medium text-gray-700 mb-1">Product Interest <span class="text-gray-400 font-normal">(optional)</span></label>
                    <select id="inquiry-product" v-model="form.product" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white">
                      <option value="">Select a category</option>
                      <option v-for="cat in productCategories" :key="cat.slug" :value="cat.name">{{ cat.name }}</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label for="inquiry-quantity" class="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity <span class="text-gray-400 font-normal">(optional)</span></label>
                    <select id="inquiry-quantity" v-model="form.quantity" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white">
                      <option value="">Select quantity range</option>
                      <option value="1-50">1 - 50 pieces</option>
                      <option value="50-200">50 - 200 pieces</option>
                      <option value="200-500">200 - 500 pieces</option>
                      <option value="500-1000">500 - 1,000 pieces</option>
                      <option value="1000+">1,000+ pieces</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label for="inquiry-message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea id="inquiry-message" v-model="form.message" required rows="4" maxlength="5000" placeholder="Tell us about your project: design ideas, fabric preferences, timeline, etc." :aria-invalid="errors.message ? 'true' : 'false'" :aria-describedby="errors.message ? 'inquiry-message-error' : undefined" @input="clearError('message')" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm resize-none" :class="errors.message ? 'border-red-300 bg-red-50/40' : ''"></textarea>
                  <p v-if="errors.message" id="inquiry-message-error" role="alert" class="mt-1 text-xs text-red-600">{{ errors.message }}</p>
                </div>
                <div>
                  <label for="inquiry-privacy" class="flex items-start gap-2 text-xs text-gray-600">
                    <input id="inquiry-privacy" v-model="agreedToPrivacy" type="checkbox" class="mt-0.5 flex-shrink-0" :aria-invalid="errors.privacy ? 'true' : 'false'" :aria-describedby="errors.privacy ? 'inquiry-privacy-error' : undefined" @change="clearError('privacy')" />
                    <span>
                      I agree to the
                      <NuxtLink to="/privacy-policy" class="text-brand hover:underline">Privacy Policy</NuxtLink>
                      and consent to being contacted about this inquiry.
                    </span>
                  </label>
                  <p v-if="errors.privacy" id="inquiry-privacy-error" class="mt-1 text-xs text-red-600">{{ errors.privacy }}</p>
                </div>
                <!-- 人机验证：仅当配置了 Turnstile site key 时显示 -->
                <div v-if="turnstileSiteKey" class="space-y-1">
                  <div id="turnstile-slot" class="min-h-[65px]"></div>
                  <p v-if="errors.turnstile" role="alert" class="text-xs text-red-600">{{ errors.turnstile }}</p>
                </div>
                <p v-if="formError" role="alert" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{{ formError }}</p>
                <!-- honeypot：真人看不到，填了就判定为机器人 -->
                <input
                  v-model="form.botfield"
                  type="text"
                  name="bot-field"
                  tabindex="-1"
                  autocomplete="off"
                  aria-hidden="true"
                  class="hidden"
                />
                <button type="submit" :disabled="formSubmitting" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  {{ formSubmitting ? 'Sending...' : 'Send Inquiry' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Contact Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="font-heading font-bold text-navy text-lg mb-4">Contact Information</h3>
              <ul class="space-y-4 text-sm">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div>
                    <div class="font-medium text-navy">Business Office (Shenzhen)</div>
                    <div class="text-gray-500 mt-0.5">Room 208, Building A, Phase 3, Jiewei Industrial City,<br>Shangmugu Community, Pinghu, Longgang District,<br>Shenzhen 518111, Guangdong, China</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  <div>
                    <div class="font-medium text-navy">Factory (Hubei)</div>
                    <div class="text-gray-500 mt-0.5">No.121 Xianyuan Avenue North, Longhuashan,<br>Xiantao, Hubei 433099, China</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <div>
                    <div class="font-medium text-navy">Email</div>
                    <a href="mailto:Marc@tutesports.com" class="text-gray-500 hover:text-brand transition-colors">Marc@tutesports.com</a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <div>
                    <div class="font-medium text-navy">Phone</div>
                    <a href="tel:+8618271971983" class="text-gray-500 hover:text-brand transition-colors">+86 182 7197 1983</a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <div class="font-medium text-navy">Business Hours</div>
                    <div class="text-gray-500 mt-0.5">Monday - Saturday<br>9:00 AM - 6:00 PM (GMT+8)</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Map：深圳办公室（原来只是灰色占位框，一眼半成品） -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <iframe
                title="TontonSports Shenzhen office location"
                src="https://maps.google.com/maps?q=Jiewei%20Industrial%20City%2C%20Shangmugu%2C%20Pinghu%2C%20Longgang%2C%20Shenzhen&z=13&output=embed"
                width="100%"
                height="240"
                style="border:0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              ></iframe>
              <div class="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                Shenzhen office · Xiantao factory
              </div>
            </div>

            <!-- Response Promise -->
            <div class="bg-brand/5 border border-brand/10 rounded-xl p-6">
              <h3 class="font-heading font-bold text-navy mb-3">What to Expect</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Response within 24 hours
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Free digital mockup included
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Detailed pricing breakdown
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  No commitment required
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
