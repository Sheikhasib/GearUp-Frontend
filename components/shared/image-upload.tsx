"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Image, X } from "@phosphor-icons/react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  alt?: string
}

export function ImageUpload({ value, onChange, alt = "Image" }: ImageUploadProps) {
  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <div className="group relative h-24 w-24 overflow-hidden rounded-full border">
          <img src={value} alt={alt} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:opacity-100 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="gearup_products"
          onSuccess={(result) => {
            const url = (result.info as { secure_url: string }).secure_url
            onChange(url)
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              aria-label="Add image"
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image size={24} />
              <span className="text-xs">Add Photo</span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}