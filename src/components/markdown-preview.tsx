"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Maximize2, Copy, Upload, Moon, Sun, Download, Github, Loader2 } from "lucide-react"
import { marked } from "marked"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { KatexOptions } from "katex"
import { markdownToPdf, downloadPdf } from "@/lib/utils/typst-pdf"

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: KatexOptions) => string
    }
  }
}

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})



export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState("")
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    readingTime: 0,
  })
  const { resolvedTheme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load KaTeX CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    document.head.appendChild(link)

    // Load KaTeX JS
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const example = urlParams.get("example")

    if (example === "compu") {
      const filename = encodeURIComponent("Resum-Clara-Civit-compu.md")
      console.log("[v0] Loading markdown file:", filename)
      fetch(`/${filename}`, {
        headers: {
          Accept: "text/plain, text/markdown, */*",
        },
      })
        .then((response) => {
          console.log("[v0] Response status:", response.status)
          console.log("[v0] Response headers:", response.headers.get("content-type"))
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then((content) => {
          console.log("[v0] Loaded content length:", content.length)
          console.log("[v0] Content preview:", content.substring(0, 200))
          setMarkdown(content)
        })
        .catch((error) => {
          console.error("[v0] Failed to load example:", error)
          setMarkdown(
            "# Error\n\nFailed to load the example file. Please check if 'Resul-Clara-Civit-compu.md' exists in the public folder.",
          )
        })
    }
  }, [])

  const processKaTeX = (text: string): string => {
    // Only process on client side
    if (typeof window === 'undefined' || !window.katex) {
      return text
    }
    try {
      // Process display math ($$...$$)
      text = text.replace(/\$\$([^$]+?)\$\$/g, (_, math) => {
        try {
          return window.katex!.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })
        } catch {
          return `<span style="color: red;">Error: ${math}</span>`
        }
      })
      // Process inline math ($...$)
      text = text.replace(/\$([^$\n]+?)\$/g, (_, math) => {
        try {
          return window.katex!.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          })
        } catch {
          return `<span style="color: red;">Error: ${math}</span>`
        }
      })
      return text
    } catch {
      return text
    }
  }

  // Only process KaTeX when mounted (client-side)
  const processedMarkdown = mounted ? processKaTeX(markdown) : markdown
  const htmlContent = marked(processedMarkdown) as string

  useEffect(() => {
    const words = markdown.trim().split(/\s+/).length
    const chars = markdown.length
    const readingTime = Math.ceil(words / 200)

    setStats({
      words,
      chars,
      readingTime,
    })
  }, [markdown])

  const copyToClipboard = async (format: "markdown" | "html") => {
    const content = format === "markdown" ? markdown : htmlContent
    await navigator.clipboard.writeText(content)
  }

  const handleFileLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && ((file.type === "text/markdown") || file.name.endsWith(".md"))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdown(content)
      }
      reader.readAsText(file)
    }
    // Reset the input value to allow loading the same file again
    event.target.value = ""
  }

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const downloadPDF = async () => {
    setIsPdfGenerating(true)
    try {
      console.log("Starting PDF download with markdown:", markdown.substring(0, 100) + "...")
      const pdfBytes = await markdownToPdf(markdown)
      console.log("PDF compilation successful, downloading...")
      downloadPdf(pdfBytes, "markdown-document.pdf")
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      // Show user-friendly error message
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPdfGenerating(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Markdown Live Editor</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>READING TIME: {stats.readingTime} MIN READ</span>
              <span>WORDS: {stats.words}</span>
              <span>CHARACTERS: {stats.chars}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild className="cursor-pointer hover:bg-gray-400">
              <a href="https://github.com/Mapaor/markdown-katex-live-editor" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="cursor-pointer hover:bg-gray-400">
              {!mounted ? (
                <Moon className="h-4 w-4" />
              ) : resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className={`grid gap-4 ${isEditorFullscreen || isPreviewFullscreen ? "" : "md:grid-cols-2"}`}>
          {!isPreviewFullscreen && (
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">
                  MARKDOWN
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleFileLoad} className="cursor-pointer hover:bg-gray-400">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("markdown") } className="cursor-pointer hover:bg-gray-400"> 
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditorFullscreen(!isEditorFullscreen)} className="cursor-pointer hover:bg-gray-400">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter your markdown here... Use $ for inline equations and $$ for block equations."
                className="h-[500px] font-mono resize-none overflow-y-auto"
              />
            </div>
          )}

          {!isEditorFullscreen && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">
                  PREVIEW
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={downloadPDF} disabled={isPdfGenerating} className="cursor-pointer hover:bg-gray-400">
                    {isPdfGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("html") } className="cursor-pointer hover:bg-gray-400"> 
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)} className="cursor-pointer hover:bg-gray-400">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div
                className="max-w-none rounded-md border p-4 h-[500px] overflow-y-auto bg-card markdown-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  .markdown-content h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.67em 0;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 0.3em;
                  }
                  .markdown-content h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.83em 0;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 0.3em;
                  }
                  .markdown-content h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin: 1em 0;
                  }
                  .markdown-content ul {
                    margin: 1em 0;
                    padding-left: 2em;
                    list-style-type: disc;
                  }
                  .markdown-content ol {
                    margin: 1em 0;
                    padding-left: 2em;
                    list-style-type: decimal;
                  }
                  .markdown-content li {
                    margin: 0.5em 0;
                  }
                  .markdown-content p {
                    margin: 1em 0;
                    line-height: 1.6;
                  }
                  .markdown-content strong {
                    font-weight: bold;
                  }
                  .markdown-content em {
                    font-style: italic;
                  }
                  .markdown-content code {
                    background-color: #f3f4f6;
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-family: monospace;
                  }
                  .markdown-content pre {
                    background-color: #f3f4f6;
                    padding: 1em;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1em 0;
                  }
                `
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
