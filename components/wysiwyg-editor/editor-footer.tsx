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
    const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Content</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #ccc; color: #666; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        pre { background-color: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
${html}
</body>
</html>`

    const blob = new Blob([fullHTML], { type: "text/html" })
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
