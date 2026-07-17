import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { chatEntryPath, type ChatReturnPath } from '../chat/returnTargets'
import type { ChatContextReference } from '../chat/types'
import { ChatIcon } from '../ui/icons'

export function ContextChatLink({
  context,
  returnTo,
  children,
  className = 'text-link icon-label',
}: {
  context: Pick<ChatContextReference, 'type' | 'id'>
  returnTo: ChatReturnPath
  children: ReactNode
  className?: string
}) {
  return (
    <Link className={className} to={chatEntryPath(context, returnTo)}>
      <ChatIcon aria-hidden="true" className="icon-leading" focusable="false" />
      {children}
    </Link>
  )
}
