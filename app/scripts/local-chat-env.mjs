export function parseLocalApiKey(contents) {
  const line = contents
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith('#'))
  if (!line) return ''
  const value = line.startsWith('OPENAI_API_KEY=')
    ? line.slice('OPENAI_API_KEY='.length).trim()
    : line
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1).trim()
  }
  return value
}

export function withLocalChatEnvironment(environment, keyFileContents) {
  const resolved = { ...environment }
  const existingKey = resolved.OPENAI_API_KEY?.trim()
  const fileKey = existingKey ? '' : parseLocalApiKey(keyFileContents)
  if (fileKey) resolved.OPENAI_API_KEY = fileKey
  if (!resolved.VITE_CHAT_MODE && (existingKey || fileKey)) {
    resolved.VITE_CHAT_MODE = 'api'
  }
  return {
    environment: resolved,
    loadedFileKey: Boolean(fileKey),
  }
}
