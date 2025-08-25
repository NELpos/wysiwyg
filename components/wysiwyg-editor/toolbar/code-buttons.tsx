"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Code, FileCode } from "lucide-react"

interface CodeButtonsProps {
  editor: Editor
}

export function CodeButtons({ editor }: CodeButtonsProps) {
  const handleInlineCode = () => {
    console.log("[v0] Inline code button clicked, can toggle:", editor.can().toggleCode())
    editor.chain().focus().toggleCode().run()
  }

  const handleCodeBlock = () => {
    console.log("[v0] Code block button clicked, can toggle:", editor.can().toggleCodeBlock())
    editor.chain().focus().toggleCodeBlock().run()
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={editor.isActive("code") ? "default" : "ghost"}
        size="sm"
        onClick={handleInlineCode}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("codeBlock") ? "default" : "ghost"}
        size="sm"
        onClick={handleCodeBlock}
        title="Code Block"
      >
        <FileCode className="h-4 w-4" />
      </Button>
    </div>
  )
}
