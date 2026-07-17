import type {
  ChatMessage,
  ChatThread,
  ResolvedChatContext,
} from './types'

export function createChatThread(context: ResolvedChatContext, now = new Date()): ChatThread {
  const createdAt = now.toISOString()
  const id = `chat-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`
  const welcome: ChatMessage = {
    id: `${id}-welcome`,
    role: 'assistant',
    content: context.reference.type === 'general'
      ? 'What would you like to understand? I’ll use the app’s learning content and relevant saved context.'
      : `What would you like to understand about ${context.title}?`,
    createdAt,
    status: 'complete',
    citations: [],
    suggestedFollowUps: context.suggestedQuestions,
    boundary: null,
  }
  return {
    id,
    title: context.reference.type === 'general' ? 'New conversation' : context.title,
    createdAt,
    updatedAt: createdAt,
    context: [context.reference],
    messages: [welcome],
  }
}

export function createChatMessage(
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status'] = 'complete',
  now = new Date(),
): ChatMessage {
  return {
    id: `message-${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    createdAt: now.toISOString(),
    status,
    citations: [],
    suggestedFollowUps: [],
    boundary: null,
  }
}
