// =========================================================
// Cac ham xu ly ngay thang (dinh dang ngay/thang/nam - Viet Nam)
// =========================================================

// Chuyen gia tri bat ky -> Date an toan
function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  }
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

// Hien thi dd/mm/yyyy
export function formatDate(value) {
  const d = toDate(value)
  if (!d) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

// Kiem tra het han (so voi thoi gian thuc)
export function isExpired(expireDate) {
  const d = toDate(expireDate)
  if (!d) return false
  d.setHours(23, 59, 59, 999)
  return d.getTime() < new Date().getTime()
}

// Ngay hom nay dang yyyy-mm-dd
export function todayStr() {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Cong them so thang
export function addMonths(dateStr, months) {
  const d = toDate(dateStr) || new Date()
  d.setMonth(d.getMonth() + (months || 0))
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// ===== CHUYEN DOI GIUA dd/mm/yyyy <-> yyyy-mm-dd =====

// Tu yyyy-mm-dd -> dd/mm/yyyy (de hien trong o nhap)
export function toVNDate(isoStr) {
  if (!isoStr) return ''
  const m = String(isoStr).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  return `${m[3]}/${m[2]}/${m[1]}`
}

// Tu dd/mm/yyyy -> yyyy-mm-dd (de luu vao database)
// Tra ve null neu nhap sai
export function fromVNDate(vnStr) {
  if (!vnStr) return null
  const m = String(vnStr).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}