import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getCourses } from '../services/hskService.js'

const LEVEL_COLORS = [
  'from-brand-400 to-brand-500',
  'from-orange-400 to-orange-500',
  'from-yellow-400 to-yellow-500',
  'from-red-400 to-red-500',
  'from-pink-400 to-pink-500',
  'from-rose-400 to-rose-500'
]

export default function HskCourses() {
  const [courses, setCourses] = useState([])
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    const data = getCourses()
    setCourses(data)
    if (data.length > 0) setActiveTab(data[0].id)
  }, [])

  const activeCourse = courses.find((c) => c.id === activeTab)

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">Khóa học theo giáo trình tiêu chuẩn</h1>
              <p className="text-gray-500 mt-1">Vui lòng chọn giáo trình bạn muốn học</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-4xl">📚</span>
              <span className="text-4xl">🎓</span>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-brand-100">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500 text-lg">Chưa có giáo trình nào.</p>
              <p className="text-gray-400 text-sm mt-1">Admin cần vào trang quản lý để tạo giáo trình và bài học.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setActiveTab(course.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      activeTab === course.id
                        ? 'bg-brand-500 border-brand-500 text-white shadow-card'
                        : 'bg-white border-brand-100 text-gray-700 hover:border-brand-300'
                    }`}
                  >
                    <span className="text-lg">{activeTab === course.id ? '📖' : '📘'}</span>
                    <div className="text-left">
                      <div>{course.name}</div>
                      {course.author && <div className="text-xs opacity-75">{course.author}</div>}
                    </div>
                  </button>
                ))}
              </div>

              {activeCourse && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{activeCourse.name}</h2>
                        <p className="text-xs text-gray-400">{activeCourse.description || 'Bộ giáo trình chuẩn'}</p>
                      </div>
                    </div>
                  </div>

                  {activeCourse.levels.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-brand-100">
                      <p className="text-gray-400">Chưa có cấp độ nào. Admin cần thêm cấp độ cho giáo trình này.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {activeCourse.levels
                        .sort((a, b) => (a.levelNum || 0) - (b.levelNum || 0))
                        .map((level, idx) => {
                          const totalVocab = level.lessons.reduce((sum, l) => sum + (l.vocab?.length || 0), 0)
                          const totalLessons = level.lessons.length
                          const color = LEVEL_COLORS[idx % LEVEL_COLORS.length]

                          return (
                            <Link
                              key={level.id}
                              to={`/hsk/${activeCourse.id}/${level.id}`}
                              className="bg-white rounded-2xl p-4 shadow-card border border-brand-100 hover:-translate-y-1 transition-transform"
                            >
                              <div className={`h-36 rounded-xl bg-gradient-to-br ${color} flex flex-col items-center justify-center text-white mb-3`}>
                                <span className="text-xs font-semibold opacity-80">STANDARD</span>
                                <span className="text-3xl font-extrabold">HSK</span>
                                <span className="text-4xl font-extrabold">{level.levelNum || idx + 1}</span>
                              </div>

                              <div className="space-y-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1"><span>📝</span> {totalVocab} từ vựng</div>
                                <div className="flex items-center gap-1"><span>📖</span> {totalLessons} bài học</div>
                              </div>

                              <div className="mt-3">
                                <span className="text-brand-600 text-sm font-semibold hover:underline">Bắt đầu học →</span>
                              </div>
                            </Link>
                          )
                        })}
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <div className="bg-white rounded-xl p-5 border border-brand-100 text-center shadow-card">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-bold text-gray-800">Học theo lộ trình chuẩn</h4>
              <p className="text-xs text-gray-500 mt-1">Nội dung bám sát giáo trình chính thức HSK và Boya.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-brand-100 text-center shadow-card">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-bold text-gray-800">Theo dõi tiến độ</h4>
              <p className="text-xs text-gray-500 mt-1">Hệ thống ghi nhận và phân tích quá trình học tập của bạn.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-brand-100 text-center shadow-card">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-bold text-gray-800">Ứng dụng AI hỗ trợ</h4>
              <p className="text-xs text-gray-500 mt-1">AI giúp giải thích, luyện tập và gợi ý nội dung phù hợp.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-brand-100 text-center shadow-card">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="font-bold text-gray-800">Học mọi lúc, mọi nơi</h4>
              <p className="text-xs text-gray-500 mt-1">Truy cập trên mọi thiết bị, học offline khi cần.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}