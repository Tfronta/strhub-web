import type React from "react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { type Document, BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import Image from "next/image"

interface ContentfulRichTextProps {
  document: Document
  className?: string
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{text}</code>,
    [MARKS.SUPERSCRIPT]: (text: React.ReactNode) => <sup>{text}</sup>,
    [MARKS.SUBSCRIPT]: (text: React.ReactNode) => <sub>{text}</sub>,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mb-3 mt-6">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-lg font-semibold mb-2 mt-3">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-base font-semibold mb-2 mt-3">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-sm font-semibold mb-2 mt-3">{children}</h6>
    ),
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-4 leading-relaxed">{children}</p>,
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="ml-4">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-border" />,
    [BLOCKS.TABLE]: (node: any, children: React.ReactNode) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-border">{children}</table>
      </div>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: React.ReactNode) => (
      <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">{children}</th>
    ),
    [BLOCKS.TABLE_CELL]: (node: any, children: React.ReactNode) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
    [BLOCKS.TABLE_ROW]: (node: any, children: React.ReactNode) => <tr>{children}</tr>,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields
      if (file?.contentType?.startsWith("image/")) {
        return (
          <div className="my-6">
            <Image
              src={`https:${file.url}`}
              alt={title || "Embedded image"}
              width={file.details.image.width}
              height={file.details.image.height}
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )
      }
      return null
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a href={node.data.uri} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

export default function ContentfulRichText({ document, className = "" }: ContentfulRichTextProps) {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      {documentToReactComponents(document, options)}
    </div>
  )
}
