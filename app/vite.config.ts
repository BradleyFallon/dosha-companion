import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createChatApiPlugin } from './server/chatApi.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      createChatApiPlugin({
        apiKey: env.OPENAI_API_KEY,
        model: env.OPENAI_CHAT_MODEL || 'gpt-5-mini',
      }),
    ],
  }
})
