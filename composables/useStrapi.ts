import { useRuntimeConfig } from '#imports'

const FALLBACK_IMG = '/category/basketball.png'

export function useStrapi() {
  const config = useRuntimeConfig()
  const strapiUrl = config.public.strapiUrl || 'https://tutesportswear-strapi-us.onrender.com'
  return { strapiUrl }
}

export function getCleanImageUrl(rawUrl: string, strapiUrl: string): string {
  if (!rawUrl) return FALLBACK_IMG
  if (rawUrl.startsWith('/')) return `${strapiUrl}${rawUrl}`
  return rawUrl.split('?')[0]
}

export function getProductImageUrl(item: any, strapiUrl: string): string {
  let url = ''
  if (item?.image?.url) url = item.image.url
  else if (Array.isArray(item?.image) && item.image[0]?.url) url = item.image[0].url
  else if (item?.attributes?.image?.data?.attributes?.url) url = item.attributes.image.data.attributes.url
  return getCleanImageUrl(url, strapiUrl)
}

/** Cloudinary 原图 → 自动格式 + 压缩（后台走 Cloudinary 上传，URL 形如 .../upload/v123/xxx.png） */
export function optimizeCloudinary(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  if (url.includes('/f_auto')) return url
  const [base, rest] = url.split('/upload/')
  return `${base}/upload/f_auto,q_auto,w_1200/${rest}`
}

/** 单个媒体字段（可传数组，取第一张）→ 完整可访问 URL */
export function getMediaUrl(value: any, strapiUrl: string): string {
  if (!value) return ''
  const media = Array.isArray(value) ? value[0] : value
  const raw = typeof media === 'string' ? media : (media?.url || media?.attributes?.url || '')
  if (!raw) return ''
  return optimizeCloudinary(getCleanImageUrl(raw, strapiUrl))
}

/** 多个媒体字段 → [{ url, alt }]，兼容 Strapi 5 扁平数组与 Strapi 4 的 data[].attributes */
export function getMediaList(value: any, strapiUrl: string): { url: string; alt: string }[] {
  const raw = Array.isArray(value)
    ? value
    : (value?.data ? value.data : (value ? [value] : []))
  return raw
    .map((m: any) => {
      const url = typeof m === 'string' ? m : (m?.url || m?.attributes?.url || '')
      return {
        url: url ? optimizeCloudinary(getCleanImageUrl(url, strapiUrl)) : '',
        alt: (typeof m === 'string' ? '' : (m?.alternativeText || m?.attributes?.alternativeText || '')) as string
      }
    })
    .filter((i: { url: string }) => !!i.url)
}

export function getSlug(item: any): string {
  return item?.slug || item?.attributes?.slug || ''
}

export function getTitle(item: any): string {
  return item?.title || item?.attributes?.title || ''
}

// 无价格产品使用该默认起订量
export const DEFAULT_MOQ = 10

/**
 * 起订量：优先取阶梯价第一档的 minQty（与价格区间保持一致），
 * 其次取产品自填 moq 字段，都没有则用 DEFAULT_MOQ。
 */
export function getMoq(item: any): number {
  const tiers = getPriceTiers(item)
  if (tiers.length) return tiers[0].minQty

  const legacy = toNumber(item?.moq ?? item?.attributes?.moq)
  return legacy !== null && legacy > 0 ? legacy : DEFAULT_MOQ
}

// ---------- Pricing ----------

export const DEFAULT_PRICE_NOTE =
  'Reference price based on standard fabric and print method. Excludes shipping, sampling fee and logo setup. Final price depends on fabric, print method and quantity.'

export interface PriceTier {
  minQty: number
  maxQty: number | null
  unitPrice: number
  label: string
}

function toNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/** 后台填的阶梯价，按起订量升序 */
export function getPriceTiers(item: any): PriceTier[] {
  const raw = item?.priceTiers ?? item?.attributes?.priceTiers
  if (!Array.isArray(raw)) return []

  return raw
    .map((row: any) => {
      const minQty = toNumber(row?.minQty)
      const unitPrice = toNumber(row?.unitPrice)
      const maxQty = toNumber(row?.maxQty)
      if (minQty === null || unitPrice === null || unitPrice <= 0) return null
      const label =
        row?.label?.trim() ||
        (maxQty && maxQty >= minQty ? `${minQty} – ${maxQty} pcs` : `${minQty}+ pcs`)
      return { minQty, maxQty: maxQty && maxQty >= minQty ? maxQty : null, unitPrice, label }
    })
    .filter(Boolean)
    .sort((a: PriceTier, b: PriceTier) => a.minQty - b.minQty)
}

/** 起价：优先取阶梯最低价，其次兼容旧的单一 price 字段；都没有返回 null（不要返回 0） */
export function getPriceFrom(item: any): number | null {
  const tiers = getPriceTiers(item)
  if (tiers.length) return Math.min(...tiers.map(t => t.unitPrice))

  const legacy = toNumber(item?.price ?? item?.attributes?.price)
  return legacy !== null && legacy > 0 ? legacy : null
}

export function hasPrice(item: any): boolean {
  return getPriceFrom(item) !== null
}

export function getPriceNote(item: any): string {
  const note = item?.priceNote ?? item?.attributes?.priceNote
  return (typeof note === 'string' && note.trim()) || DEFAULT_PRICE_NOTE
}

/** 9.8 -> "9.80"，12 -> "12"；无价返回空串 */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return ''
  const n = Number(value)
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)
}

/** schema.org 报价区间，无价返回 null（绝不能输出 price: 0） */
export function getOfferRange(item: any): { low: number; high: number; count: number } | null {
  const tiers = getPriceTiers(item)
  const prices = tiers.map(t => t.unitPrice)
  if (prices.length) {
    return { low: Math.min(...prices), high: Math.max(...prices), count: prices.length }
  }
  const single = getPriceFrom(item)
  return single === null ? null : { low: single, high: single, count: 1 }
}
