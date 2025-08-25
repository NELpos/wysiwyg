"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Code } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditorFooterProps {
  wordCount: number
  autoSaveStatus: "saved" | "saving" | "unsaved"
  onExportHTML: () => string
  onExportJSON: () => any
}

export function EditorFooter({ wordCount, autoSaveStatus, onExportHTML, onExportJSON }: EditorFooterProps) {
  const handleExportHTML = () => {
    const html = onExportHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "content.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const json = onExportJSON()
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "content.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = () => {
    switch (autoSaveStatus) {
      case "saved":
        return "default"
      case "saving":
        return "secondary"
      case "unsaved":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = () => {
    switch (autoSaveStatus) {
      case "saved":
        return "Saved"
      case "saving":
        return "Saving..."
      case "unsaved":
        return "Unsaved"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="border-t bg-muted/30 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{wordCount} words</span>
        <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportHTML}>
            <FileText className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJSON}>
            <Code className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
