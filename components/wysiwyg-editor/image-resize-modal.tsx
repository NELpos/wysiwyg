"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { Editor } from "@tiptap/react"

interface ImageResizeModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor
  imageNode: any
  imagePos: number
}

export function ImageResizeModal({ isOpen, onClose, editor, imageNode, imagePos }: ImageResizeModalProps) {
  const [width, setWidth] = useState<number>(300)
  const [height, setHeight] = useState<number>(200)
  const [aspectRatio, setAspectRatio] = useState<number>(1.5)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [originalWidth, setOriginalWidth] = useState<number>(300)
  const [originalHeight, setOriginalHeight] = useState<number>(200)

  useEffect(() => {
    if (imageNode && isOpen) {
      const currentWidth = imageNode.attrs.width || 300
      const currentHeight = imageNode.attrs.height || 200
      setWidth(currentWidth)
      setHeight(currentHeight)
      setAspectRatio(currentWidth / currentHeight)
      setOriginalWidth(currentWidth)
      setOriginalHeight(currentHeight)
    }
  }, [imageNode, isOpen])

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const handlePresetSize = (scale: number) => {
    const newWidth = Math.round(originalWidth * scale)
    const newHeight = Math.round(originalHeight * scale)
    setWidth(newWidth)
    setHeight(newHeight)
  }

  const handleApply = () => {
    if (imageNode) {
      editor
        .chain()
        .focus()
        .setNodeSelection(imagePos)
        .updateAttributes("image", {
          width,
          height,
        })
        .run()
    }
    onClose()
  }

  const handleReset = () => {
    setWidth(originalWidth)
    setHeight(originalHeight)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resize Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Size Presets</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePresetSize(1)} className="flex-1">
                Original
                <span className="text-xs text-muted-foreground ml-1">
                  ({originalWidth}×{originalHeight})
                </span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePresetSize(0.75)} className="flex-1">
                Large
                <span className="text-xs text-muted-foreground ml-1">(75%)</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePresetSize(0.5)} className="flex-1">
                Medium
                <span className="text-xs text-muted-foreground ml-1">(50%)</span>
              </Button>
            </div>
          </div>

          {/* Width Control */}
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <div className="space-y-2">
              <Slider
                id="width"
                min={50}
                max={800}
                step={10}
                value={[width]}
                onValueChange={(value) => handleWidthChange(value[0])}
                className="w-full"
              />
              <Input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number.parseInt(e.target.value) || 0)}
                min={50}
                max={800}
                className="w-20"
              />
            </div>
          </div>

          {/* Height Control */}
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <div className="space-y-2">
              <Slider
                id="height"
                min={50}
                max={600}
                step={10}
                value={[height]}
                onValueChange={(value) => handleHeightChange(value[0])}
                className="w-full"
              />
              <Input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number.parseInt(e.target.value) || 0)}
                min={50}
                max={600}
                className="w-20"
              />
            </div>
          </div>

          {/* Aspect Ratio Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="aspectRatio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="aspectRatio">Maintain aspect ratio</Label>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Preview size:</p>
            <div
              className="border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center text-xs text-muted-foreground"
              style={{ width: Math.min(width, 200), height: Math.min(height, 150) }}
            >
              {width} × {height}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
