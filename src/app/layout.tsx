import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://markdown-preview-katex.vercel.app"),
  title: "Markdown Editor (with KaTeX support)",
  description:
    "A powerful markdown editor with live KaTeX math rendering. Write and preview markdown with LaTeX math expressions using $ and $$ delimiters.",
  keywords: ["markdown", "katex", "latex", "math", "editor", "preview", "live rendering"],
  authors: [{ name: "v0" }],
  creator: "v0",
  publisher: "v0",
  generator: "v0.app",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markdown-preview-katex.vercel.app",
    title: "Markdown KaTeX Preview - Live Math Rendering",
    description:
      "A powerful markdown editor with live KaTeX math rendering. Write and preview markdown with LaTeX math expressions.",
    siteName: "Markdown KaTeX Preview",
    images: [
      {
        url: "/banner-editor.jpg",
        width: 1200,
        height: 630,
        alt: "Markdown KaTeX Preview - Live Math Rendering Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown KaTeX Preview - Live Math Rendering",
    description:
      "A powerful markdown editor with live KaTeX math rendering. Write and preview markdown with LaTeX math expressions.",
    images: ["/banner-editor.jpg"],
    creator: "@vercel",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
