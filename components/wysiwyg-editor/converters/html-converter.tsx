import type { Editor } from "@tiptap/react"

export interface HTMLConverterOptions {
  preserveLineBreaks?: boolean
  addParagraphTags?: boolean
  cleanEmptyParagraphs?: boolean
}

export function convertToHTML(editor: Editor, options: HTMLConverterOptions = {}): string {
  const { preserveLineBreaks = true, addParagraphTags = true, cleanEmptyParagraphs = true } = options

  // Get the raw HTML from TipTap
  let html = editor.getHTML()

  if (preserveLineBreaks) {
    // Convert single line breaks to <br> tags
    html = html.replace(/\n(?![\s]*<)/g, "<br>")

    // Handle multiple consecutive line breaks
    html = html.replace(/\n\n+/g, "</p><p>")
  }

  if (addParagraphTags) {
    // Ensure content is wrapped in paragraph tags if not already
    if (
      !html.startsWith("<p>") &&
      !html.startsWith("<h") &&
      !html.startsWith("<ul") &&
      !html.startsWith("<ol") &&
      !html.startsWith("<blockquote")
    ) {
      html = `<p>${html}</p>`
    }
  }

  if (cleanEmptyParagraphs) {
    // Remove empty paragraphs
    html = html.replace(/<p><\/p>/g, "")
    html = html.replace(/<p>\s*<\/p>/g, "")
    html = html.replace(/<p><br><\/p>/g, "")
  }

  // Clean up extra whitespace
  html = html.replace(/\s+/g, " ")
  html = html.replace(/>\s+</g, "><")

  // Ensure proper line breaks in lists
  html = html.replace(/<\/li>\s*<li>/g, "</li>\n<li>")
  html = html.replace(/<ul>/g, "<ul>\n")
  html = html.replace(/<\/ul>/g, "\n</ul>")
  html = html.replace(/<ol>/g, "<ol>\n")
  html = html.replace(/<\/ol>/g, "\n</ol>")

  // Ensure proper line breaks in tables
  html = html.replace(/<\/tr>\s*<tr>/g, "</tr>\n<tr>")
  html = html.replace(/<\/td>\s*<td>/g, "</td>\n<td>")
  html = html.replace(/<\/th>\s*<th>/g, "</th>\n<th>")

  // Ensure proper line breaks around block elements
  html = html.replace(/<\/p>\s*<p>/g, "</p>\n<p>")
  html = html.replace(/<\/h([1-6])>\s*<p>/g, "</h$1>\n<p>")
  html = html.replace(/<\/p>\s*<h([1-6])>/g, "</p>\n<h$1>")
  html = html.replace(/<\/blockquote>\s*<p>/g, "</blockquote>\n<p>")
  html = html.replace(/<\/p>\s*<blockquote>/g, "</p>\n<blockquote>")

  return html.trim()
}

export function convertToEmailHTML(editor: Editor): string {
  return convertToHTML(editor, {
    preserveLineBreaks: true,
    addParagraphTags: true,
    cleanEmptyParagraphs: true,
  })
}

export function convertToPlainHTML(editor: Editor): string {
  return convertToHTML(editor, {
    preserveLineBreaks: false,
    addParagraphTags: false,
    cleanEmptyParagraphs: true,
  })
}
