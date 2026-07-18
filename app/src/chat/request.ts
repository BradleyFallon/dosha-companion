import type { ChatApiRequest } from './api'
import type {
  ChatContextPayload,
  ChatSourceExcerpt,
  SafeProfileContext,
} from './types'

export const MAX_CHAT_REQUEST_BYTES = 100 * 1024
export const MAX_CHAT_MESSAGE_LENGTH = 2_000
export const MAX_CHAT_HISTORY_ITEMS = 12
export const MAX_CHAT_ANCHORS = 3
export const MAX_CHAT_SOURCES = 5

const MAX_CONTEXT_TEXT_LENGTH = 12_000
const MAX_SOURCE_EXCERPT_LENGTH = 2_000
const MAX_HISTORY_ASSISTANT_LENGTH = 12_000

export function validateChatApiRequest(value: unknown): ChatApiRequest {
  if (!isRecord(value)) invalid()
  const threadId = requiredString(value.threadId, 100)
  const message = requiredString(value.message, MAX_CHAT_MESSAGE_LENGTH)
  if (!isRecord(value.context)) invalid()
  const anchors = validateAnchors(value.context.anchors)
  const profile = validateProfile(value.context.profile)
  const sources = validateSources(value.context.sources)
  const history = validateHistory(value.history)
  return { threadId, message, context: { anchors, profile, sources }, history }
}

export function normalizeChatHistory(request: ChatApiRequest) {
  const history = request.history.map(({ role, content }) => ({ role, content }))
  const newest = history.at(-1)
  if (newest?.role !== 'user' || newest.content.trim() !== request.message) {
    history.push({ role: 'user', content: request.message })
  }
  return history
}

function validateAnchors(value: unknown): ChatContextPayload[] {
  if (!Array.isArray(value) || value.length > MAX_CHAT_ANCHORS) invalid()
  return value.map(validateAnchor)
}

function validateAnchor(value: unknown): ChatContextPayload {
  if (!isRecord(value) || typeof value.type !== 'string') invalid()
  switch (value.type) {
    case 'recommendation':
      return {
        type: value.type,
        recommendationId: requiredString(value.recommendationId, 100),
        title: requiredString(value.title, 300),
        guidance: requiredString(value.guidance, MAX_CONTEXT_TEXT_LENGTH),
        action: requiredString(value.action, 2_000),
        reasons: stringArray(value.reasons, 8, 1_000),
        relatedArticleId: requiredString(value.relatedArticleId, 100),
      }
    case 'article':
      return {
        type: value.type,
        articleId: requiredString(value.articleId, 100),
        title: requiredString(value.title, 300),
        summary: requiredString(value.summary, 2_000),
        body: requiredString(value.body, MAX_CONTEXT_TEXT_LENGTH),
        tags: stringArray(value.tags, 20, 100),
      }
    case 'seasonal-food':
      return {
        type: value.type,
        foodId: requiredString(value.foodId, 100),
        name: requiredString(value.name, 200),
        produceRegion: requiredString(value.produceRegion, 300),
        month: integer(value.month, 1, 12),
        dietaryPattern: requiredString(value.dietaryPattern, 200),
        relatedArticleId: requiredString(value.relatedArticleId, 100),
      }
    case 'check-in':
      return {
        type: value.type,
        checkInId: requiredString(value.checkInId, 100),
        completedAt: requiredString(value.completedAt, 100),
        classification: exact(value.classification, 'current'),
        answers: answerArray(value.answers),
      }
    case 'balance-domain':
      return {
        type: value.type,
        domain: requiredString(value.domain, 100),
        label: requiredString(value.label, 200),
        ...optionalStringProperty(value, 'usualAnswer', MAX_CONTEXT_TEXT_LENGTH),
        ...optionalStringProperty(value, 'recentAnswer', MAX_CONTEXT_TEXT_LENGTH),
        ...optionalStringProperty(value, 'usualShortLabel', 300),
        ...optionalStringProperty(value, 'recentShortLabel', 300),
        comparison: comparison(value.comparison),
      }
    case 'general':
      return { type: value.type }
    default:
      return invalid()
  }
}

function validateProfile(value: unknown): SafeProfileContext {
  if (!isRecord(value)) invalid()
  const allowed = new Set([
    'preferredName',
    'birthYear',
    'dietaryPattern',
    'allergies',
    'exclusions',
    'regionalLocationLabel',
    'currentRecommendationTitle',
    'recentCheckInSummary',
  ])
  if (Object.keys(value).some((key) => !allowed.has(key))) invalid()
  return {
    ...optionalStringProperty(value, 'preferredName', 200),
    ...optionalStringProperty(value, 'birthYear', 20),
    ...optionalStringProperty(value, 'dietaryPattern', 200),
    ...optionalStringArrayProperty(value, 'allergies', 20, 200),
    ...optionalStringArrayProperty(value, 'exclusions', 20, 200),
    ...optionalStringProperty(value, 'regionalLocationLabel', 300),
    ...optionalStringProperty(value, 'currentRecommendationTitle', 300),
    ...optionalStringProperty(value, 'recentCheckInSummary', 1_000),
  }
}

function validateSources(value: unknown): ChatSourceExcerpt[] {
  if (!Array.isArray(value) || value.length > MAX_CHAT_SOURCES) invalid()
  return value.map((source) => {
    if (!isRecord(source)) invalid()
    const type = citationType(source.type)
    const href = requiredString(source.href, 300)
    if (!/^\/(?:today|learn(?:\/[a-zA-Z0-9_-]+)?(?:#[a-zA-Z0-9_-]+)?)$/.test(href)) invalid()
    return {
      id: requiredString(source.id, 100),
      title: requiredString(source.title, 200),
      href,
      type,
      excerpt: requiredString(source.excerpt, MAX_SOURCE_EXCERPT_LENGTH),
    }
  })
}

function validateHistory(value: unknown): ChatApiRequest['history'] {
  if (!Array.isArray(value) || value.length > MAX_CHAT_HISTORY_ITEMS) invalid()
  return value.map((item) => {
    if (!isRecord(item) || (item.role !== 'user' && item.role !== 'assistant')) invalid()
    return {
      role: item.role,
      content: requiredString(
        item.content,
        item.role === 'user' ? MAX_CHAT_MESSAGE_LENGTH : MAX_HISTORY_ASSISTANT_LENGTH,
      ),
    }
  })
}

function answerArray(value: unknown) {
  if (!Array.isArray(value) || value.length > 30) invalid()
  return value.map((answer) => {
    if (!isRecord(answer)) invalid()
    return {
      question: requiredString(answer.question, 1_000),
      answer: requiredString(answer.answer, 2_000),
    }
  })
}

function comparison(value: unknown) {
  const values = [
    'close-to-usual',
    'changed-from-usual',
    'recent-only',
    'usual-only',
    'uncertain',
    'missing',
  ] as const
  const match = values.find((candidate) => candidate === value)
  if (!match) invalid()
  return match
}

function citationType(value: unknown): ChatSourceExcerpt['type'] {
  if (value === 'article' || value === 'glossary' || value === 'recommendation' || value === 'seasonal-food') return value
  return invalid()
}

function stringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value) || value.length > maxItems) invalid()
  return value.map((item) => requiredString(item, maxLength))
}

function optionalStringProperty<K extends string>(
  value: Record<string, unknown>,
  key: K,
  maxLength: number,
): Partial<Record<K, string>> {
  if (value[key] === undefined) return {}
  return { [key]: requiredString(value[key], maxLength) } as Record<K, string>
}

function optionalStringArrayProperty<K extends string>(
  value: Record<string, unknown>,
  key: K,
  maxItems: number,
  maxLength: number,
): Partial<Record<K, string[]>> {
  if (value[key] === undefined) return {}
  return { [key]: stringArray(value[key], maxItems, maxLength) } as Record<K, string[]>
}

function requiredString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') invalid()
  const trimmed = value.trim()
  if (!trimmed || value.length > maxLength) invalid()
  return trimmed
}

function integer(value: unknown, minimum: number, maximum: number) {
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) invalid()
  return value as number
}

function exact<T extends string>(value: unknown, expected: T): T {
  if (value !== expected) invalid()
  return expected
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function invalid(): never {
  throw new Error('Dosha Companion received an invalid request.')
}
