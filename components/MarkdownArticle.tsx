"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export default function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <div id="cms-body" className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
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
          code: ({ node, inline, className, children, ...props }) =>
            inline ? (
              <code className="px-1 py-0.5 rounded bg-gray-100" {...props}>
                {children}
              </code>
            ) : (
              <code className="block p-3 rounded bg-gray-100 overflow-x-auto" {...props}>
                {children}
              </code>
            ),
          h1: ({ node, ...props }) => <h1 className="mt-6 mb-3 font-semibold" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 font-semibold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-5 mb-2 font-semibold" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
