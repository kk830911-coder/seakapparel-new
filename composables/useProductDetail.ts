import { useStrapi, getMediaList } from './useStrapi'

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

  // 兜底：只推导 Material（产品字段里有值时才出现）。
  // MOQ / Reference Price / Category / Sport Type 都不再推导：
  // 这四项要么在页面顶部（阶梯价、面包屑、标题）已经显示，要么与分类重复，放进参数表只会显得啰嗦。
  const derived: SpecRow[] = []
  const material = product?.material || product?.attributes?.material
  if (material) derived.push({ label: 'Material', value: String(material) })
  derived.forEach((r: SpecRow) => {
    if (!rows.some((x: SpecRow) => x.label.toLowerCase() === r.label.toLowerCase())) rows.push(r)
  })

  return rows
}

/**
 * 工艺与面料：分类富文本（craftContent，可含图片）优先 → 全站纯文本（craftBody）回退。
 * 分类不再有独立标题字段，标题统一取全站 craftTitle。
 */
export function resolveCraft(product: any, globalBlocks: any, strapiUrl: string) {
  const cat = product?.category
  const blocks = cat?.craftContent
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0
  return {
    title: globalBlocks?.craftTitle || 'Craft & Fabric',
    // 纯文本正文：分类没写富文本时回退到全站纯文本
    body: hasBlocks ? '' : globalBlocks?.craftBody || '',
    // 分类富文本节点：有则优先显示（标题也写在富文本里）
    bodyBlocks: hasBlocks ? blocks : [],
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
