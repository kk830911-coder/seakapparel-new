/**
 * 全站唯一的分类数据源。
 * 导航、首页分类卡、产品列表筛选、询盘下拉全部从这里取，
 * 新增/改名分类只改这一处，不会出现在某个页面漏改的情况。
 */
export interface ProductCategory {
  name: string
  slug: string
  /** 首页分类卡片的配图（public/category/ 下） */
  img?: string
}

export const productCategories: ProductCategory[] = [
  { name: 'Basketball Uniform', slug: 'basketball-uniform', img: '/category/basketball.png' },
  { name: 'Football Uniform', slug: 'football-uniform', img: '/category/football.png' },
  { name: 'Badminton Jersey', slug: 'badminton-jersey', img: '/category/BadmintonJersey.png' },
  { name: 'Baseball Jersey', slug: 'baseball-jersey', img: '/category/BaseballJersey.png' },
  { name: 'Wrestling Singlet', slug: 'wrestling-singlet', img: '/category/WrestlingSinglet.png' },
  { name: 'Ice Hockey Jersey', slug: 'ice-hockey-jersey', img: '/category/IceHockeyJersey.png' },
  { name: 'Rugby Jersey', slug: 'rugby-jersey', img: '/category/RugbyJersey.png' },
  { name: 'American Football Jersey', slug: 'american-football-jersey', img: '/category/AmericanFootball.png' },
  { name: 'Boxing Outfit', slug: 'boxing-outfit', img: '/category/BoxingOutfit.png' },
  { name: 'Sports Hoodie', slug: 'sports-hoodie', img: '/category/SportsHoodie.png' },
  { name: 'Yoga Wear', slug: 'yoga-wear', img: '/category/YogaWear.png' }
]

export function getCategoryName(slug?: string | null): string | null {
  if (!slug) return null
  return productCategories.find((c: ProductCategory) => c.slug === slug)?.name || null
}
