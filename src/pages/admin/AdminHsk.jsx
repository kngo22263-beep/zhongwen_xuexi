import { useState, useEffect } from 'react'
import Modal from '../../components/Modal.jsx'
import {
  getCourses, createCourse, deleteCourse,
  createLevel, deleteLevel,
  getLessons, createHskLesson, deleteHskLesson,
  getHskLesson, addHskVocab, addHskVocabBulk, deleteHskVocab,
  addHskText, deleteHskText,
  addHskGrammar, deleteHskGrammar
} from '../../services/hskService.js'

export default function AdminHsk() {
  const [courses, setCourses] = useState([])
  const [view, setView] = useState('courses')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [refresh, setRefresh] = useState(0)

  function reload() { setRefresh((r) => r + 1) }
  useEffect(() => { setCourses(getCourses()) }, [refresh])

  // ===== MAN HINH 1: GIAO TRINH =====
  if (view === 'courses') {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">QUẢN LÝ HỌC HSK</h1>
            <p className="text-sm text-gray-500">Tạo và quản lý giáo trình, cấp độ, bài học</p>
          </div>
          <button onClick={() => setShowModal('course')} className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm">+ Tạo giáo trình mới</button>
        </div>
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-brand-100"><p className="text-gray-400">Chưa có giáo trình. Bấm "Tạo giáo trình mới" để bắt đầu.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 border border-brand-100 shadow-card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="cursor-pointer flex-1" onClick={() => { setSelectedCourse(c); setView('levels') }}>
                    <h3 className="font-bold text-gray-800 text-lg">{c.name}</h3>
                    {c.author && <p className="text-sm text-gray-400">Tác giả: {c.author}</p>}
                    <p className="text-sm text-brand-600 mt-1">{c.levels?.length || 0} cấp độ</p>
                  </div>
                  <button onClick={() => { if (window.confirm(`Xóa "${c.name}"?`)) { deleteCourse(c.id); reload() } }} className="text-gray-300 hover:text-red-500">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showModal === 'course' && <CourseModal onClose={() => setShowModal(null)} onCreated={reload} />}
      </div>
    )
  }

  // ===== MAN HINH 2: CAP DO =====
  if (view === 'levels' && selectedCourse) {
    const course = getCourses().find((c) => c.id === selectedCourse.id) || selectedCourse
    const levels = course.levels || []
    return (
      <div>
        <button onClick={() => setView('courses')} className="text-sm text-gray-500 hover:text-brand-600 mb-3">← Quay lại danh sách giáo trình</button>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-extrabold text-gray-800">{course.name} — Cấp độ</h1>
          <button onClick={() => setShowModal('level')} className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm">+ Thêm cấp độ</button>
        </div>
        {levels.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-brand-100"><p className="text-gray-400">Chưa có cấp độ. Bấm "Thêm cấp độ".</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levels.sort((a, b) => (a.levelNum || 0) - (b.levelNum || 0)).map((lv) => (
              <div key={lv.id} className="bg-white rounded-xl p-4 border border-brand-100 text-center shadow-card">
                <div className="text-2xl font-extrabold text-brand-600 mb-1">{lv.name || `HSK ${lv.levelNum}`}</div>
                <p className="text-xs text-gray-400">{lv.lessons?.length || 0} bài học</p>
                <div className="flex gap-1 mt-3 justify-center">
                  <button onClick={() => { setSelectedLevel(lv); setView('lessons') }} className="px-3 py-1 rounded bg-brand-100 text-brand-700 text-xs font-semibold hover:bg-brand-200">Mở</button>
                  <button onClick={() => { if (window.confirm('Xóa cấp độ này?')) { deleteLevel(course.id, lv.id); reload() } }} className="px-3 py-1 rounded bg-red-100 text-red-600 text-xs hover:bg-red-200">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showModal === 'level' && <LevelModal courseId={course.id} onClose={() => setShowModal(null)} onCreated={reload} />}
      </div>
    )
  }

  // ===== MAN HINH 3: BAI HOC =====
  if (view === 'lessons' && selectedCourse && selectedLevel) {
    const lessons = getLessons(selectedCourse.id, selectedLevel.id)
    return (
      <div>
        <button onClick={() => setView('levels')} className="text-sm text-gray-500 hover:text-brand-600 mb-3">← Quay lại cấp độ</button>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-extrabold text-gray-800">{selectedCourse.name} — {selectedLevel.name || `HSK ${selectedLevel.levelNum}`} — Bài học</h1>
          <button onClick={() => setShowModal('lesson')} className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm">+ Thêm bài học</button>
        </div>
        {lessons.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-brand-100"><p className="text-gray-400">Chưa có bài học.</p></div>
        ) : (
          <div className="space-y-2">
            {lessons.sort((a, b) => (a.lessonNum || 0) - (b.lessonNum || 0)).map((ls) => (
              <div key={ls.id} className="bg-white rounded-xl p-4 border border-brand-100 flex items-center justify-between shadow-soft">
                <div className="cursor-pointer flex-1" onClick={() => { setSelectedLesson(ls); setView('lesson') }}>
                  <span className="font-bold text-gray-800">Bài {ls.lessonNum}: </span>
                  <span className="hanzi">{ls.title}</span>
                  {ls.titleVi && <span className="text-gray-400 ml-2">({ls.titleVi})</span>}
                  <span className="ml-3 text-xs text-brand-600">{ls.vocab?.length || 0} từ · {ls.texts?.length || 0} bài khóa · {ls.grammar?.length || 0} ngữ pháp</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedLesson(ls); setView('lesson') }} className="px-3 py-1 rounded bg-brand-100 text-brand-700 text-xs font-semibold">Sửa</button>
                  <button onClick={() => { if (window.confirm('Xóa bài này?')) { deleteHskLesson(selectedCourse.id, selectedLevel.id, ls.id); reload() } }} className="px-3 py-1 rounded bg-red-100 text-red-600 text-xs">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showModal === 'lesson' && <LessonModal courseId={selectedCourse.id} levelId={selectedLevel.id} onClose={() => setShowModal(null)} onCreated={reload} />}
      </div>
    )
  }

  // ===== MAN HINH 4: CHI TIET BAI HOC =====
  if (view === 'lesson' && selectedCourse && selectedLevel && selectedLesson) {
    const lesson = getHskLesson(selectedCourse.id, selectedLevel.id, selectedLesson.id) || selectedLesson
    const cId = selectedCourse.id, lvId = selectedLevel.id, lsId = selectedLesson.id
    return (
      <div>
        <button onClick={() => { setView('lessons'); reload() }} className="text-sm text-gray-500 hover:text-brand-600 mb-3">← Quay lại danh sách bài</button>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Bài {lesson.lessonNum}: <span className="hanzi">{lesson.title}</span> {lesson.titleVi && `(${lesson.titleVi})`}</h1>
        <p className="text-sm text-gray-500 mb-5">{lesson.vocab?.length || 0} từ vựng · {lesson.texts?.length || 0} bài khóa · {lesson.grammar?.length || 0} ngữ pháp</p>

        <Section title="📝 Từ vựng" count={lesson.vocab?.length || 0} onAdd={() => setShowModal('vocab')} onBulk={() => setShowModal('vocabBulk')}>
          {(lesson.vocab || []).map((w, i) => (
            <div key={w.id} className="flex items-center gap-3 py-2 border-b border-gray-100 text-sm">
              <span className="text-gray-400 w-6">{i + 1}</span>
              <span className="hanzi font-bold w-16">{w.hanzi}</span>
              <span className="text-brand-600 italic w-20">{w.pinyin}</span>
              <span className="text-gray-400 w-16">{w.word_type}</span>
              <span className="text-gray-700 flex-1">{w.meaning}</span>
              <button onClick={() => { deleteHskVocab(cId, lvId, lsId, w.id); reload() }} className="text-gray-300 hover:text-red-500">🗑️</button>
            </div>
          ))}
        </Section>

        <Section title="📖 Bài khóa" count={lesson.texts?.length || 0} onAdd={() => setShowModal('text')}>
          {(lesson.texts || []).map((t, i) => (
            <div key={t.id} className="py-2 border-b border-gray-100">
              <div className="font-semibold text-gray-800">{t.title || `课文${i + 1}`}</div>
              <div className="hanzi text-sm text-gray-600 truncate">{(t.content || '').slice(0, 100)}...</div>
              <button onClick={() => { deleteHskText(cId, lvId, lsId, t.id); reload() }} className="text-xs text-red-400 hover:text-red-600 mt-1">Xóa</button>
            </div>
          ))}
        </Section>

        <Section title="📐 Ngữ pháp" count={lesson.grammar?.length || 0} onAdd={() => setShowModal('grammar')}>
          {(lesson.grammar || []).map((g, i) => (
            <div key={g.id} className="py-2 border-b border-gray-100">
              <div className="font-semibold text-gray-800">{g.title || `Ngữ pháp ${i + 1}`}</div>
              <div className="text-sm text-gray-600 truncate">{(g.content || '').slice(0, 100)}...</div>
              <button onClick={() => { deleteHskGrammar(cId, lvId, lsId, g.id); reload() }} className="text-xs text-red-400 hover:text-red-600 mt-1">Xóa</button>
            </div>
          ))}
        </Section>

        {showModal === 'vocab' && <VocabModal cId={cId} lvId={lvId} lsId={lsId} onClose={() => setShowModal(null)} onDone={() => { setShowModal(null); reload() }} />}
        {showModal === 'vocabBulk' && <VocabBulkModal cId={cId} lvId={lvId} lsId={lsId} onClose={() => setShowModal(null)} onDone={() => { setShowModal(null); reload() }} />}
        {showModal === 'text' && <TextModal cId={cId} lvId={lvId} lsId={lsId} onClose={() => setShowModal(null)} onDone={() => { setShowModal(null); reload() }} />}
        {showModal === 'grammar' && <GrammarModal cId={cId} lvId={lvId} lsId={lsId} onClose={() => setShowModal(null)} onDone={() => { setShowModal(null); reload() }} />}
      </div>
    )
  }

  return <div className="text-gray-400">Đang tải...</div>
}

// ========== COMPONENTS PHU ==========

function Section({ title, count, onAdd, onBulk, children }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-100 p-5 mb-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-800">{title} ({count})</h2>
        <div className="flex gap-2">
          {onBulk && <button onClick={onBulk} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200">📥 Nhập nhiều</button>}
          <button onClick={onAdd} className="px-3 py-1.5 rounded-lg bg-brand-100 text-brand-700 text-xs font-semibold hover:bg-brand-200">+ Thêm</button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function CourseModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Tạo giáo trình mới">
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên giáo trình (VD: Giáo trình HSK Standard)" className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:border-brand-500 outline-none" autoFocus />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tác giả (tùy chọn)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (name.trim()) { createCourse({ name: name.trim(), author: author.trim() }); onCreated() }; onClose() }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Tạo</button>
        </div>
      </div>
    </Modal>
  )
}

function LevelModal({ courseId, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [num, setNum] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Thêm cấp độ">
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên cấp độ (VD: HSK 1, Sơ cấp 1, Trung cấp 2...)" className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:border-brand-500 outline-none" autoFocus />
        <input value={num} onChange={(e) => setNum(e.target.value)} placeholder="Số thứ tự (VD: 1, 2, 3... để sắp xếp)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (name.trim()) { createLevel(courseId, { name: name.trim(), levelNum: parseInt(num) || 1 }); onCreated() }; onClose() }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Tạo</button>
        </div>
      </div>
    </Modal>
  )
}

function LessonModal({ courseId, levelId, onClose, onCreated }) {
  const [num, setNum] = useState('')
  const [title, setTitle] = useState('')
  const [titleVi, setTitleVi] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Thêm bài học">
      <div className="space-y-3">
        <input value={num} onChange={(e) => setNum(e.target.value)} placeholder="Số bài (VD: 1, 2, 3...)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" autoFocus />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề Hán tự (VD: 你好!)" className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:border-brand-500 outline-none hanzi" />
        <input value={titleVi} onChange={(e) => setTitleVi(e.target.value)} placeholder="Nghĩa tiếng Việt (VD: Xin chào!)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (title.trim()) { createHskLesson(courseId, levelId, { lessonNum: parseInt(num) || 1, title: title.trim(), titleVi: titleVi.trim() }); onCreated() }; onClose() }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Tạo</button>
        </div>
      </div>
    </Modal>
  )
}

function VocabModal({ cId, lvId, lsId, onClose, onDone }) {
  const [hanzi, setHanzi] = useState('')
  const [pinyin, setPinyin] = useState('')
  const [wordType, setWordType] = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Thêm từ vựng">
      <div className="space-y-3">
        <input value={hanzi} onChange={(e) => setHanzi(e.target.value)} placeholder="Hán tự" className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:border-brand-500 outline-none hanzi" autoFocus />
        <input value={pinyin} onChange={(e) => setPinyin(e.target.value)} placeholder="Pinyin" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
        <input value={wordType} onChange={(e) => setWordType(e.target.value)} placeholder="Từ loại (VD: Danh từ, Động từ...)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
        <input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Nghĩa tiếng Việt" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
        <input value={example} onChange={(e) => setExample(e.target.value)} placeholder="Ví dụ (tùy chọn)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none hanzi" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (hanzi.trim()) { addHskVocab(cId, lvId, lsId, { hanzi: hanzi.trim(), pinyin: pinyin.trim(), word_type: wordType.trim(), meaning: meaning.trim(), example: example.trim() }); onDone() } }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Thêm</button>
        </div>
      </div>
    </Modal>
  )
}

function VocabBulkModal({ cId, lvId, lsId, onClose, onDone }) {
  const [text, setText] = useState('')
  function handleImport() {
    const words = text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
      const p = line.split('-').map((x) => x.trim())
      return { hanzi: p[0] || '', pinyin: p[1] || '', word_type: p[2] || '', meaning: p[3] || '', example: p[4] || '' }
    }).filter((w) => w.hanzi)
    if (words.length === 0) { alert('Chưa có dữ liệu hợp lệ.'); return }
    addHskVocabBulk(cId, lvId, lsId, words)
    onDone()
  }
  return (
    <Modal open={true} onClose={onClose} title="Nhập nhiều từ vựng" maxWidth="max-w-2xl">
      <p className="text-sm text-gray-500 mb-2">Mỗi dòng 1 từ: <b>Hán tự - Pinyin - Từ loại - Nghĩa - Ví dụ</b></p>
      <p className="text-xs text-gray-400 mb-3">VD: 你 - nǐ - Đại từ - anh, chị, bạn - 你好</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder={'你 - nǐ - Đại từ - anh, chị, bạn - 你好\n好 - hǎo - Tính từ - tốt, khỏe - 你好'}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none hanzi" />
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
        <button onClick={handleImport} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Nhập tất cả</button>
      </div>
    </Modal>
  )
}

function TextModal({ cId, lvId, lsId, onClose, onDone }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinyin, setPinyin] = useState('')
  const [translation, setTranslation] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Thêm bài khóa" maxWidth="max-w-2xl">
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề (VD: 课文1)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" autoFocus />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={'Nội dung bài khóa (Hán tự)\nA: 你好！\nB: 你好！'} rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none hanzi" />
        <textarea value={pinyin} onChange={(e) => setPinyin(e.target.value)} placeholder={'Pinyin (mỗi dòng tương ứng 1 dòng nội dung)\nA: nǐ hǎo!\nB: nǐ hǎo!'} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
        <textarea value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder="Dịch nghĩa tiếng Việt" rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (content.trim()) { addHskText(cId, lvId, lsId, { title: title.trim(), content: content.trim(), pinyin: pinyin.trim(), translation: translation.trim() }); onDone() } }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Lưu</button>
        </div>
      </div>
    </Modal>
  )
}

function GrammarModal({ cId, lvId, lsId, onClose, onDone }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [examples, setExamples] = useState('')
  return (
    <Modal open={true} onClose={onClose} title="Thêm ngữ pháp" maxWidth="max-w-2xl">
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên cấu trúc ngữ pháp" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" autoFocus />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Giải thích ngữ pháp (dạng text)" rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
        <textarea value={examples} onChange={(e) => setExamples(e.target.value)} placeholder={'Ví dụ (mỗi dòng 1 ví dụ)\n你好 - nǐ hǎo - Xin chào'} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none hanzi" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Hủy</button>
          <button onClick={() => { if (title.trim()) { addHskGrammar(cId, lvId, lsId, { title: title.trim(), content: content.trim(), examples: examples.trim() }); onDone() } }}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold">Lưu</button>
        </div>
      </div>
    </Modal>
  )
}