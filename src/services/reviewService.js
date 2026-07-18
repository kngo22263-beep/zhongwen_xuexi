import { askGemini } from '../lib/aiClient.js'

export async function generateReviewPassage({ vocab, sentenceCount, hskLevel }) {
  const level = hskLevel || 'HSK1'
  const count = sentenceCount || 20

  const prompt = `你是一位专业的中文教师。请根据以下要求写一篇中文文章：

要求：
1. 文章长度：大约${count}句话，形成完整的段落。
2. 词汇：尽量使用以下词汇（自然融入文章中）：${vocab}
3. 难度等级：${level}
4. 文章要求：
   - 写成一个完整的故事或议论文，有开头、发展和结尾
   - 句子之间要有逻辑关系，使用连接词（因此、然而、同时、虽然...但是、不仅...还、由于、于是、在...的过程中 等）
   - 不要写成单独的短句，要写成像文章一样的长段落
   - 段落之间用空行分隔（写2-4个段落）
   - 内容要贴近生活，可以写关于学习、工作、旅行、创业、友情等主题
   - 语法要正确自然

格式要求（非常重要）：
- 只返回一个合法的JSON数组，不要解释，不要加反引号
- 每个元素代表一个段落，包含3个字段：
  {"hanzi": "整个段落的中文内容（多句话连在一起）", "pinyin": "整个段落的拼音", "meaning": "整个段落的越南语翻译"}

示例格式：
[{"hanzi":"在经历了这么多变化以后，小林终于对创业有了更加全面而深刻的理解。他明白，在这个高速发展的时代里，成功不仅仅依靠技术，更需要持续的努力与清晰的方向。","pinyin":"zài jīnglì le zhème duō biànhuà yǐhòu, xiǎo lín zhōngyú duì chuàngyè yǒu le gèngjiā quánmiàn ér shēnkè de lǐjiě.","meaning":"Sau khi trải qua nhiều thay đổi, Tiểu Lâm cuối cùng đã có được sự hiểu biết toàn diện và sâu sắc hơn về khởi nghiệp."}]

请直接返回JSON，不要任何其他内容。`

  const raw = await askGemini(prompt)

  let cleaned = raw.trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()

  let lines = []
  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) {
      lines = parsed
        .filter((item) => item && item.hanzi)
        .map((item) => ({
          hanzi: String(item.hanzi || '').trim(),
          pinyin: String(item.pinyin || '').trim(),
          meaning: String(item.meaning || '').trim()
        }))
    }
  } catch {
    lines = cleaned
      .split('\n\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ hanzi: s, pinyin: '', meaning: '' }))
  }

  if (lines.length === 0) {
    throw new Error('AI không tạo được đoạn văn hợp lệ. Vui lòng thử lại.')
  }

  return { lines, level, count }
}