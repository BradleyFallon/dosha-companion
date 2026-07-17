import {
  validateChatApiResponse,
  type ChatApiRequest,
  type ChatApiResponse,
} from './api'

export interface ChatClient {
  send(request: ChatApiRequest): Promise<ChatApiResponse>
}

export class MockChatClient implements ChatClient {
  async send(request: ChatApiRequest): Promise<ChatApiResponse> {
    await new Promise((resolve) => window.setTimeout(resolve, 180))
    if (/simulate mock failure/i.test(request.message)) {
      throw new Error('Dosha Companion could not respond right now.')
    }
    const boundary = detectBoundary(request.message)
    if (boundary) return boundary

    const anchor = request.context.anchors[0] ?? { type: 'general' as const }
    const citations = request.context.sources.slice(0, 3).map(({ excerpt: _excerpt, ...citation }) => citation)
    switch (anchor.type) {
      case 'recommendation':
        return {
          answer: `This recommendation was selected through the app’s deterministic guidance rules: ${anchor.reasons[0] ?? 'it matched the current recommendation context'}. The practical goal is to make “${anchor.action}” manageable, not to replace your judgment or create a rigid routine.`,
          citations,
          suggestedFollowUps: ['How could I make this easier?', 'What should I notice afterward?', 'How does this relate to Vata?'],
          boundary: null,
        }
      case 'article':
        return {
          answer: `${anchor.title} describes ${anchor.summary.charAt(0).toLowerCase()}${anchor.summary.slice(1)} The app uses these ideas as educational organizing concepts rather than diagnoses, and the linked learning content remains the source of record.`,
          citations,
          suggestedFollowUps: ['Can you give me a simple example?', 'What is the main distinction?', 'What should I read next?'],
          boundary: null,
        }
      case 'seasonal-food':
        return {
          answer: `${anchor.name} is included because it is currently listed as seasonal for ${anchor.produceRegion}. The app checked your saved dietary pattern, but it is not calculating whether this food is specifically balancing for a dosha profile.`,
          citations,
          suggestedFollowUps: ['How could I prepare this simply?', 'Why does seasonality vary?', 'What does the related article explain?'],
          boundary: null,
        }
      case 'check-in':
        return {
          answer: `This check-in records how you felt recently across ${anchor.answers.length} answers. It remains separate from your usual-nature assessment, so a recent change is a temporary pattern to observe rather than a new permanent label.`,
          citations,
          suggestedFollowUps: ['What should I keep observing?', 'How is this different from my assessment?', 'Where can I review the source questions?'],
          boundary: null,
        }
      case 'balance-domain':
        return {
          answer: anchor.recentAnswer
            ? `Your recent ${anchor.label.toLowerCase()} response records “${anchor.recentAnswer}”${anchor.usualAnswer ? ` alongside the usual pattern you supplied` : ''}. The app can describe that information, but it does not calculate a dosha score or diagnosis from it.`
            : `There is not enough recent ${anchor.label.toLowerCase()} information to compare yet. The app does not fill that gap with an inferred score or interpretation.`,
          citations,
          suggestedFollowUps: ['What should I keep observing?', 'How is recent information kept separate?', 'Where can I review my responses?'],
          boundary: null,
        }
      case 'general':
        return {
          answer: generalAnswer(request),
          citations,
          suggestedFollowUps: ['Can you explain that more simply?', 'How does this app use that idea?', 'What should I read next?'],
          boundary: citations.length ? null : 'unsupported',
        }
    }
  }
}

export class ApiChatClient implements ChatClient {
  async send(request: ChatApiRequest): Promise<ChatApiResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Dosha Companion could not respond right now.')
    return validateChatApiResponse(await response.json())
  }
}

export function createChatClient(): ChatClient {
  return import.meta.env.VITE_CHAT_MODE === 'api'
    ? new ApiChatClient()
    : new MockChatClient()
}

function generalAnswer(request: ChatApiRequest) {
  const first = request.context.sources[0]
  if (!first) return 'I could not find enough approved learning content to answer that. Try asking about Vata, current balance, routines, check-ins, or Today guidance.'
  return `${first.title} is the closest match in the app’s learning catalog. ${first.excerpt} This answer is grounded in the linked app content and does not change any assessment or recommendation result.`
}

function detectBoundary(message: string): ChatApiResponse | null {
  if (/(suicid|kill myself|can['’]?t breathe|chest pain|medical emergency)/i.test(message)) {
    return {
      answer: 'This may need immediate, real-world help. Contact local emergency services or a qualified crisis service now; this educational app cannot respond to emergencies.',
      citations: [],
      suggestedFollowUps: [],
      boundary: 'emergency',
    }
  }
  if (/(stop|start|change|skip).{0,30}(medication|medicine|prescription)|medication.{0,30}(stop|change)/i.test(message)) {
    return {
      answer: 'Do not start, stop, or change medication based on this app. A prescribing clinician or pharmacist can help you make that decision safely.',
      citations: [],
      suggestedFollowUps: [],
      boundary: 'medication',
    }
  }
  if (/(do i have|diagnos|treat|cure).{0,40}(disorder|infection|disease|anxiety|condition)|treat an infection/i.test(message)) {
    return {
      answer: 'Dosha Companion cannot diagnose or treat a medical or mental-health condition. Please ask a qualified clinician for an assessment or treatment advice.',
      citations: [],
      suggestedFollowUps: ['What educational wellness topics can you explain?'],
      boundary: 'medical',
    }
  }
  return null
}
