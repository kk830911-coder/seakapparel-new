// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = process.env.NUXT_PUBLIC_STRAPI_URL || 'https://tutesportswear-strapi-us.onrender.com'

  try {
    const [productsResponse, blogsResponse, faqsResponse] = await Promise.all([
      // 顺带带上 category，用于生成分类落地页 URL（不额外多打一次接口）
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt&populate[category]=true`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt`),
      $fetch(`${STRAPI_BASE_URL}/api/faqs?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt`)
    ])

    const routes = []

    // Products - high priority, frequently updated
    const products = (productsResponse as any)?.data || []

    // 分类落地页：只收录"确实有产品"的分类，空分类页不提交给 Google（薄内容）
    const categorySlugs = new Set<string>()
    products.forEach((item: any) => {
      const raw = item.category || item.attributes?.category?.data || item.attributes?.category
      const list = Array.isArray(raw) ? raw : (raw ? [raw] : [])
      list.forEach((cat: any) => {
        const catSlug = cat?.slug || cat?.attributes?.slug
        if (catSlug) categorySlugs.add(catSlug)
      })
    })
    categorySlugs.forEach((catSlug: string) => {
      routes.push({
        loc: `/products/category/${catSlug}`,
        changefreq: 'weekly',
        priority: 0.8
      } as any)
    })

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