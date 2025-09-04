import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { TypstCompiler } from "@myriaddreamin/typst-ts-web-compiler";
import { createTypstCompiler } from "@myriaddreamin/typst.ts";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Convert Markdown into a Typst document using cmarker + mitex.
 * Math will be rendered properly and the document will use a serif font.
 */
export function markdown2typst(mdContent: string): string {
  return `
#import "@preview/cmarker:0.1.6": cmarker
#import "@preview/mitex:0.2.4": mitex
#set page(margin: 1in)

#cmarker.render(${JSON.stringify(mdContent)}, math: mitex)
  `;
}

/**
 * Fallback: Convert Markdown to simple Typst without external packages
 */
export function markdown2typstSimple(mdContent: string): string {
  console.log("Original markdown content:", mdContent);
  
  // Convert basic markdown to Typst
  const typstContent = mdContent
    // Convert headers
    .replace(/^### (.+)$/gm, '=== $1')
    .replace(/^## (.+)$/gm, '== $1')
    .replace(/^# (.+)$/gm, '= $1')
    // Convert bold and italic
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/\*(.+?)\*/g, '_$1_')
    // Convert inline code
    .replace(/`(.+?)`/g, '`$1`')
    // Convert code blocks - keep them as is for now
    .replace(/```[\w]*\n([\s\S]*?)```/g, '```\n$1```')
    // Convert math - fix the regex
    .replace(/\$\$([^$]+?)\$\$/g, '$ $1 $')
    .replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, '$$1$')
    // Convert lists
    .replace(/^- (.+)$/gm, '- $1')
    .replace(/^\d+\. (.+)$/gm, '+ $1');

  console.log("Converted Typst content:", typstContent);

  const finalTypst = `
#set page(margin: 1in)

${typstContent}
  `;
  
  console.log("Final Typst document:", finalTypst);
  return finalTypst;
}

/**
 * Compile Typst source from Markdown into a PDF (Uint8Array).
 */
let compilerPromise: ReturnType<typeof createTypstCompiler> | null = null;

/**
 * Compile Typst source from Markdown into a PDF (Uint8Array).
 */
export async function compileToPdf(md: string): Promise<Uint8Array> {
  if (typeof window === "undefined") {
    throw new Error("PDF compilation must run on the client side");
  }

  try {
    console.log("Starting PDF compilation...");
    console.log("Input markdown:", md);
    
    if (!compilerPromise) {
      console.log("Creating new compiler instance...");
      compilerPromise = createTypstCompiler(); // loads wasm internally
    }
    const compiler = await compilerPromise;
    console.log("Compiler created successfully");
    
    // Initialize compiler with basic configuration
    console.log("Initializing compiler...");
    await compiler.init({
      getModule: () => '/wasm/typst_ts_web_compiler_bg.wasm'
    });
    console.log("Compiler initialized successfully");

    // Reset and clear any existing workspace
    await compiler.reset();
    await compiler.init({
      getModule: () => '/wasm/typst_ts_web_compiler_bg.wasm'
    });

    // Simple Typst content without external packages first
    const typstSource = `
= Test Document

This is a test paragraph.

== Sub heading

Another paragraph with some text.

*Bold text* and _italic text_.

- List item 1
- List item 2
- List item 3
    `;
    
    console.log("Using simple Typst source:", typstSource);
    
    // Add source to root workspace
    console.log("Adding source file to root...");
    await compiler.addSource('/main.typ', typstSource);
    console.log("Source file added successfully");

    console.log("Compiling to PDF...");
    const result = await compiler.compile({
      mainFilePath: "/main.typ",
      format: "pdf",
    });
    console.log("Compilation result:", result);

    if (result.result && result.result.length > 0) {
      console.log("PDF compilation successful, result size:", result.result.length);
      return result.result;
    } else {
      console.error("Compilation failed or empty result. Full result:", result);
      throw new Error(`PDF compilation failed: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error("Error during PDF compilation:", error);
    throw error;
  }
}

/**
 * Trigger download of PDF bytes.
 */
export function downloadPdf(pdfBytes: Uint8Array, filename = "markdown-document.pdf") {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}