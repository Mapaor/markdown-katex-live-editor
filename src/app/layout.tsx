import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://md.katex.cc"),
  title: "Markdown KaTeX Live Editor",
  description:
    "Live Markdown editor with KaTeX math rendering, GFM support, and PDF export via Typst.",
  keywords: [
    "markdown",
    "katex",
    "latex",
    "math",
    "editor",
    "preview",
    "typst",
    "pdf",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://md.katex.cc",
    title: "Markdown KaTeX Live Editor",
    description:
      "Edit Markdown with KaTeX math rendering in real time, preview GFM, and export to PDF via Typst.",
    siteName: "Markdown KaTeX Live Editor",
    images: [
      {
        url: "/banner-editor.jpg",
        width: 1200,
        height: 630,
        alt: "Markdown KaTeX Live Editor — live preview and export",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown KaTeX Live Editor",
    description:
      "Edit Markdown with KaTeX math rendering in real time, preview GFM, and export to PDF via Typst.",
    images: ["/banner-editor.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
