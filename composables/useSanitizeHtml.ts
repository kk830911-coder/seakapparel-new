import DOMPurify from 'isomorphic-dompurify'

/**
 * 清洗后台粘贴的 HTML 源码，防止 XSS。
 * 允许常见排版/表格/图片标签与内联样式，移除脚本、事件属性、iframe 等。
 */
export const useSanitizeHtml = () => {
  return (html) => {
    if (!html || typeof html !== 'string') return ''
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true, svg: true },
      ALLOWED_ATTR: [
        'style', 'class', 'href', 'src', 'alt', 'title', 'target', 'rel',
        'width', 'height', 'colspan', 'rowspan', 'align', 'valign', 'dir'
      ],
      ADD_TAGS: ['figure', 'figcaption', 'tbody', 'thead', 'tfoot'],
      ALLOW_DATA_ATTR: false
    })
  }
}
