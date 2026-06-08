// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  const STRAPI_BASE_URL = 'https://seak-backend.onrender.com'
  
  try {
    // 💡 1. 同时请求产品和博客，显式指定我们要拉取新版 Strapi 的唯一标识符 documentId 和 slug
    const [productsResponse, blogsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=documentId&fields[1]=id`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=documentId&fields[1]=slug&fields[2]=id`)
    ])

    const routes = []

    // 💡 2. 解析产品数据：优先取 documentId，防止新版 Strapi v5 报 404
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      // 兼容 Strapi v5 直接在根部，以及 v4 在 attributes 里的情况
      const prodId = item.documentId || item.attributes?.documentId || item.id
      if (prodId) {
        routes.push(`/products/${prodId}`)
      }
    })

    // 💡 3. 解析博客数据：优先使用 slug，没有就用 documentId 保底
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      const slug = item.slug || item.attributes?.slug
      const blogId = item.documentId || item.attributes?.documentId || item.id
      
      if (slug) {
        routes.push(`/blog/${slug}`)
      } else if (blogId) {
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