/**
 * 全站唯一的分类数据源。
 * 导航、首页分类卡、产品列表筛选、询盘下拉全部从这里取，
 * 新增/改名分类只改这一处，不会出现在某个页面漏改的情况。
 */
export interface ProductCategory {
  name: string
  slug: string
}

export const productCategories: ProductCategory[] = [
  { name: 'Basketball Uniform', slug: 'basketball-uniform' },
  { name: 'Football Uniform', slug: 'football-uniform' },
  { name: 'Badminton Jersey', slug: 'badminton-jersey' },
  { name: 'Baseball Jersey', slug: 'baseball-jersey' },
  { name: 'Wrestling Singlet', slug: 'wrestling-singlet' },
  { name: 'Ice Hockey Jersey', slug: 'ice-hockey-jersey' },
  { name: 'Rugby Jersey', slug: 'rugby-jersey' },
  { name: 'American Football Jersey', slug: 'american-football-jersey' },
  { name: 'Boxing Outfit', slug: 'boxing-outfit' },
  { name: 'Sports Hoodie', slug: 'sports-hoodie' },
  { name: 'Yoga Wear', slug: 'yoga-wear' }
]

export function getCategoryName(slug?: string | null): string | null {
  if (!slug) return null
  return productCategories.find((c: ProductCategory) => c.slug === slug)?.name || null
}
