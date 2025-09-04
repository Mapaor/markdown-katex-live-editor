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
import { Document, Page, Text, View, StyleSheet, pdf, Image as PDFImage } from "@react-pdf/renderer"
import { toPng } from "html-to-image"
import type { KatexOptions } from "katex"

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: KatexOptions) => string
    }
  }
}

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  mathImage: {
    marginVertical: 5,
    alignSelf: "center",
  },
  inlineMathImage: {
    marginHorizontal: 2,
  },
})

async function katexToDataUrl(latex: string, opts: { displayMode?: boolean; pixelRatio?: number } = {}) {
  const wrapper = document.createElement("div")
  wrapper.style.position = "fixed"
  wrapper.style.left = "-10000px"
  wrapper.style.top = "0"
  wrapper.style.zIndex = "-1000"
  wrapper.style.backgroundColor = "white"
  wrapper.style.padding = "10px"

  try {
    if (typeof window !== "undefined" && window.katex) {
      const katex = window.katex
      wrapper.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: opts.displayMode || false,
      })
    } else {
      wrapper.textContent = latex
    }
  } catch (e) {
    wrapper.textContent = "KaTeX render error: " + (e as Error).message
  }

  document.body.appendChild(wrapper)

  const dataUrl = await toPng(wrapper, {
    pixelRatio: opts.pixelRatio || 2,
    backgroundColor: "white",
  })

  document.body.removeChild(wrapper)
  return dataUrl
}

const MarkdownPDF = ({ content, mathImages }: { content: string; mathImages: { [key: string]: string } }) => {
  // Parse content and replace math with placeholders, then split into segments
  const segments: Array<{ type: "text" | "math"; content: string; isBlock?: boolean }> = []
  let currentIndex = 0

  // Find all math expressions and create segments
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g
  let match

  while ((match = mathRegex.exec(content)) !== null) {
    // Add text before math
    if (match.index > currentIndex) {
      const textContent = content.slice(currentIndex, match.index)
      if (textContent.trim()) {
        segments.push({ type: "text", content: textContent })
      }
    }

    // Add math
    const mathContent = match[1]
    const isBlock = mathContent.startsWith("$$")
    segments.push({
      type: "math",
      content: mathContent,
      isBlock,
    })

    currentIndex = match.index + match[1].length
  }

  // Add remaining text
  if (currentIndex < content.length) {
    const textContent = content.slice(currentIndex)
    if (textContent.trim()) {
      segments.push({ type: "text", content: textContent })
    }
  }

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.title}>Markdown Document</Text>
          {segments.map((segment, index) => {
            if (segment.type === "text") {
              // Clean up markdown formatting for text segments
              const cleanText = segment.content
                .replace(/#{1,6}\s+/g, "")
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/`(.*?)`/g, "$1")
                .replace(/\[(.*?)\]$$.*?$$/g, "$1")
                .trim()

              return cleanText ? (
                <Text key={index} style={pdfStyles.text}>
                  {cleanText}
                </Text>
              ) : null
            } else if (segment.type === "math" && mathImages[segment.content]) {
              return (
                <View key={index} style={segment.isBlock ? pdfStyles.mathImage : pdfStyles.inlineMathImage}>
                  <PDFImage src={mathImages[segment.content]} />
                </View>
              )
            }
            return null
          })}
        </View>
      </Page>
    </Document>
  )
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
  const { theme, setTheme } = useTheme()
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
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const downloadPDF = async () => {
    setIsPdfGenerating(true)
    try {
      // Find all math expressions in the markdown
      const mathExpressions: string[] = []
      const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g
      let match

      while ((match = mathRegex.exec(markdown)) !== null) {
        if (!mathExpressions.includes(match[1])) {
          mathExpressions.push(match[1])
        }
      }

      // Convert each math expression to a data URL
      const mathImages: { [key: string]: string } = {}

      for (const mathExpr of mathExpressions) {
        const isBlock = mathExpr.startsWith("$$")
        const latex = mathExpr.replace(/^\$+|\$+$/g, "").trim()

        try {
          const dataUrl = await katexToDataUrl(latex, {
            displayMode: isBlock,
            pixelRatio: 2,
          })
          mathImages[mathExpr] = dataUrl
        } catch (error) {
          console.error("Failed to render math:", mathExpr, error)
        }
      }

      const doc = <MarkdownPDF content={markdown} mathImages={mathImages} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "markdown-document.pdf"
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
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
              ) : theme === "dark" ? (
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
