import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function markdown2typst(mdContent: string) {
  // For now, use a simple approach without external packages
  // Convert basic markdown to Typst manually
  const typstContent = mdContent
    // Convert headers
    .replace(/^### (.*$)/gm, '=== $1')
    .replace(/^## (.*$)/gm, '== $1') 
    .replace(/^# (.*$)/gm, '= $1')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/g, '*$1*')
    .replace(/\*(.*?)\*/g, '_$1_')
    // Convert inline code
    .replace(/`(.*?)`/g, '`$1`')
    // Convert block math
    .replace(/\$\$([\s\S]*?)\$\$/g, '$ $1 $')
    // Convert inline math  
    .replace(/\$([^$\n]+?)\$/g, '$ $1 $');

  return `
#set text(font: "New Computer Modern")
#set page(margin: 1in)

${typstContent}
  `;
}

// Client-side only compilation function
export async function compileToPdf(md: string): Promise<Uint8Array> {
  // Ensure this only runs on the client side
  if (typeof window === 'undefined') {
    throw new Error('PDF compilation must run on the client side');
  }

  const typstSource = markdown2typst(md);
  console.log('Typst source:', typstSource);

  try {
    console.log('Loading Typst compiler module...');
    
    // Use the basic createTypstCompiler approach without package registry for now
    const { createTypstCompiler } = await import("@myriaddreamin/typst.ts");
    
    console.log('Creating compiler instance...');
    const compiler = createTypstCompiler();
    
    // Initialize with basic configuration
    await compiler.init({
      getModule: () => {
        console.log('Getting WASM module from CDN...');
        return 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm';
      },
    });

    console.log('Adding source file...');
    await compiler.addSource('/main.typ', typstSource);
    
    console.log('Starting PDF compilation...');
    const result = await compiler.compile({
      mainFilePath: '/main.typ',
      format: 'pdf',
    });

    if (!result.result) {
      throw new Error("Compilation failed: no result returned");
    }

    console.log('PDF compilation successful, size:', result.result.length);
    return result.result;
  } catch (error) {
    console.error("Failed to compile with Typst:", error);
    throw new Error(`PDF compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function downloadPdf(pdfBytes: Uint8Array, filename = "markdown-document.pdf") {
  // Convert to ArrayBuffer for proper Blob handling
  const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}