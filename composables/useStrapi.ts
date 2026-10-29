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

export function getSlug(item: any): string {
  return item?.slug || item?.attributes?.slug || ''
}

export function getTitle(item: any): string {
  return item?.title || item?.attributes?.title || ''
}

export function getPrice(item: any): number {
  return item?.price ?? item?.attributes?.price ?? 0
}

export function getMoq(item: any): number {
  return item?.moq ?? item?.attributes?.moq ?? 1
}
