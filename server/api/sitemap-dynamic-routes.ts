// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = 'https://seak-backend.onrender.com'
  
  try {
    // 💡 显式拉取 documentId，确保前台路由匹配准确
    const [productsResponse, blogsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=documentId`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=documentId&fields[1]=slug`)
    ])

    const routes = []

    // 1. 处理产品
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      const docId = item.documentId || item.id
      if (docId) routes.push(`/products/${docId}`)
    })

    // 2. 处理博客：如果有 slug 就用 slug，没有就用 documentId 保底
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      const slug = item.slug || item.attributes?.slug
      const docId = item.documentId || item.id
      
      if (slug) {
        routes.push(`/blog/${slug}`)
      } else if (docId) {
        routes.push(`/blog/${docId}`) // 这里的 docId 确保了即使没有 slug 也能访问
      }
    })

    return routes

  } catch (error) {
    console.error('动态站点地图生成异常:', error)
    return []
  }
})