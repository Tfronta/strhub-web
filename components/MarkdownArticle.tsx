"use client"
import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-sm font-medium"
      >
        ESC ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default function MarkdownArticle({ markdown }: { markdown: string }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
      <div id="cms-body" className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ src, alt }) => (
              <figure className="my-6" style={{ maxWidth: "min(100%, 760px)" }}>
                <img
                  src={src || ""}
                  alt={alt || ""}
                  className="rounded-lg h-auto block w-full cursor-zoom-in transition-opacity hover:opacity-90"
                  style={{ maxWidth: "min(100%, 760px)" }}
                  onClick={() => openLightbox(src || "", alt || "")}
                />
                {alt && alt.length > 20 && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            ),
            p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="my-4 border-l-4 pl-4 text-gray-700" {...props} />,
            table: ({ node, ...props }) => (
              <table className="w-full border-collapse border border-gray-300 text-center text-[13px] my-4" {...props} />
            ),
            thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
            th: ({ node, ...props }) => (
              <th className="border border-gray-300 px-3 py-2 font-semibold text-[13px]" {...props} />
            ),
            td: ({ node, ...props }) => <td className="border border-gray-300 px-3 py-2 text-[13px]" {...props} />,
            tr: ({ node, ...props }) => (
              <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-300" {...props} />
            ),
            code: ({ node, inline, className, children, ...props }: any) =>
              inline ? (
                <code className="px-1 py-0.5 rounded bg-gray-100" {...props}>{children}</code>
              ) : (
                <code className="block p-3 rounded bg-gray-100 overflow-x-auto" {...props}>{children}</code>
              ),
            h1: ({ node, ...props }) => <h1 className="mt-6 mb-3 font-semibold" {...props} />,
            h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 font-semibold" {...props} />,
            h3: ({ node, ...props }) => <h3 className="mt-5 mb-2 font-semibold" {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </>
  )
}
