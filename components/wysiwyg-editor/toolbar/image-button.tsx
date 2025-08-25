"use client"

import type React from "react"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useRef } from "react"

interface ImageButtonProps {
  editor: Editor
}

export function ImageButton({ editor }: ImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, create a local URL - in production this would upload to S3
    const url = URL.createObjectURL(file)

    editor.chain().focus().setImage({ src: url }).run()

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Insert Image">
        <ImageIcon className="h-4 w-4" />
      </Button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </>
  )
}
