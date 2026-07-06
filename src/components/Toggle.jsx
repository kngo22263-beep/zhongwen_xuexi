/**
 * Nut gat bat/tat (giong cong tac).
 * Props:
 *  - checked: dang bat (true) hay tat (false)
 *  - onChange: ham goi khi bam, tra ve gia tri moi
 *  - label: chu ben trai nut gat
 */
export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {label && <span className="text-sm font-medium text-gray-600">{label}</span>}

      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <span className={`text-xs font-semibold ${checked ? 'text-brand-600' : 'text-gray-400'}`}>
        {checked ? 'On' : 'Off'}
      </span>
    </label>
  )
}