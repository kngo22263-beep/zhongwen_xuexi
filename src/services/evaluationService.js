import { askGemini } from '../lib/aiClient.js'
import { getTodaySessions, getTodayStudyTime, saveEvaluation } from './studyService.js'

export async function evaluateToday() {
  const sessions = getTodaySessions()
  if (!sessions || sessions.length === 0) {
    throw new Error('Hôm nay bạn chưa học bài nào. Hãy vào phần Từ vựng học ít nhất 1 bài trước khi đánh giá.')
  }

  let totalWords = 0, totalFlashViewed = 0, totalFlashKnown = 0
  let totalQuiz = 0, totalCorrect = 0
  const lessonNames = []

  sessions.forEach((s) => {
    totalWords += s.words_total || 0
    totalFlashViewed += s.flashcards_viewed || 0
    totalFlashKnown += s.flashcards_known || 0
    totalQuiz += s.quiz_total || 0
    totalCorrect += s.quiz_correct || 0
    if (s.lesson_name) lessonNames.push(s.lesson_name)
  })

  const studyMinutes = Math.round(getTodayStudyTime() / 60)
  const accuracy = totalQuiz > 0 ? Math.round((totalCorrect / totalQuiz) * 100) : 0
  const flashRate = totalFlashViewed > 0 ? Math.round((totalFlashKnown / totalFlashViewed) * 100) : 0

  const prompt = `Bạn là một giáo viên tiếng Trung giàu kinh nghiệm. Hãy đánh giá chi tiết buổi học hôm nay của học viên dựa trên số liệu thực tế sau:

📊 SỐ LIỆU HỌC TẬP HÔM NAY:
- Số bài học đã hoàn thành: ${sessions.length} bài (${lessonNames.join(', ')})
- Tổng số từ vựng trong bài: ${totalWords} từ
- Flashcard: đã xem ${totalFlashViewed}/${totalWords} thẻ, đã thuộc ${totalFlashKnown} thẻ (tỷ lệ thuộc: ${flashRate}%)
- Kiểm tra: đã làm ${totalQuiz} câu, đúng ${totalCorrect} câu (tỷ lệ đúng: ${accuracy}%)
- Thời gian học: ${studyMinutes} phút

Hãy viết đánh giá bằng tiếng Việt theo ĐÚNG cấu trúc sau (giữ nguyên các tiêu đề, viết nội dung chi tiết cho từng mục):

## Đánh giá mức độ học tập hôm nay
Mức độ học tập: [Xuất sắc/Tốt/Khá/Trung bình/Yếu] ([điểm]/100)

## 📊 Kết quả học tập
- ✅ Đã hoàn thành: ${sessions.length} bài học
- ✅ Đã học: ${totalWords} từ vựng
- ✅ Đã luyện: ${totalFlashViewed} Flashcard (thuộc ${totalFlashKnown})
- ${accuracy >= 50 ? '✅' : '❌'} Kiểm tra đạt: ${accuracy}% (${totalCorrect}/${totalQuiz} câu đúng)
- ${studyMinutes >= 15 ? '✅' : '❌'} Thời gian học: ${studyMinutes} phút

## 📈 Phân tích chi tiết

### Điểm mạnh
(Liệt kê 2-3 điểm mạnh CỤ THỂ dựa trên số liệu thực, ví dụ: "Đã xem hết 6/6 flashcard cho thấy sự chăm chỉ")

### Điểm cần cải thiện
(Liệt kê 2-3 điểm yếu CỤ THỂ với số liệu và gợi ý cải thiện, ví dụ: "Tỷ lệ đúng bài kiểm tra chỉ 17%, cho thấy khả năng ghi nhớ còn thấp. Nên ôn lại bằng flashcard trước khi làm kiểm tra.")

## 🎯 Đánh giá AI

Mức độ ghi nhớ: [★☆☆☆☆ đến ★★★★★] (dựa trên tỷ lệ flashcard thuộc ${flashRate}%)
Mức độ luyện tập: [★☆☆☆☆ đến ★★★★★] (dựa trên số flashcard đã xem và bài kiểm tra)
Mức độ hoàn thành buổi học: [★☆☆☆☆ đến ★★★★★]
Khả năng cần ôn lại: [Thấp/Trung bình/Cao]

## 📚 Gợi ý buổi học tiếp theo
(5 gợi ý cụ thể với số liệu, ví dụ: "Ôn lại toàn bộ ${totalWords} từ vựng đã học", "Luyện Flashcard thêm 20-30 lượt", "Làm lại bài kiểm tra cho đến khi đạt ít nhất 80%")

## 💬 Lời khích lệ
(3-4 câu khích lệ chân thành, cụ thể, liên quan đến kết quả thực tế của học viên)

QUY TẮC CHẤM ĐIỂM (tuân thủ nghiêm ngặt):
- Kiểm tra đúng < 30%: điểm 25-40
- Kiểm tra đúng 30-50%: điểm 40-55
- Kiểm tra đúng 50-70%: điểm 55-70
- Kiểm tra đúng 70-85%: điểm 70-85
- Kiểm tra đúng > 85%: điểm 85-95
- Chưa làm kiểm tra: tối đa 55 điểm
- Flashcard thuộc < 50%: trừ 5-10 điểm
- Thời gian < 10 phút: trừ 5 điểm

QUAN TRỌNG: Phải đánh giá KHÁCH QUAN, dùng SỐ LIỆU THỰC TẾ trong mọi nhận xét. Không được viết chung chung.`

  const raw = await askGemini(prompt)
  const aiText = raw.trim()

  // Tinh diem tu dong tu so lieu
  let autoScore = 50
  if (totalQuiz > 0) {
    if (accuracy >= 85) autoScore = 90
    else if (accuracy >= 70) autoScore = 78
    else if (accuracy >= 50) autoScore = 63
    else if (accuracy >= 30) autoScore = 48
    else autoScore = 33
  } else {
    autoScore = 45
  }
  if (flashRate > 80) autoScore += 5
  if (totalFlashViewed < totalWords / 2) autoScore -= 5
  if (studyMinutes < 10) autoScore -= 5
  autoScore = Math.max(0, Math.min(100, autoScore))

  const evaluation = {
    score: autoScore,
    level: autoScore >= 85 ? 'Xuất sắc' : autoScore >= 70 ? 'Tốt' : autoScore >= 55 ? 'Khá' : autoScore >= 40 ? 'Trung bình' : 'Yếu',
    aiReport: aiText,
    sessionsCount: sessions.length,
    totalWords, totalFlashViewed, totalFlashKnown,
    totalQuiz, totalCorrect, accuracy, studyMinutes, lessonNames
  }

  saveEvaluation(evaluation)
  return evaluation
}