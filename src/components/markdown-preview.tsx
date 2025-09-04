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
import { compileToPdf, downloadPdf } from "@/lib/utils"

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: KatexOptions) => string
    }
  }
}



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
    // Check if KaTeX is loaded
    if (typeof window !== "undefined" && window.katex) {
      const katex = window.katex

      text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })
        } catch {
          return `<span class="text-red-500">Math Error: ${match}</span>`
        }
      })

      text = text.replace(/\$([^$\n]+?)\$/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          })
        } catch {
          return `<span class="text-red-500">Math Error: ${match}</span>`
        }
      })
    } else {
      // If KaTeX is not loaded, just return the text with math delimiters
      console.log("[v0] KaTeX not loaded yet, skipping math rendering")
    }

    return text
  }

  const processedMarkdown = processKaTeX(markdown)
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
      const pdfBytes = await compileToPdf(markdown)
      console.log("PDF compilation successful, downloading...")
      downloadPdf(pdfBytes)
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
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com/Mapaor/markdown-katex-live-editor" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
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
                  <Button variant="ghost" size="sm" onClick={handleFileLoad}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("markdown")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditorFullscreen(!isEditorFullscreen)}>
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
                  <Button variant="ghost" size="sm" onClick={downloadPDF} disabled={isPdfGenerating}>
                    {isPdfGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("html")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div
                className="prose prose-gray max-w-none rounded-md border p-4 h-[500px] overflow-y-auto dark:prose-invert bg-card"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
