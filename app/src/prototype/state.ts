import { initialAssessment } from '../generated/initialAssessment'
import {
  checkInQuestionSets,
  learningArticles,
  recommendationCatalog,
  seasonalProduceCatalog,
} from '../generated/contentCatalog'
import type { AssessmentMode } from '../quiz/assessment'
import { getAssessmentQuestions } from '../quiz/assessment'
import { getProfileReadiness } from '../profile/readiness'
import { DEVELOPMENT_DOSHA_FIXTURE, type DevelopmentFixture } from '../quiz/result'
import { isKnownCitation } from '../chat/retrieval'
import type {
  ChatCitation,
  ChatContextReference,
  ChatMessage,
  ChatThread,
} from '../chat/types'

export const STORAGE_KEY = 'dosha-companion-prototype-state'
export const STORAGE_VERSION = 10

export type SaveStatus = 'saved' | 'saving' | 'not-saved'

export interface RegionalLocation {
  source: 'device' | 'map' | 'city'
  areaId: string
  latitude: number
  longitude: number
  precisionKm: 10
  displayName: string
  countryCode: string
  admin1Code: string | null
  timeZone: string
  produceRegionId: string | null
}

export type LocationProfile = RegionalLocation

export interface ProfileState {
  preferredName: string
  birthYear: string
  location: LocationProfile | null
  temperatureUnitPreference: 'automatic' | 'fahrenheit' | 'celsius'
  dietaryPattern: string
  hasFoodAllergies: boolean | null
  allergies: string
  hasFoodExclusions: boolean | null
  exclusions: string
}

export type RecommendationHistoryStatus = 'shown' | 'completed' | 'dismissed'

export interface RecommendationHistoryRecord {
  recommendationId: string
  date: string
  status: RecommendationHistoryStatus
}

export interface CheckIn {
  id: string
  setId: string
  startedAt: string
  completedAt: string | null
  answers: Record<string, string>
}

export interface PrototypeState {
  accountCreated: boolean
  profile: ProfileState
  profileCompleted: boolean
  introSeen: boolean
  assessmentStarted: boolean
  assessmentMode: AssessmentMode
  currentIndex: number
  selectedAnswerId: string | null
  submittedAnswers: Record<string, string>
  skippedQuestionIds: string[]
  transitionSeen: boolean
  resultsReached: boolean
  todayVisited: boolean
  doshaFixtureId: DevelopmentFixture['fixtureId'] | null
  recommendationHistory: RecommendationHistoryRecord[]
  todayRecommendationId: string | null
  checkIns: CheckIn[]
  chatThreads: ChatThread[]
  saveStatus: SaveStatus
  restoreNotice: string | null
}

export type PrototypeAction =
  | { type: 'account-created' }
  | { type: 'update-profile'; values: Partial<ProfileState> }
  | { type: 'complete-profile' }
  | { type: 'start-assessment'; mode: AssessmentMode }
  | { type: 'select-answer'; answerId: string }
  | { type: 'submit-answer'; questionId: string; answerId: string; nextIndex: number }
  | { type: 'skip-question'; questionId: string; nextIndex: number }
  | { type: 'go-to-index'; index: number; selectedAnswerId?: string | null }
  | { type: 'complete-transition' }
  | { type: 'reach-results' }
  | { type: 'visit-today' }
  | { type: 'set-dosha-fixture'; fixtureId: DevelopmentFixture['fixtureId'] | null }
  | { type: 'show-recommendation'; recommendationId: string; date: string }
  | { type: 'recommendation-status'; recommendationId: string; date: string; status: RecommendationHistoryStatus }
  | { type: 'clear-active-recommendation' }
  | { type: 'start-check-in'; checkIn: CheckIn }
  | { type: 'answer-check-in'; checkInId: string; questionId: string; answerId: string }
  | { type: 'complete-check-in'; checkInId: string; completedAt: string }
  | { type: 'create-chat-thread'; thread: ChatThread }
  | { type: 'add-chat-message'; threadId: string; message: ChatMessage }
  | { type: 'complete-chat-message'; threadId: string; messageId: string; content: string; citations: ChatCitation[]; suggestedFollowUps: string[]; boundary: ChatMessage['boundary']; completedAt: string }
  | { type: 'fail-chat-message'; threadId: string; messageId: string }
  | { type: 'retry-chat-message'; threadId: string; messageId: string }
  | { type: 'delete-chat-thread'; threadId: string }
  | { type: 'clear-chat-history' }
  | { type: 'replace-state'; state: PrototypeState }
  | { type: 'set-save-status'; status: SaveStatus }
  | { type: 'clear-restore-notice' }
  | { type: 'reset'; status?: SaveStatus; notice?: string | null }

export const defaultState: PrototypeState = {
  accountCreated: true,
  profile: {
    preferredName: '',
    birthYear: '',
    location: null,
    temperatureUnitPreference: 'automatic',
    dietaryPattern: '',
    hasFoodAllergies: null,
    allergies: '',
    hasFoodExclusions: null,
    exclusions: '',
  },
  profileCompleted: false,
  introSeen: false,
  assessmentStarted: false,
  assessmentMode: 'full',
  currentIndex: 0,
  selectedAnswerId: null,
  submittedAnswers: {},
  skippedQuestionIds: [],
  transitionSeen: false,
  resultsReached: false,
  todayVisited: false,
  doshaFixtureId: null,
  recommendationHistory: [],
  todayRecommendationId: null,
  checkIns: [],
  chatThreads: [],
  saveStatus: 'saved',
  restoreNotice: null,
}

export function prototypeReducer(
  state: PrototypeState,
  action: PrototypeAction,
): PrototypeState {
  switch (action.type) {
    case 'account-created':
      return { ...state, accountCreated: true, saveStatus: 'saving' }
    case 'update-profile':
      return {
        ...state,
        profile: { ...state.profile, ...action.values },
        saveStatus: 'saving',
      }
    case 'complete-profile':
      return { ...state, profileCompleted: getProfileReadiness(state.profile).onboardingReady, saveStatus: 'saving' }
    case 'start-assessment':
      return {
        ...state,
        introSeen: true,
        assessmentStarted: true,
        assessmentMode: action.mode,
        doshaFixtureId: null,
        saveStatus: 'saving',
      }
    case 'select-answer':
      return { ...state, selectedAnswerId: action.answerId }
    case 'submit-answer': {
      const skippedQuestionIds = state.skippedQuestionIds.filter(
        (questionId) => questionId !== action.questionId,
      )
      return {
        ...state,
        submittedAnswers: {
          ...state.submittedAnswers,
          [action.questionId]: action.answerId,
        },
        doshaFixtureId: null,
        skippedQuestionIds,
        selectedAnswerId: null,
        currentIndex: action.nextIndex,
        saveStatus: 'saving',
      }
    }
    case 'skip-question': {
      const submittedAnswers = { ...state.submittedAnswers }
      delete submittedAnswers[action.questionId]
      return {
        ...state,
        submittedAnswers,
        doshaFixtureId: null,
        skippedQuestionIds: state.skippedQuestionIds.includes(action.questionId)
          ? state.skippedQuestionIds
          : [...state.skippedQuestionIds, action.questionId],
        selectedAnswerId: null,
        currentIndex: action.nextIndex,
        saveStatus: 'saving',
      }
    }
    case 'go-to-index':
      return {
        ...state,
        currentIndex: action.index,
        selectedAnswerId: action.selectedAnswerId ?? null,
        saveStatus: state.currentIndex === action.index ? state.saveStatus : 'saving',
      }
    case 'complete-transition':
      return { ...state, transitionSeen: true, saveStatus: 'saving' }
    case 'reach-results':
      return {
        ...state,
        resultsReached: true,
        selectedAnswerId: null,
        saveStatus: 'saving',
      }
    case 'visit-today':
      return { ...state, todayVisited: true, saveStatus: 'saving' }
    case 'set-dosha-fixture':
      return { ...state, doshaFixtureId: action.fixtureId, saveStatus: 'saving' }
    case 'show-recommendation': {
      const existing = state.recommendationHistory.some(
        (record) => record.recommendationId === action.recommendationId && record.date === action.date,
      )
      return {
        ...state,
        todayRecommendationId: action.recommendationId,
        recommendationHistory: existing
          ? state.recommendationHistory
          : [...state.recommendationHistory, { recommendationId: action.recommendationId, date: action.date, status: 'shown' }],
        saveStatus: 'saving',
      }
    }
    case 'recommendation-status':
      return {
        ...state,
        recommendationHistory: state.recommendationHistory.map((record) =>
          record.recommendationId === action.recommendationId && record.date === action.date
            ? { ...record, status: action.status }
            : record,
        ),
        saveStatus: 'saving',
      }
    case 'clear-active-recommendation':
      return { ...state, todayRecommendationId: null, saveStatus: 'saving' }
    case 'start-check-in':
      return {
        ...state,
        checkIns: state.checkIns.some((checkIn) => checkIn.id === action.checkIn.id)
          ? state.checkIns
          : [action.checkIn, ...state.checkIns],
        saveStatus: 'saving',
      }
    case 'answer-check-in':
      return {
        ...state,
        checkIns: state.checkIns.map((checkIn) => checkIn.id === action.checkInId
          ? { ...checkIn, answers: { ...checkIn.answers, [action.questionId]: action.answerId } }
          : checkIn),
        saveStatus: 'saving',
      }
    case 'complete-check-in':
      return {
        ...state,
        checkIns: state.checkIns.map((checkIn) => checkIn.id === action.checkInId
          ? { ...checkIn, completedAt: action.completedAt }
          : checkIn),
        saveStatus: 'saving',
      }
    case 'create-chat-thread':
      return {
        ...state,
        chatThreads: [action.thread, ...state.chatThreads.filter((thread) => thread.id !== action.thread.id)].slice(0, 20),
        saveStatus: 'saving',
      }
    case 'add-chat-message':
      return {
        ...state,
        chatThreads: updateChatThread(state.chatThreads, action.threadId, (thread) => ({
          ...thread,
          title: thread.title === 'New conversation' && action.message.role === 'user'
            ? action.message.content.slice(0, 60)
            : thread.title,
          updatedAt: action.message.createdAt,
          messages: [...thread.messages, action.message].slice(-40),
        })),
        saveStatus: 'saving',
      }
    case 'complete-chat-message':
      return {
        ...state,
        chatThreads: updateChatThread(state.chatThreads, action.threadId, (thread) => ({
          ...thread,
          updatedAt: action.completedAt,
          messages: thread.messages.map((message) => message.id === action.messageId
            ? {
                ...message,
                content: action.content,
                status: 'complete',
                citations: action.citations,
                suggestedFollowUps: action.suggestedFollowUps,
                boundary: action.boundary,
              }
            : message),
        })),
        saveStatus: 'saving',
      }
    case 'fail-chat-message':
      return {
        ...state,
        chatThreads: updateChatThread(state.chatThreads, action.threadId, (thread) => ({
          ...thread,
          messages: thread.messages.map((message) => message.id === action.messageId
            ? { ...message, status: 'error' }
            : message),
        })),
        saveStatus: 'saving',
      }
    case 'retry-chat-message':
      return {
        ...state,
        chatThreads: updateChatThread(state.chatThreads, action.threadId, (thread) => ({
          ...thread,
          messages: thread.messages.map((message) => message.id === action.messageId
            ? { ...message, status: 'pending' }
            : message),
        })),
        saveStatus: 'saving',
      }
    case 'delete-chat-thread':
      return {
        ...state,
        chatThreads: state.chatThreads.filter((thread) => thread.id !== action.threadId),
        saveStatus: 'saving',
      }
    case 'clear-chat-history':
      return { ...state, chatThreads: [], saveStatus: 'saving' }
    case 'replace-state':
      return { ...action.state, saveStatus: 'saving', restoreNotice: null }
    case 'set-save-status':
      return { ...state, saveStatus: action.status }
    case 'clear-restore-notice':
      return { ...state, restoreNotice: null }
    case 'reset':
      return {
        ...defaultState,
        saveStatus: action.status ?? 'saved',
        restoreNotice: action.notice ?? null,
      }
  }
}

interface PersistedState {
  version: typeof STORAGE_VERSION
  state: Omit<PrototypeState, 'selectedAnswerId' | 'saveStatus' | 'restoreNotice'>
}

export interface RestoreResult {
  state: PrototypeState
  notice: string | null
}

export interface PersistenceResult {
  ok: boolean
  error: string | null
}

export function serializeState(state: PrototypeState): string {
  const persisted: PersistedState = {
    version: STORAGE_VERSION,
    state: {
      accountCreated: state.accountCreated,
      profile: {
        ...state.profile,
        location: coarsenLocationForStorage(state.profile.location),
      },
      profileCompleted: state.profileCompleted,
      introSeen: state.introSeen,
      assessmentStarted: state.assessmentStarted,
      assessmentMode: state.assessmentMode,
      currentIndex: state.currentIndex,
      submittedAnswers: state.submittedAnswers,
      skippedQuestionIds: state.skippedQuestionIds,
      transitionSeen: state.transitionSeen,
      resultsReached: state.resultsReached,
      todayVisited: state.todayVisited,
      doshaFixtureId: state.doshaFixtureId,
      recommendationHistory: state.recommendationHistory,
      todayRecommendationId: state.todayRecommendationId,
      checkIns: state.checkIns,
      chatThreads: state.chatThreads,
    },
  }
  return JSON.stringify(persisted)
}

export function coarsenLocationForStorage(
  location: LocationProfile | null,
): LocationProfile | null {
  return location
}

export function persistState(
  state: PrototypeState,
  storage: Pick<Storage, 'setItem'> = window.localStorage,
): PersistenceResult {
  try {
    storage.setItem(STORAGE_KEY, serializeState(state))
    return { ok: true, error: null }
  } catch {
    return {
      ok: false,
      error: 'Changes could not be saved. They remain available only for this session.',
    }
  }
}

export function removePersistedState(
  storage: Pick<Storage, 'removeItem'> = window.localStorage,
): PersistenceResult {
  try {
    storage.removeItem(STORAGE_KEY)
    return { ok: true, error: null }
  } catch {
    return {
      ok: false,
      error: 'Saved data could not be removed from this browser.',
    }
  }
}

export function restoreState(
  storage: Pick<Storage, 'getItem'> = window.localStorage,
): RestoreResult {
  let value: string | null
  try {
    value = storage.getItem(STORAGE_KEY)
  } catch {
    return {
      state: { ...defaultState, saveStatus: 'not-saved' },
      notice: 'Local storage is unavailable. Progress will last only for this session.',
    }
  }

  if (!value) return { state: defaultState, notice: null }

  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    return {
      state: defaultState,
      notice: 'Saved progress was corrupt and could not be restored. A fresh session was started.',
    }
  }

  if (!isRecord(parsed) || typeof parsed.version !== 'number' || !isRecord(parsed.state)) {
    return {
      state: defaultState,
      notice: 'Saved progress was not recognized. A fresh session was started.',
    }
  }

  if (parsed.version > STORAGE_VERSION || parsed.version < 1) {
    return {
      state: defaultState,
      notice: 'Saved progress uses an incompatible version. A fresh session was started.',
    }
  }

  const migrated = parsed.version === 1
    ? migrateV1(parsed.state)
    : parsed.state
  const state = sanitizeState(migrated)

  return {
    state,
    notice: parsed.version < STORAGE_VERSION
      ? `Saved progress was updated from version ${parsed.version} to version ${STORAGE_VERSION}.`
      : null,
  }
}

function migrateV1(rawState: Record<string, unknown>) {
  const rawProfile = isRecord(rawState.profile) ? rawState.profile : {}
  const location: LocationProfile | null = null

  return {
    ...rawState,
    profile: {
      ...rawProfile,
      location,
    },
  }
}

function sanitizeState(raw: Record<string, unknown>): PrototypeState {
  const rawProfile = isRecord(raw.profile) ? raw.profile : {}
  const profile: ProfileState = {
    preferredName: sanitizeString(rawProfile.preferredName, 80),
    birthYear: sanitizeBirthYear(rawProfile.birthYear),
    location: sanitizeLocation(rawProfile.location),
    temperatureUnitPreference: sanitizeEnum(rawProfile.temperatureUnitPreference, [
      'automatic', 'fahrenheit', 'celsius',
    ]),
    dietaryPattern: sanitizeEnum(rawProfile.dietaryPattern, [
      '', 'Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other',
    ]),
    hasFoodAllergies: sanitizeFoodStatus(rawProfile.hasFoodAllergies, rawProfile.allergies),
    allergies: sanitizeString(rawProfile.allergies, 500),
    hasFoodExclusions: sanitizeFoodStatus(rawProfile.hasFoodExclusions, rawProfile.exclusions),
    exclusions: sanitizeString(rawProfile.exclusions, 500),
  }
  const accountCreated = true
  const readiness = getProfileReadiness(profile)
  const profileCompleted =
    raw.profileCompleted === true &&
    readiness.coreReady
  const assessmentStarted = raw.assessmentStarted === true && profileCompleted
  const assessmentMode: AssessmentMode = raw.assessmentMode === 'short' ? 'short' : 'full'
  const validQuestionIds = new Set(initialAssessment.questions.map((question) => question.id))
  const submittedAnswers: Record<string, string> = {}

  if (isRecord(raw.submittedAnswers)) {
    for (const [questionId, answerId] of Object.entries(raw.submittedAnswers)) {
      const question = initialAssessment.questions.find((candidate) => candidate.id === questionId)
      if (
        question &&
        typeof answerId === 'string' &&
        question.answers.some((answer) => answer.id === answerId)
      ) {
        submittedAnswers[questionId] = answerId
      }
    }
  }

  const skippedQuestionIds = Array.isArray(raw.skippedQuestionIds)
    ? [...new Set(raw.skippedQuestionIds.filter(
        (questionId): questionId is string =>
          typeof questionId === 'string' &&
          validQuestionIds.has(questionId as (typeof initialAssessment.questions)[number]['id']) &&
          !submittedAnswers[questionId],
      ))]
    : []
  const maxIndex = Math.max(getAssessmentQuestions(assessmentMode, true).length - 1, 0)
  const currentIndex = clampInteger(raw.currentIndex, 0, maxIndex)
  const resultsReached = raw.resultsReached === true && assessmentStarted
  const doshaFixtureId = raw.doshaFixtureId === DEVELOPMENT_DOSHA_FIXTURE.fixtureId
    ? DEVELOPMENT_DOSHA_FIXTURE.fixtureId
    : null
  const recommendationIds = new Set(recommendationCatalog.map((item) => item.id))
  const recommendationHistory = sanitizeRecommendationHistory(raw.recommendationHistory, recommendationIds)
  const todayRecommendationId = typeof raw.todayRecommendationId === 'string' && recommendationIds.has(raw.todayRecommendationId)
    ? raw.todayRecommendationId
    : null
  const checkIns = sanitizeCheckIns(raw.checkIns)
  const chatThreads = sanitizeChatThreads(raw.chatThreads, checkIns)

  return {
    accountCreated,
    profile,
    profileCompleted,
    introSeen: raw.introSeen === true && profileCompleted,
    assessmentStarted,
    assessmentMode,
    currentIndex,
    selectedAnswerId: null,
    submittedAnswers,
    skippedQuestionIds,
    transitionSeen: raw.transitionSeen === true && assessmentStarted,
    resultsReached,
    todayVisited: raw.todayVisited === true && resultsReached,
    doshaFixtureId,
    recommendationHistory,
    todayRecommendationId,
    checkIns,
    chatThreads,
    saveStatus: 'saved',
    restoreNotice: null,
  }
}

function updateChatThread(
  threads: ChatThread[],
  threadId: string,
  update: (thread: ChatThread) => ChatThread,
) {
  const updated = threads.map((thread) => thread.id === threadId ? update(thread) : thread)
  return updated.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)).slice(0, 20)
}

function sanitizeChatThreads(value: unknown, checkIns: CheckIn[]): ChatThread[] {
  if (!Array.isArray(value)) return []
  const validRecommendationIds = new Set(recommendationCatalog.map((item) => item.id))
  const validArticleIds = new Set(learningArticles.map((item) => item.id))
  const validProduceIds = new Set(seasonalProduceCatalog.map((item) => item.id))
  const validCheckInIds = new Set(checkIns.map((item) => item.id))
  const threads: ChatThread[] = []
  const seen = new Set<string>()
  for (const item of value.slice(0, 100)) {
    if (!isRecord(item) || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{4,100}$/.test(item.id) || seen.has(item.id)) continue
    if (!validIsoDate(item.createdAt) || !validIsoDate(item.updatedAt) || !Array.isArray(item.context) || !Array.isArray(item.messages)) continue
    const context = item.context.flatMap((reference) => {
      const sanitized = sanitizeChatContextReference(reference, validRecommendationIds, validArticleIds, validProduceIds, validCheckInIds)
      return sanitized ? [sanitized] : []
    }).slice(0, 4)
    if (context.length === 0) continue
    const messages = sanitizeChatMessages(item.messages)
    seen.add(item.id)
    threads.push({
      id: item.id,
      title: sanitizeString(item.title, 100) || 'Conversation',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      context,
      messages,
    })
  }
  return threads.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)).slice(0, 20)
}

function sanitizeChatContextReference(
  value: unknown,
  recommendationIds: Set<string>,
  articleIds: Set<string>,
  produceIds: Set<string>,
  checkInIds: Set<string>,
): ChatContextReference | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null
  if (value.type === 'recommendation' && recommendationIds.has(value.id)) return { type: value.type, id: value.id, sourcePath: '/today' }
  if (value.type === 'article' && articleIds.has(value.id)) return { type: value.type, id: value.id, sourcePath: `/learn/${value.id}` }
  if (value.type === 'seasonal-food' && produceIds.has(value.id)) return { type: value.type, id: value.id, sourcePath: '/today' }
  if (value.type === 'check-in' && checkInIds.has(value.id)) return { type: value.type, id: value.id, sourcePath: '/questions' }
  if (value.type === 'general' && value.id === 'general') {
    const sourcePath = ['/today', '/learn', '/questions', '/balance'].includes(String(value.sourcePath)) ? String(value.sourcePath) : '/today'
    return { type: 'general', id: 'general', sourcePath }
  }
  return null
}

function sanitizeChatMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return []
  const messages: ChatMessage[] = []
  const seen = new Set<string>()
  for (const item of value.slice(-40)) {
    if (!isRecord(item) || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{4,120}$/.test(item.id) || seen.has(item.id)) continue
    if ((item.role !== 'user' && item.role !== 'assistant') || !validIsoDate(item.createdAt)) continue
    const content = sanitizeString(item.content, 12_000)
    if (!content) continue
    const status = item.status === 'complete' ? 'complete' : item.status === 'error' ? 'error' : 'error'
    const citations = Array.isArray(item.citations)
      ? item.citations.flatMap((citation) => {
          const sanitized = sanitizeChatCitation(citation)
          return sanitized ? [sanitized] : []
        }).slice(0, 5)
      : []
    const suggestedFollowUps = Array.isArray(item.suggestedFollowUps)
      ? item.suggestedFollowUps.flatMap((question) => {
          const sanitized = sanitizeString(question, 240)
          return sanitized ? [sanitized] : []
        }).slice(0, 4)
      : []
    const boundary = item.boundary === 'medical' || item.boundary === 'medication' || item.boundary === 'unsupported' || item.boundary === 'emergency'
      ? item.boundary
      : null
    seen.add(item.id)
    messages.push({ id: item.id, role: item.role, content, createdAt: item.createdAt, status, citations, suggestedFollowUps, boundary })
  }
  return messages
}

function sanitizeChatCitation(value: unknown): ChatCitation | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.href !== 'string') return null
  if (value.type !== 'article' && value.type !== 'glossary' && value.type !== 'recommendation' && value.type !== 'seasonal-food') return null
  const citation: ChatCitation = {
    id: value.id.slice(0, 100),
    title: value.title.trim().slice(0, 200),
    href: value.href,
    type: value.type,
  }
  return isKnownCitation(citation) ? citation : null
}

function sanitizeRecommendationHistory(value: unknown, validIds: Set<string>): RecommendationHistoryRecord[] {
  if (!Array.isArray(value)) return []
  const records: RecommendationHistoryRecord[] = []
  const seen = new Set<string>()
  for (const item of value.slice(-60)) {
    if (!isRecord(item) || typeof item.recommendationId !== 'string' || !validIds.has(item.recommendationId)) continue
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue
    if (item.status !== 'shown' && item.status !== 'completed' && item.status !== 'dismissed') continue
    const key = `${item.date}:${item.recommendationId}`
    if (seen.has(key)) continue
    seen.add(key)
    records.push({ recommendationId: item.recommendationId, date: item.date, status: item.status })
  }
  return records
}

function sanitizeCheckIns(value: unknown): CheckIn[] {
  if (!Array.isArray(value)) return []
  const setById = new Map(checkInQuestionSets.map((set) => [set.id, set]))
  const questionById = new Map<string, (typeof initialAssessment.questions)[number]>(initialAssessment.questions.map((question) => [question.id, question]))
  const records: CheckIn[] = []
  const seen = new Set<string>()
  for (const item of value.slice(0, 30)) {
    if (!isRecord(item) || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{4,80}$/.test(item.id) || seen.has(item.id)) continue
    const set = typeof item.setId === 'string' ? setById.get(item.setId) : undefined
    if (!set || !validIsoDate(item.startedAt)) continue
    const answers: Record<string, string> = {}
    if (isRecord(item.answers)) {
      for (const [questionId, answerId] of Object.entries(item.answers)) {
        const question = questionById.get(questionId)
        if (set.questionIds.includes(questionId) && question && typeof answerId === 'string' && question.answers.some((answer) => answer.id === answerId)) {
          answers[questionId] = answerId
        }
      }
    }
    const completedAt = validIsoDate(item.completedAt) && Object.keys(answers).length === set.questionIds.length
      ? item.completedAt
      : null
    seen.add(item.id)
    records.push({ id: item.id, setId: set.id, startedAt: item.startedAt, completedAt, answers })
  }
  return records
}

function validIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function sanitizeLocation(value: unknown): LocationProfile | null {
  if (!isRecord(value)) return null
  const source = value.source === 'device' || value.source === 'map' || value.source === 'city'
    ? value.source
    : null
  if (source === null) return null
  const latitude = nullableNumber(value.latitude, -90, 90)
  const longitude = nullableNumber(value.longitude, -180, 180)
  const areaId = sanitizeString(value.areaId, 80)
  const displayName = sanitizeString(value.displayName, 120)
  const countryCode = sanitizeString(value.countryCode, 2).toUpperCase()
  if (latitude === null || longitude === null || !areaId || !displayName || !/^[A-Z]{2}$/.test(countryCode)) return null

  return {
    source,
    latitude,
    longitude,
    areaId,
    precisionKm: 10,
    displayName,
    countryCode,
    admin1Code: sanitizeNullableString(value.admin1Code, 80),
    timeZone: sanitizeString(value.timeZone, 100) || browserTimeZone(),
    produceRegionId: sanitizeNullableString(value.produceRegionId, 80),
  }
}

function sanitizeString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function sanitizeNullableString(value: unknown, maxLength: number) {
  const sanitized = sanitizeString(value, maxLength)
  return sanitized || null
}

function sanitizeEnum<const T extends readonly string[]>(value: unknown, allowed: T): T[number] {
  return allowed.includes(value as T[number]) ? value as T[number] : allowed[0]
}

function sanitizeBirthYear(value: unknown) {
  const text = typeof value === 'number' ? String(value) : sanitizeString(value, 4)
  if (!/^\d{4}$/.test(text)) return ''
  const year = Number(text)
  const currentYear = new Date().getFullYear()
  return year >= currentYear - 120 && year <= currentYear - 18 ? text : ''
}

function sanitizeFoodStatus(value: unknown, details: unknown) {
  if (value === true || value === false) return value
  return typeof details === 'string' && details.trim() ? true : null
}

function nullableNumber(value: unknown, minimum: number, maximum: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum
    ? value
    : null
}

function clampInteger(value: unknown, minimum: number, maximum: number) {
  return typeof value === 'number' && Number.isInteger(value)
    ? Math.min(Math.max(value, minimum), maximum)
    : minimum
}

function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function createTestState(
  values: Partial<PrototypeState> = {},
): PrototypeState {
  return {
    ...defaultState,
    ...values,
    profile: { ...defaultState.profile, ...values.profile },
  }
}

export function createDemoState(now = new Date()): PrototypeState {
  const submittedAnswers = Object.fromEntries(initialAssessment.questions.map((question) => {
    const direction = question.assessmentType === 'baseline' && question.defaultOrder % 2 === 0
      ? 'pitta'
      : 'vata'
    const directional = question.answers.find((answer) => answer.score.weights[direction] === 1)
    return [question.id, directional?.id ?? question.answers.find((answer) => answer.kind === 'ordinary')?.id ?? question.answers[0]?.id ?? '']
  }))
  const quickSet = checkInQuestionSets.find((set) => set.id === 'quick-current')
  const answers = Object.fromEntries((quickSet?.questionIds ?? []).map((questionId) => {
    const question = initialAssessment.questions.find((candidate) => candidate.id === questionId)
    return [questionId, question?.answers.find((answer) => answer.score.weights.vata === 1)?.id ?? '']
  }))
  return {
    ...defaultState,
    accountCreated: true,
    profile: {
      preferredName: 'Demo Editor',
      birthYear: '1990',
      location: { source: 'city', latitude: 45.5, longitude: -122.7, areaId: 'grid-v1:45.5:-122.7', precisionKm: 10, displayName: 'Portland, Oregon, United States', countryCode: 'US', admin1Code: 'OR', timeZone: 'America/Los_Angeles', produceRegionId: 'us-pacific-northwest' },
      temperatureUnitPreference: 'automatic',
      dietaryPattern: 'Vegetarian',
      hasFoodAllergies: false,
      allergies: '',
      hasFoodExclusions: false,
      exclusions: '',
    },
    profileCompleted: true,
    introSeen: true,
    assessmentStarted: true,
    assessmentMode: 'full',
    currentIndex: initialAssessment.questions.length - 1,
    submittedAnswers,
    transitionSeen: true,
    resultsReached: true,
    todayVisited: true,
    doshaFixtureId: null,
    checkIns: quickSet ? [{ id: `demo-${now.getTime()}`, setId: quickSet.id, startedAt: now.toISOString(), completedAt: now.toISOString(), answers }] : [],
  }
}
