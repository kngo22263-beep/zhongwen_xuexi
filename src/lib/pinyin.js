// =========================================================
// Tien ich xu ly Pinyin va tach cau cho doan van on tap
// =========================================================

/**
 * Tach 1 doan van tieng Trung thanh cac cau rieng le.
 * Dua tren cac dau cau tieng Trung: 。！？；
 * @param {string} text - Doan van
 * @returns {string[]} - Mang cac cau
 */
export function splitSentences(text) {
  if (!text) return []
  // Tach theo dau cau nhung van giu lai dau cau
  const matches = text.match(/[^。！？!?；;]+[。！？!?；;]?/g)
  if (!matches) return [text.trim()].filter(Boolean)
  return matches.map((s) => s.trim()).filter(Boolean)
}

/**
 * Dem so cau trong 1 doan van.
 * @param {string} text
 * @returns {number}
 */
export function countSentences(text) {
  return splitSentences(text).length
}

/**
 * Kiem tra 1 ky tu co phai chu Han khong.
 * @param {string} ch
 * @returns {boolean}
 */
export function isHanzi(ch) {
  if (!ch) return false
  const code = ch.codePointAt(0)
  return code >= 0x4e00 && code <= 0x9fff
}

/**
 * Dem so chu Han trong 1 chuoi.
 * @param {string} text
 * @returns {number}
 */
export function countHanzi(text) {
  if (!text) return 0
  let count = 0
  for (const ch of text) {
    if (isHanzi(ch)) count++
  }
  return count
}

/**
 * Chuan hoa khoang trang cho pinyin (bo khoang trang thua).
 * @param {string} pinyin
 * @returns {string}
 */
export function normalizePinyin(pinyin) {
  if (!pinyin) return ''
  return pinyin.replace(/\s+/g, ' ').trim()
}