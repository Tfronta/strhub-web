"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Bold, Italic, Code, Link, List, ListOrdered, Quote, ImageIcon } from "lucide-react"
import { ImageUpload } from "./image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState("edit")
  const [showImageUpload, setShowImageUpload] = useState(false)

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea[data-markdown-editor]") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleImageUploaded = (url: string, alt = "") => {
    const imageMarkdown = `![${alt}](${url})`
    const textarea = document.querySelector("textarea[data-markdown-editor]") as HTMLTextAreaElement

    if (textarea) {
      const start = textarea.selectionStart
      const newText = value.substring(0, start) + imageMarkdown + value.substring(start)
      onChange(newText)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
      }, 0)
    }

    setShowImageUpload(false)
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for preview
    const html = text
      // Images
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-muted pl-4 italic text-muted-foreground">$1</blockquote>',
      )
      // Line breaks
      .replace(/\n/g, "<br>")

    return html
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*")} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`")} title="Code">
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("[", "](url)")}
                title="Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("* ", "")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("1. ", "")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("> ", "")} title="Quote">
                <Quote className="h-4 w-4" />
              </Button>

              <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" title="Upload Image">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                    <DialogDescription>Upload an image to insert into your content</DialogDescription>
                  </DialogHeader>
                  <ImageUpload onImageUploaded={handleImageUploaded} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            data-markdown-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[300px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[300px] p-4 border rounded-md bg-background">
            {value ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
