import { describe, expect, it } from 'vitest'
import {
  parseLocalApiKey,
  withLocalChatEnvironment,
} from './local-chat-env.mjs'

describe('local chat development environment', () => {
  it('parses raw and assignment-style key files without retaining line breaks', () => {
    expect(parseLocalApiKey('  test-raw-key\n')).toBe('test-raw-key')
    expect(parseLocalApiKey('# local only\nOPENAI_API_KEY="test-assigned-key"\n')).toBe('test-assigned-key')
  })

  it('enables API mode when a local key is available', () => {
    expect(withLocalChatEnvironment({}, 'test-file-key')).toEqual({
      environment: {
        OPENAI_API_KEY: 'test-file-key',
        VITE_CHAT_MODE: 'api',
      },
      loadedFileKey: true,
    })
  })

  it('preserves explicit environment choices and prefers an environment key', () => {
    expect(withLocalChatEnvironment({
      OPENAI_API_KEY: 'test-environment-key',
      VITE_CHAT_MODE: 'mock',
    }, 'test-file-key')).toEqual({
      environment: {
        OPENAI_API_KEY: 'test-environment-key',
        VITE_CHAT_MODE: 'mock',
      },
      loadedFileKey: false,
    })
  })
})
