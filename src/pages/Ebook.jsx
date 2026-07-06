import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Loader from '../components/Loader.jsx'
import { getEbooks } from '../services/ebookService.js'

// Mau bia cho tung cap HSK
const HSK_COLORS = {
  HSK1: 'from-teal-400 to-teal-500',
  HSK2: 'from-orange-400 to-orange-500',
  HSK3: 'from-yellow-400 to-yellow-500',
  HSK4: 'from-red-400 to-red-500',
  HSK5: 'from-blue-500 to-blue-600',
  HSK6: 'from-purple-500 to-purple-600'
}

// Du lieu mau (khi chua cau hinh Supabase van co sach de xem)
const SAMPLE = [
  { course: 'HSK2.0', levels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] },
  { course: 'HSK3.0', levels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] }
]

function BookCard({ book }) {
  const color = HSK_COLORS[book.hsk_level] || 'from-brand-400 to-brand-500'
  const num = book.hsk_level?.replace('HSK', '') || '?'

  return (
    <div className="bg-white rounded-2xl p-3 shadow-card border border-brand-100 hover:-translate-y-1 transition-transform">
      {/* Bia sach */}
      <div
        className={`h-40 rounded-xl bg-gradient-to-br ${color} flex flex-col items-center justify-center text-white`}
      >
        <span className="text-xs opacity-80">STANDARD COURSE</span>
        <span className="text-4xl font-extrabold">HSK</span>
        <span className="text-5xl font-extrabold">{num}</span>
        {book.course === 'HSK3.0' && <span className="text-xs mt-1">(3.0版)</span>}
      </div>
      {/* Thong tin */}
      <div className="mt-3 px-1">
        <h4 className="font-bold text-gray-800">
          {book.title || `HSK ${num}${book.course === 'HSK3.0' ? ' (3.0版)' : ''}`}
        </h4>
        <p className="text-xs text-gray-400">{book.description || 'Sách giáo trình'}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => book.file_url && window.open(book.file_url, '_blank')}
            className="flex-1 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold"
          >
            📕 Xem ngay
          </button>
          <button
            onClick={() => {
              if (book.file_url) {
                const a = document.createElement('a')
                a.href = book.file_url
                a.download = book.title || 'ebook.pdf'
                a.click()
              } else {
                alert('Sách này chưa có file tải xuống.')
              }
            }}
            className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
          >
            ⬇ Tải xuống
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Ebook() {
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const books = await getEbooks()
        if (!mounted) return
        // Nhom sach theo giao trinh (HSK2.0 / HSK3.0)
        const map = {}
        for (const b of books) {
          const key = b.course || 'HSK2.0'
          if (!map[key]) map[key] = []
          map[key].push(b)
        }
        const result = Object.keys(map).map((course) => ({ course, books: map[course] }))
        setGroups(result)
      } catch {
        // Neu chua co Supabase -> dung du lieu mau
        const result = SAMPLE.map((g) => ({
          course: g.course,
          books: g.levels.map((lv) => ({ hsk_level: lv, course: g.course }))
        }))
        setGroups(result)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <Loader text="Đang tải kho sách..." />
          ) : (
            groups.map((group) => (
              <section key={group.course} className="mb-10">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-800 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm">
                    📖
                  </span>
                  Giáo trình chuẩn {group.course.replace('HSK', 'HSK ')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {group.books.map((book, i) => (
                    <BookCard key={book.id || `${group.course}-${i}`} book={book} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}