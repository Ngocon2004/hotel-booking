'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-amber-600 px-4 py-2 text-sm font-bold text-white"
    >
      In phiếu
    </button>
  )
}
