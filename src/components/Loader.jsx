/**
 * Vong xoay cho tai (loading spinner).
 * Props:
 *  - text: chu hien ben duoi (tuy chon)
 *  - size: kich thuoc vong xoay ('sm' | 'md' | 'lg')
 */
export default function Loader({ text = 'Đang tải...', size = 'md' }) {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  }[size] || 'w-8 h-8 border-[3px]'

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClass} rounded-full border-brand-200 border-t-brand-500 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}