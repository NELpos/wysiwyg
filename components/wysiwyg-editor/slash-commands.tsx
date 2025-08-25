"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, Code, Minus, Search, ImageIcon } from "lucide-react"

interface SlashCommand {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: (editor: Editor) => void
}

interface SlashCommandsProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
}

export function SlashCommands({ editor, isOpen, onClose, position }: SlashCommandsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const commands: SlashCommand[] = [
    {
      id: "table",
      title: "Table",
      description: "Insert a 2x2 table",
      icon: <Table className="w-4 h-4" />,
      action: (editor) => {
        editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()
      },
    },
    {
      id: "codeblock",
      title: "Code Block",
      description: "Insert a code block",
      icon: <Code className="w-4 h-4" />,
      action: (editor) => {
        editor.chain().focus().toggleCodeBlock().run()
      },
    },
    {
      id: "divider",
      title: "Divider",
      description: "Insert a horizontal rule",
      icon: <Minus className="w-4 h-4" />,
      action: (editor) => {
        editor.chain().focus().setHorizontalRule().run()
      },
    },
    {
      id: "image",
      title: "Image",
      description: "Upload or insert an image",
      icon: <ImageIcon className="w-4 h-4" />,
      action: (editor) => {
        const url = window.prompt("Enter image URL:")
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      command.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
          break
        case "ArrowUp":
          event.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
          break
        case "Enter":
          event.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case "Escape":
          event.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  const executeCommand = (command: SlashCommand) => {
    command.action(editor)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Card
      ref={containerRef}
      className="fixed z-[100] w-80 max-h-80 overflow-y-auto shadow-lg border bg-background"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="p-2">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8 text-sm"
          />
        </div>

        <div className="text-xs text-muted-foreground mb-2 px-2">Commands ({filteredCommands.length})</div>

        {filteredCommands.length > 0 ? (
          filteredCommands.map((command, index) => (
            <Button
              key={command.id}
              variant={index === selectedIndex ? "secondary" : "ghost"}
              className="w-full justify-start h-auto p-2 mb-1"
              onClick={() => executeCommand(command)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{command.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{command.title}</div>
                  <div className="text-xs text-muted-foreground">{command.description}</div>
                </div>
              </div>
            </Button>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">No commands found for "{searchQuery}"</div>
        )}
      </div>
    </Card>
  )
}
