import { getAssessmentQuestions } from '../quiz/assessment'
import type { PrototypeState } from './state'

export function nextResumePath(state: PrototypeState) {
  if (!state.accountCreated) return '/create-account'
  if (!state.profile.preferredName) return '/profile/name'
  if (!state.profile.location) return '/profile/location'
  if (!state.profileCompleted) return '/profile/food'
  if (!state.assessmentStarted) return '/assessment'
  if (state.resultsReached) return state.todayVisited ? '/today' : '/results'
  const questions = getAssessmentQuestions(state.assessmentMode)
  return `/assessment/question/${questions[state.currentIndex]?.id ?? questions[0]?.id}`
}
