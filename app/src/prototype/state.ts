import type { AssessmentMode } from '../quiz/assessment'

export const STORAGE_KEY = 'dosha-companion-prototype-state'
export const STORAGE_VERSION = 2

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
  | { type: 'reset' }

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
}

export function prototypeReducer(
  state: PrototypeState,
  action: PrototypeAction,
): PrototypeState {
  switch (action.type) {
    case 'account-created':
      return { ...state, accountCreated: true, saveStatus: 'saved' }
    case 'update-profile':
      return {
        ...state,
        profile: { ...state.profile, ...action.values },
        saveStatus: 'saved',
      }
    case 'complete-profile':
      return { ...state, profileCompleted: true, saveStatus: 'saved' }
    case 'start-assessment':
      return {
        ...state,
        introSeen: true,
        assessmentStarted: true,
        assessmentMode: action.mode,
        saveStatus: 'saved',
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
        saveStatus: 'saved',
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
        saveStatus: 'saved',
      }
    }
    case 'go-to-index':
      return {
        ...state,
        currentIndex: action.index,
        selectedAnswerId: action.selectedAnswerId ?? null,
      }
    case 'complete-transition':
      return { ...state, transitionSeen: true, saveStatus: 'saved' }
    case 'reach-results':
      return {
        ...state,
        resultsReached: true,
        selectedAnswerId: null,
        saveStatus: 'saved',
      }
    case 'visit-today':
      return { ...state, todayVisited: true, saveStatus: 'saved' }
    case 'set-save-status':
      return { ...state, saveStatus: action.status }
    case 'reset':
      return defaultState
  }
}

interface PersistedState {
  version: number
  state: Omit<PrototypeState, 'selectedAnswerId' | 'saveStatus'>
}

export function serializeState(state: PrototypeState): string {
  const profile = {
    ...state.profile,
    location: coarsenLocationForStorage(state.profile.location),
  }
  const persisted: PersistedState = {
    version: STORAGE_VERSION,
    state: {
      accountCreated: state.accountCreated,
      profile,
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
) {
  storage.setItem(STORAGE_KEY, serializeState(state))
}

export function restoreState(
  storage: Pick<Storage, 'getItem'> = window.localStorage,
): PrototypeState {
  const value = storage.getItem(STORAGE_KEY)
  if (!value) return defaultState

  try {
    const parsed = JSON.parse(value) as Partial<PersistedState>
    if (parsed.version !== STORAGE_VERSION || !parsed.state) return defaultState
    return {
      ...defaultState,
      ...parsed.state,
      profile: { ...defaultState.profile, ...parsed.state.profile },
      selectedAnswerId: null,
      saveStatus: 'saved',
    }
  } catch {
    return defaultState
  }
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
