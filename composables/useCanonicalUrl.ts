// 统一 canonical 与 og:url：
// 1. 剔除 utm_* / fbclid 等追踪参数，避免同一页面被搜索引擎当成多个 URL
// 2. 保留有意义的筛选参数（category / page 等）并按字母排序，保证 URL 唯一
// 3. og:url 与 canonical 保持一致（之前详情页 og:url 一直指向首页）
const TRACKING_PARAMS = /^(utm_|ga_|mc_|pk_|hsa_|_hs)|^(fbclid|gclid|msclkid|yclid|dclid|igshid|ref|referrer|source|spm)$/

export const useCanonicalUrl = () => {
  const route = useRoute()
  const baseUrl = 'https://www.tutesports.com'

  const canonicalUrl = computed(() => {
    const params = Object.entries(route.query)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '' && !TRACKING_PARAMS.test(key))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

    const path = route.path !== '/' ? route.path.replace(/\/+$/, '') : '/'
    return `${baseUrl}${path}${params.length ? '?' + params.join('&') : ''}`
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })

  useSeoMeta({
    ogUrl: () => canonicalUrl.value
  })

  return { canonicalUrl }
}
