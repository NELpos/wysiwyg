"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { List, ListOrdered } from "lucide-react"

interface ListButtonsProps {
  editor: Editor
}

export function ListButtons({ editor }: ListButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}
