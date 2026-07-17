import type {
  ChatBoundary,
  ChatCitation,
  ChatContextPayload,
  ChatSourceExcerpt,
  SafeProfileContext,
} from './types'

export interface ChatApiRequest {
  threadId: string
  message: string
  context: {
    anchors: ChatContextPayload[]
    profile: SafeProfileContext
    sources: ChatSourceExcerpt[]
  }
  history: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface ChatApiResponse {
  answer: string
  citations: ChatCitation[]
  suggestedFollowUps: string[]
  boundary: ChatBoundary | null
}

export function validateChatApiResponse(value: unknown): ChatApiResponse {
  if (!isRecord(value) || typeof value.answer !== 'string' || !value.answer.trim() || value.answer.length > 12_000) {
    throw new Error('Dosha Companion received an invalid response.')
  }
  if (!Array.isArray(value.citations) || !Array.isArray(value.suggestedFollowUps)) {
    throw new Error('Dosha Companion received an invalid response.')
  }
  const citations = value.citations.map(validateCitation)
  const suggestedFollowUps = value.suggestedFollowUps.map((item) => {
    if (typeof item !== 'string' || !item.trim() || item.length > 240) throw new Error('Dosha Companion received an invalid response.')
    return item.trim()
  }).slice(0, 4)
  const boundary = validateBoundary(value.boundary)
  return { answer: value.answer.trim(), citations, suggestedFollowUps, boundary }
}

function validateCitation(value: unknown): ChatCitation {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.href !== 'string') {
    throw new Error('Dosha Companion received an invalid response.')
  }
  if (!['article', 'glossary', 'recommendation', 'seasonal-food'].includes(String(value.type))) {
    throw new Error('Dosha Companion received an invalid response.')
  }
  if (!isSafeAppHref(value.href)) throw new Error('Dosha Companion received an invalid response.')
  return {
    id: value.id.slice(0, 100),
    title: value.title.trim().slice(0, 200),
    href: value.href,
    type: value.type as ChatCitation['type'],
  }
}

function validateBoundary(value: unknown): ChatBoundary | null {
  if (value === null) return null
  if (value === 'medical' || value === 'medication' || value === 'unsupported' || value === 'emergency') return value
  throw new Error('Dosha Companion received an invalid response.')
}

function isSafeAppHref(value: string) {
  return /^\/(?:today|learn(?:\/[a-zA-Z0-9_-]+)?(?:#[a-zA-Z0-9_-]+)?)$/.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
