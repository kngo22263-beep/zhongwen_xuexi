// =========================================================
// Cac hang so dung chung cho toan website
// =========================================================

// Cac cap do HSK
export const HSK_LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']

// Loai tu tieng Trung
export const WORD_TYPES = [
  'Danh từ',
  'Động từ',
  'Tính từ',
  'Trạng từ',
  'Đại từ',
  'Số từ',
  'Lượng từ',
  'Giới từ',
  'Liên từ',
  'Trợ từ',
  'Thán từ'
]

// So cau cho doan van on tap (trang On tap)
export const SENTENCE_COUNTS = [20, 30, 50]

// So cau hoi cho phan Kiem tra
export const QUESTION_COUNTS = [10, 20, 30, 40, 50]

// Muc do kho
export const DIFFICULTY_LEVELS = ['Dễ', 'Trung bình', 'Khó']

// 3 dang cau hoi kiem tra (giong hinh trang 7-8)
export const QUIZ_TYPES = [
  {
    id: 'multiple',
    title: 'Câu hỏi trắc nghiệm',
    desc: 'Chọn đáp án đúng',
    hint: 'Chọn đáp án đúng cho mỗi câu hỏi. Kiểm tra vốn từ vựng của bạn!',
    topics: [
      'Tiếng Việt → Hán tự',
      'Hán tự → Tiếng Việt',
      'Pinyin → Hán tự',
      'Hán tự → Pinyin',
      'Tiếng Việt → Pinyin',
      'Pinyin → Tiếng Việt'
    ]
  },
  {
    id: 'short',
    title: 'Câu hỏi trả lời ngắn',
    desc: 'Nhập đáp án của bạn',
    hint: 'Nhập đáp án ngắn gọn theo yêu cầu. Luyện tập khả năng ghi nhớ và diễn đạt!',
    topics: [
      'Hán tự → Nghĩa (Tiếng Việt)',
      'Hán tự → Pinyin'
    ]
  },
  {
    id: 'match',
    title: 'Câu hỏi ghép câu',
    desc: 'Ghép các phần để tạo thành câu hoàn chỉnh',
    hint: 'Ghép các phần câu lại với nhau để tạo thành câu đúng nghĩa!',
    topics: [
      'Ghép từ thành câu',
      'Chọn từ điền vào chỗ trống'
    ]
  }
]