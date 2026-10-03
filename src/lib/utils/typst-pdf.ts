/**
 * Simple Typst PDF compiler for markdown content
 * Uses markdown2typst for conversion and Typst WASM for compilation
 */

import { createTypstCompiler, loadFonts } from '@myriaddreamin/typst.ts'
import { markdown2typst } from 'markdown2typst'

const typstFontName = "Geist" // Chosen text font for the generated PDF

// Singleton compiler instance

let compilerInstance: Awaited<ReturnType<typeof createTypstCompiler>> | null = null
let isInitializing = false

// Font paths (relative to public/)
const CORE_FONTS = [
	'/fonts/IBMPlexSans-Regular.ttf',
	'/fonts/IBMPlexSans-Bold.ttf',
	'/fonts/NewCMMath-Regular.otf',
	'/fonts/NewCMMath-Book.otf',
]

/**
 * Initialize the Typst compiler
 */
async function initCompiler() {
	if (compilerInstance) {
		return compilerInstance
	}

	// Prevent multiple simultaneous initializations
	if (isInitializing) {
		// Wait for the existing initialization to complete
		while (isInitializing) {
			await new Promise(resolve => setTimeout(resolve, 50))
		}
		if (compilerInstance) {
			return compilerInstance
		}
	}

	isInitializing = true

	try {
		const compiler = createTypstCompiler()
		await compiler.init({
			getModule: async () => {
				const response = await fetch('/wasm/typst_ts_web_compiler_bg.wasm')
				if (!response.ok) {
					throw new Error(`Failed to load Typst WASM: ${response.statusText}`)
				}
				return await response.arrayBuffer()
			},
			beforeBuild: [
				loadFonts(CORE_FONTS, { assets: ['text'] })
			]
		})
		compilerInstance = compiler
		return compiler
	} finally {
		isInitializing = false
	}
}

/**
 * Convert markdown to PDF using Typst
 * @param markdown - The markdown content to convert
 * @returns PDF as Uint8Array
 */
export async function markdownToPdf(markdown: string): Promise<Uint8Array> {
	try {
		// Convert markdown to Typst
		let typstSource = markdown2typst(markdown)
		typstSource = `#set text(font: "${typstFontName}")\n\n${typstSource}` // We set the font of the document

		// Try server-side API first
		try {
			const response = await fetch('/api/compile-pdf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ typstSource })
			});
			
			if (response.ok) {
				const arrayBuffer = await response.arrayBuffer();
				return new Uint8Array(arrayBuffer);
			}
			
			// If status is 501, server-side compilation is disabled in .env
			if (response.status !== 501) {
				console.warn('Server-side PDF generation failed, falling back to WASM.', await response.text());
			}
		} catch (err) {
			console.warn('Failed to reach server-side API, falling back to WASM.', err);
		}

		// Fallback to WASM compilation
		// Get or create compiler
		const compiler = await initCompiler()
		
		// Add source to compiler
		compiler.addSource('/main.typ', typstSource)
		// Compile to PDF
		const result = await compiler.compile({
			mainFilePath: '/main.typ',
			format: 1, // PDF format
		})
		if (!result.result || result.result.length === 0) {
			// Better error formatting - handle diagnostics properly
			let errorMessage = 'Unknown compilation error'
			if (result.diagnostics) {
				try {
					if (Array.isArray(result.diagnostics)) {
						errorMessage = result.diagnostics
							.map(d => {
								if (typeof d === 'string') return d
								if (typeof d === 'object') return JSON.stringify(d, null, 2)
								return String(d)
							})
							.join('\n')
					} else if (typeof result.diagnostics === 'object') {
						errorMessage = JSON.stringify(result.diagnostics, null, 2)
					} else {
						errorMessage = String(result.diagnostics)
					}
				} catch {
					errorMessage = 'Failed to parse diagnostics'
				}
			}
			throw new Error(`Compilation failed:\n${errorMessage}`)
		}
		return result.result
	} catch (error) {
		console.error('Failed to compile markdown to PDF:', error)
		throw new Error(`PDF compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

/**
 * Download PDF bytes as a file
 * @param pdfBytes - The PDF content as Uint8Array
 * @param filename - The name for the downloaded file
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string = 'document.pdf'): void {
	const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()

	URL.revokeObjectURL(url)
}

/**
 * Reset the compiler instance (useful for cleanup or if compilation gets stuck)
 */
export function resetCompiler(): void {
	compilerInstance = null
}
