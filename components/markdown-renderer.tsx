"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Enhanced markdown rendering for public display
    let html = text
      // Images
      .replace(
        /!\[([^\]]*)\]$$([^)]+)$$/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6 shadow-sm" loading="lazy" />',
      )
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-10 mb-6 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-foreground">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(
        /```([^`]+)```/g,
        '<pre class="bg-muted p-4 rounded-lg my-6 overflow-x-auto border"><code class="text-sm font-mono">$1</code></pre>',
      )
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">$1</code>')
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // Unordered lists
      .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>')
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-primary/30 pl-6 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r">$1</blockquote>',
      )
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-8 border-t border-border" />')
      // Paragraphs (convert double line breaks to paragraphs)
      .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
      // Single line breaks
      .replace(/\n/g, "<br>")

    // Wrap in paragraph tags if not already wrapped
    if (!html.startsWith("<")) {
      html = `<p class="mb-4 text-muted-foreground leading-relaxed">${html}</p>`
    }

    return html
  }

  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
