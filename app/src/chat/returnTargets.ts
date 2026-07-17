import type { ChatContextReference, ChatContextType } from './types'

export const chatReturnTargets = {
  today: '/today',
  learn: '/learn',
  questions: '/questions',
  balance: '/balance',
} as const

export type ChatReturnPath = (typeof chatReturnTargets)[keyof typeof chatReturnTargets]

export function chatEntryPath(
  reference?: Pick<ChatContextReference, 'type' | 'id'>,
  returnTo: ChatReturnPath = '/today',
) {
  const returnKey = Object.entries(chatReturnTargets).find(([, path]) => path === returnTo)?.[0] ?? 'today'
  const parameters = new URLSearchParams({ return: returnKey })
  if (reference && reference.type !== 'general') {
    parameters.set('contextType', reference.type)
    parameters.set('contextId', reference.id)
  }
  return `/chat/new?${parameters.toString()}`
}

export function chatReferenceFromSearch(search: string): ChatContextReference | null {
  const parameters = new URLSearchParams(search)
  const sourcePath = chatReturnPath(search, '/today')
  const type = parameters.get('contextType')
  const id = parameters.get('contextId')
  if (!type && !id) return { type: 'general', id: 'general', sourcePath }
  if (!isContextType(type) || !id || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return null
  return { type, id, sourcePath }
}

export function chatReturnPath(search: string, fallback: ChatReturnPath) {
  const key = new URLSearchParams(search).get('return')
  return key && key in chatReturnTargets
    ? chatReturnTargets[key as keyof typeof chatReturnTargets]
    : fallback
}

function isContextType(value: string | null): value is Exclude<ChatContextType, 'general'> {
  return value === 'recommendation' || value === 'article' || value === 'seasonal-food' || value === 'check-in' || value === 'balance-domain'
}
