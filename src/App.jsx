import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Ebook from './pages/Ebook.jsx'
import Vocabulary from './pages/Vocabulary.jsx'
import VocabularyLesson from './pages/VocabularyLesson.jsx'
import Review from './pages/Review.jsx'
import LearningEvaluation from './pages/LearningEvaluation.jsx'
import HskCourses from './pages/HskCourses.jsx'
import HskLevel from './pages/HskLevel.jsx'
import HskLesson from './pages/HskLesson.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import CreateAccount from './pages/admin/CreateAccount.jsx'
import RenewAccount from './pages/admin/RenewAccount.jsx'
import ImportEbook from './pages/admin/ImportEbook.jsx'
import ImportVocab from './pages/admin/ImportVocab.jsx'
import ImportReading from './pages/admin/ImportReading.jsx'
import AdminHsk from './pages/admin/AdminHsk.jsx'
import Settings from './pages/admin/Settings.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Trang cong khai */}
      <Route path="/" element={<Home />} />
      <Route path="/ebook" element={<Ebook />} />
      <Route path="/hsk" element={<HskCourses />} />
      <Route path="/hsk/:courseId/:levelId" element={<HskLevel />} />
      <Route path="/hsk/:courseId/:levelId/:lessonId" element={<HskLesson />} />

      {/* Trang co phi - can dang nhap */}
      <Route path="/vocabulary" element={<ProtectedRoute><Vocabulary /></ProtectedRoute>} />
      <Route path="/vocabulary/:lessonId" element={<ProtectedRoute><VocabularyLesson /></ProtectedRoute>} />
      <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
      <Route path="/evaluation" element={<ProtectedRoute><LearningEvaluation /></ProtectedRoute>} />

      {/* Khu vuc Admin */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:filter" element={<UserManagement />} />
        <Route path="create" element={<CreateAccount />} />
        <Route path="renew" element={<RenewAccount />} />
        <Route path="import/ebook" element={<ImportEbook />} />
        <Route path="import/vocab" element={<ImportVocab />} />
        <Route path="import/reading" element={<ImportReading />} />
        <Route path="hsk" element={<AdminHsk />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Trang khong ton tai */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}