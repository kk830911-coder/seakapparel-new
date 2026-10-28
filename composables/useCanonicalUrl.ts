export const useCanonicalUrl = () => {
  const route = useRoute()
  const baseUrl = 'https://www.tutesports.com'
  
  const canonicalUrl = computed(() => {
    const path = route.path
    const query = Object.keys(route.query).length > 0 
      ? '?' + Object.entries(route.query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : ''
    return `${baseUrl}${path}${query}`
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })

  return { canonicalUrl }
}
