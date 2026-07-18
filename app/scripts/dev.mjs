import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { withLocalChatEnvironment } from './local-chat-env.mjs'

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const appDirectory = resolve(scriptsDirectory, '..')
const apiKeyPath = resolve(appDirectory, '..', 'apikey.txt')
const suppliedArguments = process.argv.slice(2)
const forceMock = suppliedArguments.includes('--mock-chat')
const viteArguments = suppliedArguments.filter((argument) => argument !== '--mock-chat')

let environment
let loadedFileKey = false
if (forceMock) {
  environment = { ...process.env, VITE_CHAT_MODE: 'mock' }
} else {
  const keyFileContents = await readFile(apiKeyPath, 'utf8').catch(() => '')
  const resolved = withLocalChatEnvironment(process.env, keyFileContents)
  environment = resolved.environment
  loadedFileKey = resolved.loadedFileKey
}

if (forceMock) {
  console.log('[dev] Chat mode: mock')
} else if (environment.VITE_CHAT_MODE === 'api') {
  console.log(`[dev] Chat mode: OpenAI API${loadedFileKey ? ' (loaded from ignored apikey.txt)' : ''}`)
} else {
  console.log('[dev] Chat mode: mock (no local API key found)')
}

const viteBin = resolve(appDirectory, 'node_modules', 'vite', 'bin', 'vite.js')
const vite = spawn(
  process.execPath,
  [viteBin, '--host', '0.0.0.0', ...viteArguments],
  {
    cwd: appDirectory,
    env: environment,
    stdio: 'inherit',
  },
)

vite.on('error', () => {
  console.error('[dev] Vite could not be started.')
  process.exitCode = 1
})
vite.on('exit', (code) => {
  process.exitCode = code ?? 1
})
