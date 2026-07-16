import type { ReactNode } from 'react'

export function MarkdownBody({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split('\n')
  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  function flushParagraph() {
    if (paragraph.length > 0) {
      const text = paragraph.join(' ')
      blocks.push(<p key={`p-${blocks.length}`}>{inline(text)}</p>)
      paragraph = []
    }
  }
  function flushList() {
    if (list.length > 0) {
      blocks.push(<ul key={`ul-${blocks.length}`}>{list.map((item) => <li key={item}>{inline(item)}</li>)}</ul>)
      list = []
    }
  }

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph()
      flushList()
    } else if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push(<h2 key={`h-${blocks.length}`}>{line.slice(3)}</h2>)
    } else if (line.startsWith('- ')) {
      flushParagraph()
      list.push(line.slice(2))
    } else {
      flushList()
      paragraph.push(line.trim())
    }
  }
  flushParagraph()
  flushList()
  return <div className="article-body">{blocks}</div>
}

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    : part)
}
