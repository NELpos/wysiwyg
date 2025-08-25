"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Table } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TableButtonProps {
  editor: Editor
}

export function TableButton({ editor }: TableButtonProps) {
  const insertTable = () => {
    console.log(
      "[v0] Insert table clicked, can insert:",
      editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    )
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" title="Insert Table">
          <Table className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={insertTable}>Insert Table (3x3)</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Add column before clicked, can add:", editor.can().addColumnBefore())
            editor.chain().focus().addColumnBefore().run()
          }}
          disabled={!editor.can().addColumnBefore()}
        >
          Add Column Before
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Add column after clicked, can add:", editor.can().addColumnAfter())
            editor.chain().focus().addColumnAfter().run()
          }}
          disabled={!editor.can().addColumnAfter()}
        >
          Add Column After
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Delete column clicked, can delete:", editor.can().deleteColumn())
            editor.chain().focus().deleteColumn().run()
          }}
          disabled={!editor.can().deleteColumn()}
        >
          Delete Column
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Add row before clicked, can add:", editor.can().addRowBefore())
            editor.chain().focus().addRowBefore().run()
          }}
          disabled={!editor.can().addRowBefore()}
        >
          Add Row Before
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Add row after clicked, can add:", editor.can().addRowAfter())
            editor.chain().focus().addRowAfter().run()
          }}
          disabled={!editor.can().addRowAfter()}
        >
          Add Row After
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Delete row clicked, can delete:", editor.can().deleteRow())
            editor.chain().focus().deleteRow().run()
          }}
          disabled={!editor.can().deleteRow()}
        >
          Delete Row
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Delete table clicked, can delete:", editor.can().deleteTable())
            editor.chain().focus().deleteTable().run()
          }}
          disabled={!editor.can().deleteTable()}
        >
          Delete Table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
