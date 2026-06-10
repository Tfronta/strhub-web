"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (url: string, alt?: string) => void
  className?: string
}

export function ImageUpload({ onImageUploaded, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const altText = prompt("Enter alt text for the image (optional):") || file.name
        onImageUploaded(data.url, altText)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p>Drag and drop an image here, or</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-2"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, WebP (max 5MB)</p>
        </div>
      </div>
    </div>
  )
}
