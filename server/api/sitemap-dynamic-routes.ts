// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = 'https://seak-backend.onrender.com'
  
  try {
    const [productsResponse, blogsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs`)
    ])

    const routes = []

    // 1. 处理产品：用最原始、最粗暴的方式提取 ID
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      // 检查所有可能的字段名，强制转为字符串
      const id = item.documentId || item.attributes?.documentId || item.id || ''
      if (id) {
        routes.push(`/products/${String(id)}`)
      }
    })

    // 2. 处理博客
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      const slug = item.slug || item.attributes?.slug
      const docId = item.documentId || item.attributes?.documentId || item.id
      
      if (slug) {
        routes.push(`/blog/${String(slug)}`)
      } else if (docId) {
        routes.push(`/blog/${String(docId)}`)
      }
    })

    return routes

  } catch (error) {
    console.error('站点地图生成失败:', error)
    return []
  }
})