// server/api/sitemap-dynamic-routes.ts
export default defineEventHandler(async () => {
  // 你的 Strapi 后端线上地址
  const STRAPI_BASE_URL = 'https://seak-backend.onrender.com'
  
  try {
    // 💡 1. 并发请求 Strapi 的产品接口和博客接口（根据你 Strapi 的实际 API 标识符调整）
    const [productsResponse, blogsResponse] = await Promise.all([
      $fetch(`${STRAPI_BASE_URL}/api/products?fields[0]=id`),
      $fetch(`${STRAPI_BASE_URL}/api/blogs?fields[0]=id&fields[1]=slug`)
    ])

    const routes = []

    // 💡 2. 解析产品数据并追加到路由数组
    // 顺便兼容一下 Strapi v4 (data.attributes) 和 v5 (直接在 data 里) 的不同数据结构
    const products = (productsResponse as any)?.data || []
    products.forEach((item: any) => {
      const id = item.id
      routes.push(`/products/${id}`)
    })

    // 💡 3. 解析博客数据并追加（如果你博客详情页用的是 id 就用 id，用的是 slug 就用 slug）
    const blogs = (blogsResponse as any)?.data || []
    blogs.forEach((item: any) => {
      // 如果你的前端路由是 /blog/123，用 id：
      const id = item.id
      routes.push(`/blog/${id}`)
      
      // 如果你的前端路由是 /blog/how-to-import，用 slug (把上面两行注释掉，换成下面这行)：
      // const slug = item.slug || item.attributes?.slug || item.id
      // routes.push(`/blog/${slug}`)
    })

    // 返回给 @nuxtjs/sitemap 模块，它会自动拼接到 sitemap.xml 中
    return routes

  } catch (error) {
    console.error('生成动态站点地图失败，后端可能正在休眠:', error)
    // 如果后端挂了或者在休眠，返回空数组，保证打包不崩溃
    return []
  }
})