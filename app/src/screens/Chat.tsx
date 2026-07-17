import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { createChatClient } from '../chat/client'
import { resolveChatContext } from '../chat/context'
import { buildSafeProfileContext } from '../chat/profile'
import { retrieveChatSources } from '../chat/retrieval'
import {
  chatEntryPath,
  chatReferenceFromSearch,
  type ChatReturnPath,
} from '../chat/returnTargets'
import { createChatMessage, createChatThread } from '../chat/thread'
import type { ChatMessage, ChatThread } from '../chat/types'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import {
  ChatIcon,
  NewChatIcon,
  RetryIcon,
  SendIcon,
  SourceIcon,
} from '../ui/icons'

const MAX_MESSAGE_LENGTH = 2000

export function ChatHomeScreen() {
  const { state } = usePrototype()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const general = resolveChatContext({ type: 'general', id: 'general', sourcePath: '/today' }, state)

  function start(value: string) {
    const normalized = value.trim()
    navigate(chatEntryPath(undefined, '/today'), {
      state: normalized ? { initialQuestion: normalized } : undefined,
    })
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (question.trim()) start(question)
  }

  return (
    <Screen className="chat-home">
      <p className="eyebrow">Context-aware learning</p>
      <h1 className="section-title-with-icon" tabIndex={-1}>
        <ChatIcon aria-hidden="true" className="heading-icon" focusable="false" weight="duotone" />
        Ask Dosha Companion
      </h1>
      <p className="lede">Ask about Ayurveda, your Today guidance, your check-ins, or something in the learning library.</p>
      <form className="chat-start-form" onSubmit={submit}>
        <label htmlFor="chat-home-question">Ask a question</label>
        <textarea
          id="chat-home-question"
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What would you like to understand?"
          rows={3}
          value={question}
        />
        <button className="button primary icon-label" disabled={!question.trim()} type="submit">
          <ChatIcon aria-hidden="true" className="icon-leading" focusable="false" />
          Start conversation
        </button>
      </form>
      <section aria-labelledby="chat-suggestions-title">
        <h2 id="chat-suggestions-title">Suggested questions</h2>
        <div className="suggestion-list">
          {general?.suggestedQuestions.map((suggestion) => (
            <button key={suggestion} onClick={() => start(suggestion)} type="button">{suggestion}</button>
          ))}
        </div>
      </section>
      <RecentConversations threads={state.chatThreads} />
      <p className="boundary-note">Dosha Companion uses the app’s learning content and your saved profile context. It provides educational wellness information, not diagnosis or medical treatment.</p>
    </Screen>
  )
}

export function NewChatScreen() {
  const { state, dispatch } = usePrototype()
  const location = useLocation()
  const navigate = useNavigate()
  const reference = chatReferenceFromSearch(location.search)
  const resolved = reference ? resolveChatContext(reference, state) : null
  const threadRef = useRef<ChatThread | null>(null)
  if (resolved && !threadRef.current) threadRef.current = createChatThread(resolved)

  useEffect(() => {
    const thread = threadRef.current
    if (!thread) return
    dispatch({ type: 'create-chat-thread', thread })
    navigate(`/chat/${thread.id}`, {
      replace: true,
      state: location.state,
    })
  }, [dispatch, location.state, navigate])

  if (!reference || !resolved) {
    return (
      <Screen>
        <BackLink label="Ask Dosha Companion" to="/chat" />
        <p className="eyebrow">Conversation unavailable</p>
        <h1 tabIndex={-1}>That item could not be opened</h1>
        <p>The original content may no longer be available. Start a general conversation instead.</p>
        <Link className="button primary icon-label" to="/chat/new">
          <NewChatIcon aria-hidden="true" className="icon-leading" focusable="false" />
          New conversation
        </Link>
      </Screen>
    )
  }
  return <Screen><p role="status">Starting conversation…</p></Screen>
}

export function ChatThreadScreen() {
  const { threadId } = useParams()
  const { state, dispatch } = usePrototype()
  const location = useLocation()
  const thread = state.chatThreads.find((candidate) => candidate.id === threadId)
  const resolved = useMemo(
    () => thread?.context[0] ? resolveChatContext(thread.context[0], state) : null,
    [state, thread],
  )
  const client = useMemo(() => createChatClient(), [])
  const [draft, setDraft] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const messageList = useRef<HTMLDivElement>(null)
  const initialSent = useRef(false)
  const initialQuestion = isLocationState(location.state) ? location.state.initialQuestion : ''
  const pending = thread?.messages.some((message) => message.status === 'pending') ?? false

  useEffect(() => {
    const region = messageList.current
    if (region) region.scrollTop = region.scrollHeight
  }, [thread?.messages])

  useEffect(() => {
    if (!thread || !resolved || !initialQuestion || initialSent.current) return
    initialSent.current = true
    void sendQuestion(initialQuestion)
  })

  if (!thread) return <Navigate replace to="/chat" />
  if (!resolved) {
    return (
      <Screen>
        <BackLink label="Conversations" to="/chat" />
        <h1 tabIndex={-1}>Conversation context unavailable</h1>
        <p>The anchored item is no longer available, but you can start another conversation.</p>
        <Link className="button primary" to="/chat/new">New conversation</Link>
      </Screen>
    )
  }

  async function sendQuestion(value: string) {
    const question = value.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!question || pending || !thread || !resolved) return
    const userMessage = createChatMessage('user', question)
    const assistantMessage = createChatMessage('assistant', 'Thinking…', 'pending', new Date(Date.now() + 1))
    dispatch({ type: 'add-chat-message', threadId: thread.id, message: userMessage })
    dispatch({ type: 'add-chat-message', threadId: thread.id, message: assistantMessage })
    setDraft('')
    setAnnouncement('Dosha Companion is preparing a response.')
    await requestResponse(question, assistantMessage.id, [...thread.messages, userMessage])
  }

  async function requestResponse(question: string, assistantMessageId: string, history: ChatMessage[]) {
    if (!thread || !resolved) return
    const sources = retrieveChatSources({ question, context: resolved, state })
    try {
      const response = await client.send({
        threadId: thread.id,
        message: question,
        context: {
          anchors: [resolved.payload],
          profile: buildSafeProfileContext(state, resolved),
          sources,
        },
        history: history
          .filter((message) => message.status === 'complete')
          .slice(-12)
          .map(({ role, content }) => ({ role, content })),
      })
      const citations = response.citations.filter((citation) =>
        sources.some((source) =>
          source.id === citation.id &&
          source.type === citation.type &&
          source.href === citation.href,
        ),
      )
      const completedAt = new Date().toISOString()
      dispatch({
        type: 'complete-chat-message',
        threadId: thread.id,
        messageId: assistantMessageId,
        content: response.answer,
        citations,
        suggestedFollowUps: response.suggestedFollowUps,
        boundary: response.boundary,
        completedAt,
      })
      setAnnouncement('Dosha Companion responded.')
    } catch {
      dispatch({ type: 'fail-chat-message', threadId: thread.id, messageId: assistantMessageId })
      setAnnouncement('The response failed. You can retry.')
    }
  }

  async function retry(messageId: string) {
    if (!thread) return
    const index = thread.messages.findIndex((message) => message.id === messageId)
    const userMessage = [...thread.messages.slice(0, index)].reverse().find((message) => message.role === 'user')
    if (!userMessage || pending) return
    dispatch({ type: 'retry-chat-message', threadId: thread.id, messageId })
    setAnnouncement('Retrying response.')
    await requestResponse(userMessage.content, messageId, thread.messages.slice(0, index))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void sendQuestion(draft)
  }

  function composerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (draft.trim() && !pending) void sendQuestion(draft)
    }
  }

  const latestSuggestions = [...thread.messages].reverse().find(
    (message) => message.role === 'assistant' && message.status === 'complete' && message.suggestedFollowUps.length,
  )?.suggestedFollowUps ?? resolved.suggestedQuestions

  return (
    <section className="chat-screen">
      <header className="chat-header">
        <BackLink label={returnLabel(resolved.sourcePath)} to={resolved.sourcePath} />
        <Link className="chat-new-link icon-label" to={chatEntryPath(undefined, returnPath(resolved.sourcePath))}>
          <NewChatIcon aria-hidden="true" className="icon-leading" focusable="false" />
          New conversation
        </Link>
      </header>
      <article className="chat-context-card" aria-labelledby="chat-context-title">
        <div>
          <p className="eyebrow">Discussing</p>
          <h1 id="chat-context-title" tabIndex={-1}>{resolved.title}</h1>
          {resolved.subtitle ? <p className="chat-context-subtitle">{resolved.subtitle}</p> : null}
          <p className="chat-context-summary">{resolved.summary}</p>
        </div>
        <Link to={resolved.sourcePath}>Open original</Link>
      </article>
      <div className="chat-message-list" aria-label="Conversation messages" ref={messageList} role="region">
        {thread.messages.map((message) => (
          <article className={`chat-message ${message.role} ${message.status}`} key={message.id}>
            <p className="chat-message-role">{message.role === 'assistant' ? 'Dosha Companion' : 'You'}</p>
            {message.status === 'error' ? (
              <div role="alert">
                <p>Dosha Companion could not respond right now.</p>
                <button className="text-button icon-label" disabled={pending} onClick={() => void retry(message.id)} type="button">
                  <RetryIcon aria-hidden="true" className="icon-leading" focusable="false" />
                  Retry response
                </button>
              </div>
            ) : <p>{message.content}</p>}
            {message.citations.length ? (
              <div className="chat-citations">
                <p className="chat-citation-label"><SourceIcon aria-hidden="true" className="icon-leading" focusable="false" />Based on</p>
                <div>{message.citations.map((citation) => <Link key={`${citation.type}-${citation.id}`} to={citation.href}>{citation.title}</Link>)}</div>
              </div>
            ) : null}
          </article>
        ))}
        {!pending && latestSuggestions.length ? (
          <div className="chat-suggestions" aria-label="Suggested questions">
            {latestSuggestions.map((suggestion) => <button key={suggestion} onClick={() => void sendQuestion(suggestion)} type="button">{suggestion}</button>)}
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <form className="chat-composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-message">Ask a follow-up</label>
        <textarea
          aria-label="Ask a follow-up"
          disabled={pending}
          id="chat-message"
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={composerKeyDown}
          placeholder="Ask a follow-up…"
          rows={2}
          value={draft}
        />
        <button aria-label="Send message" className="chat-send-button" disabled={!draft.trim() || pending} type="submit">
          <SendIcon aria-hidden="true" focusable="false" />
          <span>Send</span>
        </button>
      </form>
    </section>
  )
}

function RecentConversations({ threads }: { threads: ChatThread[] }) {
  return (
    <section className="chat-history" aria-labelledby="chat-history-title">
      <div className="chat-history-heading">
        <h2 id="chat-history-title">Recent conversations</h2>
        <Link className="icon-label" to="/chat/new">
          <NewChatIcon aria-hidden="true" className="icon-leading" focusable="false" />
          New
        </Link>
      </div>
      {threads.length ? (
        <ul>{threads.map((thread) => <li key={thread.id}><Link to={`/chat/${thread.id}`}><strong>{thread.title}</strong><span>{relativeDate(thread.updatedAt)}</span></Link></li>)}</ul>
      ) : <p className="empty-state">No saved conversations yet.</p>}
    </section>
  )
}

function relativeDate(value: string) {
  const date = new Date(value)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function returnLabel(path: string) {
  if (path.startsWith('/learn')) return 'Learn'
  if (path === '/questions') return 'Questions'
  if (path === '/balance') return 'My Balance'
  return 'Today'
}

function returnPath(path: string): ChatReturnPath {
  if (path.startsWith('/learn')) return '/learn'
  if (path === '/questions') return '/questions'
  if (path === '/balance') return '/balance'
  return '/today'
}

function isLocationState(value: unknown): value is { initialQuestion: string } {
  return typeof value === 'object' && value !== null && 'initialQuestion' in value && typeof value.initialQuestion === 'string'
}
