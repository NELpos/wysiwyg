"use client"

import type { Editor } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { FormatButtons } from "./format-buttons"
import { ListButtons } from "./list-buttons"
import { TableButton } from "./table-button"
import { CodeButtons } from "./code-buttons"
import { ImageButton } from "./image-button"

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b bg-muted/30 p-2">
      <div className="flex flex-wrap items-center gap-1">
        <FormatButtons editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ListButtons editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <TableButton editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <CodeButtons editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ImageButton editor={editor} />
      </div>
    </div>
  )
}
