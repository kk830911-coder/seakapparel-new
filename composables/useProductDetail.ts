import { useStrapi, getMediaList, getMoq, getPriceFrom, formatPrice } from './useStrapi'

export interface SpecRow {
  label: string
  value: string
}

export interface DetailImage {
  url: string
  alt: string
}

/**
 * 参数表取值优先级：产品自身 → 所属分类 → 全站默认。
 * 同一 label 只保留优先级最高的一条：分类填通用值、产品填具体值时不会重复出现两行。
 */
export function resolveSpecRows(product: any, globalBlocks: any): SpecRow[] {
  const rows: SpecRow[] = []

  const push = (list: any) => {
    if (!Array.isArray(list)) return
    list.forEach((r: any) => {
      const label = String(r?.label || '').trim()
      const value = String(r?.value ?? '').trim()
      if (!label || !value) return
      if (rows.some((x: SpecRow) => x.label.toLowerCase() === label.toLowerCase())) return
      rows.push({ label, value })
    })
  }

  push(product?.specRows)
  push(product?.category?.specRows)
  push(globalBlocks?.specDefaults)

  // 兜底：从产品字段自动推导，保证任何产品都有一张像样的参数表
  const derived: SpecRow[] = []
  const moq = getMoq(product)
  if (moq > 0) derived.push({ label: 'MOQ', value: `${moq} pieces` })
  const priceFrom = getPriceFrom(product)
  if (priceFrom !== null) derived.push({ label: 'Reference Price', value: `From $${formatPrice(priceFrom)} / pc` })
  const material = product?.material || product?.attributes?.material
  if (material) derived.push({ label: 'Material', value: String(material) })
  const sport = product?.sport_type || product?.attributes?.sport_type
  if (sport) derived.push({ label: 'Sport Type', value: String(sport).replace(/_/g, ' ') })
  const categoryName = product?.category?.name
  if (categoryName) derived.push({ label: 'Category', value: String(categoryName) })
  derived.forEach((r: SpecRow) => {
    if (!rows.some((x: SpecRow) => x.label.toLowerCase() === r.label.toLowerCase())) rows.push(r)
  })

  return rows
}

/** 工艺与面料：分类覆盖 → 全站共用（图片取自全站共用块） */
export function resolveCraft(product: any, globalBlocks: any, strapiUrl: string) {
  const cat = product?.category
  return {
    title: cat?.craftTitle || globalBlocks?.craftTitle || 'Craft & Fabric',
    body: cat?.craftBody || globalBlocks?.craftBody || '',
    images: getMediaList(globalBlocks?.craftImages, strapiUrl)
  }
}

/**
 * 全站共用块（工艺 / 认证 / 客户 / 工厂实拍 / 物流 / 条款 / FAQ）。
 * 后台未开放公开权限或接口异常时返回 null，页面会自动隐藏这些区块，不会报错、不会白屏。
 */
export async function useGlobalProductBlocks() {
  const { strapiUrl } = useStrapi()

  const { data } = await useFetch(`${strapiUrl}/api/global-product-block`, {
    query: {
      'populate[craftImages]': true,
      'populate[specDefaults]': true,
      'populate[certifications][populate][image]': true,
      'populate[clients][populate][image]': true,
      'populate[factoryShots][populate][image]': true,
      'populate[infoBlocks][populate][images]': true,
      'populate[detailFaqs]': true
    },
    key: 'global-product-blocks'
  })

  return { blocks: computed(() => (data.value as any)?.data || null) }
}
