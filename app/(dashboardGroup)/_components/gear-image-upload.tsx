"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Image, X } from "@phosphor-icons/react"

interface GearImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function GearImageUpload({ images, onImagesChange }: GearImageUploadProps) {
  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border">
            <img
              src={url}
              alt={`Gear image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <CldUploadWidget
          uploadPreset="gearup_products"
          onSuccess={(result) => {
            const url = (result.info as { secure_url: string }).secure_url
            onImagesChange([...images, url])
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image size={24} />
              <span className="text-xs">Add Image</span>
            </button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  )
}
