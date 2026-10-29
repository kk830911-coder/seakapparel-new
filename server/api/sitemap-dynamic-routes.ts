// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = process.env.NUXT_PUBLIC_STRAPI_URL || 'https://tutesportswear-strapi-us.onrender.com'

  try {
    const [productsResponse, blogsResponse, faqsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt`),
      $fetch(`${STRAPI_BASE_URL}/api/faqs?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt`)
    ])

    const routes = []

    // Products - high priority, frequently updated
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      const prodSlug = item.slug || item.attributes?.slug
      if (prodSlug) {
        routes.push({
          loc: `/products/${prodSlug}`,
          lastmod: item.updatedAt || item.attributes?.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.9
        })
      }
    })

    // Blogs - medium priority
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      const blogSlug = item.slug || item.attributes?.slug
      if (blogSlug) {
        routes.push({
          loc: `/blog/${blogSlug}`,
          lastmod: item.publishedAt || item.attributes?.publishedAt || new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.7
        })
      }
    })

    // FAQs - medium priority
    const faqs = (faqsResponse as any)?.data || []
    faqs.forEach((item: any) => {
      const faqSlug = item.slug || item.attributes?.slug
      if (faqSlug) {
        routes.push({
          loc: `/faq/${faqSlug}`,
          lastmod: item.updatedAt || item.attributes?.updatedAt || new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.6
        })
      }
    })

    console.log('Sitemap: Generated dynamic routes:', routes.length)
    return routes

  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return []
  }
})