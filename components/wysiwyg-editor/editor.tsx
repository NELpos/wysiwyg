"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Image } from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { EditorToolbar } from "./toolbar/editor-toolbar"
import { EditorFooter } from "./editor-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImageResizeModal } from "./image-resize-modal"
import { SlashCommands } from "./slash-commands"
import { FloatingToolbar } from "./floating-toolbar"
import { convertToEmailHTML } from "./converters/html-converter"

const lowlight = createLowlight(common)

export function WysiwygEditor() {
  const [wordCount, setWordCount] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageNode, setSelectedImageNode] = useState<any>(null)
  const [selectedImagePos, setSelectedImagePos] = useState<number>(0)
  const [isSlashCommandsOpen, setIsSlashCommandsOpen] = useState(false)
  const [slashCommandsPosition, setSlashCommandsPosition] = useState({ x: 0, y: 0 })
  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] = useState(false)
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ x: 0, y: 0 })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "cursor-pointer hover:opacity-80 transition-opacity",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "table-auto border-collapse border border-gray-300",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-gray-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-50 font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-gray-100 rounded-md p-4 font-mono text-sm overflow-x-auto",
        },
      }),
    ],
    content: "<p>Start writing your content here...</p>",
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)
      setAutoSaveStatus("unsaved")

      console.log("[v0] Editor updated, available commands:", {
        canInsertTable: editor.can().insertTable({ rows: 3, cols: 3 }),
        canToggleCodeBlock: editor.can().toggleCodeBlock(),
        isCodeBlockActive: editor.isActive("codeBlock"),
        isTableActive: editor.isActive("table"),
      })

      // Auto-save logic (debounced)
      setTimeout(() => {
        setAutoSaveStatus("saving")
        // Simulate save
        setTimeout(() => {
          setAutoSaveStatus("saved")
        }, 500)
      }, 1000)
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state
      const { from, to, empty } = selection

      console.log("[v0] Selection update:", { from, to, empty })

      if (!empty && to > from) {
        // Text is selected, show floating toolbar
        const coords = editor.view.coordsAtPos(from)
        const editorElement = editor.view.dom
        const editorRect = editorElement.getBoundingClientRect()

        console.log("[v0] Showing floating toolbar at coords:", coords)
        console.log("[v0] Editor rect:", editorRect)

        setFloatingToolbarPosition({
          x: coords.left,
          y: coords.top - 60, // Position above the selection
        })
        setIsFloatingToolbarVisible(true)
      } else {
        // No text selected, hide floating toolbar
        console.log("[v0] Hiding floating toolbar")
        setIsFloatingToolbarVisible(false)
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] px-4 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-50 [&_pre]:bg-gray-100 [&_pre]:rounded-md [&_pre]:p-4 [&_code]:font-mono [&_code]:text-sm",
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        if (node.type.name === "image") {
          setSelectedImageNode(node)
          setSelectedImagePos(nodePos)
          setIsImageModalOpen(true)
          return true
        }
        return false
      },
      handleKeyDown: (view, event) => {
        if (event.key === "/" && !isSlashCommandsOpen) {
          const { selection } = view.state
          const { from } = selection
          const coords = view.coordsAtPos(from)

          const editorElement = view.dom.closest(".ProseMirror")
          const editorRect = editorElement?.getBoundingClientRect()

          if (editorRect) {
            setSlashCommandsPosition({
              x: coords.left - editorRect.left,
              y: coords.bottom - editorRect.top + 5,
            })
          }

          // Small delay to allow the "/" character to be inserted
          setTimeout(() => {
            setIsSlashCommandsOpen(true)
          }, 10)

          return false
        }

        if (event.key === "Escape" && isSlashCommandsOpen) {
          setIsSlashCommandsOpen(false)
          return true
        }

        return false
      },
    },
    onCreate: ({ editor }) => {
      console.log(
        "[v0] Editor created with extensions:",
        editor.extensionManager.extensions.map((ext) => ext.name),
      )
    },
  })

  const getHTML = useCallback(() => {
    return editor ? convertToEmailHTML(editor) : ""
  }, [editor])

  const getJSON = useCallback(() => {
    return editor?.getJSON() || null
  }, [editor])

  const handleSlashCommandsClose = useCallback(() => {
    setIsSlashCommandsOpen(false)
    // Remove the "/" character that triggered the menu
    if (editor) {
      const { selection } = editor.state
      const { from } = selection
      const textBefore = editor.state.doc.textBetween(from - 1, from)
      if (textBefore === "/") {
        editor
          .chain()
          .focus()
          .deleteRange({ from: from - 1, to: from })
          .run()
      }
    }
  }, [editor])

  if (!editor) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center text-muted-foreground">Loading editor...</div>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">WYSIWYG Editor</h2>
          </div>
          <ThemeToggle />
        </div>
        <EditorToolbar editor={editor} />
        <div className="relative">
          <EditorContent editor={editor} className="min-h-[400px] max-h-[600px] overflow-y-auto" />
          {isSlashCommandsOpen && (
            <SlashCommands
              editor={editor}
              isOpen={isSlashCommandsOpen}
              onClose={handleSlashCommandsClose}
              position={slashCommandsPosition}
            />
          )}
          {isFloatingToolbarVisible && (
            <FloatingToolbar editor={editor} isVisible={isFloatingToolbarVisible} position={floatingToolbarPosition} />
          )}
        </div>
        <EditorFooter
          wordCount={wordCount}
          autoSaveStatus={autoSaveStatus}
          onExportHTML={() => getHTML()}
          onExportJSON={() => getJSON()}
        />
      </Card>
      <ImageResizeModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        editor={editor}
        imageNode={selectedImageNode}
        imagePos={selectedImagePos}
      />
    </div>
  )
}
