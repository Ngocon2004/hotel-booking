'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadRoomImage } from '@/server/actions/rooms'
import { toast } from 'sonner'

type Props = {
  initial?: string[]
  /** Số ảnh tối đa được phép upload (default 6) */
  max?: number
}

/**
 * Image uploader có:
 * - Preview ảnh đã upload
 * - Upload trực tiếp lên Supabase Storage
 * - Xóa ảnh khỏi danh sách
 * - Render hidden input[name="images"] để form submit
 */
export default function ImageUploader({ initial = [], max = 6 }: Props) {
  const [images, setImages] = useState<string[]>(initial)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (images.length + files.length > max) {
      toast.error(`Chỉ được upload tối đa ${max} ảnh`)
      return
    }

    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await uploadRoomImage(fd)
        if (res.error) {
          toast.error(res.error)
          continue
        }
        if (res.url) {
          setImages((prev) => [...prev, res.url!])
        }
      }
      toast.success(`Đã upload ${files.length} ảnh`)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Hidden inputs để form submit */}
      {images.map((url, i) => (
        <input key={i} type="hidden" name="images" value={url} />
      ))}

      {/* Grid preview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative group aspect-video rounded-lg overflow-hidden border-2 border-amber-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Ảnh ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] uppercase tracking-wider font-bold rounded">
                Chính
              </span>
            )}
          </div>
        ))}

        {images.length < max && (
          <label
            className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              uploading
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin mb-1" />
                <span className="text-xs text-amber-700 font-semibold">Đang upload...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 font-semibold">Thêm ảnh</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Tối đa {max} ảnh. Chấp nhận JPG, PNG, WEBP. Kích thước &lt; 5MB. Ảnh đầu tiên sẽ là ảnh chính.
      </p>
    </div>
  )
}
