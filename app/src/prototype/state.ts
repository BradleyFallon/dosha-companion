import { initialAssessment } from '../generated/initialAssessment'
import type { AssessmentMode } from '../quiz/assessment'
import { getAssessmentQuestions } from '../quiz/assessment'

export const STORAGE_KEY = 'dosha-companion-prototype-state'
export const STORAGE_VERSION = 3

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
    saveStatus: 'saved',
    restoreNotice: null,
  }
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
