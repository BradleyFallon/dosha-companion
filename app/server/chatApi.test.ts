import { describe, expect, it, vi } from 'vitest'
import type { ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses'
import type { ChatApiRequest, ChatApiResponse } from '../src/chat/api'
import {
  handleChatApiRequest,
  type OpenAIChatClient,
} from './chatApi'

describe('local OpenAI chat handler', () => {
  it('returns a validated grounded response through strict Responses API output', async () => {
    const client = modelClient(response({
      answer: 'The supplied article describes usual tendencies as distinct from recent experience.',
      citations: [citation],
      suggestedFollowUps: ['How are recent check-ins different?'],
      boundary: null,
    }))
    const result = await handleChatApiRequest('POST', JSON.stringify(validRequest()), {
      apiKey: 'test-key',
      client,
    })

    expect(result).toEqual({
      status: 200,
      body: expect.objectContaining({
        answer: expect.stringContaining('usual tendencies'),
        citations: [citation],
      }),
    })
    expect(client.create).toHaveBeenCalledOnce()
    expect(client.create).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gpt-5-mini',
      store: false,
      stream: false,
      reasoning: { effort: 'low' },
      text: expect.objectContaining({
        format: expect.objectContaining({
          type: 'json_schema',
          strict: true,
        }),
      }),
    }))
  })

  it('rejects invalid input and oversized messages before model use', async () => {
    const client = modelClient(response(validResponse))
    const invalid = validRequest()
    invalid.message = 'x'.repeat(2_001)

    expect(await handleChatApiRequest('GET', '', { apiKey: 'test-key', client })).toMatchObject({ status: 405 })
    expect(await handleChatApiRequest('POST', '{bad json', { apiKey: 'test-key', client })).toMatchObject({ status: 400 })
    expect(await handleChatApiRequest('POST', JSON.stringify(invalid), { apiKey: 'test-key', client })).toMatchObject({ status: 400 })
    expect(client.create).not.toHaveBeenCalled()
  })

  it('reports a missing server key without revealing configuration details', async () => {
    const result = await handleChatApiRequest('POST', JSON.stringify(validRequest()), {})
    expect(result).toEqual({
      status: 503,
      body: { error: 'Chat API is not configured.' },
    })
  })

  it('returns a generic upstream failure and rejects invalid structured output', async () => {
    const failing = modelClient(Promise.reject(new Error('secret upstream detail')))
    const malformed = modelClient(response({ answer: '', citations: [], suggestedFollowUps: [], boundary: null }))

    expect(await handleChatApiRequest('POST', JSON.stringify(validRequest()), {
      apiKey: 'test-key',
      client: failing,
    })).toEqual({
      status: 502,
      body: { error: 'Dosha Companion could not respond right now.' },
    })
    expect(await handleChatApiRequest('POST', JSON.stringify(validRequest()), {
      apiKey: 'test-key',
      client: malformed,
    })).toMatchObject({ status: 502 })
  })

  it('bypasses OpenAI for deterministic health boundaries even without an API key', async () => {
    const client = modelClient(response(validResponse))
    const request = validRequest()
    request.message = 'Should I stop taking my medication?'
    const result = await handleChatApiRequest('POST', JSON.stringify(request), { client })

    expect(result).toMatchObject({
      status: 200,
      body: { boundary: 'medication', citations: [] },
    })
    expect(client.create).not.toHaveBeenCalled()
  })

  it('removes fabricated and duplicate citations and restores supplied titles', async () => {
    const client = modelClient(response({
      ...validResponse,
      citations: [
        { ...citation, title: 'Invented title' },
        citation,
        { id: 'fabricated', title: 'Fabricated', href: '/learn/fabricated', type: 'article' },
      ],
    }))
    const result = await handleChatApiRequest('POST', JSON.stringify(validRequest()), {
      apiKey: 'test-key',
      client,
    })

    expect(result).toMatchObject({
      status: 200,
      body: { citations: [citation] },
    })
  })

  it('sends the newest user question to OpenAI exactly once', async () => {
    const client = modelClient(response(validResponse))
    const request = validRequest()
    request.history = [
      { role: 'user', content: 'Earlier question' },
      { role: 'assistant', content: 'Earlier grounded answer' },
      { role: 'user', content: request.message },
    ]
    await handleChatApiRequest('POST', JSON.stringify(request), {
      apiKey: 'test-key',
      client,
    })

    const params = vi.mocked(client.create).mock.calls[0][0]
    expect(Array.isArray(params.input)).toBe(true)
    const currentQuestionInputs = (params.input as Array<{ role?: string; content?: string }>).filter(
      (item) => item.role === 'user' && item.content === request.message,
    )
    expect(currentQuestionInputs).toHaveLength(1)
  })
})

const citation = {
  id: 'nature-and-current-balance',
  title: 'Nature and current balance',
  href: '/learn/nature-and-current-balance',
  type: 'article' as const,
}

const validResponse: ChatApiResponse = {
  answer: 'The supplied article distinguishes usual tendencies from recent experience.',
  citations: [citation],
  suggestedFollowUps: ['How are recent check-ins different?'],
  boundary: null,
}

function validRequest(): ChatApiRequest {
  return {
    threadId: 'thread-test',
    message: 'How is a recent check-in different?',
    context: {
      anchors: [{ type: 'general' }],
      profile: { preferredName: 'Alex' },
      sources: [{
        ...citation,
        excerpt: 'Usual tendencies and recent experience are kept separate.',
      }],
    },
    history: [],
  }
}

function response(value: unknown) {
  return Promise.resolve({ output_text: JSON.stringify(value) })
}

function modelClient(result: Promise<{ output_text: string }>): OpenAIChatClient {
  return {
    create: vi.fn((_params: ResponseCreateParamsNonStreaming) => result),
  }
}
