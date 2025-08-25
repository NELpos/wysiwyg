import { WysiwygEditor } from "@/components/wysiwyg-editor/editor"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">WYSIWYG Editor</h1>
            <p className="text-muted-foreground">Create and format content for emails, reports, and more</p>
          </div>
          <WysiwygEditor />
        </div>
      </div>
    </div>
  )
}
