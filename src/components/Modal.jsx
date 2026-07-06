import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth}`}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-xl font-extrabold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 flex items-center justify-center text-lg"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 pb-6 pt-4">{children}</div>
      </div>
    </div>
  )
}