// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = 'https://seak-backend.onrender.com'
  
  try {
    // 💡 1. 调整请求，明确拉取 documentId
    const [productsResponse, blogsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=documentId`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=documentId`)
    ])

    const routes = []

    // 💡 2. 解析产品数据：统一使用 documentId
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      const prodId = item.documentId || item.attributes?.documentId || item.id
      if (prodId) {
        routes.push(`/products/${prodId}`)
      }
    })

    // 💡 3. 解析博客数据：【强制】仅使用 documentId
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      // 直接提取 documentId，摒弃 slug 逻辑
      const blogId = item.documentId || item.attributes?.documentId || item.id
      
      if (blogId) {
        routes.push(`/blog/${blogId}`)
      }
    })

    console.log('成功全自动生成以下动态 SEO 路由:', routes)
    return routes

  } catch (error) {
    console.error('动态站点地图生成失败，可能是后端正在休眠或字段错乱:', error)
    return []
  }
})