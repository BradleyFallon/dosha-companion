export type ChatContextType =
  | 'recommendation'
  | 'article'
  | 'seasonal-food'
  | 'check-in'
  | 'balance-domain'
  | 'general'

export interface ChatContextReference {
  type: ChatContextType
  id: string
  sourcePath: string
}

export type ChatContextPayload =
  | {
      type: 'recommendation'
      recommendationId: string
      title: string
      guidance: string
      action: string
      reasons: string[]
      relatedArticleId: string
    }
  | {
      type: 'article'
      articleId: string
      title: string
      summary: string
      body: string
      tags: string[]
    }
  | {
      type: 'seasonal-food'
      foodId: string
      name: string
      produceRegion: string
      month: number
      dietaryPattern: string
      relatedArticleId: string
    }
  | {
      type: 'check-in'
      checkInId: string
      completedAt: string
      classification: 'current'
      answers: Array<{ question: string; answer: string }>
    }
  | {
      type: 'balance-domain'
      domain: string
      label: string
      usualAnswer?: string
      recentAnswer?: string
      comparison?: string
    }
  | { type: 'general' }

export interface ResolvedChatContext {
  reference: ChatContextReference
  title: string
  subtitle?: string
  summary: string
  sourcePath: string
  suggestedQuestions: string[]
  sourceIds: string[]
  payload: ChatContextPayload
}

export type ChatCitationType =
  | 'article'
  | 'glossary'
  | 'recommendation'
  | 'seasonal-food'

export interface ChatCitation {
  id: string
  title: string
  href: string
  type: ChatCitationType
}

export type ChatBoundary =
  | 'medical'
  | 'medication'
  | 'unsupported'
  | 'emergency'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status: 'pending' | 'complete' | 'error'
  citations: ChatCitation[]
  suggestedFollowUps: string[]
  boundary: ChatBoundary | null
}

export interface ChatThread {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  context: ChatContextReference[]
  messages: ChatMessage[]
}

export interface SafeProfileContext {
  preferredName?: string
  birthYear?: string
  dietaryPattern?: string
  allergies?: string[]
  exclusions?: string[]
  regionalLocationLabel?: string
  currentRecommendationTitle?: string
  recentCheckInSummary?: string
}

export interface ChatSourceExcerpt extends ChatCitation {
  excerpt: string
}
