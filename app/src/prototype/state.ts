import { initialAssessment } from '../generated/initialAssessment'
import { checkInQuestionSets, recommendationCatalog } from '../generated/contentCatalog'
import type { AssessmentMode } from '../quiz/assessment'
import { getAssessmentQuestions } from '../quiz/assessment'

export const STORAGE_KEY = 'dosha-companion-prototype-state'
export const STORAGE_VERSION = 4

export type SaveStatus = 'saved' | 'saving' | 'not-saved'

export interface LocationProfile {
  source: 'device' | 'map' | 'skipped'
  latitude: number | null
  longitude: number | null
  accuracyMeters: number | null
  timeZone: string
  units: 'us' | 'metric'
  displayLabel: string | null
}

export interface ProfileState {
  preferredName: string
  ageBand: string
  location: LocationProfile | null
  dietaryPattern: string
  allergies: string
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
  recommendationHistory: RecommendationHistoryRecord[]
  todayRecommendationId: string | null
  checkIns: CheckIn[]
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
  | { type: 'show-recommendation'; recommendationId: string; date: string }
  | { type: 'recommendation-status'; recommendationId: string; date: string; status: RecommendationHistoryStatus }
  | { type: 'clear-active-recommendation' }
  | { type: 'start-check-in'; checkIn: CheckIn }
  | { type: 'answer-check-in'; checkInId: string; questionId: string; answerId: string }
  | { type: 'complete-check-in'; checkInId: string; completedAt: string }
  | { type: 'replace-state'; state: PrototypeState }
  | { type: 'set-save-status'; status: SaveStatus }
  | { type: 'clear-restore-notice' }
  | { type: 'reset'; status?: SaveStatus; notice?: string | null }

export const defaultState: PrototypeState = {
  accountCreated: false,
  profile: {
    preferredName: '',
    ageBand: '',
    location: null,
    dietaryPattern: '',
    allergies: '',
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
  recommendationHistory: [],
  todayRecommendationId: null,
  checkIns: [],
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
      return { ...state, profileCompleted: true, saveStatus: 'saving' }
    case 'start-assessment':
      return {
        ...state,
        introSeen: true,
        assessmentStarted: true,
        assessmentMode: action.mode,
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

interface PersistedStateV3 {
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
  const persisted: PersistedStateV3 = {
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
      recommendationHistory: state.recommendationHistory,
      todayRecommendationId: state.todayRecommendationId,
      checkIns: state.checkIns,
    },
  }
  return JSON.stringify(persisted)
}

export function coarsenLocationForStorage(
  location: LocationProfile | null,
): LocationProfile | null {
  if (!location || location.latitude === null || location.longitude === null) {
    return location
  }

  return {
    ...location,
    latitude: Number(location.latitude.toFixed(2)),
    longitude: Number(location.longitude.toFixed(2)),
    accuracyMeters:
      location.accuracyMeters === null
        ? 1_000
        : Math.max(Math.round(location.accuracyMeters), 1_000),
  }
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
  const label = [rawProfile.city, rawProfile.region, rawProfile.country]
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .map((value) => value.trim())
    .join(', ')
  const location: LocationProfile | null = label
    ? {
        source: 'map',
        latitude: null,
        longitude: null,
        accuracyMeters: null,
        timeZone: browserTimeZone(),
        units: rawProfile.units === 'metric' ? 'metric' : 'us',
        displayLabel: label,
      }
    : null

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
    ageBand: sanitizeEnum(rawProfile.ageBand, [
      '', '18–24', '25–34', '35–44', '45–54', '55–64', '65+', 'Prefer not to say',
    ]),
    location: sanitizeLocation(rawProfile.location),
    dietaryPattern: sanitizeEnum(rawProfile.dietaryPattern, [
      '', 'Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other',
    ]),
    allergies: sanitizeString(rawProfile.allergies, 500),
    exclusions: sanitizeString(rawProfile.exclusions, 500),
  }
  const accountCreated = raw.accountCreated === true
  const profileCompleted =
    raw.profileCompleted === true &&
    accountCreated &&
    Boolean(profile.preferredName) &&
    Boolean(profile.location)
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
  const recommendationIds = new Set(recommendationCatalog.map((item) => item.id))
  const recommendationHistory = sanitizeRecommendationHistory(raw.recommendationHistory, recommendationIds)
  const todayRecommendationId = typeof raw.todayRecommendationId === 'string' && recommendationIds.has(raw.todayRecommendationId)
    ? raw.todayRecommendationId
    : null
  const checkIns = sanitizeCheckIns(raw.checkIns)

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
    recommendationHistory,
    todayRecommendationId,
    checkIns,
    saveStatus: 'saved',
    restoreNotice: null,
  }
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
  const source = value.source === 'device' || value.source === 'map' || value.source === 'skipped'
    ? value.source
    : null
  if (source === null) return null
  const latitude = nullableNumber(value.latitude, -90, 90)
  const longitude = nullableNumber(value.longitude, -180, 180)
  const displayLabel = source === 'skipped'
    ? null
    : sanitizeNullableString(value.displayLabel, 120)
  if (source === 'device' && (latitude === null || longitude === null)) return null
  if (source === 'map' && (latitude === null || longitude === null) && !displayLabel) return null

  return {
    source,
    latitude: source === 'skipped' ? null : latitude,
    longitude: source === 'skipped' ? null : longitude,
    accuracyMeters: source === 'skipped'
      ? null
      : nullableNumber(value.accuracyMeters, 0, 1_000_000),
    timeZone: sanitizeString(value.timeZone, 100) || browserTimeZone(),
    units: value.units === 'metric' ? 'metric' : 'us',
    displayLabel,
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
  const submittedAnswers = Object.fromEntries(initialAssessment.questions.map((question) => [
    question.id,
    question.answers.find((answer) => answer.kind === 'ordinary')?.id ?? question.answers[0]?.id ?? '',
  ]))
  const quickSet = checkInQuestionSets.find((set) => set.id === 'quick-current')
  const answers = Object.fromEntries((quickSet?.questionIds ?? []).map((questionId) => {
    const question = initialAssessment.questions.find((candidate) => candidate.id === questionId)
    return [questionId, question?.answers.find((answer) => answer.kind === 'ordinary')?.id ?? '']
  }))
  return {
    ...defaultState,
    accountCreated: true,
    profile: {
      preferredName: 'Demo Editor',
      ageBand: 'Prefer not to say',
      location: { source: 'skipped', latitude: null, longitude: null, accuracyMeters: null, timeZone: browserTimeZone(), units: 'us', displayLabel: null },
      dietaryPattern: 'Vegetarian',
      allergies: '',
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
    checkIns: quickSet ? [{ id: `demo-${now.getTime()}`, setId: quickSet.id, startedAt: now.toISOString(), completedAt: now.toISOString(), answers }] : [],
  }
}
