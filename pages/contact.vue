<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  company: '',
  phone: '',
  product: '',
  quantity: '',
  message: ''
})
const formSubmitted = ref(false)
const formSubmitting = ref(false)

const submitForm = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return
  formSubmitting.value = true
  try {
    const mailtoLink = `mailto:Marc@tutesports.com?subject=Inquiry from ${form.value.name} - ${form.value.company || 'Individual'}&body=Name: ${form.value.name}%0AEmail: ${form.value.email}%0ACompany: ${form.value.company || 'N/A'}%0APhone: ${form.value.phone || 'N/A'}%0AProduct Interest: ${form.value.product || 'N/A'}%0AQuantity: ${form.value.quantity || 'N/A'}%0A%0AMessage:%0A${form.value.message}`
    window.location.href = mailtoLink
    formSubmitted.value = true
  } catch (err) {
    console.error('Form submission error:', err)
  } finally {
    formSubmitting.value = false
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
    { property: 'og:url', content: 'https://www.seakapparel.com/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact TontonSports",
        "description": "Contact TontonSports for custom sportswear manufacturing inquiries",
        "url": "https://www.seakapparel.com/contact"
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
          <a href="https://wa.me/8618271971983" target="_blank" class="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow-md transition-all group">
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

              <div v-if="formSubmitted" class="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <h3 class="font-heading font-bold text-green-800 text-lg mb-2">Inquiry Sent!</h3>
                <p class="text-green-600 text-sm">Thank you for reaching out. We'll respond within 24 hours.</p>
              </div>

              <form v-else @submit.prevent="submitForm" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input v-model="form.name" type="text" required placeholder="Your full name" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input v-model="form.email" type="email" required placeholder="your@email.com" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input v-model="form.company" type="text" placeholder="Company name" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input v-model="form.phone" type="text" placeholder="+1 234 567 8900" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Interest</label>
                    <select v-model="form.product" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white">
                      <option value="">Select a category</option>
                      <option value="Basketball Jerseys">Basketball Jerseys</option>
                      <option value="Football Uniforms">Football Uniforms</option>
                      <option value="Hockey Jerseys">Hockey Jerseys</option>
                      <option value="Yoga & Fitness Wear">Yoga & Fitness Wear</option>
                      <option value="Running Apparel">Running Apparel</option>
                      <option value="Team Uniforms">Team Uniforms</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity</label>
                    <select v-model="form.quantity" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white">
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
                  <label class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea v-model="form.message" required rows="4" placeholder="Tell us about your project: design ideas, fabric preferences, timeline, etc." class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm resize-none"></textarea>
                </div>
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
                    <div class="font-medium text-navy">Factory Address</div>
                    <div class="text-gray-500 mt-0.5">Room 207, Building A, Jiewei Industrial Park,<br>Longgang District, Shenzhen,<br>Guangdong Province, China</div>
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

            <!-- Map Placeholder -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-gray-100 h-48 flex items-center justify-center">
                <div class="text-center text-gray-400">
                  <svg class="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <p class="text-sm">Google Maps</p>
                  <p class="text-xs">Longgang District, Shenzhen</p>
                </div>
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
